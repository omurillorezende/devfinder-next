import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST() {
  const projects = await prisma.project.findMany({
    select: { id: true, language: true },
  });

  let updated = 0;
  for (const p of projects) {
    const lang = p.language?.toLowerCase() ?? null;
    // só atualiza se houver diferença
    if (p.language !== lang) {
      await prisma.project.update({
        where: { id: p.id },
        data: { language: lang },
      });
      updated++;
    }
  }

  return NextResponse.json({ ok: true, updated });
}

// permite rodar via navegador
export async function GET() { return POST(); }
