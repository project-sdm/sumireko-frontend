export function clampK(raw: string, fallback: number, min = 1, max = 40): number {
  return Math.min(max, Math.max(min, parseInt(raw, 10) || fallback));
}
