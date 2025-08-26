"use client";
import { useState, useEffect } from "react";
import { useProjectsSearch } from "@/hooks/useProjectsSearch";
import { SearchBar } from "@/components/SearchBar";
import { ProjectCard } from "@/components/ProjectCard";
import type { SearchParams } from "@/hooks/useProjectsSearch";

export default function ExplorarPage() {
  const [params, setParams] = useState<SearchParams>({
    q: "",
    lang: "",
    minStars: 0,
    order: "trending",
  });

  const { data, loading, error } = useProjectsSearch(params);

  return (
    <main className="max-w-5xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">Explorar projetos</h1>
      <SearchBar onChange={setParams} />   {/* agora não dá mais erro */}
      {/* ... */}
    </main>
  );
}
