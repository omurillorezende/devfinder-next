import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const GH = "https://api.github.com";
const headers: HeadersInit = {
  "User-Agent": "devfinder-next",
  Accept: "application/vnd.github+json",
  ...(process.env.GITHUB_TOKEN ? { Authorization: `token ${process.env.GITHUB_TOKEN}` } : {}),
};

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const toLang = (lang: any) =>
  typeof lang === "string" && lang.length ? lang.toLowerCase() : null;

function chunk<T>(arr: T[], size = 50) {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const perPage = Number(url.searchParams.get("per_page") ?? 20); // <= controle por query
    const langs = (url.searchParams.get("langs")?.split(",") ?? [
      "typescript",
      "javascript",
      "python",
      "go",
      "rust",
    ]).map((s) => s.trim()).filter(Boolean);

    const results: any[] = [];

    // 1) Buscar TOP repos por linguagem (sem enrich extra)
    for (const lang of langs) {
      const r = await fetch(
        `${GH}/search/repositories?q=stars:%3E=50+language:${encodeURIComponent(
          lang
        )}&sort=stars&order=desc&per_page=${perPage}`,
        { headers, cache: "no-store" }
      );
      const json = await r.json();
      if (!r.ok) {
        console.error("GitHub search error", r.status, json);
        throw new Error(`GitHub search ${r.status}: ${json?.message ?? "unknown"}`);
      }
      results.push(...(json.items ?? []));
      // leve respiro entre chamadas pra evitar rate limit
      await new Promise((res) => setTimeout(res, 120));
    }

    // 2) Upsert em lotes (sem readme/ownerFollowers por enquanto)
    let upserts = 0;
    for (const part of chunk(results, 50)) {
      await Promise.all(
        part.map((repo) =>
          prisma.project.upsert({
            where: { repoId: repo.id },
            create: {
              repoId: repo.id,
              fullName: repo.full_name,
              name: repo.name,
              owner: repo.owner.login,
              description: repo.description,
              language: toLang(repo.language),
              topics: repo.topics ?? [],
              stars: repo.stargazers_count,
              forks: repo.forks_count,
              watchers: repo.subscribers_count ?? repo.watchers_count ?? 0,
              openIssues: repo.open_issues_count,
              hasHomepage: Boolean(repo.homepage),
              // enrich depois:
              readmeSize: 0,
              lastPushedAt: new Date(repo.pushed_at),
              ownerFollowers: 0,
            },
            update: {
              description: repo.description,
              language: toLang(repo.language),
              topics: repo.topics ?? [],
              stars: repo.stargazers_count,
              forks: repo.forks_count,
              watchers: repo.subscribers_count ?? repo.watchers_count ?? 0,
              openIssues: repo.open_issues_count,
              hasHomepage: Boolean(repo.homepage),
              lastPushedAt: new Date(repo.pushed_at),
            },
          })
        )
      );
      upserts += part.length;
    }

    return NextResponse.json({
      ok: true,
      langs,
      perPage,
      upserts,
    });
  } catch (e: any) {
    console.error("INGEST ERROR:", e);
    return NextResponse.json(
      { ok: false, error: String(e?.message ?? e) },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  return POST(req);
}
