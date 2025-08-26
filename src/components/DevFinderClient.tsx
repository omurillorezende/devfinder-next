"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SearchForm } from "@/components/search-form";
import { UserCard } from "@/components/user-card";
import { TopReposChart } from "@/components/top-repos-chart";

type GitHubUser = {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  html_url: string;
};

type TopRepo = { name: string; stars: number; url: string; language: string | null };

async function fetchUser(username: string): Promise<GitHubUser | null> {
  if (!username) return null;
  const r = await fetch(`https://api.github.com/users/${username}`);
  if (!r.ok) {
    const j = await r.json().catch(() => ({}));
    throw new Error(j?.message || `Erro ${r.status}`);
  }
  return r.json();
}

async function fetchTopRepos(username: string): Promise<TopRepo[] | null> {
  if (!username) return null;
  const r = await fetch(
    `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`
  );
  if (!r.ok) {
    const j = await r.json().catch(() => ({}));
    throw new Error(j?.message || `Erro ${r.status}`);
  }
  const repos = (await r.json()) as any[];
  return repos
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 5)
    .map((r) => ({
      name: r.name,
      stars: r.stargazers_count,
      url: r.html_url,
      language: r.language ?? null,
    }));
}

export default function DevFinderClient() {
  const [username, setUsername] = useState("");

  const {
    data: user,
    error: userErr,
    isFetching: loadingUser,
  } = useQuery({
    queryKey: ["user", username],
    queryFn: () => fetchUser(username),
    enabled: !!username,
    retry: 1,
    staleTime: 60_000,
  });

  const {
    data: repos,
    error: reposErr,
    isFetching: loadingRepos,
  } = useQuery({
    queryKey: ["repos", username],
    queryFn: () => fetchTopRepos(username),
    enabled: !!username,
    retry: 1,
    staleTime: 60_000,
  });

  return (
    <div className="max-w-3xl w-full mx-auto space-y-6">
      <h2 className="text-2xl font-bold">DevFinder</h2>

      {/* Autocomplete + busca inteligente de usuários */}
      <SearchForm onSearch={setUsername} />

      {/* Estados/erros */}
      {userErr && (
        <p className="text-red-500 text-sm">
          {(userErr as Error).message || "Usuário não encontrado"}
        </p>
      )}
      {reposErr && (
        <p className="text-red-500 text-sm">
          {(reposErr as Error).message || "Erro ao carregar repositórios"}
        </p>
      )}

      {/* Usuário */}
      {loadingUser && <p className="opacity-70 text-sm">Carregando usuário…</p>}
      {user && <UserCard data={user} />}

      {/* Top repositórios */}
      {loadingRepos && <p className="opacity-70 text-sm">Carregando repositórios…</p>}
      {repos?.length ? (
        <TopReposChart data={repos} />
      ) : (
        username &&
        !loadingRepos && (
          <p className="text-sm opacity-70">Sem repositórios populares.</p>
        )
      )}
    </div>
  );
}
