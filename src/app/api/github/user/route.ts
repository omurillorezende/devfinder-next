import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs"; // garante Node no Vercel

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const u = searchParams.get("u");
  if (!u) return NextResponse.json({ error: "username required" }, { status: 400 });

  const headers: Record<string, string> = {
    "User-Agent": "devfinder-next",
    Accept: "application/vnd.github.v3+json",
  };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  const gh = await fetch(`https://api.github.com/users/${u}`, { headers });
  const data = await gh.json();
  return NextResponse.json(data, { status: gh.status });
}
