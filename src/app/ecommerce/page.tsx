"use client";

import { useEffect, useRef, useState } from "react";
import { API_URL, searchByImage } from "@/lib/api";
import { useSearch } from "@/lib/useSearch";
import { KSelector } from "@/components/KSelector";
import { BackLink } from "@/components/BackLink";
import { PageHeader } from "@/components/PageHeader";
import { UploadDropzone } from "@/components/UploadDropzone";
import { SearchModeSelector } from "@/components/SearchModeSelector";
import { type SearchMode } from "@/lib/searchModes";
import { CameraIcon } from "@/components/icons";
import { clampK } from "@/lib/clampK";

type Mode = "upload" | "camera";

export default function Ecommerce() {
  const [mode, setMode] = useState<Mode>("upload");
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [k, setK] = useState(5);
  const [kRaw, setKRaw] = useState("5");
  const { results, timeMs, loading, error, run, reset, setError } = useSearch();
  const [cameraActive, setCameraActive] = useState(false);
  const [searchMode, setSearchMode] = useState<SearchMode>("native");

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
    reset();
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
    reset();
  }

  function resetToInput() {
    clearPreview();
    setFile(null);
    reset();
    if (mode === "camera") startCamera();
  }

  async function handleSearch() {
    if (!file) return;
    const committed = clampK(kRaw, k);
    setK(committed);
    setKRaw(String(committed));
    await run(() => searchByImage(file, committed, searchMode));
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-16 flex flex-col gap-10">
      <BackLink />

      <PageHeader
        title="Búsqueda Visual"
        subtitle="Sube una imagen o toma una foto para encontrar prendas similares"
        icon={<CameraIcon className="h-6 w-6" />}
      />

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
        <UploadDropzone
          accept="image/*"
          title="Arrastra una imagen aquí o haz click"
          hint="JPG, PNG, WEBP"
          onFile={handleFile}
          onInvalid={setError}
          invalidMessage="El archivo debe ser una imagen"
          icon={
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
          }
        />
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
                <CameraIcon className="h-10 w-10 text-white/30" />
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
              <CameraIcon className="h-4 w-4" />
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
        <div className="flex flex-wrap items-center justify-center gap-4 rounded-xl border border-surface-border bg-surface p-4 shadow-soft">
          <SearchModeSelector value={searchMode} onChange={setSearchMode} />
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

      {error && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-center text-sm text-red-500">
          {error}
        </p>
      )}

      {loading && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          {Array.from({ length: k }).map((_, i) => (
            <div
              key={i}
              className="aspect-square animate-pulse rounded-lg border border-surface-border bg-surface-2 shadow-soft"
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
                className="aspect-square rounded-lg border border-surface-border object-cover shadow-soft transition-all hover:scale-[1.03] hover:shadow-lg"
              />
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
