import { SearchResponse } from "./schemas";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function postFile(
  endpoint: string,
  file: File,
  k: number,
  searchMode?: string,
): Promise<SearchResponse> {
  const url = new URL(endpoint, API_URL);
  url.searchParams.set("k", String(k));
  if (searchMode) url.searchParams.set("mode", searchMode);

  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(url.toString(), { method: "POST", body: formData });

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`${res.status}: ${text}`);
  }

  return SearchResponse.parse(await res.json());
}

export async function searchByText(
  q: string,
  k = 5,
  language = "english",
): Promise<SearchResponse> {
  const url = new URL("/text/search", API_URL);
  url.searchParams.set("q", q);
  url.searchParams.set("k", String(k));
  url.searchParams.set("language", language);

  const res = await fetch(url.toString());

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`${res.status}: ${text}`);
  }

  return SearchResponse.parse(await res.json());
}

export function searchByImage(file: File, k = 5, searchMode?: string) {
  return postFile("/images/search", file, k, searchMode);
}

export function searchByAudio(file: File, k = 5, searchMode?: string) {
  return postFile("/audio/search", file, k, searchMode);
}
