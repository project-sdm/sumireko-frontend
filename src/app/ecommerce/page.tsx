"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { API_URL, searchByImage } from "@/lib/api";
import { KSelector } from "@/components/KSelector";
import { SEARCH_MODES, type SearchMode } from "@/lib/searchModes";

type Mode = "upload" | "camera";

export default function Ecommerce() {
  const [mode, setMode] = useState<Mode>("upload");
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [k, setK] = useState(5);
  const [kRaw, setKRaw] = useState("5");
  const [results, setResults] = useState<string[]>([]);
  const [timeMs, setTimeMs] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [searchMode, setSearchMode] = useState<SearchMode>("native");

  const inputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const previewUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    };
  }, []);

  function clearPreview() {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    setPreview(null);
  }

  function handleFile(f: File) {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    const url = URL.createObjectURL(f);
    previewUrlRef.current = url;
    setFile(f);
    setPreview(url);
    setResults([]);
    setError(null);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (!f) return;
    if (f.type.startsWith("image/")) {
      handleFile(f);
    } else {
      setError("El archivo debe ser una imagen");
    }
  }

  async function startCamera() {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
    } catch {
      setError("No se pudo acceder a la cámara");
    }
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCameraActive(false);
  }

  function capturePhoto() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        stopCamera();
        handleFile(new File([blob], "capture.jpg", { type: "image/jpeg" }));
      },
      "image/jpeg",
      0.92,
    );
  }

  function switchMode(m: Mode) {
    if (m === mode) return;
    stopCamera();
    clearPreview();
    setMode(m);
    setFile(null);
    setResults([]);
    setError(null);
  }

  function resetToInput() {
    clearPreview();
    setFile(null);
    setResults([]);
    setError(null);
    if (mode === "camera") startCamera();
    else inputRef.current?.click();
  }

  async function handleSearch() {
    if (!file) return;
    const committed = Math.min(40, Math.max(1, parseInt(kRaw, 10) || k));
    setK(committed);
    setKRaw(String(committed));
    setLoading(true);
    setError(null);
    setTimeMs(null);
    try {
      const data = await searchByImage(file, committed, searchMode);
      setResults(data.results);
      setTimeMs(data.time_ms);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al buscar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-16 flex flex-col gap-10">
      <Link
        href="/"
        className="text-sm text-foreground/50 hover:text-foreground transition-colors"
      >
        ← Volver al inicio
      </Link>

      <header className="text-center">
        <h1 className="text-3xl font-semibold tracking-tight">
          Búsqueda Visual
        </h1>
        <p className="mt-2 text-sm text-foreground/60">
          Sube una imagen o toma una foto para encontrar prendas similares
        </p>
      </header>

      {/* Mode toggle — hide once we have a preview */}
      {!preview && (
        <div className="flex justify-center">
          <div className="flex rounded-lg bg-surface border border-surface-border p-1 gap-1">
            {(["upload", "camera"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => switchMode(m)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  mode === m
                    ? "bg-foreground text-background"
                    : "text-foreground/60 hover:text-foreground"
                }`}
              >
                {m === "upload" ? "Subir imagen" : "Usar cámara"}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Upload zone */}
      {mode === "upload" && !preview && (
        <section
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`cursor-pointer rounded-xl border-2 border-dashed p-10 text-center transition-colors ${
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
        </section>
      )}

      {/* Camera viewfinder */}
      {mode === "camera" && !preview && (
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-full rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover transition-opacity ${cameraActive ? "opacity-100" : "opacity-0"}`}
            />
            {!cameraActive && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <svg
                  className="h-10 w-10 text-white/30"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <button
                  onClick={startCamera}
                  className="rounded-lg bg-white/10 border border-white/20 px-5 py-2 text-sm font-medium text-white hover:bg-white/20 transition-colors"
                >
                  Activar cámara
                </button>
              </div>
            )}
          </div>

          {cameraActive && (
            <button
              onClick={capturePhoto}
              className="flex items-center gap-2 rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-accent-foreground hover:opacity-90 transition-opacity"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Capturar foto
            </button>
          )}

          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}

      {/* Preview */}
      {preview && (
        <div className="flex flex-col items-center gap-3">
          <div className="w-full rounded-xl border border-surface-border overflow-hidden">
            <img
              src={preview}
              alt="Preview"
              className="mx-auto max-h-72 w-full object-contain bg-surface"
            />
          </div>
          <button
            onClick={resetToInput}
            className="text-xs text-foreground/40 hover:text-foreground/70 transition-colors"
          >
            {mode === "camera" ? "Tomar otra foto" : "Cambiar imagen"}
          </button>
        </div>
      )}

      {/* Controls */}
      {preview && (
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <div className="flex items-center gap-2 rounded-lg bg-surface border border-surface-border px-3 py-2">
            <label className="text-sm text-foreground/60">Modo</label>
            <select
              value={searchMode}
              onChange={(e) => setSearchMode(e.target.value as SearchMode)}
              className="bg-transparent text-sm font-medium outline-none cursor-pointer h-7"
            >
              {SEARCH_MODES.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
          <KSelector
            value={k}
            rawValue={kRaw}
            onValueChange={setK}
            onRawChange={setKRaw}
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="rounded-lg bg-foreground text-background px-5 py-2 text-sm font-medium transition-opacity hover:opacity-80 disabled:opacity-40 cursor-pointer"
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
        <div className="flex flex-col gap-4">
          {timeMs !== null && (
            <p className="text-center text-xs text-foreground/40 tabular-nums">
              {results.length} resultados en {timeMs} ms
            </p>
          )}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            {results.map((path, i) => (
              <img
                key={i}
                src={`${API_URL}/media/images/${path}`}
                alt={`Similar item ${i + 1}`}
                className="aspect-square rounded-lg object-cover transition-transform hover:scale-[1.03]"
              />
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
