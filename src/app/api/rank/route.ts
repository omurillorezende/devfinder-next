import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { scoreAllTime, scoreTrending } from "@/lib/scoring";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  const projects = await prisma.project.findMany();

  // for..of evita "implicit any" do .map callback
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

export async function GET() {
  return POST();
}
