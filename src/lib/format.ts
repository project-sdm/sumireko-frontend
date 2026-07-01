export function parseName(path: string): string {
  return (
    path
      .split("/")
      .pop()
      ?.replace(/\.[^.]+$/, "")
      .replace(/[_-]/g, " ") ?? path
  );
}
