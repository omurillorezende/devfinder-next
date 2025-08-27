export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import DevFinderClient from "@/components/DevFinderClient";
import RankingsColumns from "@/components/RankingsColumns";
import type { Project } from "@/components/ProjectCard";

const norm = (p: any): Project => ({
  id: p.id,
  repoId: p.repoId,
  fullName: p.fullName,
  name: p.name,
  owner: p.owner,
  description: p.description ?? null,
  language: p.language ?? null,
  topics: (p.topics as string[] | null) ?? [],
  stars: p.stars,
  forks: p.forks,
  watchers: p.watchers,
  openIssues: p.openIssues,
  hasHomepage: Boolean(p.hasHomepage),
  readmeSize: p.readmeSize ?? 0,
  lastPushedAt: new Date(p.lastPushedAt).toISOString(),
  ownerFollowers: p.ownerFollowers ?? 0,
  scoreAllTime: p.scoreAllTime ?? 0,
  scoreTrending: p.scoreTrending ?? 0,
});

export default async function Home() {
  let trending: Project[] = [];
  let alltime: Project[] = [];

  try {
    const [t, a] = await Promise.all([
      prisma.project.findMany({ orderBy: { scoreTrending: "desc" }, take: 20 }),
      prisma.project.findMany({ orderBy: { scoreAllTime: "desc" }, take: 20 }),
    ]);
    trending = t.map(norm);
    alltime = a.map(norm);
  } catch (e) {
    console.error("HOME DB ERROR:", e);
  }

  return (
    <main className="max-w-6xl mx-auto p-6 space-y-10">
      {/* DevFinder no topo */}
      <section className="rounded-2xl border border-neutral-800/60 bg-neutral-900/40 p-6 shadow-sm">
        <DevFinderClient />
      </section>

      {/* Rankings lado a lado com filtros e toggle */}
      <RankingsColumns trending={trending} alltime={alltime} />
    </main>
  );
}
