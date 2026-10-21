import PillarLinks from "@/components/sections/PillarLinks";

export default function SuperBnbAcademyMainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <PillarLinks offer="scale" categories={["scale"]} title="Nos guides pour scaler et optimiser ton Airbnb" />
    </>
  );
}
