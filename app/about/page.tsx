import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Heart, Users, Sparkles, ArrowRight } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "About Us | Kindred School Discovery",
  description: "Learn about Kindred's mission to help families find schools where their children truly belong.",
}

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-secondary/30 to-background">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <h1 className="font-serif text-5xl lg:text-6xl font-medium mb-6">
            About Kindred
          </h1>
          <p className="text-xl text-muted-foreground">
            We believe every child deserves to be in a place where they truly belong. Since 2023, Kindred has been on a mission to transform how families discover and choose schools.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gradient-to-b from-background to-secondary/20">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-serif text-4xl font-medium mb-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground mb-4">
                School selection is one of the most important decisions parents make. Yet, it's often overwhelming, filled with incomplete information and emotional uncertainty.
              </p>
              <p className="text-lg text-muted-foreground mb-4">
                We've built Kindred to be an emotionally intelligent guide that understands your values, preferences, and dreams for your child. We combine data, expert insights, and personalized matching to help you discover schools where your child will truly flourish.
              </p>
              <p className="text-lg text-muted-foreground">
                Our vision is a world where every child finds a school environment that nurtures their unique potential.
              </p>
            </div>
            
            <div className="grid gap-6">
              <div className="bg-card rounded-2xl p-8 border">
                <Heart className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Child-Centric</h3>
                <p className="text-muted-foreground">Every recommendation is made with your child's wellbeing and growth at heart</p>
              </div>
              <div className="bg-card rounded-2xl p-8 border">
                <Users className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Transparent</h3>
                <p className="text-muted-foreground">We provide honest, unbiased information to empower your decisions</p>
              </div>
              <div className="bg-card rounded-2xl p-8 border">
                <Sparkles className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Holistic</h3>
                <p className="text-muted-foreground">We consider academic excellence, environment, culture, and values</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="font-serif text-5xl font-bold text-primary mb-2">50K+</div>
              <p className="text-muted-foreground">Families Supported</p>
            </div>
            <div>
              <div className="font-serif text-5xl font-bold text-primary mb-2">2000+</div>
              <p className="text-muted-foreground">Schools Listed</p>
            </div>
            <div>
              <div className="font-serif text-5xl font-bold text-primary mb-2">10+</div>
              <p className="text-muted-foreground">Major Cities</p>
            </div>
            <div>
              <div className="font-serif text-5xl font-bold text-primary mb-2">4.9/5</div>
              <p className="text-muted-foreground">User Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-secondary/20">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl font-medium mb-4">Our Team</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Founded by education experts, parents, and technologists dedicated to transforming school discovery
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Priya Sharma", role: "Founder & CEO", bio: "Former educator with 15+ years in school leadership" },
              { name: "Amit Patel", role: "CTO", bio: "Tech entrepreneur focused on education technology" },
              { name: "Dr. Neha Singh", role: "Head of Research", bio: "Education researcher and curriculum expert" },
            ].map((member, i) => (
              <div key={i} className="bg-card rounded-2xl p-8 border text-center">
                <div className="w-24 h-24 bg-primary/10 rounded-full mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                <p className="text-primary text-sm font-medium mb-3">{member.role}</p>
                <p className="text-muted-foreground text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <h2 className="font-serif text-4xl font-medium text-center mb-16">Our Core Values</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-semibold mb-3">Excellence</h3>
                <p className="text-muted-foreground">We strive for the highest standards in every aspect of our platform and service</p>
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-3">Empathy</h3>
                <p className="text-muted-foreground">We understand the hopes, fears, and aspirations of families navigating school selection</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-semibold mb-3">Accessibility</h3>
                <p className="text-muted-foreground">We believe everyone deserves access to quality information about schools</p>
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-3">Innovation</h3>
                <p className="text-muted-foreground">We continuously improve our platform to better serve families</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary/5 border-y">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="font-serif text-4xl font-medium mb-6">Ready to Find Your Perfect School?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Start your journey with Kindred today
          </p>
          <Link
            href="/discover"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors"
          >
            Explore Schools
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
