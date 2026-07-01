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
    </main>
  );
}
