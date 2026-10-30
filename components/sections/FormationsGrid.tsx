import SectionHeader from "@/components/SectionHeader";
import FormationCard from "@/components/FormationCard";
import { formations } from "@/lib/formations";

export default function FormationsGrid() {
  return (
    <section id="formations" className="relative overflow-hidden py-28">
      <div className="container-x relative">
        <SectionHeader
          tag="Nos formations"
          title="Choisis ton modèle."
          highlight="Lance-toi."
          subtitle="3 formations complémentaires pour générer tes premiers revenus Airbnb — sans crédit, sans capital, sans attendre."
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
