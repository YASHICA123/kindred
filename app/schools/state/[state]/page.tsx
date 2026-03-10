import { Metadata } from "next"
import { Suspense } from "react"
import { SearchSchoolsResults } from "@/components/search-schools-results"
import { fetchAllStates } from "@/lib/supabase-queries"

interface SearchParams {
  q?: string
  board?: string
  fees?: string
  type?: string
  sort?: string
  page?: string
}

interface Props {
  params: Promise<{ state: string }>
  searchParams: Promise<SearchParams>
}

// Generate static paths for popular states
export async function generateStaticParams() {
  const states = await fetchAllStates()
  return states.slice(0, 10).map((state) => ({
    state: state.slug,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state } = await params
  const states = await fetchAllStates()
  const stateData = states.find((s) => s.slug === state)
  const stateName = stateData?.name || state.replace(/-/g, " ")

  const title = `Best Schools in ${stateName} | Kindred`
  const description = `Discover top-rated schools in ${stateName}. Compare ratings, fees, and curricula to find the perfect school for your child.`

  return {
    title,
    description,
  }
}

export default async function StateSchoolsPage({ params, searchParams }: Props) {
  const { state } = await params
  const search = await searchParams
  const states = await fetchAllStates()
  const stateData = states.find((s) => s.slug === state)
  const stateName = stateData?.name || state.replace(/-/g, " ")

  // Pass state as filter
  const enhancedParams = {
    ...search,
    state,
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="font-serif text-4xl lg:text-5xl font-bold mb-3">
            Schools in {stateName}
          </h1>
          <p className="text-lg text-muted-foreground">
            {search.q
              ? `Results for: "${search.q}"`
              : `Explore the best schools across ${stateName}`}
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
