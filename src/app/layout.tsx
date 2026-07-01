import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sumireko",
  description:
    "Sistema multimodal de recuperación por similitud: texto, imágenes y audio.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme')||(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.classList.add(t);}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <header className="border-b border-surface-border">
          <nav className="mx-auto max-w-5xl px-4 h-14 flex items-center justify-between">
            <Link
              href="/"
              className="text-sm font-semibold tracking-tight hover:opacity-70 transition-opacity"
            >
              Sumireko
            </Link>
            <div className="flex items-center gap-6">
              <div className="flex gap-6 text-sm text-foreground/60">
                <Link
                  href="/text"
                  className="hover:text-foreground transition-colors"
                >
                  Texto
                </Link>
                <Link
                  href="/ecommerce"
                  className="hover:text-foreground transition-colors"
                >
                  E-Commerce
                </Link>
                <Link
                  href="/music"
                  className="hover:text-foreground transition-colors"
                >
                  Música
                </Link>
              </div>
              <ThemeToggle />
            </div>
          </nav>
        </header>
        <div className="flex-1">{children}</div>
        <footer className="border-t border-surface-border">
          <div className="mx-auto max-w-5xl px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted">
            <span>Sumireko · Base de Datos 2 · UTEC 2026-1</span>
            <a
              href="https://github.com/project-sdm/sumireko-frontend"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              GitHub ↗
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
}
