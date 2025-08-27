"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Props = {
  onSearch: (username: string) => void;
};

type Suggestion = {
  login: string;
  avatar_url: string;
  html_url: string;
};

export function SearchForm({ onSearch }: Props) {
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // debounce simples
  const debounce = (fn: (...args: any[]) => void, ms = 350) => {
    let t: any;
    return (...args: any[]) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), ms);
    };
  };

  const doSuggest = useCallback(
    debounce(async (q: string) => {
      if (!q || q.length < 2) {
        setSuggestions([]);
        setOpen(false);
        return;
      }
      try {
        setLoading(true);
        // Busca usuários aproximados via GitHub Search API
        const r = await fetch(
          `https://api.github.com/search/users?q=${encodeURIComponent(q)}&per_page=5`
        );
        const j = await r.json();
        const items = Array.isArray(j.items) ? j.items : [];
        setSuggestions(
          items.map((it: any) => ({
            login: it.login,
            avatar_url: it.avatar_url,
            html_url: it.html_url,
          }))
        );
        setOpen(items.length > 0);
      } catch {
        setSuggestions([]);
        setOpen(false);
      } finally {
        setLoading(false);
      }
    }, 350),
    []
  );

  useEffect(() => {
    doSuggest(value.trim());
  }, [value, doSuggest]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = value.trim();
    if (!user) return;
    onSearch(user);
    setOpen(false);
  };

  const pick = (login: string) => {
    setValue(login);
    setOpen(false);
    onSearch(login);
  };

  // fecha popup ao clicar fora
  useEffect(() => {
    const onDoc = (ev: MouseEvent) => {
      const t = ev.target as Node;
      if (!listRef.current || !inputRef.current) return;
      if (!listRef.current.contains(t) && !inputRef.current.contains(t)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div className="relative">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full"
      >
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Digite um usuário do GitHub..."
          className="flex-1 rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls="user-suggest-list"
        />

        <button
          type="submit"
          className="rounded-md bg-blue-600 hover:bg-blue-500 px-4 py-2 text-sm sm:text-base font-medium w-full sm:w-auto"
          aria-label="Buscar usuário"
        >
          {loading ? "Buscando..." : "Buscar"}
        </button>
      </form>

      {/* Dropdown de sugestões */}
      {open && suggestions.length > 0 && (
        <ul
          id="user-suggest-list"
          ref={listRef}
          className="absolute z-20 mt-2 w-full sm:max-w-lg rounded-md border border-neutral-800 bg-neutral-900/95 backdrop-blur p-1 shadow-lg"
          role="listbox"
        >
          {suggestions.map((u) => (
            <li key={u.login}>
              <button
                onClick={() => pick(u.login)}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-neutral-800 text-left"
                role="option"
                aria-selected="false"
              >
                <img
                  src={u.avatar_url}
                  alt={u.login}
                  className="w-7 h-7 rounded-full border border-neutral-700"
                />
                <div className="min-w-0">
                  <div className="font-medium truncate">{u.login}</div>
                  <div className="text-xs opacity-70 truncate">{u.html_url}</div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
