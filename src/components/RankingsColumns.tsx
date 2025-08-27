"use client";

import { useMemo, useState } from "react";
import { ProjectCard, type Project } from "@/components/ProjectCard";

type View = "list" | "grid";

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
      <div className="flex flex-wrap items-center gap-4 justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-semibold">{title}</h2>
          <span className="text-xs px-2 py-1 rounded-md bg-neutral-800/80 border border-neutral-700">
            {count} projetos
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="bg-neutral-900 border border-neutral-700 rounded-md px-2 py-1 text-sm"
            title="Filtrar por linguagem"
          >
            <option value="">Todas linguagens</option>
            {languages.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>

          <label className="flex items-center gap-2 text-sm">
            ⭐ mín:
            <input
              type="number"
              min={0}
              step={50}
              value={minStars}
              onChange={(e) => setMinStars(Number(e.target.value || 0))}
              className="w-24 bg-neutral-900 border border-neutral-700 rounded-md px-2 py-1"
            />
          </label>

          <div className="inline-flex overflow-hidden rounded-md border border-neutral-700">
            <button
              onClick={() => setView("list")}
              className={`px-3 py-1 text-sm ${
                view === "list"
                  ? "bg-neutral-800"
                  : "bg-neutral-900 hover:bg-neutral-800/60"
              }`}
              title="Lista"
            >
              Lista
            </button>
            <button
              onClick={() => setView("grid")}
              className={`px-3 py-1 text-sm ${
                view === "grid"
                  ? "bg-neutral-800"
                  : "bg-neutral-900 hover:bg-neutral-800/60"
              }`}
              title="Grade"
            >
              Grade
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

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

export default function RankingsColumns({
  trending,
  alltime,
}: {
  trending: Project[];
  alltime: Project[];
}) {
  const [viewL, setViewL] = useState<View>("list");
  const [viewR, setViewR] = useState<View>("list");
  const [langL, setLangL] = useState("");
  const [langR, setLangR] = useState("");
  const [minStarsL, setMinStarsL] = useState(0);
  const [minStarsR, setMinStarsR] = useState(0);

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

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Em alta (esquerda) */}
      <section className="rounded-2xl border border-neutral-800/60 bg-neutral-900/30 p-5 shadow-sm">
        <Toolbar
          title="🔥 Em alta"
          count={filteredL.length}
          languages={languagesL}
          lang={langL}
          setLang={setLangL}
          minStars={minStarsL}
          setMinStars={setMinStarsL}
          view={viewL}
          setView={setViewL}
        />
        {filteredL.length ? (
          <ListOrGrid items={filteredL} view={viewL} />
        ) : (
          <p className="text-sm opacity-70">Sem resultados com os filtros.</p>
        )}
      </section>

      {/* Todos os tempos (direita) */}
      <section className="rounded-2xl border border-neutral-800/60 bg-neutral-900/30 p-5 shadow-sm">
        <Toolbar
          title="🏆 Todos os tempos"
          count={filteredR.length}
          languages={languagesR}
          lang={langR}
          setLang={setLangR}
          minStars={minStarsR}
          setMinStars={setMinStarsR}
          view={viewR}
          setView={setViewR}
        />
        {filteredR.length ? (
          <ListOrGrid items={filteredR} view={viewR} />
        ) : (
          <p className="text-sm opacity-70">Sem resultados com os filtros.</p>
        )}
      </section>
    </div>
  );
}
