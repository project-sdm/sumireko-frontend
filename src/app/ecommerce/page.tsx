"use client";

import { useRef, useState } from "react";
import { searchByImage } from "@/lib/api";

export default function Ecommerce() {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [k, setK] = useState(5);
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(f: File) {
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResults([]);
    setError(null);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f?.type.startsWith("image/")) handleFile(f);
  }

  async function handleSearch() {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const data = await searchByImage(file, k);
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
          Búsqueda Visual
        </h1>
        <p className="mt-2 text-sm text-foreground/60">
          Sube una imagen y encuentra prendas similares en el catálogo
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
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />

        {preview ? (
          <div className="flex flex-col items-center gap-3">
            <img
              src={preview}
              alt="Uploaded preview"
              className="mx-auto max-h-64 rounded-lg object-contain"
            />
            <p className="text-xs text-foreground/40">
              Click para cambiar imagen
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            <p className="text-sm">Arrastra una imagen aquí o haz click</p>
            <p className="text-xs">JPG, PNG, WEBP</p>
          </div>
        )}
      </section>

      {preview && (
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
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          {Array.from({ length: k }).map((_, i) => (
            <div
              key={i}
              className="aspect-square animate-pulse rounded-lg bg-surface"
            />
          ))}
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          {results.map((path, i) => (
            <img
              key={i}
              src={`${process.env.NEXT_PUBLIC_API_URL}/media/images/${path}`}
              alt={`Similar item ${i + 1}`}
              className="aspect-square rounded-lg object-cover transition-transform hover:scale-[1.03]"
            />
          ))}
        </div>
      )}
    </main>
  );
}
