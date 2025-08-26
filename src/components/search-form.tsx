"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/useDebounce";
import Image from "next/image";

type Props = { onSearch: (username: string) => void };

type Suggestion = { login: string; avatar_url: string; html_url: string };

const LS_KEY = "devfinder_recent_users";
const MAX_RECENTS = 8;

function loadRecents(): Suggestion[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as Suggestion[];
    return Array.isArray(arr) ? arr.slice(0, MAX_RECENTS) : [];
  } catch {
    return [];
  }
}

function saveRecent(user: Suggestion) {
  try {
    const prev = loadRecents();
    const dedup = [user, ...prev.filter((u) => u.login !== user.login)].slice(
      0,
      MAX_RECENTS
    );
    localStorage.setItem(LS_KEY, JSON.stringify(dedup));
  } catch {}
}

export function SearchForm({ onSearch }: Props) {
  const [term, setTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1); // índice selecionado (teclado)
  const [recents, setRecents] = useState<Suggestion[]>([]);
  const debounced = useDebounce(term, 250);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // carregar recentes quando montar
  useEffect(() => {
    setRecents(loadRecents());
  }, []);

  // busca usuários relacionados na API do GitHub (servidor proxy local)
  const { data, isFetching } = useQuery({
    queryKey: ["search-users", debounced],
    queryFn: async () => {
      if (!debounced || debounced.length < 2)
        return { items: [] as Suggestion[] };
      const res = await fetch(
        `/api/github/search-users?q=${encodeURIComponent(debounced)}&per_page=8`
      );
      if (!res.ok) throw new Error("Falha ao buscar usuários");
      return (await res.json()) as { items: Suggestion[] };
    },
    enabled: debounced.length >= 2,
    staleTime: 30_000,
  });

  const suggestions = (data?.items ?? []) as Suggestion[];
  const showRecents = !isFetching && suggestions.length === 0 && recents.length > 0 && term.length < 2;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!term.trim()) return;
    // se há um item ativo nas sugestões, usa ele
    const selected =
      active >= 0 && active < suggestions.length ? suggestions[active] : null;
    const login = selected?.login ?? term.trim();
    onSearch(login);
    // salva recente se veio de uma sugestão válida
    if (selected) {
      saveRecent(selected);
      setRecents(loadRecents());
      setTerm(selected.login);
    }
    setOpen(false);
    setActive(-1);
  }

  function pick(u: Suggestion) {
    setTerm(u.login);
    onSearch(u.login);
    saveRecent(u);
    setRecents(loadRecents());
    setOpen(false);
    setActive(-1);
  }

  // abrir dropdown ao digitar/focar
  useEffect(() => {
    if ((debounced && debounced.length >= 1) || document.activeElement === inputRef.current) {
      setOpen(true);
    }
    // resetar seleção quando muda a lista
    setActive(-1);
  }, [debounced]);

  // clique fora fecha dropdown
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) {
        setOpen(false);
        setActive(-1);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // navegação por teclado
  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open) return;
    const hasList = suggestions.length > 0;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!hasList) return;
      setActive((i) => {
        const next = i + 1;
        return next >= suggestions.length ? 0 : next;
      });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!hasList) return;
      setActive((i) => {
        const prev = i - 1;
        return prev < 0 ? suggestions.length - 1 : prev;
      });
    } else if (e.key === "Enter") {
      // o submit do form já trata o selected/term
      // mas se não há sugestões, só deixa o form enviar
    } else if (e.key === "Escape") {
      setOpen(false);
      setActive(-1);
    }
  }

  // rolar item ativo para a vista
  useEffect(() => {
    if (!listRef.current) return;
    const el = listRef.current.querySelector<HTMLButtonElement>(
      `[data-index="${active}"]`
    );
    if (el) el.scrollIntoView({ block: "nearest" });
  }, [active]);

  return (
    <div ref={rootRef} className="relative">
      <form onSubmit={handleSubmit} className="flex gap-2" role="search">
        <input
          ref={inputRef}
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="Buscar usuário do GitHub (ex: diego, rocketseat, torvalds)…"
          className="flex-1 rounded-lg px-3 py-2 bg-neutral-800 outline-none"
          autoComplete="off"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls="user-suggestions"
          aria-activedescendant={
            active >= 0 ? `user-suggestion-${active}` : undefined
          }
        />
        <button type="submit" className="rounded-lg px-4 py-2 bg-indigo-600">
          Buscar
        </button>
      </form>

      {open && (isFetching || suggestions.length > 0 || showRecents) && (
        <div
          id="user-suggestions"
          ref={listRef}
          role="listbox"
          className="absolute z-10 mt-2 w-full max-h-80 overflow-auto rounded-lg bg-neutral-900 border border-neutral-800 shadow-lg"
        >
          {isFetching && (
            <div className="px-3 py-2 text-sm opacity-70">Procurando…</div>
          )}

          {/* Sugestões */}
          {suggestions.map((u, idx) => (
            <button
              type="button"
              key={u.login}
              data-index={idx}
              id={`user-suggestion-${idx}`}
              role="option"
              aria-selected={active === idx}
              onMouseEnter={() => setActive(idx)}
              onClick={() => pick(u)}
              className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-neutral-800 ${
                active === idx ? "bg-neutral-800" : ""
              }`}
            >
              <Image
                src={u.avatar_url}
                alt={u.login}
                width={24}
                height={24}
                className="rounded-full"
              />
              <div className="flex-1">
                <div className="text-sm font-medium">{u.login}</div>
                <div className="text-xs opacity-70">
                  {u.html_url.replace("https://", "")}
                </div>
              </div>
            </button>
          ))}

          {/* Recentes quando não há sugestões */}
          {showRecents && (
            <>
              <div className="px-3 py-1 text-xs uppercase tracking-wide opacity-60">
                Recentes
              </div>
              {recents.map((u, idx) => (
                <button
                  type="button"
                  key={`recent-${u.login}`}
                  onClick={() => pick(u)}
                  className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-neutral-800"
                >
                  <Image
                    src={u.avatar_url}
                    alt={u.login}
                    width={20}
                    height={20}
                    className="rounded-full"
                  />
                  <div className="flex-1">
                    <div className="text-sm">{u.login}</div>
                  </div>
                </button>
              ))}
            </>
          )}

          {!isFetching &&
            suggestions.length === 0 &&
            !showRecents &&
            debounced.length >= 2 && (
              <div className="px-3 py-2 text-sm opacity-70">Sem resultados</div>
            )}
        </div>
      )}
    </div>
  );
}
