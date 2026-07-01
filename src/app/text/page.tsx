"use client";

import { useState } from "react";
import { searchByText } from "@/lib/api";
import { useSearch } from "@/lib/useSearch";
import { BackLink } from "@/components/BackLink";
import { KSelector } from "@/components/KSelector";

export default function Text() {
  const [query, setQuery] = useState("");
  const [language, setLanguage] = useState("english");
  const [k, setK] = useState(5);
  const [kRaw, setKRaw] = useState("5");
  const { results, timeMs, loading, error, run } = useSearch();

  async function handleSearch() {
    if (!query.trim()) return;
    const committed = Math.min(40, Math.max(1, parseInt(kRaw, 10) || k));
    setK(committed);
    setKRaw(String(committed));
    await run(() => searchByText(query, committed, language));
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-16 flex flex-col gap-10">
      <BackLink />

      <header className="text-center">
        <h1 className="text-3xl font-semibold tracking-tight">
          Búsqueda de Texto
        </h1>
        <p className="mt-2 text-sm text-foreground/60">
          Escribe una consulta para encontrar los documentos más relevantes
        </p>
      </header>

      <div className="flex gap-2">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="rounded-lg bg-surface border border-surface-border px-3 py-2 text-sm font-medium outline-none cursor-pointer"
        >
          <option value="english">Inglés</option>
          <option value="spanish">Español</option>
          <option value="multilingual">Multilingüe</option>
        </select>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Ej: machine learning"
          className="flex-1 rounded-lg bg-surface border border-surface-border px-4 py-2 text-sm outline-none focus:border-foreground/30 transition-colors"
        />
        <button
          onClick={handleSearch}
          className="rounded-lg bg-foreground text-background px-5 py-2 text-sm font-medium transition-opacity hover:opacity-80 disabled:opacity-40 cursor-pointer"
          disabled={!query.trim() || loading}
        >
          {loading ? "Buscando..." : "Buscar"}
        </button>
      </div>

      <div className="flex justify-center">
        <KSelector
          value={k}
          rawValue={kRaw}
          onValueChange={setK}
          onRawChange={setKRaw}
        />
      </div>

      {error && <p className="text-center text-sm text-red-500">{error}</p>}

      {loading && (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-11 animate-pulse rounded-lg bg-surface" />
          ))}
        </div>
      )}

      {!loading && timeMs !== null && (
        <div className="flex flex-col gap-3">
          <p className="text-center text-xs text-foreground/40 tabular-nums">
            {results.length} resultado{results.length !== 1 ? "s" : ""} en{" "}
            {timeMs} ms
          </p>
          {results.length === 0 && (
            <p className="text-center text-sm text-foreground/50 py-6">
              No se encontraron documentos para tu consulta.
            </p>
          )}
          <ul className="flex flex-col gap-2">
            {results.map((name, i) => (
              <li
                key={i}
                className="flex items-center gap-3 rounded-lg bg-surface border border-surface-border p-3 text-sm"
              >
                <span className="w-5 text-right text-xs text-foreground/30 tabular-nums">
                  {i + 1}
                </span>
                <span className="truncate">{name}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
