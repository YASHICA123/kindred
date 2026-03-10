import { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { fetchCitiesWithSchoolCount, fetchAllStates } from "@/lib/supabase-queries"
import Link from "next/link"
import { MapPin, ArrowUpRight, ChevronRight } from "lucide-react"
import { notFound } from "next/navigation"

interface CityWithCount {
  id: string
  name: string
  slug: string
  schoolCount: number
}

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const states = await fetchAllStates()
  return states.slice(0, 10).map((state: { slug: string }) => ({
    slug: state.slug,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const { state } = await fetchCitiesWithSchoolCount(slug)
  const stateName = state?.name || slug.replace(/-/g, " ")

  return {
    title: `Schools in ${stateName} | Kindred School Discovery`,
    description: `Explore cities and schools in ${stateName}. Find the best schools by city, board, and curriculum.`,
  }
}

export default async function StateDetailPage({ params }: Props) {
  const { slug } = await params
  const { state, cities }: { state: any; cities: CityWithCount[] } = await fetchCitiesWithSchoolCount(slug)

  if (!state) {
    notFound()
  }

  const citiesWithSchools = cities.filter((c: CityWithCount) => c.schoolCount > 0)
  const totalSchools = cities.reduce((sum: number, c: CityWithCount) => sum + c.schoolCount, 0)

  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-secondary/30 to-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/states" className="hover:text-primary transition-colors">
              All States
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="font-semibold text-foreground">{state.name}</span>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <MapPin className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-primary">{state.code}</span>
          </div>
          <h1 className="font-serif text-4xl lg:text-5xl font-medium mb-4">
            Schools in {state.name}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            {totalSchools > 0
              ? `${totalSchools} school${totalSchools !== 1 ? "s" : ""} across ${citiesWithSchools.length} cit${citiesWithSchools.length !== 1 ? "ies" : "y"}`
              : `Explore cities in ${state.name}`}
          </p>

          <Link
            href={`/schools/state/${slug}`}
            className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
          >
            View All Schools
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Cities with schools */}
      {citiesWithSchools.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <h2 className="font-serif text-2xl lg:text-3xl font-medium mb-8">
              Cities with Schools
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {citiesWithSchools.map((city) => (
                <Link
                  key={city.slug}
                  href={`/schools/state/${slug}/${city.slug}`}
                  className="group flex items-center justify-between p-6 bg-card rounded-2xl border hover:shadow-lg hover:border-primary/30 transition-all duration-300"
                >
                  <div>
                    <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                      {city.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {city.schoolCount} school{city.schoolCount !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-primary/40 group-hover:text-primary transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All cities in the state */}
      <section className="py-16 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="font-serif text-2xl lg:text-3xl font-medium mb-8">
            All Cities in {state.name}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {cities.map((city) => (
              <Link
                key={city.slug}
                href={`/schools/state/${slug}/${city.slug}`}
                className="group px-4 py-3 bg-card rounded-xl border text-sm hover:border-primary/30 hover:text-primary transition-all"
              >
                <span className="font-medium">{city.name}</span>
                {city.schoolCount > 0 && (
                  <span className="ml-2 text-xs text-muted-foreground">
                    ({city.schoolCount})
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
