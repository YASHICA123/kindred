import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { fetchStatesWithSchoolCount } from "@/lib/supabase-queries"
import Link from "next/link"
import { MapPin, ArrowUpRight } from "lucide-react"

interface StateWithCount {
  id: string
  name: string
  slug: string
  code: string
  schoolCount: number
}

export const metadata = {
  title: "Schools by State | Kindred School Discovery",
  description: "Explore and discover schools across all Indian states and union territories",
}

const stateImages: Record<string, string> = {
  "Maharashtra": "/mumbai-cityscape-gateway-of-india-sunset.jpg",
  "Gujarat": "/gujarat.webp",
  "Karnataka": "/bangalore-garden-city-tech-park-green-trees.jpg",
  "Telangana": "/hyderabad-charminar-historical-architecture-evenin.jpg",
  "Tamil Nadu": "/tamuil nadu.webp",
  "Delhi": "/delhi.jpg",
  "Uttar Pradesh": "/Uttar pradesh.jpg",
  "Rajasthan": "/OIP.webp",
}

export default async function StatesPage() {
  const states: StateWithCount[] = await fetchStatesWithSchoolCount()

  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-secondary/30 to-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-primary">State-wise Discovery</span>
          </div>
          <h1 className="font-serif text-4xl lg:text-5xl font-medium mb-4">
            Schools Across India
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Explore schools across {states.length} states and union territories
          </p>
        </div>
      </section>

      {/* States Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {states.map((state) => (
              <Link
                key={state.slug}
                href={`/schools/state/${state.slug}`}
                className="group block bg-card rounded-3xl overflow-hidden border hover:shadow-xl hover:border-primary/30 transition-all duration-300"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                  {stateImages[state.name] ? (
                    <img
                      src={stateImages[state.name]}
                      alt={state.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <span className="text-4xl font-serif text-primary/30">{state.code}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-serif text-2xl font-semibold group-hover:text-primary transition-colors">
                      {state.name}
                    </h3>
                    <ArrowUpRight className="h-5 w-5 text-primary/60 group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">
                    {state.schoolCount > 0
                      ? `${state.schoolCount} school${state.schoolCount !== 1 ? "s" : ""} listed`
                      : "Coming soon"}
                  </p>

                  {state.code && (
                    <span className="text-xs px-3 py-1 bg-secondary/50 text-muted-foreground rounded-full group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      {state.code}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
