"use client";
import { useEffect, useState } from "react";

export type SearchParams = {
  q?: string; lang?: string; minStars?: number; order?: "trending" | "alltime";
};

export function useProjectsSearch(params: SearchParams) {
  const { q = "", lang = "", minStars = 0, order = "trending" } = params;
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const url = new URL("/api/search", window.location.origin);
    if (q) url.searchParams.set("q", q);
    if (lang) url.searchParams.set("lang", lang);
    if (minStars) url.searchParams.set("minStars", String(minStars));
    url.searchParams.set("order", order);
    setLoading(true); setError(null);
    fetch(url.toString())
      .then(r => r.ok ? r.json() : r.json().then(x => Promise.reject(x)))
      .then(j => setData(j.items ?? []))
      .catch(e => setError(e?.error ?? "Erro ao buscar"))
      .finally(() => setLoading(false));
  }, [q, lang, minStars, order]);

  return { data, loading, error };
}
