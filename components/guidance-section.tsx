"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowRight, BookOpen, MessageCircle, Users } from "lucide-react"

const guidanceOptions = [
  {
    icon: MessageCircle,
    title: "Counselor Connect",
    description: "Speak with our education counselors who understand each school's unique culture.",
    cta: "Book a session",
    href: "/counselor-connect",
  },
  {
    icon: BookOpen,
    title: "School Readiness Guide",
    description: "Comprehensive resources to help you understand different curricula and philosophies.",
    cta: "Explore guides",
    href: "#guides",
  },
  {
    icon: Users,
    title: "Parent Community",
    description: "Connect with other parents and get honest insights from families who've been through the process.",
    cta: "Join community",
    href: "#community",
  },
]

export function GuidanceSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
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

  return (
    <section id="guidance" ref={sectionRef} className="py-16 lg:py-20 bg-gradient-to-r from-secondary/10 via-primary/5 to-accent/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div
          className={`text-center mb-14 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="text-sm font-medium text-primary/80 tracking-wide">Support & Guidance</span>
          <h2 className="font-serif text-3xl lg:text-4xl xl:text-5xl mt-3 text-balance">We're here to help</h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg leading-relaxed">
            Choosing a school is one of the most important decisions for your family. We offer multiple ways to support
            your journey.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5 lg:gap-6">
          {guidanceOptions.map((option, index) => (
            <div
              key={option.title}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
              className={`group p-8 lg:p-10 rounded-2xl bg-card border border-border/30 transition-all duration-500 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              } ${hoveredCard === index ? "shadow-lg border-primary/20" : ""}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-colors duration-300 ${
                  hoveredCard === index ? "bg-primary text-primary-foreground" : "bg-secondary text-primary"
                }`}
              >
                <option.icon className="h-5 w-5" />
              </div>
              <h3 className="font-serif text-xl mb-3">{option.title}</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">{option.description}</p>
              <Link
                href={option.href}
                className="inline-flex items-center gap-2 text-sm font-medium text-primary group-hover:gap-3 transition-all duration-300"
              >
                {option.cta}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
