// scripts/export-guest-links.mjs
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";

const SITE_URL = "https://joywedsjoshua.amdigital.ng";

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in your .env.local.",
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

function csvEscape(value) {
  const str = String(value ?? "");
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

async function main() {
  console.log("Fetching guests from Supabase...");

  const { data, error } = await supabase
    .from("guests")
    .select(
      "name, phone, max_family_size, has_responded, attendance, created_at",
    )
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Failed to fetch guests:", error.message);
    process.exit(1);
  }

  if (!data || data.length === 0) {
    console.error("No guests found in the table.");
    process.exit(1);
  }

  const header = [
    "Name",
    "Phone",
    "Number",
    "Invite Link",
    "Has Responded",
    "Attendance",
  ];

  const lines = [header.join(",")];

  for (const g of data) {
    // Universal site URL for all guests to verify via phone number
    const universalLink = SITE_URL;

    lines.push(
      [
        csvEscape(g.name),
        csvEscape(g.phone),
        csvEscape(g.max_family_size),
        csvEscape(universalLink),
        csvEscape(g.has_responded ? "Yes" : "No"),
        csvEscape(g.attendance || ""),
      ].join(","),
    );
  }

  const outName = process.argv[2] || "guest-list-export.csv";
  const outPath = path.resolve(outName);
  fs.writeFileSync(outPath, lines.join("\n"), "utf8");

  console.log(`\nExported ${data.length} guest(s) to: ${outPath}`);
}

main().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
