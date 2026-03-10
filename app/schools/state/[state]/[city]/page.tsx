import { Metadata } from "next"
import { Suspense } from "react"
import { SearchSchoolsResults } from "@/components/search-schools-results"
import { fetchAllStates, fetchCitiesByState } from "@/lib/supabase-queries"

interface SearchParams {
  q?: string
  board?: string
  fees?: string
  type?: string
  sort?: string
  page?: string
}

interface Props {
  params: Promise<{ state: string; city: string }>
  searchParams: Promise<SearchParams>
}

// Generate static paths for popular state/city combinations
export async function generateStaticParams() {
  const states = await fetchAllStates()
  const paths = []

  for (const state of states.slice(0, 5)) {
    const cities = await fetchCitiesByState(state.slug)
    for (const city of cities.slice(0, 3)) {
      paths.push({
        state: state.slug,
        city: city.slug,
      })
    }
  }

  return paths
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state: stateSlug, city: citySlug } = await params
  const states = await fetchAllStates()
  const stateData = states.find((s) => s.slug === stateSlug)
  const cities = await fetchCitiesByState(stateSlug)
  const cityData = cities.find((c) => c.slug === citySlug)

  const stateName = stateData?.name || stateSlug.replace(/-/g, " ")
  const cityName = cityData?.name || citySlug.replace(/-/g, " ")

  const title = `Best Schools in ${cityName}, ${stateName} | Kindred`
  const description = `Discover top-rated schools in ${cityName}. Compare ratings, fees, boards, and facilities to find the perfect school for your child.`

  return {
    title,
    description,
  }
}

export default async function CitySchoolsPage({ params, searchParams }: Props) {
  const { state: stateSlug, city: citySlug } = await params
  const search = await searchParams
  const states = await fetchAllStates()
  const stateData = states.find((s) => s.slug === stateSlug)
  const cities = await fetchCitiesByState(stateSlug)
  const cityData = cities.find((c) => c.slug === citySlug)

  const stateName = stateData?.name || stateSlug.replace(/-/g, " ")
  const cityName = cityData?.name || citySlug.replace(/-/g, " ")

  // Pass state and city as filters
  const enhancedParams = {
    ...search,
    state: stateSlug,
    city: citySlug,
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <span>{stateName}</span>
          <span>/</span>
          <span className="font-semibold text-foreground">{cityName}</span>
        </div>

        {/* Page Header */}
        <div className="mb-12">
          <h1 className="font-serif text-4xl lg:text-5xl font-bold mb-3">
            Schools in {cityName}
          </h1>
          <p className="text-lg text-muted-foreground">
            {search.q
              ? `Results for: "${search.q}"`
              : `Find the best schools in ${cityName}, ${stateName}`}
          </p>
        </div>

        {/* Results */}
        <Suspense fallback={<SchoolsResultsSkeleton />}>
          <SearchSchoolsResults searchParams={enhancedParams as any} />
        </Suspense>
      </div>
    </main>
  )
}

function SchoolsResultsSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-40 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
      ))}
    </div>
  )
}
