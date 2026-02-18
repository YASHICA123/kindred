"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"

const testimonials = [
  {
    id: 1,
    quote:
      "Finding the right school felt overwhelming until we discovered Kindred. Their insights helped us understand what really mattered for our daughter's growth.",
    author: "Priya Sharma",
    role: "Parent of a 6-year-old",
    school: "The Heritage School, Gurgaon",
    image: "/indian-mother-professional-portrait-warm-smile.jpg",
  },
  {
    id: 2,
    quote:
      "The comparison tools were invaluable. We could see exactly how each school's approach aligned with our family's values and our son's learning style.",
    author: "Rahul Mehta",
    role: "Parent of a 10-year-old",
    school: "Cambridge International, Mumbai",
    image: "/indian-father-professional-portrait-friendly.jpg",
  },
  {
    id: 3,
    quote:
      "What impressed us most was the depth of information about each school's culture. It's not just about rankings—it's about finding where your child will flourish.",
    author: "Anita Krishnan",
    role: "Parent of two",
    school: "Greenwood Montessori, Bangalore",
    image: "/indian-woman-professional-portrait-confident.jpg",
  },
]

export function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0)

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className="py-16 lg:py-24 bg-white border-b border-border/20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left side - heading */}
          <div className="lg:col-span-4">
            <span className="text-sm font-medium text-primary uppercase tracking-wider">Parent Stories</span>
            <h2 className="font-serif text-3xl lg:text-4xl mt-3 leading-tight">
              Families who found their <span className="text-primary">perfect match</span>
            </h2>
            <div className="flex items-center gap-3 mt-8">
              <button
                onClick={prevTestimonial}
                className="p-3 rounded-full border border-border hover:bg-secondary transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={nextTestimonial}
                className="p-3 rounded-full border border-border hover:bg-secondary transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <span className="ml-4 text-sm text-muted-foreground">
                {activeIndex + 1} / {testimonials.length}
              </span>
            </div>
          </div>

          {/* Right side - testimonial card */}
          <div className="lg:col-span-8">
            <div className="relative bg-card rounded-3xl p-8 lg:p-12 shadow-sm">
              <Quote className="h-12 w-12 text-primary/20 absolute top-8 right-8" />

              <p className="font-serif text-xl lg:text-2xl leading-relaxed mb-8 text-balance">
                {testimonials[activeIndex].quote}
              </p>

              <div className="flex items-center gap-4">
                <img
                  src={testimonials[activeIndex].image || "/placeholder.svg"}
                  alt={testimonials[activeIndex].author}
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium">{testimonials[activeIndex].author}</p>
                  <p className="text-sm text-muted-foreground">{testimonials[activeIndex].role}</p>
                  <p className="text-sm text-primary">{testimonials[activeIndex].school}</p>
                </div>
              </div>

              {/* Progress dots */}
              <div className="flex items-center gap-2 mt-8">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`h-1.5 rounded-full transition-all ${
                      index === activeIndex ? "w-8 bg-primary" : "w-1.5 bg-border"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
