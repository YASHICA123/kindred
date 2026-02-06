import { Award, BookOpen, Globe, Heart, Shield, Sparkles } from "lucide-react"

const quickFacts = [
  { icon: BookOpen, label: "Curriculum", value: "IB + CBSE" },
  { icon: Globe, label: "Languages", value: "English, Hindi, French" },
  { icon: Shield, label: "Accreditation", value: "IB World School" },
  { icon: Award, label: "Ranking", value: "Top 10 in NCR" },
]

export function SchoolOverview() {
  return (
    <section className="py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Main content */}
          <div className="lg:col-span-8">
            <div className="prose prose-lg max-w-none">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-primary uppercase tracking-wider">Our Story</span>
              </div>
              <h2 className="font-serif text-2xl lg:text-3xl mt-2 mb-6">Where curiosity meets opportunity</h2>
              <p className="text-muted-foreground leading-relaxed">
                The Heritage School was founded in 2002 with a vision to create an educational environment that nurtures
                not just academic excellence, but the holistic development of every child. Our approach combines the
                rigor of international curricula with the warmth and cultural richness of Indian values.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                We believe that every child has unique potential waiting to be discovered. Our educators are trained to
                identify and nurture individual strengths while building a strong foundation in critical thinking,
                creativity, and collaboration—skills essential for success in an ever-changing world.
              </p>
            </div>

            {/* Core values */}
            <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { icon: Heart, title: "Compassion", desc: "Empathy in action" },
                { icon: Globe, title: "Global Mindset", desc: "World-ready citizens" },
                { icon: Sparkles, title: "Innovation", desc: "Creative problem-solving" },
              ].map((value) => (
                <div key={value.title} className="p-5 rounded-xl bg-secondary/50">
                  <value.icon className="h-6 w-6 text-primary mb-3" />
                  <h3 className="font-medium">{value.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{value.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar with quick facts */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              {/* Quick facts card */}
              <div className="bg-card rounded-2xl border border-border p-6">
                <h3 className="font-serif text-lg mb-6">Quick Facts</h3>
                <div className="space-y-4">
                  {quickFacts.map((fact) => (
                    <div key={fact.label} className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <fact.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{fact.label}</p>
                        <p className="font-medium">{fact.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fee card */}
              <div className="bg-primary/5 rounded-2xl p-6">
                <h3 className="font-serif text-lg mb-2">Annual Fee Range</h3>
                <p className="text-3xl font-serif text-primary">₹2.5L - 4L</p>
                <p className="text-sm text-muted-foreground mt-2">Varies by grade level</p>
                <button className="w-full mt-4 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors">
                  Request Fee Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
