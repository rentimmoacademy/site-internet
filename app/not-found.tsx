import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-ink">
      <div className="dot-grid pointer-events-none absolute inset-0 opacity-50" />
      <div className="container-x relative text-center">
        <p className="text-9xl font-extrabold tracking-[-0.04em] text-brand-green">404</p>
        <h1 className="mt-6 text-h2 font-extrabold tracking-tight text-white">Page introuvable</h1>
        <p className="mx-auto mt-5 max-w-md text-white/65">
          Cette page n'existe pas ou a été déplacée. Retourne à l'accueil pour découvrir nos formations.
        </p>
        <Link href="/" className="btn-primary mt-10">
          Retour à l'accueil <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}
