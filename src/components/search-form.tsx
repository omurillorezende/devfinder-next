"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function SearchForm({ onSearch }: { onSearch?: (u: string) => void }) {
  const [username, setUsername] = useState("");
  const router = useRouter();

  function go(u: string) {
    if (onSearch) onSearch(u);
    router.push(`/u/${u}`);
  }

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); go(username.trim()); }}
      className="flex gap-2"
      aria-label="Buscar usuário do GitHub"
    >
      <label htmlFor="username" className="sr-only">Usuário do GitHub</label>
      <input
        id="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="ex: torvalds"
        className="flex-1 border rounded-xl p-3 outline-none focus:ring"
        autoComplete="off"
      />
      <button type="submit" className="bg-black text-white rounded-xl px-4 py-2" disabled={!username}>
        Buscar
      </button>
    </form>
  );
}
