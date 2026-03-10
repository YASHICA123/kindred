import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { fetchFeeRangesWithSchoolCount } from "@/lib/supabase-queries"
import Link from "next/link"
import { IndianRupee, ArrowUpRight } from "lucide-react"

interface FeeRangeWithCount {
  id: string
  name: string
  slug: string
  min_fee: number | null
  max_fee: number | null
  schoolCount: number
}

export const metadata = {
  title: "Schools by Fee Range | Kindred School Discovery",
  description: "Explore schools by annual fee range — find the perfect school within your budget across India.",
}

const feeColors: Record<string, string> = {
  "under-50k": "from-green-500/20 to-emerald-600/5",
  "50k-1lakh": "from-blue-500/20 to-sky-600/5",
  "1-2lakh": "from-purple-500/20 to-violet-600/5",
  "2-5lakh": "from-amber-500/20 to-yellow-600/5",
  "above-5lakh": "from-rose-500/20 to-pink-600/5",
}

export default async function FeeRangesPage() {
  const feeRanges: FeeRangeWithCount[] = await fetchFeeRangesWithSchoolCount()

  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-secondary/30 to-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-4">
            <IndianRupee className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-primary">Fee-wise Discovery</span>
          </div>
          <h1 className="font-serif text-4xl lg:text-5xl font-medium mb-4">
            Schools by Fee Range
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Find the perfect school within your budget across {feeRanges.length} fee categories
          </p>
        </div>
      </section>

      {/* Fee Ranges Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {feeRanges.map((fr) => (
              <Link
                key={fr.slug}
                href={`/fees/${fr.slug}`}
                className="group block bg-card rounded-3xl overflow-hidden border hover:shadow-xl hover:border-primary/30 transition-all duration-300"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                  <div className={`w-full h-full bg-gradient-to-br ${feeColors[fr.slug] || "from-primary/20 to-primary/5"} flex items-center justify-center`}>
                    <IndianRupee className="h-16 w-16 text-primary/30 group-hover:text-primary/50 transition-colors" />
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-serif text-2xl font-semibold group-hover:text-primary transition-colors">
                      {fr.name}
                    </h3>
                    <ArrowUpRight className="h-5 w-5 text-primary/60 group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
                  </div>
                  <p className="text-muted-foreground">
                    {fr.schoolCount > 0
                      ? `${fr.schoolCount} school${fr.schoolCount !== 1 ? "s" : ""}`
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
