import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const u = searchParams.get("u");
  if (!u) return NextResponse.json({ error: "username required" }, { status: 400 });

  const headers: Record<string, string> = {
    "User-Agent": "devfinder-next",
    Accept: "application/vnd.github.v3+json",
  };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  const gh = await fetch(`https://api.github.com/users/${u}/repos?per_page=100&sort=updated`, { headers });
  const repos = await gh.json();

  if (!Array.isArray(repos)) return NextResponse.json(repos, { status: gh.status });

  const top = repos
    .sort((a: any, b: any) => b.stargazers_count - a.stargazers_count)
    .slice(0, 5)
    .map((r: any) => ({ name: r.name, stars: r.stargazers_count, url: r.html_url, language: r.language }));

  return NextResponse.json(top, { status: 200 });
}
