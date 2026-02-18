"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowRight, GraduationCap, Globe, BookOpen, Award, Sparkles } from "lucide-react"

const philosophies = [
  {
    name: "Montessori",
    count: "240+",
    description: "Child-led, hands-on learning that respects natural development",
    icon: Sparkles,
    gradient: "from-amber-500/20 to-orange-500/10",
  },
  {
    name: "International",
    count: "180+",
    description: "Global curriculum preparing students for a connected world",
    icon: Globe,
    gradient: "from-sky-500/20 to-blue-500/10",
  },
  {
    name: "CBSE",
    count: "520+",
    description: "Comprehensive national curriculum with strong foundations",
    icon: BookOpen,
    gradient: "from-emerald-500/20 to-green-500/10",
  },
  {
    name: "ICSE",
    count: "310+",
    description: "Application-focused education with practical learning",
    icon: GraduationCap,
    gradient: "from-violet-500/20 to-purple-500/10",
  },
  {
    name: "IB World",
    count: "95+",
    description: "Inquiry-based learning developing international mindset",
    icon: Award,
    gradient: "from-rose-500/20 to-pink-500/10",
  },
]

export function DiscoveryPills() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

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

  return (
    <section ref={sectionRef} className="py-16 lg:py-20 bg-white relative overflow-hidden border-b border-border/20">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
        {/* Section header */}
        <div
          className={`max-w-2xl mb-16 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="inline-flex items-center gap-2 text-sm font-medium text-primary tracking-wide mb-4">
            <span className="w-8 h-px bg-primary" />
            Explore by philosophy
          </span>
          <h2 className="font-serif text-3xl lg:text-5xl leading-tight">
            Every approach has its
            <span className="text-muted-foreground"> own kind of magic</span>
          </h2>
        </div>

        {/* Horizontal scroll container for mobile, grid for desktop */}
        <div
          ref={scrollRef}
          className="flex lg:grid lg:grid-cols-5 gap-4 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 -mx-6 px-6 lg:mx-0 lg:px-0 scrollbar-hide"
        >
          {philosophies.map((philosophy, index) => (
            <Link
              key={philosophy.name}
              href={`/discover?type=${philosophy.name.toLowerCase()}`}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
              className={`group relative flex-shrink-0 w-[280px] lg:w-auto transition-all duration-500 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              <div
                className={`relative h-full p-6 rounded-2xl border border-border/50 bg-card overflow-hidden transition-all duration-500 ${
                  activeIndex === index
                    ? "border-primary/40 shadow-xl shadow-primary/10 scale-[1.02]"
                    : "hover:border-border"
                }`}
              >
                {/* Gradient background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${philosophy.gradient} transition-opacity duration-500 ${
                    activeIndex === index ? "opacity-100" : "opacity-0"
                  }`}
                />

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 ${
                      activeIndex === index
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    <philosophy.icon className="w-5 h-5" />
                  </div>

                  {/* Name and count */}
                  <div className="flex items-baseline gap-2 mb-2">
                    <h3 className="font-serif text-xl">{philosophy.name}</h3>
                    <span className="text-sm text-muted-foreground">{philosophy.count}</span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{philosophy.description}</p>

                  {/* Arrow indicator */}
                  <div
                    className={`flex items-center gap-2 text-sm font-medium transition-all duration-300 ${
                      activeIndex === index ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    <span>Explore</span>
                    <ArrowRight
                      className={`w-4 h-4 transition-transform duration-300 ${
                        activeIndex === index ? "translate-x-1" : ""
                      }`}
                    />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
