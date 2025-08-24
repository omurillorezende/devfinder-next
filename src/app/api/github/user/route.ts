import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const u = searchParams.get("u");
  if (!u) return NextResponse.json({ error: "username required" }, { status: 400 });

  const headers: Record<string, string> = { "User-Agent": "devfinder-next" };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const res = await fetch(`https://api.github.com/users/${u}`, { headers });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
