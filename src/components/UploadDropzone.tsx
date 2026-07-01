"use client";

import { useRef, useState } from "react";

interface UploadDropzoneProps {
  /** File input `accept` value, e.g. "image/*" or "audio/*". */
  accept: string;
  title: string;
  hint: string;
  icon: React.ReactNode;
  onFile: (file: File) => void;
  /** Called when a dropped file does not match `accept`. */
  onInvalid?: (message: string) => void;
  invalidMessage?: string;
}

export function UploadDropzone({
  accept,
  title,
  hint,
  icon,
  onFile,
  onInvalid,
  invalidMessage = "Tipo de archivo no válido",
}: UploadDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const typePrefix = accept.split("/")[0];

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (!f) return;
    if (f.type.startsWith(typePrefix)) onFile(f);
    else onInvalid?.(invalidMessage);
  }

  return (
    <section
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          inputRef.current?.click();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={title}
      className={`cursor-pointer rounded-xl border-2 border-dashed p-10 text-center transition-colors focus:outline-none focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/40 ${
        dragging
          ? "border-accent bg-accent/5"
          : "border-surface-border hover:border-foreground/30"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
        }}
      />
      <div className="flex flex-col items-center gap-3 text-foreground/50">
        {icon}
        <p className="text-sm">{title}</p>
        <p className="text-xs">{hint}</p>
      </div>
    </section>
  );
}
