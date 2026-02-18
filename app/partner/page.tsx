import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Briefcase, BarChart3, Users, Zap, ArrowRight, CheckCircle } from "lucide-react"
import Link from "next/link"

const benefits = [
  {
    icon: Users,
    title: "Reach More Families",
    description: "Get discovered by thousands of parents actively searching for schools",
  },
  {
    icon: BarChart3,
    title: "Track Performance",
    description: "Monitor your school profile visibility and enquiry analytics",
  },
  {
    icon: Zap,
    title: "Instant Updates",
    description: "Update your fees, facilities, and admission information in real-time",
  },
  {
    icon: Briefcase,
    title: "Lead Management",
    description: "Manage and track all incoming enquiries from one dashboard",
  },
]

const features = [
  "Complete school profile management",
  "Photo and video gallery hosting",
  "Admission timeline management",
  "Curriculum details showcase",
  "Fees structure transparency",
  "Facilities & infrastructure listing",
  "Student testimonials section",
  "Real-time analytics dashboard",
  "Lead tracking system",
  "Parent communication tools",
]

export const metadata = {
  title: "For Schools | Kindred Partner Program",
  description: "Partner with Kindred to reach more families and manage admissions efficiently",
}

export default function PartnerPage() {
  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-primary/10 via-secondary/30 to-background">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <Briefcase className="h-8 w-8 text-primary" />
            <span className="text-sm font-medium text-primary">For Schools</span>
          </div>
          <h1 className="font-serif text-5xl lg:text-6xl font-medium mb-6">
            Partner with Kindred
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Reach more families, streamline your admissions process, and grow your school with our comprehensive partnership program
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="#contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors"
            >
              Get Started
              <ArrowRight className="h-5 w-5" />
            </Link>
            <a
              href="#features"
              className="inline-flex items-center gap-2 px-8 py-4 bg-secondary border border-border rounded-xl font-semibold hover:bg-secondary/80 transition-colors"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Why Partner Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <h2 className="font-serif text-4xl font-medium text-center mb-16">Why Partner with Kindred?</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, i) => (
              <div key={i} className="bg-card rounded-2xl p-8 border hover:shadow-lg transition-all">
                <benefit.icon className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Numbers Section */}
      <section className="py-20 bg-primary/5 border-y">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="font-serif text-5xl font-bold text-primary mb-2">50K+</div>
              <p className="text-muted-foreground">Active Families</p>
            </div>
            <div>
              <div className="font-serif text-5xl font-bold text-primary mb-2">2000+</div>
              <p className="text-muted-foreground">Schools Listed</p>
            </div>
            <div>
              <div className="font-serif text-5xl font-bold text-primary mb-2">95%</div>
              <p className="text-muted-foreground">Partner Satisfaction</p>
            </div>
            <div>
              <div className="font-serif text-5xl font-bold text-primary mb-2">10+</div>
              <p className="text-muted-foreground">Major Cities</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-serif text-4xl font-medium mb-8">Comprehensive School Management Dashboard</h2>
              <p className="text-muted-foreground mb-8 text-lg">
                Everything you need to manage your school's presence and admissions in one place
              </p>
              <ul className="space-y-3">
                {features.slice(0, 5).map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                    <span className="font-medium">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="space-y-3">
              {features.slice(5).map((feature, i) => (
                <div key={i} className="flex items-start gap-3 bg-secondary/30 rounded-xl p-4">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  <span className="font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-secondary/20">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <h2 className="font-serif text-4xl font-medium text-center mb-16">Flexible Pricing Plans</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Starter",
                price: "Free",
                description: "Perfect for new schools",
                features: ["Basic profile", "Photo gallery", "Enquiry form", "Up to 100 monthly enquiries"],
              },
              {
                name: "Professional",
                price: "₹4,999",
                period: "/ month",
                description: "Most popular for growing schools",
                features: ["Full profile management", "Advanced analytics", "Lead tracking", "Unlimited enquiries", "Custom branding", "Priority support"],
                highlighted: true,
              },
              {
                name: "Enterprise",
                price: "Custom",
                description: "For large school networks",
                features: ["Everything in Professional", "Multiple school profiles", "API access", "Dedicated account manager", "Custom integrations"],
              },
            ].map((plan, i) => (
              <div
                key={i}
                className={`rounded-2xl p-8 border ${
                  plan.highlighted
                    ? "bg-primary/5 border-primary/30 ring-2 ring-primary/20 transform lg:scale-105"
                    : "bg-card border-border"
                }`}
              >
                <h3 className="text-2xl font-semibold mb-2">{plan.name}</h3>
                <p className="text-muted-foreground text-sm mb-4">{plan.description}</p>
                <div className="mb-6">
                  <span className="font-serif text-4xl font-bold">{plan.price}</span>
                  {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                    plan.highlighted
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-secondary hover:bg-secondary/80"
                  }`}
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <h2 className="font-serif text-4xl font-medium text-center mb-16">How It Works</h2>
          
          <div className="space-y-8">
            {[
              {
                step: "1",
                title: "Sign Up",
                description: "Create your account and provide basic school information",
              },
              {
                step: "2",
                title: "Complete Your Profile",
                description: "Add photos, curriculum details, facilities, and admission requirements",
              },
              {
                step: "3",
                title: "Go Live",
                description: "Your school appears in searches and parents start discovering you",
              },
              {
                step: "4",
                title: "Manage Enquiries",
                description: "Track and manage all enquiries through our dashboard",
              },
            ].map((item, i) => (
              <div key={i} className="flex gap-6 items-start">
                <div className="w-12 h-12 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center flex-shrink-0">
                  <span className="font-serif text-2xl font-bold text-primary">{item.step}</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-20 bg-gradient-to-r from-primary/10 to-primary/5 border-y rounded-3xl mx-4 md:mx-8">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="font-serif text-4xl font-medium mb-6">Ready to Grow Your School?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join 2000+ schools already partnering with Kindred to reach more families
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors"
            >
              Contact Our Team
              <ArrowRight className="h-5 w-5" />
            </Link>
            <a
              href="mailto:partners@kindred.school"
              className="inline-flex items-center gap-2 px-8 py-4 bg-secondary border border-border rounded-xl font-semibold hover:bg-secondary/80 transition-colors"
            >
              Email Us
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
