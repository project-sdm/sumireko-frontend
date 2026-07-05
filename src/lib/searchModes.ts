export type SearchMode = "native" | "pg-brute" | "pg-ivf" | "pg-hnsw";

export const SEARCH_MODES: { value: SearchMode; label: string }[] = [
  { value: "native", label: "Nativo" },
  { value: "pg-brute", label: "Postgres (Fuerza Bruta)" },
  { value: "pg-ivf", label: "Postgres (IVFFlat)" },
  { value: "pg-hnsw", label: "Postgres (HNSW)" },
];

export type TextSearchMode = "native" | "pg-brute" | "pg-gin" | "pg-gist";

export const TEXT_SEARCH_MODES: { value: TextSearchMode; label: string }[] = [
  { value: "native", label: "Nativo" },
  { value: "pg-brute", label: "Postgres (Fuerza Bruta)" },
  { value: "pg-gin", label: "Postgres (GIN)" },
  { value: "pg-gist", label: "Postgres (GiST)" },
];
