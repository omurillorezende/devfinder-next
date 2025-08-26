// src/app/api/rank/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { scoreAllTime, scoreTrending } from "@/lib/scoring";

export const dynamic = "force-dynamic";

export async function POST() {
  const projects = await prisma.project.findMany();
  await Promise.all(
    projects.map((p) =>
      prisma.project.update({
        where: { id: p.id },
        data: {
          scoreAllTime: scoreAllTime(p),
          scoreTrending: scoreTrending(p),
          scoreUpdatedAt: new Date(),
        },
      })
    )
  );
  return NextResponse.json({ ok: true, updated: projects.length });
}

// facilita testar no navegador
export async function GET() {
  return POST();
}
