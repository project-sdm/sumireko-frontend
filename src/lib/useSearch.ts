import { useRef, useState } from "react";

interface SearchResult {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  results: any[];
  time_ms: number;
}

export function useSearch<T extends SearchResult>() {
  const [results, setResults] = useState<T["results"]>([]);
  const [timeMs, setTimeMs] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestId = useRef(0);

  async function run(searchFn: () => Promise<T>) {
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
