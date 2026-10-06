import { NextResponse } from "next/server";
import { waitUntil } from "@vercel/functions";
import { supabaseAdmin } from "@/lib/supabase";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const { guestId, phone, attendance, additionalGuests, message } =
      await request.json();

    if (!guestId || !phone) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing guest identifier or phone number.",
        },
        { status: 400 },
      );
    }

    const cleanInputPhone = String(phone).replace(/\D/g, "");

    const { data: guest, error: fetchError } = await supabaseAdmin
      .from("guests")
      .select("*")
      .eq("id", guestId)
      .single();

    if (fetchError || !guest) {
      return NextResponse.json(
        { success: false, message: "Guest record not found." },
        { status: 404 },
      );
    }

    const cleanDbPhone = String(guest.phone || "").replace(/\D/g, "");
    if (!cleanDbPhone || cleanDbPhone !== cleanInputPhone) {
      return NextResponse.json(
        { success: false, message: "Phone number mismatch." },
        { status: 401 },
      );
    }

    if (guest.has_responded) {
      return NextResponse.json(
        { success: false, message: "This invitation has already responded." },
        { status: 409 },
      );
    }

    if (!["Attending", "Declined"].includes(attendance)) {
      return NextResponse.json(
        { success: false, message: "Invalid attendance value." },
        { status: 400 },
      );
    }

    let finalAdditional = [];
    if (attendance === "Attending") {
      const maxAllowed = (guest.max_family_size || 1) - 1;
      finalAdditional = Array.isArray(additionalGuests)
        ? additionalGuests
            .slice(0, maxAllowed)
            .map((n) => String(n).trim())
            .filter(Boolean)
        : [];
    }

    const { data: updated, error: updateError } = await supabaseAdmin
      .from("guests")
      .update({
        attendance,
        additional_guests: finalAdditional,
        message: message ? String(message).trim() : null,
        has_responded: true,
        responded_at: new Date().toISOString(),
      })
      .eq("id", guestId)
      .eq("has_responded", false)
      .select()
      .maybeSingle();

    if (updateError || !updated) {
      return NextResponse.json(
        { success: false, message: "This invitation has already responded." },
        { status: 409 },
      );
    }

    // The RSVP is safely committed at this point — everything below is
    // "nice to have, not required for the guest's response to count."
    const additionalGuestsString =
      finalAdditional.length > 0 ? finalAdditional.join(", ") : "None";

    // waitUntil schedules this work to run AFTER the response below is
    // sent, but keeps the function alive until it finishes — unlike a
    // bare unawaited Promise, this is guaranteed to actually run.
    waitUntil(
      Promise.all([
        resend.emails
          .send({
            from: "Wedding RSVP <onboarding@resend.dev>",
            to: process.env.RECIPIENT_EMAIL || "your-email@example.com",
            subject: `RSVP Update: ${guest.name} (${attendance})`,
            html: `
              <h2>New RSVP Submission</h2>
              <p><strong>Guest Name:</strong> ${guest.name}</p>
              <p><strong>Attendance:</strong> ${attendance}</p>
              <p><strong>Additional Guests:</strong> ${additionalGuestsString}</p>
              <p><strong>Wishes:</strong> ${message || "None provided"}</p>
            `,
          })
          .then((res) => {
            if (res?.error)
              console.error("Resend returned an error:", res.error);
          })
          .catch((emailErr) => console.error("Resend email error:", emailErr)),

        process.env.GOOGLE_SHEET_URL
          ? fetch(process.env.GOOGLE_SHEET_URL, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name: guest.name,
                phone: cleanInputPhone,
                attendance,
                additionalGuests: finalAdditional,
                message: message || "None",
                timestamp: new Date().toISOString(),
              }),
            })
              .then((res) => {
                if (!res.ok) console.error("Sheets sync failed:", res.status);
              })
              .catch((sheetErr) =>
                console.error("Google Sheets sync error:", sheetErr),
              )
          : Promise.resolve(),
      ]),
    );

    // Returns immediately — the guest sees success as soon as the DB
    // write lands, not after email/Sheets finish.
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Submit error:", err);
    return NextResponse.json(
      { success: false, message: "Server error submitting RSVP." },
      { status: 500 },
    );
  }
}
