"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

interface CityData {
  name: string
  slug: string
  schoolCount: number
}

const cityImages: Record<string, string> = {
  "Mumbai": "/mumbai-cityscape-gateway-of-india-sunset.jpg",
  "Jaipur": "/OIP.webp",
  "Bengaluru": "/bangalore-garden-city-tech-park-green-trees.jpg",
  "Bangalore": "/banglore.webp",
  "Pune": "/pune.webp",
  "Hyderabad": "/hyderabad-charminar-historical-architecture-evenin.jpg",
  "New Delhi": "/delhi.jpg",
  "Delhi": "/delhi.jpg",
  "Chennai": "/chennai-marina-beach-temple-architecture.jpg",
  "Lucknow": "/lucknow.jpg",
  "Noida": "/noida.jpg",
}

const fallbackCities: CityData[] = [
  { name: "Mumbai", slug: "mumbai", schoolCount: 0 },
  { name: "Jaipur", slug: "jaipur", schoolCount: 0 },
  { name: "Bengaluru", slug: "bengaluru", schoolCount: 0 },
  { name: "Pune", slug: "pune", schoolCount: 0 },
  { name: "Hyderabad", slug: "hyderabad", schoolCount: 0 },
]

export function CitiesExplorer() {
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredCity, setHoveredCity] = useState<string | null>(null)
  const [cities, setCities] = useState<CityData[]>(fallbackCities)
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
    async function loadCities() {
      try {
        const res = await fetch("/api/schools/discovery")
        if (!res.ok) return
        const data = await res.json()
        if (data.states && data.states.length > 0) {
          // Collect all cities with counts from top states
          const allCities: CityData[] = []
          // Fetch cities for the top 5 states by school count
          const topStates = [...data.states]
            .sort((a: { schoolCount: number }, b: { schoolCount: number }) => b.schoolCount - a.schoolCount)
            .slice(0, 5)

          for (const state of topStates) {
            const cityRes = await fetch(`/api/states?slug=${state.slug}`)
            if (!cityRes.ok) continue
            const cityData = await cityRes.json()
            if (cityData.cities) {
              for (const city of cityData.cities) {
                if (city.schoolCount > 0) {
                  allCities.push(city)
                }
              }
            }
          }

          if (allCities.length > 0) {
            const sorted = allCities
              .sort((a, b) => b.schoolCount - a.schoolCount)
              .slice(0, 5)
            setCities(sorted)
          }
        }
      } catch {
        // keep fallback
      }
    }
    loadCities()
  }, [])

  return (
    <section ref={sectionRef} className="py-16 lg:py-24 bg-white border-b border-border/20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className={`text-left mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
           <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 text-sm font-medium text-primary tracking-wide mb-4">
              <span className="w-8 h-px bg-primary" />
              Explore by City
            </span>
            <h2 className="font-serif text-3xl lg:text-5xl leading-[1.1]">
              Discover schools in top Cities
              <span className="text-muted-foreground"> find their spark</span>
            </h2>
          </div>
          <Link
            href="/cities"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:gap-3 transition-all"
          >
            View all cities
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        

        <div className="grid grid-cols-6 lg:grid-cols-12 gap-4 lg:gap-5 auto-rows-[140px] lg:auto-rows-[180px]">
          {cities.map((city, index) => {
            const sizes = [
              "col-span-6 lg:col-span-5 row-span-2",
              "col-span-3 lg:col-span-4 row-span-2",
              "col-span-3 lg:col-span-3 row-span-1",
              "col-span-3 lg:col-span-4 row-span-1",
              "col-span-3 lg:col-span-5 row-span-1",
            ]

            const image = cityImages[city.name] || "/placeholder.jpg"

            return (
              <Link
                key={city.name}
                href={`/cities/${city.slug}`}
                onMouseEnter={() => setHoveredCity(city.name)}
                onMouseLeave={() => setHoveredCity(null)}
                className={`group relative rounded-2xl lg:rounded-3xl overflow-hidden ${sizes[index]} transition-all duration-700 glow-hover ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                }`}
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                <img
                  src={image}
                  alt={city.name}
                  className={`w-full h-full object-cover transition-transform duration-700 ${
                    hoveredCity === city.name ? "scale-110" : "scale-100"
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                <div className="absolute inset-0 p-5 lg:p-6 flex flex-col justify-end">
                  <div className="flex items-end justify-between">
                    <div>
                      <h3 className="font-serif text-lg lg:text-xl text-white">{city.name}</h3>
                      <p className="text-white/70 text-sm mt-0.5">{city.schoolCount} schools</p>
                    </div>
                    <div
                      className={`p-2.5 rounded-full transition-all duration-300 ${
                        hoveredCity === city.name ? "bg-primary text-primary-foreground scale-110" : "bg-white/20 backdrop-blur-sm text-white"
                      }`}
                    >
                      <ArrowUpRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
