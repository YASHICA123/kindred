import { Metadata } from "next"
import { Suspense } from "react"
import { SearchSchoolsResults } from "@/components/search-schools-results"

interface SearchParams {
  q?: string
  board?: string
  fees?: string
  type?: string
  sort?: string
  page?: string
}

interface Props {
  searchParams: Promise<SearchParams>
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams
  const query = params.q ? `"${params.q}" - ` : ""
  const board = params.board ? ` ${params.board}` : ""
  const title = `Search Schools${board} | Kindred`
  const description = `Discover and compare top schools in India. ${query}Find the best schools for your child with Kindred's advanced search.`

  return {
    title,
    description,
  }
}

export default async function SchoolsPage({ searchParams }: Props) {
  const params = await searchParams

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="font-serif text-4xl lg:text-5xl font-bold mb-3">
            Discover Schools
          </h1>
          <p className="text-lg text-muted-foreground">
            {params.q
              ? `Results for: "${params.q}"`
              : "Browse and filter schools across India"}
          </p>
        </div>

        {/* Results with Suspense for streaming */}
        <Suspense fallback={<SchoolsResultsSkeleton />}>
          <SearchSchoolsResults searchParams={params} />
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
