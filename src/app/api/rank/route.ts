import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { scoreAllTime, scoreTrending } from "@/lib/scoring";
import type { Project } from "@prisma/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  const projects: Project[] = await prisma.project.findMany();

  // Pode usar for..of (mais simples e sem any implícito)
  for (const p of projects) {
    await prisma.project.update({
      where: { id: p.id },
      data: {
        scoreAllTime: scoreAllTime(p),
        scoreTrending: scoreTrending(p),
        scoreUpdatedAt: new Date(),
      },
    });
  }

  return NextResponse.json({ ok: true, updated: projects.length });
}

// facilita testar no navegador
export async function GET() {
  return POST();
}
