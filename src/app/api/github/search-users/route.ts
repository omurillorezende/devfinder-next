import { NextRequest, NextResponse } from "next/server";

const GH = "https://api.github.com";
const headers: HeadersInit = process.env.GITHUB_TOKEN
  ? { Authorization: `token ${process.env.GITHUB_TOKEN}` }
  : {};

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") ?? "").trim();
  const perPage = Number(searchParams.get("per_page") ?? 10);

  if (!q || q.length < 2) {
    return NextResponse.json({ items: [] });
  }

  // Busca por login e nome (parcial) + ordena por relevância
  const url = `${GH}/search/users?q=${encodeURIComponent(q)} in:login in:name&per_page=${perPage}`;
  const r = await fetch(url, { headers, cache: "no-store" });
  const j = await r.json();

  if (!r.ok) {
    return NextResponse.json({ error: j?.message ?? "GitHub error" }, { status: r.status });
  }

  // Retorno enxuto pro autocomplete
  const items = (j.items ?? []).map((u: any) => ({
    login: u.login,
    avatar_url: u.avatar_url,
    html_url: u.html_url,
  }));

  return NextResponse.json({ items });
}
