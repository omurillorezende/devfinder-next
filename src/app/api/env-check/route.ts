import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const url = process.env.DATABASE_URL || "";
  const prefix = url.slice(0, 20);
  const codes = Array.from(prefix).map((c) => c.charCodeAt(0));
  return NextResponse.json({
    startsWithPostgresql: url.startsWith("postgresql://"),
    rawPrefix: prefix,
    charCodes: codes, // bom pra detectar BOM (65279) ou espaços (32)
  });
}
