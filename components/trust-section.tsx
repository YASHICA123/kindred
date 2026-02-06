"use client"

import { useEffect, useRef, useState } from "react"

const stats = [
  { value: 1200, suffix: "+", label: "Schools", sublabel: "Across India" },
  { value: 98, suffix: "%", label: "Satisfaction", sublabel: "Parent feedback" },
  { value: 50, suffix: "K+", label: "Families", sublabel: "Helped so far" },
  { value: 15, suffix: "+", label: "Cities", sublabel: "And growing" },
]

function AnimatedCounter({ value, suffix, isVisible }: { value: number; suffix: string; isVisible: boolean }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isVisible) return

    let start = 0
    const duration = 2000
    const increment = value / (duration / 16)

    const timer = setInterval(() => {
      start += increment
      if (start >= value) {
        setCount(value)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)

    return () => clearInterval(timer)
  }, [isVisible, value])

  return (
    <span className="tabular-nums">
      {count.toLocaleString()}
      {suffix}
    </span>
  )
}

export function TrustSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="py-20 lg:py-32 bg-white">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-serif font-bold text-foreground mb-6">
            Trusted by thousands of families
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real families making real decisions. Here's the impact of Kindred.
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`text-center p-8 lg:p-10 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-border/30 hover:border-primary/20 transition-all duration-300 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <span className="font-serif text-4xl lg:text-5xl font-bold text-primary">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} isVisible={isVisible} />
              </span>
              <p className="text-base font-semibold text-foreground mt-3">{stat.label}</p>
              <p className="text-sm text-muted-foreground mt-1">{stat.sublabel}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
