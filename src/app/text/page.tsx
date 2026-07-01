"use client";

import { useState } from "react";
import { BackLink } from "@/components/BackLink";

export default function Text() {
  const [query, setQuery] = useState("");

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
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ej: machine learning"
          className="flex-1 rounded-lg bg-surface border border-surface-border px-4 py-2 text-sm outline-none focus:border-foreground/30 transition-colors"
        />
        <button
          className="rounded-lg bg-foreground text-background px-5 py-2 text-sm font-medium transition-opacity hover:opacity-80 disabled:opacity-40 cursor-pointer"
          disabled={!query.trim()}
        >
          Buscar
        </button>
      </div>
    </main>
  );
}
