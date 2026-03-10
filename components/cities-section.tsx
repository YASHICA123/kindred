"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

interface CityData {
  name: string
  slug: string
  schoolCount: number
}

const cityImages: Record<string, string> = {
  "Mumbai": "/mumbai-cityscape-gateway-of-india-sunset.jpg",
  "New Delhi": "/delhi.jpg",
  "Delhi": "/delhi.jpg",
  "Bengaluru": "/bangalore-garden-city-tech-park-green-trees.jpg",
  "Bangalore": "/banglore.webp",
  "Hyderabad": "/hyderabad-charminar-historical-architecture-evenin.jpg",
  "Chennai": "/chennai-marina-beach-temple-architecture.jpg",
  "Pune": "/pune.webp",
  "Kolkata": "/placeholder.jpg",
  "Jaipur": "/OIP.webp",
  "Lucknow": "/lucknow.jpg",
  "Noida": "/noida.jpg",
}

const fallbackCities: CityData[] = [
  { name: "Mumbai", slug: "mumbai", schoolCount: 0 },
  { name: "New Delhi", slug: "new-delhi", schoolCount: 0 },
  { name: "Bengaluru", slug: "bengaluru", schoolCount: 0 },
  { name: "Hyderabad", slug: "hyderabad", schoolCount: 0 },
  { name: "Chennai", slug: "chennai", schoolCount: 0 },
]

export function CitiesSection() {
  const [hoveredCity, setHoveredCity] = useState<string | null>(null)
  const [cities, setCities] = useState<CityData[]>(fallbackCities)

  useEffect(() => {
    async function loadCities() {
      try {
        const res = await fetch("/api/schools/discovery")
        if (!res.ok) return
        const data = await res.json()
        if (data.states && data.states.length > 0) {
          const allCities: CityData[] = []
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
    <section className="py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16">
          <span className="text-sm font-medium text-primary uppercase tracking-wider">Explore by Location</span>
          <h2 className="font-serif text-3xl lg:text-4xl xl:text-5xl mt-3 text-balance">Schools in your city</h2>
        </div>

        {/* Interactive city cards with hover effects */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6">
          {cities.map((city, index) => {
            const image = cityImages[city.name] || "/placeholder.jpg"

            return (
              <Link
                key={city.name}
                href={`/cities/${city.slug}`}
                onMouseEnter={() => setHoveredCity(city.name)}
                onMouseLeave={() => setHoveredCity(null)}
                className={`group relative rounded-2xl overflow-hidden ${
                  index === 0 ? "col-span-2 lg:col-span-2 row-span-2" : ""
                }`}
              >
                <div className={`${index === 0 ? "aspect-square lg:aspect-[4/5]" : "aspect-[3/4]"}`}>
                  <img
                    src={image}
                    alt={city.name}
                    className={`w-full h-full object-cover transition-transform duration-700 ${
                      hoveredCity === city.name ? "scale-110" : "scale-100"
                    }`}
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6">
                  <div className="flex items-end justify-between">
                    <div>
                      <h3
                        className={`font-serif text-background ${
                          index === 0 ? "text-2xl lg:text-3xl" : "text-lg lg:text-xl"
                        }`}
                      >
                        {city.name}
                      </h3>
                      <p className="text-background/70 text-sm mt-1">{city.schoolCount} schools</p>
                  </div>
                  <div
                    className={`p-2 bg-background/20 backdrop-blur-sm rounded-full transition-all duration-300 ${
                      hoveredCity === city.name ? "bg-primary text-primary-foreground" : "text-background"
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
