import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Fuse from "fuse.js";

export const dynamic = "force-dynamic";

// normaliza alguns atalhos de linguagem
function normalizeQuery(q: string) {
  return q
    .replace(/\bts\b/gi, "typescript")
    .replace(/\bjs\b/gi, "javascript")
    .trim();
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = normalizeQuery(searchParams.get("q") ?? "");
  const lang = searchParams.get("lang") || undefined;
  const minStars = Number(searchParams.get("minStars") ?? 0);
  const order = (searchParams.get("order") ?? "trending") as "trending" | "alltime";
  const langFilter = lang ? lang.toLowerCase() : undefined;

  

  const all = await prisma.project.findMany({
  where: {
    stars: { gte: minStars },
    language: langFilter ? { equals: langFilter } : undefined,
  },
  take: 1000,
  });

  const allWithTopics = all.map((p) => ({
    ...p,
    topics: (p.topics as string[] | null) ?? [],
  }));

  // se não tem query, só ordena
  if (!q) {
    const sorted = [...allWithTopics].sort((a, b) =>
      order === "trending" ? b.scoreTrending - a.scoreTrending : b.scoreAllTime - a.scoreAllTime
    );
    return NextResponse.json({ items: sorted.slice(0, 50) });
  }

  // busca fuzzy com Fuse.js
  const fuse = new Fuse(allWithTopics, {
    includeScore: true,
    threshold: 0.35,
    keys: [
      { name: "name", weight: 3 },
      { name: "fullName", weight: 2 },
      { name: "description", weight: 1.5 },
      { name: "topics", weight: 1.5 },
      { name: "language", weight: 1 },
    ],
  });

  const hits = fuse.search(q).map((r) => r.item);
  const ranked = hits.sort((a, b) =>
    order === "trending" ? b.scoreTrending - a.scoreTrending : b.scoreAllTime - a.scoreAllTime
  );

  return NextResponse.json({ items: ranked.slice(0, 50) });
}
