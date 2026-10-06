import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request) {
  try {
    const { phone: inputPhone } = await request.json();

    const cleanInputPhone = String(inputPhone || "").replace(/\D/g, "");

    if (!cleanInputPhone) {
      return NextResponse.json(
        { success: false, message: "Please enter a valid phone number." },
        { status: 400 },
      );
    }

    // Look up guest(s) directly by phone — no token involved anymore.
    const { data: guests, error } = await supabaseAdmin
      .from("guests")
      .select("*")
      .eq("phone", cleanInputPhone);

    if (error) {
      console.error("Verification lookup error:", error);
      return NextResponse.json(
        { success: false, message: "Server error verifying guest." },
        { status: 500 },
      );
    }

    if (!guests || guests.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            "We couldn't find that phone number on our guest list. Please double-check and try again.",
        },
        { status: 404 },
      );
    }

    // If more than one record shares this phone, prefer one that hasn't
    // responded yet so a second household isn't blocked by the first's reply.
    const guest = guests.find((g) => !g.has_responded) || guests[0];

    return NextResponse.json({
      success: true,
      guest: {
        id: guest.id,
        name: guest.name,
        maxFamilySize: guest.max_family_size || 1,
        hasResponded: guest.has_responded || false,
      },
    });
  } catch (err) {
    console.error("Verification error:", err);
    return NextResponse.json(
      { success: false, message: "Server error verifying guest." },
      { status: 500 },
    );
  }
}
