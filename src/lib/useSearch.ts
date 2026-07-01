import { useState } from "react";
import type { SearchResponse } from "./schemas";

/**
 * Shared search state used by every modality page (text, image, audio).
 * `run` receives a thunk that performs the actual API call, so each page
 * keeps its own arguments (query/file, k, mode, language) while the
 * loading/error/timing bookkeeping lives here.
 */
export function useSearch() {
  const [results, setResults] = useState<string[]>([]);
  const [timeMs, setTimeMs] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run(searchFn: () => Promise<SearchResponse>) {
    setLoading(true);
    setError(null);
    setTimeMs(null);
    try {
      const data = await searchFn();
      setResults(data.results);
      setTimeMs(data.time_ms);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al buscar");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setResults([]);
    setTimeMs(null);
    setError(null);
  }

  return { results, timeMs, loading, error, run, reset, setError };
}
