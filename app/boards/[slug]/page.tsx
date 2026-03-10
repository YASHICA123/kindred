import { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { fetchSchoolsByBoardSlug, fetchAllBoards } from "@/lib/supabase-queries"
import Link from "next/link"
import { BookOpen, ArrowUpRight, ChevronRight, MapPin, Star } from "lucide-react"
import { notFound } from "next/navigation"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const boards = await fetchAllBoards()
  return boards.map((board: { slug: string }) => ({
    slug: board.slug,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const boards = await fetchAllBoards()
  const board = boards.find((b: { slug: string }) => b.slug === slug)
  const boardName = board?.name || slug.toUpperCase()

  return {
    title: `${boardName} Schools in India | Kindred School Discovery`,
    description: `Explore the best ${boardName} schools across India. Compare ratings, fees, and locations.`,
  }
}

export default async function BoardDetailPage({ params }: Props) {
  const { slug } = await params
  const boards = await fetchAllBoards()
  const board = boards.find((b: { slug: string }) => b.slug === slug)

  if (!board) {
    notFound()
  }

  const schools = await fetchSchoolsByBoardSlug(slug)

  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-secondary/30 to-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/boards" className="hover:text-primary transition-colors">
              All Boards
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="font-semibold text-foreground">{board.name}</span>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-primary">Board</span>
          </div>
          <h1 className="font-serif text-4xl lg:text-5xl font-medium mb-4">
            {board.name} Schools
          </h1>
          {board.full_name && (
            <p className="text-lg text-muted-foreground mb-2">{board.full_name}</p>
          )}
          <p className="text-xl text-muted-foreground max-w-2xl">
            {schools.length > 0
              ? `${schools.length} school${schools.length !== 1 ? "s" : ""} found`
              : `No schools listed yet for ${board.name}`}
          </p>
          {board.description && (
            <p className="mt-4 text-muted-foreground max-w-3xl">{board.description}</p>
          )}
        </div>
      </section>

      {/* Schools List */}
      {schools.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <h2 className="font-serif text-2xl lg:text-3xl font-medium mb-8">
              Schools
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {schools.map((school: any) => (
                <Link
                  key={school.slug}
                  href={`/schools/${school.slug}`}
                  className="group block bg-card rounded-2xl border overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all duration-300"
                >
                  <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                    {school.cover_image ? (
                      <img
                        src={school.cover_image}
                        alt={school.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                        <BookOpen className="h-12 w-12 text-primary/30" />
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-1">
                        {school.name}
                      </h3>
                      <ArrowUpRight className="h-4 w-4 text-primary/40 group-hover:text-primary flex-shrink-0 ml-2 transition-colors" />
                    </div>

                    <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                      {school.city_name && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {school.city_name}{school.state_name ? `, ${school.state_name}` : ""}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                      {school.rating && (
                        <span className="flex items-center gap-1 text-sm">
                          <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                          {school.rating}
                        </span>
                      )}
                      {school.type && (
                        <span className="text-xs px-2 py-0.5 bg-secondary rounded-full text-muted-foreground">
                          {school.type}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {schools.length === 0 && (
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
            <BookOpen className="h-16 w-16 text-muted-foreground/30 mx-auto mb-6" />
            <h2 className="font-serif text-2xl font-medium mb-3">No Schools Listed Yet</h2>
            <p className="text-muted-foreground mb-8">
              We&apos;re working on adding {board.name} schools. Check back soon!
            </p>
            <Link
              href="/boards"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
            >
              Browse All Boards
            </Link>
          </div>
        </section>
      )}

      <Footer />
    </main>
  )
}
