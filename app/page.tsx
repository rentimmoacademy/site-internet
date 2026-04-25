import Hero from "@/components/sections/Hero";
import SocialProof from "@/components/sections/SocialProof";
import FormationsGrid from "@/components/sections/FormationsGrid";
import AutomaticBnbCard from "@/components/AutomaticBnbCard";
import Results from "@/components/sections/Results";
import PropertiesShowcase from "@/components/sections/PropertiesShowcase";
import WhyRentimmo from "@/components/sections/WhyRentimmo";
import MoroccoSpotlight from "@/components/sections/MoroccoSpotlight";
import AboutPreview from "@/components/sections/AboutPreview";
import BlogPreview from "@/components/sections/BlogPreview";
import FinalCTA from "@/components/sections/FinalCTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <SocialProof />
      <FormationsGrid />
      <AutomaticBnbCard />
      <Results />
      <PropertiesShowcase />
      <WhyRentimmo />
      <MoroccoSpotlight />
      <AboutPreview />
      <BlogPreview />
      <FinalCTA />
    </>
  );
}
