import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { fetchAgeGroupsWithSchoolCount } from "@/lib/supabase-queries"
import Link from "next/link"
import { Users, ArrowUpRight } from "lucide-react"

interface AgeGroupWithCount {
  id: string
  name: string
  slug: string
  age_range: string
  schoolCount: number
}

export const metadata = {
  title: "Schools by Age Group | Kindred School Discovery",
  description: "Find schools for every stage of your child's journey — Preschool, Primary, Secondary, and more.",
}

const ageGroupColors: Record<string, string> = {
  "preschool": "from-pink-400/20 to-rose-500/5",
  "primary": "from-blue-400/20 to-cyan-500/5",
  "secondary": "from-purple-400/20 to-indigo-500/5",
  "senior-secondary": "from-amber-400/20 to-orange-500/5",
  "post-secondary": "from-green-400/20 to-teal-500/5",
}

export default async function AgeGroupsPage() {
  const ageGroups: AgeGroupWithCount[] = await fetchAgeGroupsWithSchoolCount()

  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-secondary/30 to-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-primary">Age-wise Discovery</span>
          </div>
          <h1 className="font-serif text-4xl lg:text-5xl font-medium mb-4">
            Schools by Age Group
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Find the perfect school for every stage of your child&apos;s journey
          </p>
        </div>
      </section>

      {/* Age Groups Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ageGroups.map((group) => (
              <Link
                key={group.slug}
                href={`/age-groups/${group.slug}`}
                className="group block bg-card rounded-3xl overflow-hidden border hover:shadow-xl hover:border-primary/30 transition-all duration-300"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                  <div className={`w-full h-full bg-gradient-to-br ${ageGroupColors[group.slug] || "from-primary/20 to-primary/5"} flex flex-col items-center justify-center gap-2`}>
                    <span className="text-4xl font-serif font-bold text-primary/30 group-hover:text-primary/50 transition-colors">
                      {group.name}
                    </span>
                    <span className="text-sm text-muted-foreground">{group.age_range}</span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-serif text-2xl font-semibold group-hover:text-primary transition-colors">
                        {group.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">{group.age_range}</p>
                    </div>
                    <ArrowUpRight className="h-5 w-5 text-primary/60 group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
                  </div>

                  <p className="text-sm text-muted-foreground">
                    {group.schoolCount > 0
                      ? `${group.schoolCount} school${group.schoolCount !== 1 ? "s" : ""} listed`
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
