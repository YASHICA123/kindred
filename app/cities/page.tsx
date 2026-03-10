import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { fetchStatesWithSchoolCount, fetchCitiesWithSchoolCount } from "@/lib/supabase-queries"
import Link from "next/link"
import { MapPin, ArrowUpRight } from "lucide-react"

const cityImages: Record<string, string> = {
  "Mumbai": "/mumbai-cityscape-gateway-of-india-sunset.jpg",
  "New Delhi": "/delhi.jpg",
  "Delhi": "/delhi.jpg",
  "Bengaluru": "/bangalore-garden-city-tech-park-green-trees.jpg",
  "Hyderabad": "/hyderabad-charminar-historical-architecture-evenin.jpg",
  "Chennai": "/chennai-marina-beach-temple-architecture.jpg",
  "Pune": "/pune.webp",
  "Kolkata": "/placeholder.jpg",
  "Ahmedabad": "/OIP.webp",
  "Jaipur": "/OIP.webp",
  "Lucknow": "/lucknow.jpg",
  "Noida": "/noida.jpg",
}

export const metadata = {
  title: "Schools by City | Kindred School Discovery",
  description: "Explore and discover schools across India's major cities",
}

export default async function CitiesPage() {
  // Fetch states and collect all cities with school counts
  const states = await fetchStatesWithSchoolCount()
  const topStates = states
    .filter((s) => s.schoolCount > 0)
    .sort((a, b) => b.schoolCount - a.schoolCount)
    .slice(0, 10)

  const allCities: { name: string; slug: string; count: number; stateName: string; stateSlug: string }[] = []

  for (const state of topStates) {
    const { cities } = await fetchCitiesWithSchoolCount(state.slug)
    for (const city of cities) {
      if (city.schoolCount > 0) {
        allCities.push({
          name: city.name,
          slug: city.slug,
          count: city.schoolCount,
          stateName: state.name,
          stateSlug: state.slug,
        })
      }
    }
  }

  allCities.sort((a, b) => b.count - a.count)
  return (
    <main className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-secondary/30 to-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-primary">City-wise Discovery</span>
          </div>
          <h1 className="font-serif text-4xl lg:text-5xl font-medium mb-4">
            Schools Across India
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Discover schools in your city with detailed information about curriculum, fees, and facilities
          </p>
        </div>
      </section>

      {/* Cities Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allCities.map((city) => (
              <Link
                key={city.slug}
                href={`/cities/${city.slug}`}
                className="group block bg-card rounded-3xl overflow-hidden border hover:shadow-xl hover:border-primary/30 transition-all duration-300"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                  {cityImages[city.name] ? (
                    <img
                      src={cityImages[city.name]}
                      alt={city.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <MapPin className="h-8 w-8 text-primary/30" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-serif text-2xl font-semibold group-hover:text-primary transition-colors">
                      {city.name}
                    </h3>
                    <ArrowUpRight className="h-5 w-5 text-primary/60 group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2">
                    {city.count} school{city.count !== 1 ? "s" : ""} &middot; {city.stateName}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {["CBSE", "ICSE", "IB"].map((board) => (
                      <span
                        key={board}
                        className="text-xs px-3 py-1 bg-secondary/50 text-muted-foreground rounded-full group-hover:bg-primary/10 group-hover:text-primary transition-colors"
                      >
                        {board}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose by City Section */}
      <section className="py-16 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl lg:text-4xl font-medium mb-4">
              Why explore by city?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Find schools that match your location, cultural values, and educational philosophy
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card rounded-2xl p-8 border">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Local Expertise</h3>
              <p className="text-muted-foreground">
                Detailed information about schools specific to your region with local insights
              </p>
            </div>

            <div className="bg-card rounded-2xl p-8 border">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Comparison</h3>
              <p className="text-muted-foreground">
                Compare multiple schools in your area by fees, curriculum, and facilities
              </p>
            </div>

            <div className="bg-card rounded-2xl p-8 border">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Recommendations</h3>
              <p className="text-muted-foreground">
                Get personalized school suggestions based on your preferences and budget
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
