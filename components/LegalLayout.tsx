export default function LegalLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <section className="bg-ink pt-40 pb-16">
        <div className="container-x">
          <p className="tag mb-5 text-brand-green">Légal</p>
          <h1 className="text-[clamp(2.5rem,5vw,4rem)] font-extrabold leading-[1] tracking-[-0.03em] text-white">
            {title}
          </h1>
          <p className="mt-5 text-sm text-white/50">Dernière mise à jour : {updated}</p>
        </div>
      </section>
      <section className="bg-cream py-20 text-ink">
        <div className="container-x">
          <div className="prose prose-lg prose-neutral mx-auto max-w-3xl prose-headings:font-extrabold prose-headings:tracking-tight prose-h2:mt-10 prose-h2:text-2xl prose-strong:text-ink prose-a:text-brand-dark prose-a:font-bold prose-ul:my-4 prose-li:my-1">
            {children}
          </div>
        </div>
      </section>
    </>
  );
}
