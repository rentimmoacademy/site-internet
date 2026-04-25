import SectionHeader from "@/components/SectionHeader";
import FormationCard from "@/components/FormationCard";
import { formations } from "@/lib/formations";

export default function FormationsGrid() {
  return (
    <section id="formations" className="relative overflow-hidden bg-ink-soft py-28">
      <div className="dot-grid pointer-events-none absolute inset-0 opacity-60" />
      <div className="container-x relative">
        <SectionHeader
          tag="Nos formations"
          title={
            <>
              Choisis ton modèle.{" "}
              <span className="bg-brand-gradient bg-clip-text text-transparent">Lance-toi.</span>
            </>
          }
          subtitle="3 formations complémentaires pour générer tes premiers revenus Airbnb — sans crédit, sans capital, sans attendre."
          dark
        />

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {formations.map((f, i) => (
            <FormationCard key={f.slug} formation={f} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
