"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SearchForm } from "@/components/search-form";
import { UserCard } from "@/components/user-card";
import { TopReposChart } from "@/components/top-repos-chart";
import { Skeleton } from "@/components/skeleton";
import { EmptyState, ErrorState } from "@/components/ui-states";

export default function Home() {
  const [username, setUsername] = useState<string | null>(null);

  const userQuery = useQuery({
    queryKey: ["user", username],
    queryFn: async () => {
      const res = await fetch(`/api/github/user?u=${username}`);
      if (!res.ok) throw new Error("Usuário não encontrado");
      return res.json();
    },
    enabled: !!username,
    staleTime: 60_000,
  });

  const reposQuery = useQuery({
    queryKey: ["repos", username],
    queryFn: async () => {
      const res = await fetch(`/api/github/repos?u=${username}`);
      if (!res.ok) throw new Error("Falha ao buscar repositórios");
      return res.json();
    },
    enabled: !!username,
    staleTime: 60_000,
  });

  return (
    <main className="min-h-screen grid place-items-center p-8">
      <div className="max-w-3xl w-full space-y-6">
        <h1 className="text-3xl font-bold">DevFinder</h1>

        <SearchForm onSearch={(u) => setUsername(u)} />

        {!username && <EmptyState text="Busque um usuário para começar." />}

        {userQuery.isLoading && (
          <div role="status" aria-busy="true" className="space-y-3">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-24 w-full" />
          </div>
        )}
        {userQuery.isError && <ErrorState text={(userQuery.error as Error).message} />}
        {userQuery.data && <UserCard data={userQuery.data} />}

        {reposQuery.isLoading && username && (
          <div role="status" aria-busy="true" className="space-y-3">
            <Skeleton className="h-6 w-56" />
            <Skeleton className="h-64 w-full" />
          </div>
        )}
        {reposQuery.isError && username && <ErrorState text="Erro ao carregar repositórios." />}
        {reposQuery.data && <TopReposChart data={reposQuery.data} />}
      </div>
    </main>
  );
}
