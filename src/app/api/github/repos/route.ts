import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const u = searchParams.get("u");
  if (!u) return NextResponse.json({ error: "username required" }, { status: 400 });

  const headers: Record<string, string> = { "User-Agent": "devfinder-next" };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  // Top repositórios por estrelas (pega até 100 e a gente filtra)
  const res = await fetch(
    `https://api.github.com/users/${u}/repos?per_page=100&sort=updated`,
    { headers }
  );
  const repos = await res.json();

  if (!Array.isArray(repos)) {
    return NextResponse.json(repos, { status: res.status });
  }

  // Ordena pelos mais estrelados e pega os 5 primeiros
  const top = repos
    .sort((a: any, b: any) => b.stargazers_count - a.stargazers_count)
    .slice(0, 5)
    .map((r: any) => ({
      name: r.name,
      stars: r.stargazers_count,
      url: r.html_url,
      language: r.language,
    }));

  return NextResponse.json(top);
}
