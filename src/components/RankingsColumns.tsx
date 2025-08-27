"use client";

import { useEffect, useMemo, useState } from "react";
import { ProjectCard, type Project } from "@/components/ProjectCard";

type View = "list" | "grid";

/* -------- util: localStorage com SSR-safe -------- */
function useLocalStorage<T>(key: string, initial: T) {
  const [state, setState] = useState<T>(() => initial);
  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? window.localStorage.getItem(key) : null;
      if (raw != null) setState(JSON.parse(raw));
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(state));
      }
    } catch {}
  }, [key, state]);
  return [state, setState] as const;
}

/* -------- Skeletons -------- */
function SkeletonBar({ w = "w-24" }: { w?: string }) {
  return <div className={`h-3 ${w} rounded-full bg-neutral-800 animate-pulse`} />;
}
function SkeletonCard() {
  return (
    <article className="min-h-[160px] h-full rounded-xl border border-neutral-800/60 bg-neutral-900/40 p-4 shadow-sm flex flex-col animate-pulse">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-full bg-neutral-800" />
        <div className="flex-1 min-w-0">
          <SkeletonBar w="w-48" />
          <div className="mt-2 space-y-1.5">
            <SkeletonBar w="w-full" />
            <SkeletonBar w="w-5/6" />
          </div>
        </div>
      </div>
      <div className="flex-1" />
      <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
        <SkeletonBar w="w-16" />
        <SkeletonBar w="w-16" />
        <SkeletonBar w="w-16" />
      </div>
    </article>
  );
}

/* -------- Toolbar responsiva -------- */
function Toolbar({
  title,
  count,
  languages,
  lang,
  setLang,
  minStars,
  setMinStars,
  view,
  setView,
}: {
  title: string;
  count: number;
  languages: string[];
  lang: string;
  setLang: (s: string) => void;
  minStars: number;
  setMinStars: (n: number) => void;
  view: View;
  setView: (v: View) => void;
}) {
  return (
    <div className="mb-4 rounded-xl border border-neutral-800/60 bg-gradient-to-b from-neutral-900/60 to-neutral-900/30 p-4">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h2 className="text-xl md:text-2xl font-semibold">{title}</h2>
          <span className="text-xs px-2 py-0.5 rounded-md bg-neutral-800/80 border border-neutral-700">
            {count}
          </span>
        </div>

        {/* Toggle Lista/Grade */}
        <div className="inline-flex overflow-hidden rounded-md border border-neutral-700">
          <button
            onClick={() => setView("list")}
            className={`px-3 py-1.5 text-sm min-w-[64px] ${
              view === "list" ? "bg-neutral-800" : "bg-neutral-900 hover:bg-neutral-800/60"
            }`}
            title="Lista"
          >
            Lista
          </button>
          <button
            onClick={() => setView("grid")}
            className={`px-3 py-1.5 text-sm min-w-[64px] ${
              view === "grid" ? "bg-neutral-800" : "bg-neutral-900 hover:bg-neutral-800/60"
            }`}
            title="Grade"
          >
            Grade
          </button>
        </div>
      </div>

      {/* Controles */}
      <div className="mt-3 grid grid-cols-2 gap-2 md:flex md:flex-wrap md:items-center md:gap-3">
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value)}
          className="w-full md:w-auto bg-neutral-900 border border-neutral-700 rounded-md px-2 py-2 text-sm min-h-[36px]"
          title="Filtrar por linguagem"
        >
          <option value="">Todas linguagens</option>
          {languages.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>

        <label className="w-full md:w-auto flex items-center gap-2 text-sm bg-neutral-900 border border-neutral-700 rounded-md px-2 py-2 min-h-[36px]">
          <span className="opacity-80">⭐ mín:</span>
          <input
            type="number"
            min={0}
            step={50}
            value={minStars}
            onChange={(e) => setMinStars(Number(e.target.value || 0))}
            className="w-full md:w-24 bg-transparent outline-none"
          />
        </label>
      </div>
    </div>
  );
}

