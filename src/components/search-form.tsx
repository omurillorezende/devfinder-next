"use client";
import { useState } from "react";

export function SearchForm({ onSearch }: { onSearch: (u: string) => void }) {
  const [username, setUsername] = useState("");
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSearch(username.trim()); }}
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
