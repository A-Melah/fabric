import { NextResponse } from "next/server";
import { waitUntil } from "@vercel/functions";
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabase";
import { phoneKey } from "@/lib/phone";
import { RELATIONSHIPS } from "@/lib/rsvp-options";

const resend = new Resend(process.env.RESEND_API_KEY);

const esc = (s) =>
  String(s ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );

const fail = (message, status) =>
  NextResponse.json({ success: false, message }, { status });

export async function POST(request) {
  try {
    const {
      guestId,
      phone,
      attendance,
      relationship,
      relationshipOther,
      additionalGuests,
      message,
    } = await request.json();

    if (!guestId || !phone) {
      return fail("Missing guest identifier or phone number.", 400);
    }
    if (!["Attending", "Declined"].includes(attendance)) {
      return fail("Invalid attendance value.", 400);
    }
    const attending = attendance === "Attending";

    if (attending && !RELATIONSHIPS.some((r) => r.value === relationship)) {
      return fail("Please select how you know the couple.", 400);
    }

    const { data: guest, error: fetchError } = await supabaseAdmin
      .from("guests")
      .select("*")
      .eq("id", guestId)
      .single();

    if (fetchError || !guest) return fail("Guest record not found.", 404);

    const key = phoneKey(phone);
    if (!key || key !== guest.phone_key) {
      return fail("Phone number mismatch.", 401);
    }
    if (guest.has_responded) {
      return fail("This invitation has already responded.", 409);
    }

    let finalAdditional = [];
    if (attendance === "Attending") {
      const maxAllowed = (guest.max_family_size || 1) - 1;
      finalAdditional = Array.isArray(additionalGuests)
        ? additionalGuests
            .map((n) => String(n).trim().slice(0, 80))
            .filter(Boolean)
            .slice(0, maxAllowed)
        : [];
    }

    const cleanRelationship = attending ? relationship : null;
    const cleanOther =
      attending && relationship === "Other"
        ? String(relationshipOther || "")
            .trim()
            .slice(0, 60) || null
        : null;
    const cleanMessage = message ? String(message).trim().slice(0, 1000) : null;

    // The .eq("has_responded", false) guard stops double submissions.
    const { data: updated, error: updateError } = await supabaseAdmin
      .from("guests")
      .update({
        attendance,
        relationship: cleanRelationship,
        relationship_other: cleanOther,
        additional_guests: finalAdditional,
        message: cleanMessage,
        has_responded: true,
        responded_at: new Date().toISOString(),
      })
      .eq("id", guestId)
      .eq("has_responded", false)
      .select()
      .maybeSingle();

    if (updateError || !updated) {
      return fail("This invitation has already responded.", 409);
    }

    // RSVP is saved. Everything below is best-effort.
    const relationshipLabel = !attending
      ? "N/A"
      : cleanOther
        ? `Other (${cleanOther})`
        : RELATIONSHIPS.find((r) => r.value === relationship).label;
    const totalAttending =
      attendance === "Attending" ? 1 + finalAdditional.length : 0;
    const additionalStr = finalAdditional.length
      ? finalAdditional.join(", ")
      : "None";

    waitUntil(
      Promise.all([
        resend.emails
          .send({
            from:
              process.env.RESEND_FROM_EMAIL ||
              "Wedding RSVP <onboarding@resend.dev>",
            to: process.env.RECIPIENT_EMAIL,
            subject: `RSVP: ${guest.name} (${attendance})`,
            html: `
              <h2>New RSVP Submission</h2>
              <p><strong>Guest:</strong> ${esc(guest.name)}</p>
              <p><strong>Attendance:</strong> ${esc(attendance)} (${totalAttending} total)</p>
              <p><strong>Relationship:</strong> ${esc(relationshipLabel)}</p>
              <p><strong>Additional guests:</strong> ${esc(additionalStr)}</p>
              <p><strong>Wishes:</strong> ${esc(cleanMessage || "None provided")}</p>
            `,
          })
          .then((res) => {
            if (res?.error) console.error("Resend error:", res.error);
          })
          .catch((e) => console.error("Resend email error:", e)),

        process.env.GOOGLE_SHEET_URL
          ? fetch(process.env.GOOGLE_SHEET_URL, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                secret: process.env.GOOGLE_SHEET_SECRET,
                guestId: guest.id,
                timestamp: new Date().toISOString(),
                name: guest.name,
                phone: guest.phone,
                attendance,
                relationship: relationshipLabel,
                totalAttending,
                additionalGuests: additionalStr,
                message: cleanMessage || "",
              }),
            })
              .then((r) => r.json())
              .then(async (r) => {
                if (!r?.ok) {
                  console.error("Sheets sync failed:", r?.error);
                  return;
                }
                await supabaseAdmin
                  .from("guests")
                  .update({ sheet_synced: true })
                  .eq("id", guest.id);
              })
              .catch((e) => console.error("Google Sheets sync error:", e))
          : Promise.resolve(),
      ]),
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Submit error:", err);
    return fail("Server error submitting RSVP.", 500);
  }
}
