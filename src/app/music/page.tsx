"use client";

import { useRef, useState } from "react";
import { searchByAudio } from "@/lib/api";

function parseName(path: string): string {
  return (
    path
      .split("/")
      .pop()
      ?.replace(/\.[^.]+$/, "")
      .replace(/[_-]/g, " ") ?? path
  );
}

export default function Music() {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [k, setK] = useState(5);
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(f: File) {
    setFile(f);
    setFileName(f.name);
    setResults([]);
    setError(null);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f?.type.startsWith("audio/")) handleFile(f);
  }

  async function handleSearch() {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const data = await searchByAudio(file, k);
      setResults(data.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-16 flex flex-col gap-10">
      <header className="text-center">
        <h1 className="text-3xl font-semibold tracking-tight">
          Búsqueda Musical
        </h1>
        <p className="mt-2 text-sm text-foreground/60">
          Sube un audio y encuentra canciones similares por características
          acústicas
        </p>
      </header>

      <section
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative cursor-pointer rounded-xl border-2 border-dashed p-10 text-center transition-colors ${
          dragging
            ? "border-accent bg-accent/5"
            : "border-surface-border hover:border-foreground/30"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="audio/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />

        {fileName ? (
          <div className="flex flex-col items-center gap-3">
            <svg
              className="h-10 w-10 text-accent"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z"
              />
            </svg>
            <p className="text-sm font-medium">{fileName}</p>
            <p className="text-xs text-foreground/40">
              Click para cambiar archivo
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 text-foreground/50">
            <svg
              className="h-10 w-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z"
              />
            </svg>
            <p className="text-sm">Arrastra un audio aquí o haz click</p>
            <p className="text-xs">MP3, WAV, OGG, FLAC</p>
          </div>
        )}
      </section>

      {fileName && (
        <div className="flex items-center justify-center gap-4">
          <div className="flex items-center gap-2 rounded-lg bg-surface border border-surface-border px-3 py-2">
            <label className="text-sm text-foreground/60">Resultados</label>
            <button
              onClick={() => setK((v) => Math.max(1, v - 1))}
              className="flex h-7 w-7 items-center justify-center rounded-md bg-foreground/5 text-sm font-medium hover:bg-foreground/10 transition-colors"
            >
              −
            </button>
            <span className="w-6 text-center text-sm font-medium tabular-nums">
              {k}
            </span>
            <button
              onClick={() => setK((v) => Math.min(20, v + 1))}
              className="flex h-7 w-7 items-center justify-center rounded-md bg-foreground/5 text-sm font-medium hover:bg-foreground/10 transition-colors"
            >
              +
            </button>
          </div>
          <button
            onClick={handleSearch}
            disabled={loading}
            className="rounded-lg bg-accent px-5 py-2 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Buscando..." : "Buscar"}
          </button>
        </div>
      )}

      {error && <p className="text-center text-sm text-red-500">{error}</p>}

      {loading && (
        <div className="flex flex-col gap-3">
          {Array.from({ length: k }).map((_, i) => (
            <div
              key={i}
              className="h-20 animate-pulse rounded-xl bg-surface"
            />
          ))}
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-xs text-foreground/40 text-center">
            {results.length} resultado{results.length !== 1 ? "s" : ""} encontrado{results.length !== 1 ? "s" : ""}
          </p>
          {results.map((path, i) => (
            <div
              key={i}
              className="flex flex-col gap-3 rounded-xl bg-surface border border-surface-border p-4"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs text-foreground/30 tabular-nums w-5 text-right">
                  {i + 1}
                </span>
                <p className="text-sm font-medium capitalize">
                  {parseName(path)}
                </p>
              </div>
              <audio
                controls
                src={`${process.env.NEXT_PUBLIC_API_URL}/${path}`}
                className="w-full h-9"
              />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
