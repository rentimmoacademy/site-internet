import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(45,184,75,0.12),transparent_65%)]" />
      <div className="container-x relative text-center">
        <p className="text-9xl font-extrabold tracking-[-0.04em] text-brand-dark">404</p>
        <h1 className="mt-6 text-h2 font-extrabold tracking-tight text-ink">Page introuvable</h1>
        <p className="mx-auto mt-5 max-w-md text-ink/70">
          Cette page n'existe pas ou a été déplacée. Retourne à l'accueil pour découvrir nos formations.
        </p>
        <Link href="/" className="btn-primary mt-10">
          Retour à l'accueil <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}
