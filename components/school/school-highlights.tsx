import { Award, Beaker, Globe, Music, Trophy, Users } from "lucide-react"

const highlights = [
  {
    icon: Beaker,
    title: "STEAM Program",
    description:
      "Integrated Science, Technology, Engineering, Arts, and Mathematics curriculum with dedicated innovation labs.",
    color: "bg-chart-1/10 text-chart-1",
  },
  {
    icon: Globe,
    title: "Global Exchange",
    description: "Partnership with 15+ international schools for student exchange programs and collaborative projects.",
    color: "bg-chart-2/10 text-chart-2",
  },
  {
    icon: Trophy,
    title: "Sports Academy",
    description: "Professional coaching in 12+ sports with state-level facilities and competitive teams.",
    color: "bg-chart-3/10 text-chart-3",
  },
  {
    icon: Music,
    title: "Performing Arts",
    description: "Dedicated music, dance, and theater programs with annual productions and recitals.",
    color: "bg-chart-4/10 text-chart-4",
  },
  {
    icon: Users,
    title: "Small Class Sizes",
    description: "Average 18 students per class ensuring personalized attention and better learning outcomes.",
    color: "bg-chart-5/10 text-chart-5",
  },
  {
    icon: Award,
    title: "100% College Placement",
    description: "Dedicated college counseling team with placements in top universities worldwide.",
    color: "bg-primary/10 text-primary",
  },
]

export function SchoolHighlights() {
  return (
    <section className="py-12 lg:py-16 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-10 lg:mb-14">
          <span className="text-sm font-medium text-primary uppercase tracking-wider">What Makes Us Different</span>
          <h2 className="font-serif text-2xl lg:text-3xl xl:text-4xl mt-2">Highlights & Programs</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {highlights.map((highlight) => (
            <div
              key={highlight.title}
              className="group p-6 bg-card rounded-2xl border border-border hover:border-primary/30 hover:shadow-md transition-all"
            >
              <div className={`w-12 h-12 rounded-xl ${highlight.color} flex items-center justify-center mb-4`}>
                <highlight.icon className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-lg mb-2 group-hover:text-primary transition-colors">{highlight.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{highlight.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
