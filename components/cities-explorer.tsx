"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

const cities = [
  { name: "Mumbai", schools: 280, image: "/mumbai-cityscape-gateway-of-india-sunset.jpg" },
  { name: "Jaipur", schools: 310, image: "/school-building-eco-friendly-green-architecture.jpg" },
  { name: "Bangalore", schools: 340, image: "/bangalore-garden-city-tech-park-green-trees.jpg" },
  { name: "Pune", schools: 190, image: "/hyderabad-charminar-historical-architecture-evenin.jpg" },
  { name: "Hyderabad", schools: 210, image: "/chennai-marina-beach-temple-architecture.jpg" },
]

export function CitiesExplorer() {
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
            href="/discover"
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

            return (
              <Link
                key={city.name}
                href={`/discover?city=${city.name.toLowerCase().replace(/\s+/g, "-")}`}
                onMouseEnter={() => setHoveredCity(city.name)}
                onMouseLeave={() => setHoveredCity(null)}
                className={`group relative rounded-2xl lg:rounded-3xl overflow-hidden ${sizes[index]} transition-all duration-700 glow-hover ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                }`}
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                <img
                  src={city.image || "/placeholder.svg"}
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
                      <p className="text-white/70 text-sm mt-0.5">{city.schools} schools</p>
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
