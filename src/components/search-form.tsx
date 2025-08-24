"use client";
import { useState } from "react";

export function SearchForm({ onSearch }: { onSearch: (u: string) => void }) {
  const [username, setUsername] = useState("");
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSearch(username.trim()); }}
      className="flex gap-2"
    >
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Digite um usuário, ex: torvalds"
        className="flex-1 border rounded-xl p-3 outline-none focus:ring"
      />
      <button
        type="submit"
        className="bg-black text-white rounded-xl px-4 py-2"
        disabled={!username}
      >
        Buscar
      </button>
    </form>
  );
}
