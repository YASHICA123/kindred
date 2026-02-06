"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"

const stories = [
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

export function StoriesSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const changeStory = (newIndex: number) => {
    if (isAnimating) return
    setIsAnimating(true)
    setTimeout(() => {
      setActiveIndex(newIndex)
      setIsAnimating(false)
    }, 300)
  }

  const nextStory = () => changeStory((activeIndex + 1) % stories.length)
  const prevStory = () => changeStory((activeIndex - 1 + stories.length) % stories.length)

  return (
    <section id="stories" ref={sectionRef} className="py-16 lg:py-20 relative overflow-hidden bg-gradient-to-b from-transparent via-secondary/3 to-transparent">
      {/* Background glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-secondary/8 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          {/* Left - heading and controls */}
          <div
            className={`lg:col-span-4 transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <span className="inline-flex items-center gap-2 text-sm font-medium text-primary tracking-wide mb-4">
              <span className="w-8 h-px bg-primary" />
              Parent stories
            </span>
            <h2 className="font-serif text-3xl lg:text-4xl leading-tight">
              Families who found
              <span className="text-muted-foreground"> their perfect match</span>
            </h2>

            {/* Navigation */}
            <div className="flex items-center gap-4 mt-10">
              <button
                onClick={prevStory}
                disabled={isAnimating}
                className="p-3.5 rounded-full border border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 disabled:opacity-50"
                aria-label="Previous story"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={nextStory}
                disabled={isAnimating}
                className="p-3.5 rounded-full border border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 disabled:opacity-50"
                aria-label="Next story"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <span className="ml-3 text-sm text-muted-foreground tabular-nums">
                {activeIndex + 1} <span className="text-border">/</span> {stories.length}
              </span>
            </div>
          </div>

          {/* Right - testimonial card */}
          <div
            className={`lg:col-span-8 transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: "150ms" }}
          >
            <div className="relative bg-card rounded-3xl p-8 lg:p-12 border border-border/30 shadow-xl shadow-black/5">
              {/* Quote icon */}
              <div className="absolute top-8 right-8 lg:top-10 lg:right-10">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Quote className="w-6 h-6 text-primary" />
                </div>
              </div>

              {/* Quote text with animation */}
              <blockquote
                className={`font-serif text-xl lg:text-2xl xl:text-[1.65rem] leading-relaxed pr-16 transition-all duration-300 ${
                  isAnimating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
                }`}
              >
                "{stories[activeIndex].quote}"
              </blockquote>

              {/* Author info */}
              <div
                className={`flex items-center gap-4 mt-10 transition-all duration-300 ${
                  isAnimating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
                }`}
                style={{ transitionDelay: "50ms" }}
              >
                <img
                  src={stories[activeIndex].image || "/placeholder.svg"}
                  alt={stories[activeIndex].author}
                  className="w-14 h-14 lg:w-16 lg:h-16 rounded-2xl object-cover ring-2 ring-border"
                />
                <div>
                  <p className="font-medium">{stories[activeIndex].author}</p>
                  <p className="text-sm text-muted-foreground">{stories[activeIndex].role}</p>
                  <p className="text-sm text-primary mt-0.5">{stories[activeIndex].school}</p>
                </div>
              </div>

              {/* Progress dots */}
              <div className="flex gap-2 mt-10">
                {stories.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => changeStory(index)}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      index === activeIndex ? "w-10 bg-primary" : "w-1.5 bg-border hover:bg-muted-foreground/30"
                    }`}
                    aria-label={`Go to story ${index + 1}`}
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
