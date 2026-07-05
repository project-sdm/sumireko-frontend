import { BackLink } from "@/components/BackLink";
import { PageHeader } from "@/components/PageHeader";

export default function Manual() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 flex flex-col gap-10">
      <BackLink />

      <PageHeader
        title="Manual de usuario"
        subtitle=""
        icon={
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        }
      />

      <section className="flex flex-col gap-4 rounded-xl border border-surface-border bg-surface p-6 shadow-soft">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-sm font-semibold text-accent">
            1
          </span>
          <h2 className="text-lg font-medium">Búsqueda E-Commerce</h2>
        </div>
        <p className="text-sm text-foreground/70 leading-relaxed">
          Sube una foto de una prenda y encuentra los productos más parecidos
          del catálogo mediante descriptores SIFT y un diccionario visual.
        </p>
        <ol className="flex flex-col gap-2 text-sm text-foreground/70 list-decimal pl-5 marker:text-muted">
          <li>
            Arrastra una imagen a la zona de subida, haz clic para elegir un
            archivo, o usa la cámara para tomar una foto.
          </li>
          <li>
            Elige el modo de búsqueda:{" "}
            <span className="font-medium text-foreground">Nativo</span> (índice
            invertido propio) o Postgres (fuerza bruta, IVFFlat o HNSW).
          </li>
          <li>
            Ajusta el número de resultados (<span className="font-mono">k</span>
            ) y presiona{" "}
            <span className="font-medium text-foreground">Buscar</span>.
          </li>
          <li>
            Verás una cuadrícula con los productos más similares y la latencia
            de la consulta.
          </li>
        </ol>
      </section>

      <section className="flex flex-col gap-4 rounded-xl border border-surface-border bg-surface p-6 shadow-soft">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-sm font-semibold text-accent">
            2
          </span>
          <h2 className="text-lg font-medium">Búsqueda musical</h2>
        </div>
        <p className="text-sm text-foreground/70 leading-relaxed">
          Busca canciones por su letra (búsqueda textual TF-IDF) o por
          características acústicas MFCC (subiendo un archivo de audio o
          grabando desde el micrófono).
        </p>
        <ol className="flex flex-col gap-2 text-sm text-foreground/70 list-decimal pl-5 marker:text-muted">
          <li>
            Elige el modo de entrada:{" "}
            <span className="font-medium text-foreground">Por letra</span>{" "}
            (escribe parte de la letra de una canción) o{" "}
            <span className="font-medium text-foreground">Por audio</span> (sube
            un archivo o graba desde el micrófono).
          </li>
          <li>
            <span className="font-medium text-foreground">Modo texto:</span>{" "}
            escribe la consulta y presiona{" "}
            <span className="font-medium text-foreground">Buscar</span> o Enter.
            Ajusta el número de resultados (<span className="font-mono">k</span>
            ) con el selector.
          </li>
          <li>
            <span className="font-medium text-foreground">Modo audio:</span>{" "}
            arrastra un archivo de audio, haz clic para elegirlo, o graba
            directamente desde tu micrófono. Elige el modo de búsqueda:{" "}
            <span className="font-medium text-foreground">Nativo</span> (índice
            invertido propio) o Postgres (fuerza bruta, IVFFlat o HNSW) y ajusta{" "}
            <span className="font-mono">k</span>.
          </li>
          <li>
            Presiona <span className="font-medium text-foreground">Buscar</span>
            . Cada resultado incluye nombre de la canción, artista, género,
            álbum, popularidad y un reproductor para escucharla.
          </li>
        </ol>
      </section>
    </main>
  );
}
