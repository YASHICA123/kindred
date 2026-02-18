import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SmartRecommendationQuiz } from "@/components/smart-recommendation-quiz"

export const metadata = {
  title: "AI School Recommender Quiz - Find Your Perfect School | Kindred",
  description: "Answer a few questions and get AI-powered school recommendations based on your child's learning style, budget, and location.",
}

export default function SmartRecommenderPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-primary/2 to-background">
      <Header />

      {/* Hero Section */}
      <section className="py-16 lg:py-24 relative">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <div className="space-y-4 mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary">
              <span>✨</span>
              AI-Powered Recommendations
            </div>
            <h1 className="font-serif text-4xl lg:text-6xl leading-tight">
              Find Your Child's
              <span className="block bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                Perfect School
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Answer a quick quiz and get personalized school recommendations based on learning style, budget, location, and more. Our AI learns from thousands of successful matches.
            </p>
          </div>

          {/* Quiz Container */}
          <div className="bg-white rounded-3xl border border-border/20 shadow-sm p-8 lg:p-12">
            <SmartRecommendationQuiz />
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-primary/5 blur-3xl pointer-events-none -z-10" />
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24 border-t border-border/20 bg-white/50">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl lg:text-4xl mb-4">Why Our Quiz Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We analyze multiple factors to match your child with schools perfectly aligned to their needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🎓",
                title: "Learning Style",
                description: "Montessori, CBSE, IB, Cambridge - we match your child's preferred learning approach",
              },
              {
                icon: "💰",
                title: "Budget Aligned",
                description: "Filter schools within your financial comfort zone without compromising quality",
              },
              {
                icon: "📍",
                title: "Location Based",
                description: "Find schools in your preferred state or city with commute convenience in mind",
              },
              {
                icon: "👥",
                title: "Special Needs Support",
                description: "Identify inclusive schools or special education programs if your child needs them",
              },
              {
                icon: "⭐",
                title: "Verified Ratings",
                description: "All recommendations come with parent reviews and verified school ratings",
              },
              {
                icon: "🔄",
                title: "Smart Matching",
                description: "AI algorithm learns from successful matches to improve recommendations",
              },
            ].map((feature, index) => (
              <div key={index} className="p-6 rounded-2xl bg-white border border-border/50 hover:shadow-md transition-all">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
