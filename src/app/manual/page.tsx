import { BackLink } from "@/components/BackLink";

export const metadata = {
  title: "Manual de usuario · Sumireko",
};

export default function Manual() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 flex flex-col gap-10">
      <BackLink />

      <header className="text-center">
        <h1 className="text-3xl font-semibold tracking-tight">
          Manual de usuario
        </h1>
        <p className="mt-2 text-sm text-foreground/60">
          Cómo usar cada modalidad de búsqueda del sistema
        </p>
      </header>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-medium">Búsqueda de texto</h2>
        <p className="text-sm text-foreground/70 leading-relaxed">
          Encuentra los documentos más relevantes para una consulta usando el
          índice invertido TF-IDF.
        </p>
        <ol className="flex flex-col gap-2 text-sm text-foreground/70 list-decimal pl-5">
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

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-medium">Búsqueda visual</h2>
        <p className="text-sm text-foreground/70 leading-relaxed">
          Sube una foto de una prenda y encuentra los productos más parecidos
          del catálogo mediante descriptores SIFT y un diccionario visual.
        </p>
        <ol className="flex flex-col gap-2 text-sm text-foreground/70 list-decimal pl-5">
          <li>
            Arrastra una imagen a la zona de subida, haz clic para elegir un
            archivo, o usa la cámara para tomar una foto.
          </li>
          <li>
            Elige el modo de búsqueda: <span className="font-medium text-foreground">Nativo</span>{" "}
            (tu índice invertido) o Postgres (Fuerza Bruta, IVFFlat o HNSW) para
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
    </main>
  );
}
