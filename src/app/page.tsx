import Link from "next/link";
import { CameraIcon, MusicNoteIcon } from "@/components/icons";

const apps = [
  {
    href: "/ecommerce",
    title: "Búsqueda E-Commerce",
    description:
      "Sube una imagen de prenda y encuentra los productos más similares del catálogo.",
    icon: <CameraIcon className="h-8 w-8" />,
  },
  {
    href: "/music",
    title: "Búsqueda Musical",
    description: "Busca canciones por su letra o por audio.",
    icon: <MusicNoteIcon className="h-8 w-8" />,
  },
];

export default function Home() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-24 flex flex-col items-center gap-16">
      <div className="text-center flex flex-col items-center gap-4">
        <h1 className="text-5xl sm:text-6xl font-semibold tracking-tight">
          Sumireko
        </h1>
        <p className="text-foreground/60 max-w-md">
          Sistema multimodal de recuperación y búsqueda.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
        {apps.map((app) => (
          <Link
            key={app.href}
            href={app.href}
            className="group flex flex-col gap-4 rounded-xl border border-surface-border bg-surface p-7 shadow-soft hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-lg transition-all duration-200"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-surface-2 text-foreground/50 group-hover:bg-accent/10 group-hover:text-accent transition-colors">
              {app.icon}
            </span>
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-medium">{app.title}</h2>
              <p className="text-sm text-foreground/60 leading-relaxed">
                {app.description}
              </p>
            </div>
            <span className="mt-auto inline-flex items-center gap-1 text-xs text-foreground/40 group-hover:text-accent transition-colors">
              Explorar
              <span className="transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </span>
          </Link>
        ))}
      </div>

      <Link
        href="/manual"
        className="text-lg text-foreground/50 hover:text-accent transition-colors"
      >
        ¿Primera vez? Lee el manual de usuario →
      </Link>
    </main>
  );
}
