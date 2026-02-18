import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ArrowRight, Briefcase, Users, Sparkles } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Careers at Kindred | Join Our Mission",
  description: "Explore career opportunities and join our team transforming school discovery",
}

const openPositions = [
  {
    title: "Senior Full Stack Engineer",
    department: "Engineering",
    location: "Delhi, India",
    type: "Full-time",
  },
  {
    title: "School Partnerships Manager",
    department: "Business Development",
    location: "Bangalore, India",
    type: "Full-time",
  },
  {
    title: "Content and Curriculum Specialist",
    department: "Content",
    location: "Mumbai, India",
    type: "Full-time",
  },
  {
    title: "Marketing Manager",
    department: "Marketing",
    location: "Delhi, India",
    type: "Full-time",
  },
  {
    title: "Customer Support Lead",
    department: "Support",
    location: "Remote, India",
    type: "Full-time",
  },
  {
    title: "UI/UX Designer",
    department: "Design",
    location: "Bangalore, India",
    type: "Full-time",
  },
]

export default function CareersPage() {
  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-secondary/30 to-background">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <h1 className="font-serif text-5xl lg:text-6xl font-medium mb-6">
            Join Our Mission
          </h1>
          <p className="text-xl text-muted-foreground">
            Help us transform how families discover and choose schools. Work with passionate people who believe every child deserves a school where they truly belong.
          </p>
        </div>
      </section>

      {/* Why Join Section */}
      <section className="py-20 bg-gradient-to-b from-background to-secondary/20">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <h2 className="font-serif text-4xl font-medium text-center mb-16">Why Join Kindred?</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card rounded-2xl p-8 border">
              <Sparkles className="h-8 w-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3">Meaningful Impact</h3>
              <p className="text-muted-foreground">
                Every day, you'll work on a platform that helps 50,000+ families make better decisions for their children
              </p>
            </div>

            <div className="bg-card rounded-2xl p-8 border">
              <Users className="h-8 w-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3">Great Team</h3>
              <p className="text-muted-foreground">
                Work alongside passionate educators, technologists, and entrepreneurs committed to excellence
              </p>
            </div>

            <div className="bg-card rounded-2xl p-8 border">
              <Briefcase className="h-8 w-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3">Growth Opportunities</h3>
              <p className="text-muted-foreground">
                Fast-growing startup with opportunities to lead, learn, and grow your skills and career
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <h2 className="font-serif text-4xl font-medium text-center mb-16">What We Offer</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Competitive Compensation</h3>
                  <p className="text-muted-foreground text-sm">Market-competitive salaries and performance bonuses</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Health Insurance</h3>
                  <p className="text-muted-foreground text-sm">Comprehensive health coverage for you and family</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Flexible Work</h3>
                  <p className="text-muted-foreground text-sm">Remote-friendly policies and flexible schedules</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Professional Development</h3>
                  <p className="text-muted-foreground text-sm">Budget for courses, conferences, and learning</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Paid Leave</h3>
                  <p className="text-muted-foreground text-sm">Generous vacation and sick leave policies</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Equity Options</h3>
                  <p className="text-muted-foreground text-sm">Be part owner of the company's success</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-20 bg-secondary/20">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <h2 className="font-serif text-4xl font-medium text-center mb-16">Open Positions</h2>
          
          <div className="space-y-4">
            {openPositions.map((position, i) => (
              <Link
                key={i}
                href={`/careers/${position.title.toLowerCase().replace(/\s+/g, "-")}`}
                className="block bg-card rounded-2xl p-6 border hover:shadow-lg hover:border-primary/30 transition-all duration-300 group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                      {position.title}
                    </h3>
                    <div className="flex flex-wrap gap-4 mt-3">
                      <span className="text-sm text-muted-foreground">{position.department}</span>
                      <span className="text-sm text-muted-foreground">📍 {position.location}</span>
                      <span className="text-sm text-primary font-medium">{position.type}</span>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-primary/60 group-hover:text-primary group-hover:translate-x-2 transition-all duration-300 flex-shrink-0" />
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">Don't see a position that fits?</p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90"
            >
              Send us your CV
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
