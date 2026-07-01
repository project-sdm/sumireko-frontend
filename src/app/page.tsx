import Link from "next/link";

const apps = [
  {
    href: "/ecommerce",
    title: "Búsqueda Visual",
    description:
      "Sube una imagen de prenda y encuentra los productos más similares del catálogo.",
    icon: (
      <svg
        className="h-8 w-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
  },
  {
    href: "/music",
    title: "Búsqueda Musical",
    description:
      "Sube un archivo de audio y encuentra las canciones más similares por características acústicas MFCC.",
    icon: (
      <svg
        className="h-8 w-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z"
        />
      </svg>
    ),
  },
  {
    href: "/text",
    title: "Búsqueda de Texto",
    description:
      "Escribe una consulta y encuentra los documentos más relevantes usando el índice invertido TF-IDF.",
    icon: (
      <svg
        className="h-8 w-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M21 21l-5.2-5.2m0 0A7.5 7.5 0 105.2 5.2a7.5 7.5 0 0010.6 10.6z"
        />
      </svg>
    ),
  },
];

export default function Home() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-24 flex flex-col items-center gap-16">
      <div className="text-center flex flex-col gap-3">
        <h1 className="text-5xl font-semibold tracking-tight">Sumireko</h1>
        <p className="text-foreground/60">
          Sistema multimodal de recuperación y búsqueda
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 w-full">
        {apps.map((app) => (
          <Link
            key={app.href}
            href={app.href}
            className="group flex flex-col gap-4 rounded-xl border border-surface-border bg-surface p-7 hover:border-foreground/20 transition-colors"
          >
            <span className="text-foreground/50 group-hover:text-accent transition-colors">
              {app.icon}
            </span>
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-medium">{app.title}</h2>
              <p className="text-sm text-foreground/60 leading-relaxed">
                {app.description}
              </p>
            </div>
            <span className="text-xs text-foreground/40 group-hover:text-accent transition-colors mt-auto">
              Explorar →
            </span>
          </Link>
        ))}
      </div>

      <Link
        href="/manual"
        className="text-sm text-foreground/50 hover:text-accent transition-colors"
      >
        ¿Primera vez? Lee el manual de usuario →
      </Link>
    </main>
  );
}
