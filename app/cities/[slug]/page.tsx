import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { fetchSchools } from "@/lib/strapi"
import Link from "next/link"
import { MapPin, ArrowUpRight } from "lucide-react"

const cities = [
  { name: "Delhi NCR", slug: "delhi-ncr", description: "Explore premium schools in Delhi NCR with CBSE, ICSE, and IB boards" },
  { name: "Mumbai", slug: "mumbai", description: "Discover schools in Mumbai offering diverse educational philosophies" },
  { name: "Bangalore", slug: "bangalore", description: "Find innovative schools in Bangalore's tech-forward education ecosystem" },
  { name: "Hyderabad", slug: "hyderabad", description: "Explore quality schools in Hyderabad combining tradition and modern education" },
  { name: "Chennai", slug: "chennai", description: "Discover heritage schools in Chennai with strong academic focus" },
  { name: "Pune", slug: "pune", description: "Find progressive schools in Pune known for holistic education" },
  { name: "Kolkata", slug: "kolkata", description: "Explore prestigious schools in Kolkata with cultural excellence" },
  { name: "Ahmedabad", slug: "ahmedabad", description: "Discover schools in Ahmedabad blending values and academics" },
  { name: "Jaipur", slug: "jaipur", description: "Find quality schools in Jaipur with traditional values" },
  { name: "Lucknow", slug: "lucknow", description: "Explore schools in Lucknow with emphasis on excellence" },
]

interface PageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: PageProps) {
  const city = cities.find(c => c.slug === params.slug)
  return {
    title: `Schools in ${city?.name} | Kindred School Discovery`,
    description: city?.description,
  }
}

export async function generateStaticParams() {
  return cities.map(city => ({
    slug: city.slug
  }))
}

export default async function CityPage({ params }: PageProps) {
  const { slug } = params
  const city = cities.find(c => c.slug === slug)
  
  if (!city) {
    return <div>City not found</div>
  }

  let schoolsData = []
  try {
    const allSchools = await fetchSchools()
    schoolsData = allSchools.filter((school: any) => 
      school.city && school.city.toLowerCase().includes(city.name.split(' ')[0].toLowerCase())
    )
  } catch (error) {
    console.error(`Error loading schools for ${city.name}:`, error)
  }

  return (
    <main className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-secondary/30 to-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-primary">City Guide</span>
          </div>
          <h1 className="font-serif text-4xl lg:text-5xl font-medium mb-4">
            Schools in {city.name}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            {city.description}
          </p>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-12 border-b">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/discover?city=${city.name}`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/50 border border-border rounded-full text-sm font-medium hover:border-primary transition-colors"
            >
              View All
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link
              href={`/discover?city=${city.name}&board=CBSE`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/50 border border-border rounded-full text-sm font-medium hover:border-primary transition-colors"
            >
              CBSE
            </Link>
            <Link
              href={`/discover?city=${city.name}&board=ICSE`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/50 border border-border rounded-full text-sm font-medium hover:border-primary transition-colors"
            >
              ICSE
            </Link>
            <Link
              href={`/discover?city=${city.name}&board=IB`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/50 border border-border rounded-full text-sm font-medium hover:border-primary transition-colors"
            >
              IB
            </Link>
          </div>
        </div>
      </section>

      {/* Schools Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {schoolsData.length > 0 ? (
            <div>
              <p className="text-muted-foreground mb-8">
                Showing <span className="font-semibold text-foreground">{schoolsData.length}</span> schools
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {schoolsData.slice(0, 12).map((school: any) => (
                  <Link
                    key={school.id}
                    href={`/schools/${school.slug || school.id}`}
                    className="group block bg-card rounded-2xl overflow-hidden border hover:shadow-lg transition-all duration-300"
                  >
                    <div className="aspect-[16/10] overflow-hidden relative bg-muted">
                      {school.image && (
                        <img
                          src={school.image}
                          alt={school.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                        {school.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-2">
                        {school.location}
                      </p>
                      {school.curriculum && (
                        <p className="text-xs text-primary mt-3 font-medium">
                          {school.curriculum}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
              {schoolsData.length > 12 && (
                <div className="text-center mt-12">
                  <Link
                    href={`/discover?city=${city.name}`}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
                  >
                    View All {schoolsData.length} Schools
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg mb-4">
                No schools found in {city.name} yet
              </p>
              <Link
                href="/discover"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90"
              >
                Explore All Schools
              </Link>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
