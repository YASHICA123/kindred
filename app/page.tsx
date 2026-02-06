import { Header } from "@/components/header"
import { ImmersiveHero } from "@/components/immersive-hero"
import { DiscoveryPills } from "@/components/discovery-pills"
import { FeaturedSchools } from "@/components/featured-schools"
import { TrustSection } from "@/components/trust-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { CitiesExplorer } from "@/components/cities-explorer"
import { AgeExplorer } from "@/components/age-explorer"
import { FeesExplorer } from "@/components/fees-explorer"
import { StoriesSection } from "@/components/stories-section"
import { GuidanceSection } from "@/components/guidance-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden">
      <Header />
      <ImmersiveHero />
      <DiscoveryPills />
      <FeaturedSchools />
      <TestimonialsSection />
      <TrustSection />
      <CitiesExplorer />
      <AgeExplorer />
      <FeesExplorer />
      <StoriesSection />
      <GuidanceSection />
      <Footer />
    </main>
  )
}
