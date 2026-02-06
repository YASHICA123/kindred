"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowUpRight, MapPin, Star, Heart } from "lucide-react"

const fallbackFeatured = [] // Removed local data - using only Strapi

export function FeaturedSchools() {
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredSchool, setHoveredSchool] = useState<number | null>(null)
  const [schools, setSchools] = useState<any[] | null>(null)
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

  // fetch top 3 schools from server API
  useEffect(() => {
    let mounted = true
    fetch('/api/top-schools')
      .then((r) => {
        if (!r.ok) throw new Error('Failed to fetch top schools')
        return r.json()
      })
      .then((json) => {
        if (!mounted) return
        setSchools(json.data || null)
      })
      .catch(() => {
        if (mounted) setSchools(null)
      })

    return () => {
      mounted = false
    }
  }, [])

  return (
    <section ref={sectionRef} className="py-20 lg:py-32 bg-white">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <div
          className={`mb-16 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex items-end justify-between gap-8">
            <div className="max-w-2xl">
              <span className="text-sm font-semibold text-secondary tracking-wide mb-3 block">Featured</span>
              <h2 className="text-4xl lg:text-5xl leading-tight font-serif font-bold text-foreground">
                Popular schools parents love
              </h2>
            </div>
            <Link
              href="/discover"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors group whitespace-nowrap"
            >
              See all
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>

        {/* Featured cards grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Featured cards */}
          {((schools && schools.length > 0 ? schools : []) as any[]).slice(0, 3).map((s, i) => (
            <Link
              key={s.id}
              href={`/schools/${s.slug}`}
              onMouseEnter={() => setHoveredSchool(i)}
              onMouseLeave={() => setHoveredSchool(null)}
              className={`group transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="relative h-full rounded-2xl overflow-hidden bg-white border border-border shadow-sm hover:shadow-xl transition-all duration-300 hover:border-primary/30 flex flex-col">
                <div className="aspect-video overflow-hidden bg-gray-100">
                  <img
                    src={s.image || "/placeholder.svg"}
                    alt={s.name}
                    className={`w-full h-full object-cover transition-transform duration-500 ${
                      hoveredSchool === i ? "scale-105" : "scale-100"
                    }`}
                  />
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-start justify-between mb-3 gap-2">
                    <div className="flex items-center gap-2 flex-wrap flex-1">
                      {(s.tags || []).slice(0, 1).map((tag: string) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-primary/10 rounded text-xs text-primary font-semibold whitespace-nowrap"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <button
                      className="p-1.5 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0"
                      onClick={(e) => e.preventDefault()}
                    >
                      <Heart className="w-4 h-4 text-gray-400 hover:text-primary transition-colors" />
                    </button>
                  </div>
                  
                  <h3 className="font-serif text-lg font-bold text-foreground mb-2 line-clamp-2">{s.name}</h3>
                  <p className="text-muted-foreground text-xs mb-4 line-clamp-2 leading-relaxed flex-1">
                    {s.description || s.highlight}
                  </p>
                  
                  <div className="space-y-2 text-xs text-muted-foreground border-t border-border/30 pt-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                      <span className="truncate">{s.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-3.5 w-3.5 fill-accent text-accent flex-shrink-0" />
                      <span className="font-medium">{s.rating} rating</span>
                    </div>
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
