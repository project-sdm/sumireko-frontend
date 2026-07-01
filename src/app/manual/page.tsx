import { BackLink } from "@/components/BackLink";
import { PageHeader } from "@/components/PageHeader";

export const metadata = {
  title: "Manual de usuario · Sumireko",
};

export default function Manual() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 flex flex-col gap-10">
      <BackLink />

      <PageHeader
        title="Manual de usuario"
        subtitle="Cómo usar cada modalidad de búsqueda del sistema"
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
          <h2 className="text-lg font-medium">Búsqueda de texto</h2>
        </div>
        <p className="text-sm text-foreground/70 leading-relaxed">
          Encuentra los documentos más relevantes para una consulta usando el
          índice invertido TF-IDF.
        </p>
        <ol className="flex flex-col gap-2 text-sm text-foreground/70 list-decimal pl-5 marker:text-muted">
          <li>
            Escribe tu consulta en el campo de texto (por ejemplo,{" "}
            <span className="font-medium text-foreground">machine learning</span>
            ).
          </li>
          <li>
            Elige el idioma del corpus (Inglés, Español o Multilingüe) para
            tokenizar y eliminar stopwords correctamente.
          </li>
          <li>
            Ajusta el número de resultados (<span className="font-mono">k</span>)
            con el selector.
          </li>
          <li>
            Presiona <span className="font-medium text-foreground">Buscar</span>{" "}
            o Enter. Verás los documentos ordenados por relevancia junto con la
            latencia de la consulta.
          </li>
        </ol>
      </section>

      <section className="flex flex-col gap-4 rounded-xl border border-surface-border bg-surface p-6 shadow-soft">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-sm font-semibold text-accent">
            2
          </span>
          <h2 className="text-lg font-medium">Búsqueda visual</h2>
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
            <span className="font-medium text-foreground">Nativo</span> (tu
            índice invertido) o Postgres (Fuerza Bruta, IVFFlat o HNSW) para
            comparar contra pgvector.
          </li>
          <li>
            Ajusta el número de resultados (<span className="font-mono">k</span>)
            y presiona{" "}
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
            3
          </span>
          <h2 className="text-lg font-medium">Búsqueda musical</h2>
        </div>
        <p className="text-sm text-foreground/70 leading-relaxed">
          Sube un archivo de audio y encuentra las canciones más parecidas por
          sus características acústicas (MFCC) y un diccionario de palabras
          acústicas.
        </p>
        <ol className="flex flex-col gap-2 text-sm text-foreground/70 list-decimal pl-5 marker:text-muted">
          <li>
            Arrastra un audio a la zona de subida, haz clic para elegir un
            archivo, o graba directamente desde tu micrófono.
          </li>
          <li>
            Elige el modo de búsqueda (
            <span className="font-medium text-foreground">Nativo</span> o
            Postgres) y el número de resultados (
            <span className="font-mono">k</span>).
          </li>
          <li>
            Presiona <span className="font-medium text-foreground">Buscar</span>.
            Cada resultado incluye un reproductor para escuchar la canción y la
            latencia de la consulta.
          </li>
        </ol>
      </section>
    </main>
  );
}
