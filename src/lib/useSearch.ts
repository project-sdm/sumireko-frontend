import { useRef, useState } from "react";
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

  // Bumped on every run/reset so a slow response from an earlier search
  // can be ignored instead of overwriting a newer one.
  const requestId = useRef(0);

  async function run(searchFn: () => Promise<SearchResponse>) {
    const id = ++requestId.current;
    setLoading(true);
    setError(null);
    setTimeMs(null);
    try {
      const data = await searchFn();
      if (id !== requestId.current) return;
      setResults(data.results);
      setTimeMs(data.time_ms);
    } catch (err) {
      if (id !== requestId.current) return;
      setError(err instanceof Error ? err.message : "Error al buscar");
    } finally {
      if (id === requestId.current) setLoading(false);
    }
  }

  function reset() {
    requestId.current++;
    setResults([]);
    setTimeMs(null);
    setError(null);
  }

  return { results, timeMs, loading, error, run, reset, setError };
}
