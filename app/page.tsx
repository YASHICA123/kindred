import { Header } from "@/components/header"
import { ImmersiveHero } from "@/components/immersive-hero"
import { FeaturedSchools } from "@/components/featured-schools"
import { TrustSection } from "@/components/trust-section"
import { BrandsExplorer } from "@/components/brands-explorer"
import { StatesExplorer } from "@/components/states-explorer"
import { CitiesExplorer } from "@/components/cities-explorer"
import { AgeExplorer } from "@/components/age-explorer"
import { FeesExplorer } from "@/components/fees-explorer"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden">
      <Header />
      <ImmersiveHero />
      <BrandsExplorer />
      <FeaturedSchools />
      <TrustSection />
      <StatesExplorer />
      <CitiesExplorer />
      <AgeExplorer />
      <FeesExplorer />
      <Footer />
    </main>
  )
}
