"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

const ageGroups = [
  { name: "Preschool", ageRange: "2-5 years", schools: 520, color: "from-pink-400 to-rose-500" },
  { name: "Primary", ageRange: "6-10 years", schools: 1240, color: "from-blue-400 to-cyan-500" },
  { name: "Secondary", ageRange: "11-16 years", schools: 980, color: "from-purple-400 to-indigo-500" },
  { name: "Senior Secondary", ageRange: "17-18 years", schools: 750, color: "from-amber-400 to-orange-500" },
  { name: "Post Secondary", ageRange: "18+ years", schools: 340, color: "from-green-400 to-teal-500" },
]

export function AgeExplorer() {
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredCity, setHoveredCity] = useState<string | null>(null)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="py-16 lg:py-20 bg-gradient-to-br from-primary/8 via-transparent to-accent/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className={`text-left mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 text-sm font-medium text-primary tracking-wide mb-4">
              <span className="w-8 h-px bg-primary" />
              Explore by Age
            </span>
            <h2 className="font-serif text-3xl lg:text-5xl leading-[1.1]">
              Schools for every stage of
              <span className="text-muted-foreground"> your child's journey</span>
            </h2>
          </div>
          <Link
            href="/discover"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:gap-3 transition-all mt-8"
          >
            Explore all age groups
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Age Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {ageGroups.map((group, index) => (
            <Link
              key={group.name}
              href={`/discover?ageGroup=${group.name.toLowerCase().replace(/\s+/g, "-")}`}
              onMouseEnter={() => setHoveredCity(group.name)}
              onMouseLeave={() => setHoveredCity(null)}
              className={`group relative rounded-2xl p-6 overflow-hidden transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              } hover:shadow-xl hover:-translate-y-1`}
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              {/* Background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${group.color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`} />
              
              {/* Content */}
              <div className="relative z-10">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${group.color} opacity-20 group-hover:opacity-30 transition-opacity duration-300 mb-4`} />
                <h3 className="font-serif text-xl lg:text-2xl text-foreground mb-1">{group.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{group.ageRange}</p>
                <div className="flex items-end justify-between">
                  <p className="text-sm font-medium text-primary">{group.schools} schools</p>
                  <div className="p-2 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <ArrowUpRight className="h-4 w-4 text-primary" />
                  </div>
                </div>
              </div>

              {/* Hover border effect */}
              <div className="absolute inset-0 rounded-2xl border border-primary/0 group-hover:border-primary/30 transition-colors duration-300" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
