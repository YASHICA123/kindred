import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { fetchBoardsWithSchoolCount } from "@/lib/supabase-queries"
import Link from "next/link"
import { BookOpen, ArrowUpRight } from "lucide-react"

interface BoardWithCount {
  id: string
  name: string
  slug: string
  full_name: string | null
  schoolCount: number
}

export const metadata = {
  title: "Schools by Board | Kindred School Discovery",
  description: "Explore schools by education board — CBSE, ICSE, IB, IGCSE, Cambridge, and more across India.",
}

const boardColors: Record<string, string> = {
  "cbse": "from-blue-500/20 to-blue-600/5",
  "icse": "from-emerald-500/20 to-emerald-600/5",
  "isc": "from-teal-500/20 to-teal-600/5",
  "ib": "from-violet-500/20 to-violet-600/5",
  "igcse": "from-amber-500/20 to-amber-600/5",
  "state-board": "from-rose-500/20 to-rose-600/5",
  "cambridge": "from-indigo-500/20 to-indigo-600/5",
  "montessori": "from-pink-500/20 to-pink-600/5",
}

export default async function BoardsPage() {
  const boards: BoardWithCount[] = await fetchBoardsWithSchoolCount()

  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-secondary/30 to-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-primary">Board-wise Discovery</span>
          </div>
          <h1 className="font-serif text-4xl lg:text-5xl font-medium mb-4">
            Schools by Board
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Explore schools across {boards.length} education boards and curricula in India
          </p>
        </div>
      </section>

      {/* Boards Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {boards.map((board) => (
              <Link
                key={board.slug}
                href={`/boards/${board.slug}`}
                className="group block bg-card rounded-3xl overflow-hidden border hover:shadow-xl hover:border-primary/30 transition-all duration-300"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                  <div className={`w-full h-full bg-gradient-to-br ${boardColors[board.slug] || "from-primary/20 to-primary/5"} flex items-center justify-center`}>
                    <span className="text-5xl font-serif font-bold text-primary/30 group-hover:text-primary/50 transition-colors">
                      {board.name}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-serif text-2xl font-semibold group-hover:text-primary transition-colors">
                      {board.name}
                    </h3>
                    <ArrowUpRight className="h-5 w-5 text-primary/60 group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
                  </div>

                  {board.full_name && (
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {board.full_name}
                    </p>
                  )}

                  <p className="text-sm text-muted-foreground">
                    {board.schoolCount > 0
                      ? `${board.schoolCount} school${board.schoolCount !== 1 ? "s" : ""} listed`
                      : "Coming soon"}
                  </p>
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
