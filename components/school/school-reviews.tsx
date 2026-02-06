"use client"

import { useState } from "react"
import { Star, ThumbsUp, ChevronDown } from "lucide-react"

const reviews = [
  {
    id: 1,
    author: "Priya Sharma",
    role: "Parent of Grade 5 student",
    date: "2 months ago",
    rating: 5,
    title: "Excellent holistic development",
    content:
      "Our daughter has flourished at Heritage. The teachers are incredibly supportive and the STEAM program has ignited her passion for science. The communication with parents is excellent.",
    helpful: 24,
    image: "/indian-mother-professional-portrait-warm-smile.jpg",
  },
  {
    id: 2,
    author: "Rahul Mehta",
    role: "Parent of Grade 8 student",
    date: "3 months ago",
    rating: 5,
    title: "Strong academics with great sports facilities",
    content:
      "The balance between academics and extracurriculars is perfect. My son is part of the football team and the coaching staff is professional. The IB preparation is thorough.",
    helpful: 18,
    image: "/indian-father-professional-portrait-friendly.jpg",
  },
  {
    id: 3,
    author: "Anita Krishnan",
    role: "Parent of Grade 2 & 6 students",
    date: "4 months ago",
    rating: 4,
    title: "Wonderful early years program",
    content:
      "The early years program is thoughtfully designed. Both my children have had different needs and the teachers have adapted beautifully. Only wish the school was closer to our home!",
    helpful: 12,
    image: "/indian-woman-professional-portrait-confident.jpg",
  },
]

const ratingBreakdown = [
  { stars: 5, percentage: 78 },
  { stars: 4, percentage: 15 },
  { stars: 3, percentage: 5 },
  { stars: 2, percentage: 1 },
  { stars: 1, percentage: 1 },
]

export function SchoolReviews() {
  const [showAllReviews, setShowAllReviews] = useState(false)

  return (
    <section className="py-12 lg:py-16 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Rating overview */}
          <div className="lg:col-span-4">
            <span className="text-sm font-medium text-primary uppercase tracking-wider">Parent Reviews</span>
            <h2 className="font-serif text-2xl lg:text-3xl mt-2 mb-6">What Parents Say</h2>

            <div className="bg-card rounded-2xl p-6 border border-border">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-5xl font-serif">4.9</span>
                <div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-5 w-5 fill-accent text-accent" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Based on 324 reviews</p>
                </div>
              </div>

              {/* Rating bars */}
              <div className="space-y-3">
                {ratingBreakdown.map((item) => (
                  <div key={item.stars} className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground w-4">{item.stars}</span>
                    <Star className="h-4 w-4 fill-accent text-accent" />
                    <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-accent rounded-full" style={{ width: `${item.percentage}%` }} />
                    </div>
                    <span className="text-sm text-muted-foreground w-8">{item.percentage}%</span>
                  </div>
                ))}
              </div>

              <button className="w-full mt-6 py-3 border border-primary text-primary rounded-full font-medium hover:bg-primary hover:text-primary-foreground transition-colors">
                Write a Review
              </button>
            </div>
          </div>

          {/* Reviews list */}
          <div className="lg:col-span-8 space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="bg-card rounded-2xl p-6 border border-border">
                <div className="flex items-start gap-4">
                  <img
                    src={review.image || "/placeholder.svg"}
                    alt={review.author}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">{review.author}</h4>
                        <p className="text-sm text-muted-foreground">{review.role}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                        ))}
                      </div>
                    </div>

                    <h5 className="font-medium mt-4">{review.title}</h5>
                    <p className="text-muted-foreground mt-2 leading-relaxed">{review.content}</p>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                      <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                        <ThumbsUp className="h-4 w-4" />
                        Helpful ({review.helpful})
                      </button>
                      <span className="text-sm text-muted-foreground">{review.date}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={() => setShowAllReviews(!showAllReviews)}
              className="w-full py-4 flex items-center justify-center gap-2 text-primary font-medium hover:bg-primary/5 rounded-xl transition-colors"
            >
              Show all reviews
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
