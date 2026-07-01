import { SEARCH_MODES, type SearchMode } from "@/lib/searchModes";

interface SearchModeSelectorProps {
  value: SearchMode;
  onChange: (mode: SearchMode) => void;
}

export function SearchModeSelector({
  value,
  onChange,
}: SearchModeSelectorProps) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-surface border border-surface-border px-3 py-2">
      <label className="text-sm text-foreground/60">Modo</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SearchMode)}
        className="bg-transparent text-sm font-medium outline-none cursor-pointer h-7"
      >
        {SEARCH_MODES.map((m) => (
          <option key={m.value} value={m.value}>
            {m.label}
          </option>
        ))}
      </select>
    </div>
  );
}
