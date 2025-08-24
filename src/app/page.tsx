"use client";

import { useState } from "react";
import { fetchGitHubUser } from "@/lib/github";

export default function Home() {
  const [username, setUsername] = useState("");
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setData(null);
    setLoading(true);

    try {
      const user = await fetchGitHubUser(username);
      setData(user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen grid place-items-center p-8">
      <div className="max-w-xl w-full space-y-4">
        <h1 className="text-3xl font-bold">DevFinder</h1>

        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Digite um usuário, ex: torvalds"
            className="flex-1 border rounded-xl p-3 outline-none focus:ring"
          />
          <button
            type="submit"
            className="bg-black text-white rounded-xl px-4 py-2"
            disabled={!username || loading}
          >
            {loading ? "Buscando..." : "Buscar"}
          </button>
        </form>

        {error && <p className="text-red-600">{error}</p>}

        {data && (
          <div className="border rounded-xl p-4 space-y-2">
            <img
              src={data.avatar_url}
              alt={data.login}
              className="w-20 h-20 rounded-full"
            />
            <h2 className="text-xl font-semibold">{data.name || data.login}</h2>
            <p className="text-sm opacity-80">{data.bio}</p>
            <p className="text-sm">Repos: {data.public_repos}</p>
            <p className="text-sm">Seguidores: {data.followers}</p>
          </div>
        )}
      </div>
    </main>
  );
}
