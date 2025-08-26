import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const GH = "https://api.github.com";
const headers: HeadersInit = process.env.GITHUB_TOKEN
  ? { Authorization: `token ${process.env.GITHUB_TOKEN}` }
  : {};

export const dynamic = "force-dynamic";

// util: normaliza linguagem para lowercase ou null
const toLang = (lang: any) =>
  typeof lang === "string" && lang.length ? lang.toLowerCase() : null;

export async function POST() {
  try {
    const langs = ["typescript", "javascript", "python", "go", "rust"];
    const results: any[] = [];

    // busca alguns repositórios por linguagem (ajuste o filtro como preferir)
    for (const lang of langs) {
      const r = await fetch(
        `${GH}/search/repositories?q=stars:%3E=50+language:${encodeURIComponent(
          lang
        )}&sort=stars&order=desc&per_page=50`,
        { headers, cache: "no-store" }
      );
      const json = await r.json();
      if (!r.ok) {
        console.error("GitHub search error", r.status, json);
        throw new Error(`GitHub search ${r.status}`);
      }
      results.push(...(json.items ?? []));
    }

    // upsert no banco
    for (const repo of results) {
      const [readmeRes, userRes] = await Promise.all([
        fetch(`${GH}/repos/${repo.full_name}/readme`, { headers }),
        fetch(`${GH}/users/${repo.owner.login}`, { headers }),
      ]);

      const readme = readmeRes.ok ? await readmeRes.json() : null;
      const user = await userRes.json();

      await prisma.project.upsert({
        where: { repoId: repo.id },

        create: {
          repoId: repo.id,
          fullName: repo.full_name,
          name: repo.name,
          owner: repo.owner.login,
          description: repo.description,
          language: toLang(repo.language),              // <- lowercase aqui
          topics: repo.topics ?? [],                    // Json no Prisma
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          watchers: repo.subscribers_count ?? repo.watchers_count ?? 0,
          openIssues: repo.open_issues_count,
          hasHomepage: Boolean(repo.homepage),
          readmeSize: readme?.size ?? 0,
          lastPushedAt: new Date(repo.pushed_at),
          ownerFollowers: user.followers ?? 0,
        },

        update: {
          description: repo.description,
          language: toLang(repo.language),              // <- lowercase aqui
          topics: repo.topics ?? [],
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          watchers: repo.subscribers_count ?? repo.watchers_count ?? 0,
          openIssues: repo.open_issues_count,
          hasHomepage: Boolean(repo.homepage),
          readmeSize: readme?.size ?? 0,
          lastPushedAt: new Date(repo.pushed_at),
          ownerFollowers: user.followers ?? 0,
        },
      });
    }

    return NextResponse.json({ ok: true, count: results.length });
  } catch (e: any) {
    console.error("INGEST ERROR:", e);
    return NextResponse.json(
      { ok: false, error: String(e?.message ?? e) },
      { status: 500 }
    );
  }
}

// facilita testar no navegador
export async function GET() {
  return POST();
}
