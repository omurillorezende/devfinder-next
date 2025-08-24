"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SearchForm } from "@/components/search-form";
import { UserCard } from "@/components/user-card";
import { TopReposChart } from "@/components/top-repos-chart";

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
    staleTime: 1000 * 60, // 1 min
  });

  const reposQuery = useQuery({
    queryKey: ["repos", username],
    queryFn: async () => {
      const res = await fetch(`/api/github/repos?u=${username}`);
      if (!res.ok) throw new Error("Falha ao buscar repositórios");
      return res.json();
    },
    enabled: !!username,
    staleTime: 1000 * 60,
  });

  return (
    <main className="min-h-screen grid place-items-center p-8">
      <div className="max-w-3xl w-full space-y-6">
        <h1 className="text-3xl font-bold">DevFinder</h1>

        <SearchForm onSearch={(u) => setUsername(u)} />

        {userQuery.isLoading && <p>Carregando usuário...</p>}
        {userQuery.isError && <p className="text-red-600">Erro: {(userQuery.error as Error).message}</p>}
        {userQuery.data && <UserCard data={userQuery.data} />}

        {reposQuery.isLoading && username && <p>Buscando repositórios...</p>}
        {reposQuery.isError && username && <p className="text-red-600">Erro ao buscar repositórios.</p>}
        {reposQuery.data && <TopReposChart data={reposQuery.data} />}
      </div>
    </main>
  );
}
