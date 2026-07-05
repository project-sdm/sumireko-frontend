import {
  ImageSearchResponse,
  AudioSearchResponse,
} from "./schemas";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function safeFetch(url: string, init?: RequestInit): Promise<Response> {
  try {
    return await fetch(url, init);
  } catch {
    throw new Error("No se pudo conectar con el servidor. Revisar conexión");
  }
}

async function postFile<T>(
  endpoint: string,
  file: File,
  k: number,
  searchMode: string | undefined,
  schema: { parse: (data: unknown) => T },
): Promise<T> {
  const url = new URL(endpoint, API_URL);
  url.searchParams.set("k", String(k));
  if (searchMode) url.searchParams.set("mode", searchMode);

  const formData = new FormData();
  formData.append("file", file);

  const res = await safeFetch(url.toString(), {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`${res.status}: ${text}`);
  }

  return schema.parse(await res.json());
}

export async function searchByText(
  q: string,
  k = 5,
  searchMode?: string,
): Promise<AudioSearchResponse> {
  const url = new URL("/text/search", API_URL);
  url.searchParams.set("q", q);
  url.searchParams.set("k", String(k));
  if (searchMode) url.searchParams.set("mode", searchMode);

  const res = await safeFetch(url.toString());

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`${res.status}: ${text}`);
  }

  return AudioSearchResponse.parse(await res.json());
}

export function searchByImage(file: File, k = 5, searchMode?: string) {
  return postFile("/images/search", file, k, searchMode, ImageSearchResponse);
}

export function searchByAudio(file: File, k = 5, searchMode?: string) {
  return postFile("/audio/search", file, k, searchMode, AudioSearchResponse);
}
