"use client";

import { useState } from "react";
import { searchByText } from "@/lib/api";
import { useSearch } from "@/lib/useSearch";
import { parseName } from "@/lib/format";
import { type Language } from "@/lib/languages";
import { BackLink } from "@/components/BackLink";
import { PageHeader } from "@/components/PageHeader";
import { KSelector } from "@/components/KSelector";
import { LanguageSelector } from "@/components/LanguageSelector";
import { clampK } from "@/lib/clampK";

export default function Text() {
  const [query, setQuery] = useState("");
  const [language, setLanguage] = useState<Language>("english");
  const [k, setK] = useState(5);
  const [kRaw, setKRaw] = useState("5");
  const { results, timeMs, loading, error, run } = useSearch();

  async function handleSearch() {
    if (!query.trim()) return;
    const committed = clampK(kRaw, k);
    setK(committed);
    setKRaw(String(committed));
    await run(() => searchByText(query, committed, language));
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-16 flex flex-col gap-10">
      <BackLink />

      <PageHeader
        title="Búsqueda de Texto"
        subtitle="Escribe una consulta para encontrar los documentos más relevantes"
        icon={
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 21l-5.2-5.2m0 0A7.5 7.5 0 105.2 5.2a7.5 7.5 0 0010.6 10.6z"
            />
          </svg>
        }
      />

      <div className="flex flex-col gap-4 rounded-xl border border-surface-border bg-surface p-4 shadow-soft">
        <div className="flex gap-2">
          <LanguageSelector value={language} onChange={setLanguage} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Ej: machine learning"
            className="flex-1 rounded-lg bg-surface-2 border border-surface-border px-4 py-2 text-sm outline-none focus:border-accent/50 transition-colors"
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
      </div>

      {error && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-center text-sm text-red-500">
          {error}
        </p>
      )}

      {loading && (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-lg border border-surface-border bg-surface p-3 shadow-soft"
            >
              <div className="h-4 w-5 animate-pulse rounded bg-surface-2" />
              <div className="h-4 w-48 animate-pulse rounded bg-surface-2" />
            </div>
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
                className="flex items-center gap-3 rounded-lg bg-surface border border-surface-border p-3 text-sm shadow-soft transition-colors hover:border-accent/40"
              >
                <span className="w-5 text-right text-xs text-foreground/30 tabular-nums">
                  {i + 1}
                </span>
                <span className="truncate capitalize">{parseName(name)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
