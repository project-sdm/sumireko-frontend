import Link from "next/link";

export function BackLink({ href = "/" }: { href?: string }) {
  return (
    <Link
      href={href}
      className="text-sm text-foreground/50 hover:text-foreground transition-colors"
    >
      ← Volver al inicio
    </Link>
  );
}
