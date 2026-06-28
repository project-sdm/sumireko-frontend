import Link from "next/link";

export default function Home() {
  return (
    <main>
      <nav>
        <Link href="/ecommerce">Búsqueda E-Commerce</Link>
        <Link href="/music">Búsqueda Musical</Link>
      </nav>
    </main>
  );
}
