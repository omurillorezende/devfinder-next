export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export const dynamic = "force-dynamic";

const GH = "https://api.github.com";
const headers: HeadersInit = {
  "User-Agent": "devfinder-next",
  Accept: "application/vnd.github+json",
  ...(process.env.GITHUB_TOKEN ? { Authorization: `token ${process.env.GITHUB_TOKEN}` } : {}),
};

// util: espera ms
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// util: limitador simples de concorrência
function pLimit(concurrency: number) {
  let active = 0;
  const queue: (() => void)[] = [];
  const next = () => {
    active--;
    if (queue.length) queue.shift()!();
  };
  return async <T>(fn: () => Promise<T>): Promise<T> =>
    new Promise<T>((resolve, reject) => {
      const run = async () => {
        active++;
        try {
          const out = await fn();
          resolve(out);
        } catch (e) {
          reject(e);
        } finally {
          next();
        }
      };
      if (active < concurrency) run();
      else queue.push(run);
    });
}

// cache simples por owner pra não bater user duas vezes
const followersCache = new Map<string, number>();

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const limit = Math.min(Number(url.searchParams.get("limit") ?? 100), 500);
    const concurrency = Math.max(1, Math.min(Number(url.searchParams.get("concurrency") ?? 4), 10));
    const jitter = Math.max(0, Math.min(Number(url.searchParams.get("jitter") ?? 120), 2000)); // ms entre hits

    // pega projetos que precisam de enrich
    const projects = await prisma.project.findMany({
      where: {
        OR: [{ ownerFollowers: 0 }, { readmeSize: 0 }],
      },
      take: limit,
    });

    if (projects.length === 0) {
      return NextResponse.json({ ok: true, updated: 0, skipped: 0, details: [] });
    }

    const limitRun = pLimit(concurrency);
    const details: Array<{ id: string; fullName: string; owner: string; readmeSize?: number; ownerFollowers?: number; error?: string; }> = [];

    await Promise.all(
      projects.map((p) =>
        limitRun(async () => {
          let readmeSize = p.readmeSize;
          let ownerFollowers = p.ownerFollowers;
          try {
            // 1) followers (com cache por owner)
            if (!ownerFollowers) {
              if (followersCache.has(p.owner)) {
                ownerFollowers = followersCache.get(p.owner)!;
              } else {
                const rUser = await fetch(`${GH}/users/${p.owner}`, { headers, cache: "no-store" });
                if (rUser.ok) {
                  const user = await rUser.json();
                  ownerFollowers = Number(user?.followers ?? 0);
                  followersCache.set(p.owner, ownerFollowers);
                } else if (rUser.status === 404) {
                  ownerFollowers = 0;
                } else {
                  const j = await rUser.json().catch(() => ({}));
                  throw new Error(`users/${p.owner} ${rUser.status}: ${j?.message ?? "unknown"}`);
                }
              }
              if (jitter) await sleep(jitter);
            }

            // 2) readme size
            if (!readmeSize) {
              const rReadme = await fetch(`${GH}/repos/${p.fullName}/readme`, { headers, cache: "no-store" });
              if (rReadme.ok) {
                const rd = await rReadme.json();
                readmeSize = Number(rd?.size ?? 0);
              } else if (rReadme.status === 404) {
                readmeSize = 0;
              } else {
                const j = await rReadme.json().catch(() => ({}));
                throw new Error(`readme ${rReadme.status}: ${j?.message ?? "unknown"}`);
              }
              if (jitter) await sleep(jitter);
            }

            // 3) update no banco
            await prisma.project.update({
              where: { id: p.id },
              data: {
                readmeSize,
                ownerFollowers,
                updatedAt: new Date(),
              },
            });

            details.push({
              id: p.id,
              fullName: p.fullName,
              owner: p.owner,
              readmeSize,
              ownerFollowers,
            });
          } catch (e: any) {
            details.push({
              id: p.id,
              fullName: p.fullName,
              owner: p.owner,
              error: String(e?.message ?? e),
            });
          }
        })
      )
    );

    const updated = details.filter((d) => !d.error).length;
    const skipped = details.filter((d) => d.error).length;

    return NextResponse.json({
      ok: true,
      limit,
      concurrency,
      updated,
      skipped,
      details,
    });
  } catch (e: any) {
    console.error("ENRICH ERROR:", e);
    return NextResponse.json({ ok: false, error: String(e?.message ?? e) }, { status: 500 });
  }
}

export async function GET(req: Request) {
  return POST(req);
}
