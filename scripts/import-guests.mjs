// scripts/import-guests.mjs
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";
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

const csvPath = process.argv[2];
if (!csvPath) {
  console.error("Usage: node scripts/import-guests.mjs <path-to-csv>");
  process.exit(1);
}

function normalizeHeader(h) {
  return h.trim().toLowerCase().replace(/\s+/g, "_");
}

const HEADER_MAP = {
  name: "name",
  full_name: "name",
  phone: "phone",
  phone_number: "phone",
  number: "max_family_size",
  max_family_size: "max_family_size",
  family_size: "max_family_size",
  household_size: "max_family_size",
  guests: "max_family_size",
};

function cleanPhone(raw) {
  return String(raw || "").replace(/\D/g, "");
}

async function main() {
  const raw = fs.readFileSync(path.resolve(csvPath), "utf8");
  const records = parse(raw, {
    columns: (headerRow) => headerRow.map(normalizeHeader),
    skip_empty_lines: true,
    trim: true,
  });

  if (records.length === 0) {
    console.error("No rows found in CSV.");
    process.exit(1);
  }

  const rowsToInsert = [];
  const skipped = [];

  for (const [i, row] of records.entries()) {
    const mapped = {};
    for (const [key, value] of Object.entries(row)) {
      const targetCol = HEADER_MAP[key];
      if (targetCol) mapped[targetCol] = value;
    }

    const name = (mapped.name || "").trim();
    const phone = cleanPhone(mapped.phone);
    const maxFamilySize = parseInt(mapped.max_family_size, 10) || 1;

    if (!name || !phone) {
      skipped.push({ row: i + 2, reason: "missing name or phone", raw: row });
      continue;
    }

    rowsToInsert.push({
      name,
      phone,
      max_family_size: maxFamilySize,
      attendance: null,
      additional_guests: [],
      message: null,
      has_responded: false,
    });
  }

  if (skipped.length) {
    console.warn(`\nSkipped ${skipped.length} row(s) — missing name/phone:`);
    skipped.forEach((s) => console.warn(`  row ${s.row}:`, s.raw));
  }

  if (rowsToInsert.length === 0) {
    console.error("Nothing valid to insert.");
    process.exit(1);
  }

  console.log(`\nInserting ${rowsToInsert.length} guest(s) into Supabase...`);

  // Insert records. Using upsert based on phone number can also prevent duplicates if re-run!
  const { data, error } = await supabase
    .from("guests")
    .upsert(rowsToInsert, { onConflict: "phone" })
    .select("name, phone, max_family_size");

  if (error) {
    console.error("Insert failed:", error.message);
    process.exit(1);
  }

  // Generate a clean summary report instead of unique links
  const outLines = ["name,phone,max_family_size,access_url"];
  for (const g of data) {
    outLines.push(
      `"${g.name}","${g.phone}",${g.max_family_size},"${SITE_URL}"`,
    );
  }

  const outPath = path.resolve("imported-guests-summary.csv");
  fs.writeFileSync(outPath, outLines.join("\n"), "utf8");

  console.log(`\nDone. Successfully processed ${data.length} guest(s).`);
  console.log(`Summary report written to: ${outPath}`);
}

main().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
