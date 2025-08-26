"use client";
import { useState } from "react";
import type { SearchParams } from "@/hooks/useProjectsSearch";

export function SearchBar({ onChange }: { onChange: (v: SearchParams)=>void }) {
  const [q, setQ] = useState("");
  const [lang, setLang] = useState("");
  const [minStars, setMinStars] = useState(0);
  const [order, setOrder] = useState<"trending"|"alltime">("trending");

  return (
    <div className="grid gap-3 md:grid-cols-5 p-3 bg-neutral-900/40 rounded-xl">
      <input className="md:col-span-2 rounded-lg px-3 py-2 bg-neutral-800 outline-none"
             placeholder="Buscar (ex: react, next, prisma)…"
             value={q} onChange={e=>setQ(e.target.value)} />
      <input className="rounded-lg px-3 py-2 bg-neutral-800 outline-none"
             placeholder="Linguagem (ex: typescript)"
             value={lang} onChange={e=>setLang(e.target.value)} />
      <input className="rounded-lg px-3 py-2 bg-neutral-800 outline-none"
             type="number" min={0} placeholder="Min stars"
             value={minStars} onChange={e=>setMinStars(Number(e.target.value||0))} />
      <select className="rounded-lg px-3 py-2 bg-neutral-800 outline-none"
              value={order} onChange={e=>setOrder(e.target.value as any)}>
        <option value="trending">Em alta</option>
        <option value="alltime">Todos os tempos</option>
      </select>
      <button className="md:col-span-5 rounded-lg px-4 py-2 bg-indigo-600"
              onClick={()=>onChange({ q, lang, minStars, order })}>
        Buscar
      </button>
    </div>
  );
}
