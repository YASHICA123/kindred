"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

interface AgeGroupData {
  name: string
  slug: string
  age_range: string
  schoolCount: number
}

const ageGroupColors: Record<string, string> = {
  "Preschool": "from-pink-400 to-rose-500",
  "Primary": "from-blue-400 to-cyan-500",
  "Secondary": "from-purple-400 to-indigo-500",
  "Senior Secondary": "from-amber-400 to-orange-500",
  "Post Secondary": "from-green-400 to-teal-500",
}

const fallbackAgeGroups: AgeGroupData[] = [
  { name: "Preschool", slug: "preschool", age_range: "2-5 years", schoolCount: 0 },
  { name: "Primary", slug: "primary", age_range: "6-10 years", schoolCount: 0 },
  { name: "Secondary", slug: "secondary", age_range: "11-16 years", schoolCount: 0 },
  { name: "Senior Secondary", slug: "senior-secondary", age_range: "17-18 years", schoolCount: 0 },
  { name: "Post Secondary", slug: "post-secondary", age_range: "18+ years", schoolCount: 0 },
]

export function AgeExplorer() {
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredCity, setHoveredCity] = useState<string | null>(null)
  const [ageGroups, setAgeGroups] = useState<AgeGroupData[]>(fallbackAgeGroups)
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

  useEffect(() => {
    async function loadAgeGroups() {
      try {
        const res = await fetch("/api/age-groups?counts=true")
        if (!res.ok) return
        const data = await res.json()
        if (Array.isArray(data) && data.length > 0) {
          setAgeGroups(data)
        }
      } catch {
        // keep fallback
      }
    }
    loadAgeGroups()
  }, [])

  return (
    <section ref={sectionRef} className="py-16 lg:py-24 bg-gradient-to-b from-secondary/5 to-white border-b border-border/20 relative overflow-hidden">
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
            href="/age-groups"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:gap-3 transition-all mt-8"
          >
            Explore all age groups
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Age Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {ageGroups.map((group, index) => {
            const color = ageGroupColors[group.name] || "from-gray-400 to-gray-500"
            return (
              <Link
                key={group.name}
                href={`/age-groups/${group.slug}`}
                onMouseEnter={() => setHoveredCity(group.name)}
                onMouseLeave={() => setHoveredCity(null)}
                className={`group relative rounded-2xl p-6 overflow-hidden transition-all duration-700 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                } hover:shadow-xl hover:-translate-y-1`}
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`} />
                
                {/* Content */}
                <div className="relative z-10">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${color} opacity-20 group-hover:opacity-30 transition-opacity duration-300 mb-4`} />
                  <h3 className="font-serif text-xl lg:text-2xl text-foreground mb-1">{group.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{group.age_range}</p>
                  <div className="flex items-end justify-between">
                    <p className="text-sm font-medium text-primary">
                      {group.schoolCount > 0 ? `${group.schoolCount} schools` : "Coming soon"}
                    </p>
                    <div className="p-2 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <ArrowUpRight className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                </div>

                {/* Hover border effect */}
                <div className="absolute inset-0 rounded-2xl border border-primary/0 group-hover:border-primary/30 transition-colors duration-300" />
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