/* -------- List/Grid -------- */
function ListOrGrid({ items, view }: { items: Project[]; view: View }) {
  if (view === "grid") {
    return (
      <div className="grid gap-3 sm:grid-cols-2 items-stretch">
        {items.map((proj: Project) => (
          <div key={proj.id} className="h-full">
            <ProjectCard p={{ ...proj, topics: proj.topics ?? [] }} />
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="space-y-3">
      {items.map((proj: Project) => (
        <ProjectCard key={proj.id} p={{ ...proj, topics: proj.topics ?? [] }} />
      ))}
    </div>
  );
}

/* -------- Componente principal -------- */
export default function RankingsColumns({
  trending,
  alltime,
}: {
  trending: Project[];
  alltime: Project[];
}) {
  // estados com persistência por coluna
  const [viewL, setViewL] = useLocalStorage<View>("rk_view_left", "list");
  const [viewR, setViewR] = useLocalStorage<View>("rk_view_right", "list");
  const [langL, setLangL] = useLocalStorage<string>("rk_lang_left", "");
  const [langR, setLangR] = useLocalStorage<string>("rk_lang_right", "");
  const [minStarsL, setMinStarsL] = useLocalStorage<number>("rk_minstars_left", 0);
  const [minStarsR, setMinStarsR] = useLocalStorage<number>("rk_minstars_right", 0);

  const languagesL = useMemo(
    () =>
      Array.from(
        new Set(trending.map((p) => (p.language || "").toLowerCase()).filter(Boolean))
      ).sort(),
    [trending]
  );

  const languagesR = useMemo(
    () =>
      Array.from(
        new Set(alltime.map((p) => (p.language || "").toLowerCase()).filter(Boolean))
      ).sort(),
    [alltime]
  );

  const filteredL = useMemo(
    () =>
      trending.filter(
        (p) =>
          (!langL || (p.language || "").toLowerCase() === langL) &&
          p.stars >= minStarsL
      ),
    [trending, langL, minStarsL]
  );

  const filteredR = useMemo(
    () =>
      alltime.filter(
        (p) =>
          (!langR || (p.language || "").toLowerCase() === langR) &&
          p.stars >= minStarsR
      ),
    [alltime, langR, minStarsR]
  );

  // skeletons (mostra 6 cards “fantasmas” quando vazio)
  const SkeletonList = ({ grid = false }: { grid?: boolean }) => (
    grid ? (
      <div className="grid gap-3 sm:grid-cols-2 items-stretch">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    ) : (
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  );

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Em alta (esquerda) */}
      <section className="rounded-2xl border border-neutral-800/60 bg-neutral-900/30 p-5 shadow-sm">
        <Toolbar
          title="🔥 Em alta"
          count={filteredL.length}
          languages={languagesL}
          lang={langL}
          setLang={(v) => setLangL(v)}
          minStars={minStarsL}
          setMinStars={(n) => setMinStarsL(n)}
          view={viewL}
          setView={(v) => setViewL(v)}
        />
        {filteredL.length ? (
          <ListOrGrid items={filteredL} view={viewL} />
        ) : (
          <SkeletonList grid={viewL === "grid"} />
        )}
      </section>

      {/* Todos os tempos (direita) */}
      <section className="rounded-2xl border border-neutral-800/60 bg-neutral-900/30 p-5 shadow-sm">
        <Toolbar
          title="🏆 Todos os tempos"
          count={filteredR.length}
          languages={languagesR}
          lang={langR}
          setLang={(v) => setLangR(v)}
          minStars={minStarsR}
          setMinStars={(n) => setMinStarsR(n)}
          view={viewR}
          setView={(v) => setViewR(v)}
        />
        {filteredR.length ? (
          <ListOrGrid items={filteredR} view={viewR} />
        ) : (
          <SkeletonList grid={viewR === "grid"} />
        )}
      </section>
    </div>
  );
}
