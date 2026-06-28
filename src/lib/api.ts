import { ImageQueryResponse } from "./schemas";

export async function searchSimilar(
  file: File,
  k: number = 5,
): Promise<ImageQueryResponse> {
  const url = new URL("/image-search", process.env.NEXT_PUBLIC_API_URL);
  url.searchParams.set("k", String(k));

  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(url.toString(), {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`Search failed: ${res.status} ${res.statusText}`);
  }

  return res.json();
}
