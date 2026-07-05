"use client";

import { useEffect, useRef, useState } from "react";
import { API_URL, searchByAudio, searchByText } from "@/lib/api";
import { useSearch } from "@/lib/useSearch";
import { type AudioSearchResponse } from "@/lib/schemas";
import { KSelector } from "@/components/KSelector";
import { BackLink } from "@/components/BackLink";
import { PageHeader } from "@/components/PageHeader";
import { UploadDropzone } from "@/components/UploadDropzone";
import { SearchModeSelector } from "@/components/SearchModeSelector";
import { type SearchMode } from "@/lib/searchModes";
import { MusicNoteIcon } from "@/components/icons";
import { clampK } from "@/lib/clampK";

type SubMode = "upload" | "record";
type InputMode = "text" | "audio";

const RECORDING_MIME_CANDIDATES = ["audio/webm", "audio/mp4", "audio/ogg"];

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
  const [inputMode, setInputMode] = useState<InputMode>("audio");
  const [query, setQuery] = useState("");
  const [subMode, setSubMode] = useState<SubMode>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [k, setK] = useState(5);
  const [kRaw, setKRaw] = useState("5");
  const {
    results,
    timeMs,
    loading,
    error,
    run,
    reset: resetSearch,
    setError,
  } = useSearch<AudioSearchResponse>();
  const [recording, setRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [searchMode, setSearchMode] = useState<SearchMode>("native");

  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  function switchInputMode(m: InputMode) {
    if (m === inputMode) return;
    if (recording) stopRecording();
    setInputMode(m);
    setFile(null);
    setFileName(null);
    setQuery("");
    resetSearch();
    setRecordingTime(0);
  }

  function handleFile(f: File) {
    setFile(f);
    setFileName(f.name);
    resetSearch();
  }

  function switchSubMode(m: SubMode) {
    if (m === subMode) return;
    if (recording) stopRecording();
    setSubMode(m);
    setFile(null);
    setFileName(null);
    resetSearch();
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

  async function handleTextSearch() {
    if (!query.trim()) return;
    const committed = clampK(kRaw, k);
    setK(committed);
    setKRaw(String(committed));
    await run(() => searchByText(query.trim(), committed));
  }

  async function handleAudioSearch() {
    if (!file) return;
    const committed = clampK(kRaw, k);
    setK(committed);
    setKRaw(String(committed));
    await run(() => searchByAudio(file, committed, searchMode));
  }

  function resetAudio() {
    setFile(null);
    setFileName(null);
    resetSearch();
    setRecordingTime(0);
  }

  function activeTabStyle(active: boolean) {
    return active
      ? "bg-foreground text-background"
      : "text-foreground/60 hover:text-foreground";
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-16 flex flex-col gap-10">
      <BackLink />

      <PageHeader
        title="Búsqueda Musical"
        subtitle="Busca canciones por su letra o por características acústicas MFCC"
        icon={<MusicNoteIcon className="h-6 w-6" />}
      />

      {/* Input mode toggle */}
      <div className="flex justify-center">
        <div className="flex rounded-lg bg-surface border border-surface-border p-1 gap-1">
          {(["text", "audio"] as InputMode[]).map((m) => (
            <button
              key={m}
              onClick={() => switchInputMode(m)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTabStyle(inputMode === m)}`}
            >
              {m === "text" ? "Por letra" : "Por audio"}
            </button>
          ))}
        </div>
      </div>

      {/* Text search input */}
      {inputMode === "text" && (
        <div className="flex flex-col gap-4 rounded-xl border border-surface-border bg-surface p-4 shadow-soft">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleTextSearch()}
              placeholder="Letra de la canción..."
              className="flex-1 rounded-lg bg-surface-2 border border-surface-border px-4 py-2 text-sm outline-none focus:border-accent/50 transition-colors"
            />
            <button
              onClick={handleTextSearch}
              disabled={!query.trim() || loading}
              className="rounded-lg bg-foreground text-background px-5 py-2 text-sm font-medium transition-opacity hover:opacity-80 disabled:opacity-40 cursor-pointer"
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
      )}

      {/* Audio: sub-mode toggle — hide once a file is ready */}
      {inputMode === "audio" && !fileName && (
        <div className="flex justify-center">
          <div className="flex rounded-lg bg-surface border border-surface-border p-1 gap-1">
            {(["upload", "record"] as SubMode[]).map((m) => (
              <button
                key={m}
                onClick={() => switchSubMode(m)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTabStyle(subMode === m)}`}
              >
                {m === "upload" ? "Subir archivo" : "Grabar"}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Audio: upload zone */}
      {inputMode === "audio" && subMode === "upload" && !fileName && (
        <UploadDropzone
          accept="audio/*"
          title="Arrastra un audio aquí o haz click"
          hint="MP3, WAV, OGG, FLAC"
          onFile={handleFile}
          onInvalid={setError}
          invalidMessage="El archivo debe ser un audio"
          icon={<MusicNoteIcon className="h-10 w-10" />}
        />
      )}

      {/* Audio: recording zone */}
      {inputMode === "audio" && subMode === "record" && !fileName && (
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

      {/* Audio: file ready chip */}
      {inputMode === "audio" && fileName && (
        <div className="flex items-center gap-3 rounded-xl border border-surface-border bg-surface p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
            <MusicNoteIcon className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{fileName}</p>
            <p className="text-xs text-foreground/40">
              {subMode === "record" ? "Grabación" : "Archivo subido"}
            </p>
          </div>
          <button
            onClick={resetAudio}
            className="text-xs text-foreground/40 hover:text-foreground/70 transition-colors shrink-0"
          >
            Cambiar
          </button>
        </div>
      )}

      {/* Audio: controls */}
      {inputMode === "audio" && fileName && (
        <div className="flex flex-wrap items-center justify-center gap-4 rounded-xl border border-surface-border bg-surface p-4 shadow-soft">
          <SearchModeSelector value={searchMode} onChange={setSearchMode} />
          <KSelector
            value={k}
            rawValue={kRaw}
            onValueChange={setK}
            onRawChange={setKRaw}
          />
          <button
            onClick={handleAudioSearch}
            disabled={loading}
            className="rounded-lg bg-foreground text-background px-5 py-2 text-sm font-medium transition-opacity hover:opacity-80 disabled:opacity-40 cursor-pointer"
          >
            {loading ? "Buscando..." : "Buscar"}
          </button>
        </div>
      )}

      {error && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-center text-sm text-red-500">
          {error}
        </p>
      )}

      {loading && (
        <div className="flex flex-col gap-3">
          {Array.from({ length: k }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col gap-3 rounded-xl border border-surface-border bg-surface p-4 shadow-soft"
            >
              <div className="flex items-center gap-3">
                <div className="h-4 w-5 animate-pulse rounded bg-surface-2" />
                <div className="h-4 w-40 animate-pulse rounded bg-surface-2" />
              </div>
              <div className="h-9 w-full animate-pulse rounded bg-surface-2" />
            </div>
          ))}
        </div>
      )}

      {!loading && timeMs !== null && (
        <div className="flex flex-col gap-3">
          <p className="text-xs text-foreground/40 text-center tabular-nums">
            {results.length} resultado
            {results.length !== 1 ? "s" : ""} encontrado
            {results.length !== 1 ? "s" : ""} en {timeMs} ms
          </p>
          {results.length === 0 && (
            <p className="text-center text-sm text-foreground/50 py-6">
              No se encontraron canciones similares.
            </p>
          )}
          {results.map((song, i) => (
            <div
              key={i}
              className="flex flex-col gap-3 rounded-xl bg-surface border border-surface-border p-4 shadow-soft transition-colors hover:border-accent/40"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs text-foreground/30 tabular-nums w-5 text-right">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {song.track_name}
                  </p>
                  <p className="text-xs text-foreground/50 truncate">
                    {song.track_artist}
                  </p>
                </div>
                <span className="text-xs text-foreground/30 tabular-nums shrink-0">
                  {song.track_popularity}%
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <span className="text-[10px] rounded-full bg-foreground/5 px-2 py-0.5 text-foreground/40">
                  {song.playlist_genre}
                </span>
                <span className="text-[10px] rounded-full bg-foreground/5 px-2 py-0.5 text-foreground/40">
                  {song.track_album_name}
                </span>
              </div>
              <audio
                controls
                src={`${API_URL}/media/audios/${song.track_id}.mp3`}
                className="w-full h-9"
              />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
