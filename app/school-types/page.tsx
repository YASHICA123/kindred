import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { fetchSchoolTypesWithSchoolCount } from "@/lib/supabase-queries"
import Link from "next/link"
import { Zap, ArrowUpRight } from "lucide-react"

interface SchoolTypeWithCount {
  id: string
  name: string
  slug: string
  description: string | null
  schoolCount: number
}

export const metadata = {
  title: "Schools by Type | Kindred School Discovery",
  description: "Explore schools by type — Co-educational, Boys Only, Girls Only, Day School, Boarding and more.",
}

const typeColors: Record<string, string> = {
  "co-educational": "from-blue-500/20 to-blue-600/5",
  "boys-only": "from-indigo-500/20 to-indigo-600/5",
  "girls-only": "from-pink-500/20 to-pink-600/5",
  "day-school": "from-amber-500/20 to-amber-600/5",
  "boarding": "from-emerald-500/20 to-emerald-600/5",
}

export default async function SchoolTypesPage() {
  const types: SchoolTypeWithCount[] = await fetchSchoolTypesWithSchoolCount()

  return (
    <main className="min-h-screen">
      <Header />

      <section className="pt-32 pb-16 bg-gradient-to-b from-secondary/30 to-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-primary">Type-wise Discovery</span>
          </div>
          <h1 className="font-serif text-4xl lg:text-5xl font-medium mb-4">
            Schools by Type
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Explore schools across {types.length} categories — find the right fit for your child
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {types.map((t) => (
              <Link
                key={t.slug}
                href={`/school-types/${t.slug}`}
                className="group block bg-card rounded-3xl overflow-hidden border hover:shadow-xl hover:border-primary/30 transition-all duration-300"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                  <div className={`w-full h-full bg-gradient-to-br ${typeColors[t.slug] || "from-primary/20 to-primary/5"} flex items-center justify-center`}>
                    <span className="text-5xl font-serif font-bold text-primary/30 group-hover:text-primary/50 transition-colors">
                      {t.name}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-serif text-2xl font-semibold group-hover:text-primary transition-colors">
                      {t.name}
                    </h3>
                    <ArrowUpRight className="h-5 w-5 text-primary/60 group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
                  </div>
                  {t.description && (
                    <p className="text-muted-foreground text-sm mb-3">{t.description}</p>
                  )}
                  <p className="text-primary font-medium">
                    {t.schoolCount > 0
                      ? `${t.schoolCount} school${t.schoolCount !== 1 ? "s" : ""}`
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
