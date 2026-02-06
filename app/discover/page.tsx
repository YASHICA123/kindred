import { Suspense } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import DiscoverClient from "@/components/discover/discover-client"
import { DiscoverHero } from "@/components/discover/discover-hero"

export const metadata = {
  title: "Discover Schools | Kindred",
  description: "Explore and discover the perfect school for your child with our curated collection.",
}

export default function DiscoverPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <DiscoverHero />
      <section className="py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Suspense fallback={<div className="py-8">Loading filters...</div>}>
            <DiscoverClient />
          </Suspense>
        </div>
      </section>
      <Footer />
    </main>
  )
}
