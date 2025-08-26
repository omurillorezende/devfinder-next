export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { ProjectCard } from "@/components/ProjectCard";
import DevFinderClient from "@/components/DevFinderClient";

export default async function Home() {
  const [trending, alltime] = await Promise.all([
    prisma.project.findMany({ orderBy: { scoreTrending: "desc" }, take: 10 }),
    prisma.project.findMany({ orderBy: { scoreAllTime: "desc" }, take: 10 }),
  ]);

  const norm = (p: any) => ({ ...p, topics: (p.topics as string[] | null) ?? [] });

  return (
    <main className="max-w-5xl mx-auto p-4 space-y-10">
      {/* 👉 DevFinder no topo */}
      <section>
        <DevFinderClient />
      </section>

      {/* Rankings abaixo */}
      <section>
        <h2 className="text-xl font-semibold mb-3">🔥 Em alta</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {trending.map((p) => (
            <ProjectCard key={p.id} p={norm(p)} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">🏆 Todos os tempos</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {alltime.map((p) => (
            <ProjectCard key={p.id} p={norm(p)} />
          ))}
        </div>
      </section>
    </main>
  );
}
