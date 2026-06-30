interface KSelectorProps {
  value: number;
  rawValue: string;
  onValueChange: (v: number) => void;
  onRawChange: (raw: string) => void;
  min?: number;
  max?: number;
}

export function KSelector({
  value,
  rawValue,
  onValueChange,
  onRawChange,
  min = 1,
  max = 40,
}: KSelectorProps) {
  function commit(raw: string) {
    const v = parseInt(raw, 10);
    const clamped = isNaN(v) ? value : Math.min(max, Math.max(min, v));
    onValueChange(clamped);
    onRawChange(String(clamped));
  }

  function step(delta: number) {
    const n = Math.min(max, Math.max(min, value + delta));
    onValueChange(n);
    onRawChange(String(n));
  }

  return (
    <div className="flex items-center gap-2 rounded-lg bg-surface border border-surface-border px-3 py-2">
      <label className="text-sm text-foreground/60">Resultados</label>
      <button
        onClick={() => step(-1)}
        className="flex h-7 w-7 items-center justify-center rounded-md bg-foreground/5 text-sm font-medium hover:bg-foreground/10 transition-colors"
      >
        −
      </button>
      <input
        type="number"
        min={min}
        max={max}
        value={rawValue}
        onChange={(e) => onRawChange(e.target.value)}
        onBlur={() => commit(rawValue)}
        className="w-10 text-center text-sm font-medium tabular-nums bg-transparent outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <button
        onClick={() => step(1)}
        className="flex h-7 w-7 items-center justify-center rounded-md bg-foreground/5 text-sm font-medium hover:bg-foreground/10 transition-colors"
      >
        +
      </button>
    </div>
  );
}
