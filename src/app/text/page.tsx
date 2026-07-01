"use client";

import { BackLink } from "@/components/BackLink";

export default function Text() {
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
    </main>
  );
}
