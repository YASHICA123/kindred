import { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { fetchSchoolsByFeeRangeSlug, fetchAllFeeRanges } from "@/lib/supabase-queries"
import Link from "next/link"
import { IndianRupee, ArrowUpRight, ChevronRight, MapPin, Star } from "lucide-react"
import { notFound } from "next/navigation"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const feeRanges = await fetchAllFeeRanges()
  return feeRanges.map((fr: { slug: string }) => ({
    slug: fr.slug,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const feeRanges = await fetchAllFeeRanges()
  const fr = feeRanges.find((f: { slug: string }) => f.slug === slug)
  const name = fr?.name || slug

  return {
    title: `${name} Schools in India | Kindred School Discovery`,
    description: `Explore schools with annual fees ${name} across India. Compare ratings, curriculum, and locations.`,
  }
}

export default async function FeeRangeDetailPage({ params }: Props) {
  const { slug } = await params
  const feeRanges = await fetchAllFeeRanges()
  const feeRange = feeRanges.find((f: { slug: string }) => f.slug === slug)

  if (!feeRange) {
    notFound()
  }

  const schools = await fetchSchoolsByFeeRangeSlug(slug)

  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-secondary/30 to-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/fees" className="hover:text-primary transition-colors">
              All Fee Ranges
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="font-semibold text-foreground">{feeRange.name}</span>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <IndianRupee className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-primary">Fee Range</span>
          </div>
          <h1 className="font-serif text-4xl lg:text-5xl font-medium mb-4">
            {feeRange.name} Schools
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            {schools.length > 0
              ? `${schools.length} school${schools.length !== 1 ? "s" : ""} found`
              : `No schools listed yet for ${feeRange.name}`}
          </p>
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
                        <IndianRupee className="h-12 w-12 text-primary/30" />
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
                      {school.rating && (
                        <span className="flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          {Number(school.rating).toFixed(1)}
                        </span>
                      )}
                    </div>

                    {school.board_name && (
                      <span className="inline-block px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full mb-2">
                        {school.board_name}
                      </span>
                    )}

                    {(school.fees_min || school.fees_max) && (
                      <p className="text-sm font-medium text-primary mt-2">
                        {school.fees_min && school.fees_max
                          ? `₹${Number(school.fees_min).toLocaleString("en-IN")} - ₹${Number(school.fees_max).toLocaleString("en-IN")}`
                          : school.fees_min
                          ? `From ₹${Number(school.fees_min).toLocaleString("en-IN")}`
                          : `Up to ₹${Number(school.fees_max).toLocaleString("en-IN")}`}
                        /year
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  )
}
