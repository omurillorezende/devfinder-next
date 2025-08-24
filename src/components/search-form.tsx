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
        aria-describedby="username-help"
        autoComplete="off"
      />
      <span id="username-help" className="sr-only">Digite o nome de usuário e tecle Enter</span>
      <button
        type="submit"
        className="bg-black text-white rounded-xl px-4 py-2"
        disabled={!username}
        aria-label="Buscar"
      >
        Buscar
      </button>
    </form>
  );
}
