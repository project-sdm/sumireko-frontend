"use client";

// update backend for webm support

import { useEffect, useRef, useState } from "react";
import { API_URL, searchByAudio } from "@/lib/api";
import { KSelector } from "@/components/KSelector";

type Mode = "upload" | "record";
type SearchMode = "native" | "pg-brute" | "pg-ivf" | "pg-hnsw";

const SEARCH_MODES: { value: SearchMode; label: string }[] = [
  { value: "native", label: "Nativo" },
  { value: "pg-brute", label: "Postgres (Fuerza Bruta)" },
  { value: "pg-ivf", label: "Postgres (IVFFlat)" },
  { value: "pg-hnsw", label: "Postgres (HNSW)" },
];

function parseName(path: string): string {
  return (
    path
      .split("/")
      .pop()
      ?.replace(/\.[^.]+$/, "")
      .replace(/[_-]/g, " ") ?? path
  );
}

const RECORDING_MIME_CANDIDATES = [
  "audio/webm",
  "audio/mp4",
  "audio/ogg",
];

function pickSupportedMimeType(): string | undefined {
  if (typeof MediaRecorder === "undefined" || !MediaRecorder.isTypeSupported) {
    return undefined;
  }
  return RECORDING_MIME_CANDIDATES.find((type) =>
    MediaRecorder.isTypeSupported(type),
  );
}

function formatTime(s: number): string {
  const m = Math.floor(s / 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${(s % 60).toString().padStart(2, "0")}`;
}

export default function Music() {
  const [mode, setMode] = useState<Mode>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [k, setK] = useState(5);
  const [kRaw, setKRaw] = useState("5");
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [searchMode, setSearchMode] = useState<SearchMode>("native");

  const inputRef = useRef<HTMLInputElement>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

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
    if (!f) return;
    if (f.type.startsWith("audio/")) {
      handleFile(f);
    } else {
      setError("El archivo debe ser un audio");
    }
  }

  function switchMode(m: Mode) {
    if (m === mode) return;
    if (recording) stopRecording();
    setMode(m);
    setFile(null);
    setFileName(null);
    setResults([]);
    setError(null);
    setRecordingTime(0);
  }

  async function startRecording() {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mimeType = pickSupportedMimeType();
      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);
      recorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const type = recorder.mimeType || "audio/webm";
        const ext = type.split("/")[1]?.split(";")[0] || "webm";
        const blob = new Blob(chunksRef.current, { type });
        handleFile(new File([blob], `recording.${ext}`, { type }));
        streamRef.current?.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      };

      recorder.start(100);
      setRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(
        () => setRecordingTime((t) => t + 1),
        1000,
      );
    } catch {
      setError("No se pudo acceder al micrófono");
    }
  }

  function stopRecording() {
    recorderRef.current?.stop();
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setRecording(false);
  }

  async function handleSearch() {
    if (!file) return;
    const committed = Math.min(40, Math.max(1, parseInt(kRaw, 10) || k));
    setK(committed);
    setKRaw(String(committed));
    setLoading(true);
    setError(null);
    try {
      const data = await searchByAudio(file, committed, searchMode);
      setResults(data.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setFile(null);
    setFileName(null);
    setResults([]);
    setError(null);
    setRecordingTime(0);
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-16 flex flex-col gap-10">
      <header className="text-center">
        <h1 className="text-3xl font-semibold tracking-tight">
          Búsqueda Musical
        </h1>
        <p className="mt-2 text-sm text-foreground/60">
          Sube un audio o graba desde tu micrófono para encontrar canciones
          similares
        </p>
      </header>

      {/* Mode toggle — hide once a file is ready */}
      {!fileName && (
        <div className="flex justify-center">
          <div className="flex rounded-lg bg-surface border border-surface-border p-1 gap-1">
            {(["upload", "record"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => switchMode(m)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  mode === m
                    ? "bg-foreground text-background"
                    : "text-foreground/60 hover:text-foreground"
                }`}
              >
                {m === "upload" ? "Subir archivo" : "Grabar"}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Upload zone */}
      {mode === "upload" && !fileName && (
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
            accept="audio/*"
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
                d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z"
              />
            </svg>
            <p className="text-sm">Arrastra un audio aquí o haz click</p>
            <p className="text-xs">MP3, WAV, OGG, FLAC</p>
          </div>
        </section>
      )}

      {/* Recording zone */}
      {mode === "record" && !fileName && (
        <div className="flex flex-col items-center gap-6 rounded-xl border-2 border-dashed border-surface-border p-12">
          {recording ? (
            <>
              <div className="relative flex items-center justify-center">
                <div className="absolute h-16 w-16 rounded-full bg-red-500/20 animate-ping" />
                <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-red-500">
                  <svg
                    className="h-5 w-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <rect x="6" y="6" width="12" height="12" rx="2" />
                  </svg>
                </div>
              </div>
              <p className="text-2xl font-mono tabular-nums text-foreground/80">
                {formatTime(recordingTime)}
              </p>
              <button
                onClick={stopRecording}
                className="rounded-lg bg-red-500 px-6 py-2.5 text-sm font-medium text-white hover:opacity-90 transition-opacity"
              >
                Detener grabación
              </button>
            </>
          ) : (
            <>
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface border border-surface-border text-foreground/50">
                <svg
                  className="h-7 w-7"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
                  />
                </svg>
              </div>
              <div className="text-center flex flex-col gap-1">
                <p className="text-sm">Graba desde tu micrófono</p>
                <p className="text-xs text-foreground/40">
                  El audio se usará para encontrar canciones similares
                </p>
              </div>
              <button
                onClick={startRecording}
                className="rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-accent-foreground hover:opacity-90 transition-opacity"
              >
                Iniciar grabación
              </button>
            </>
          )}
        </div>
      )}

      {/* File ready chip */}
      {fileName && (
        <div className="flex items-center gap-3 rounded-xl border border-surface-border bg-surface p-4">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
            <svg
              className="h-5 w-5"
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
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{fileName}</p>
            <p className="text-xs text-foreground/40">
              {mode === "record" ? "Grabación" : "Archivo subido"}
            </p>
          </div>
          <button
            onClick={reset}
            className="text-xs text-foreground/40 hover:text-foreground/70 transition-colors flex-shrink-0"
          >
            Cambiar
          </button>
        </div>
      )}

      {/* Controls */}
      {fileName && (
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
        <div className="flex flex-col gap-3">
          {Array.from({ length: k }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-surface" />
          ))}
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-xs text-foreground/40 text-center">
            {results.length} resultado
            {results.length !== 1 ? "s" : ""} encontrado
            {results.length !== 1 ? "s" : ""}
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
                src={`${API_URL}/media/audios/${path}`}
                className="w-full h-9"
              />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
