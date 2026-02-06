"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

const cities = [
  {
    name: "Mumbai",
    schools: 280,
    image: "/mumbai-cityscape-gateway-of-india-sunset.jpg",
  },
  {
    name: "Delhi NCR",
    schools: 420,
    image: "/delhi-india-gate-monuments-urban-landscape.jpg",
  },
  {
    name: "Bangalore",
    schools: 340,
    image: "/bangalore-garden-city-tech-park-green-trees.jpg",
  },
  {
    name: "Hyderabad",
    schools: 190,
    image: "/hyderabad-charminar-historical-architecture-evenin.jpg",
  },
  {
    name: "Chennai",
    schools: 210,
    image: "/chennai-marina-beach-temple-architecture.jpg",
  },
]

export function CitiesSection() {
  const [hoveredCity, setHoveredCity] = useState<string | null>(null)

  return (
    <section className="py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16">
          <span className="text-sm font-medium text-primary uppercase tracking-wider">Explore by Location</span>
          <h2 className="font-serif text-3xl lg:text-4xl xl:text-5xl mt-3 text-balance">Schools in your city</h2>
        </div>

        {/* Interactive city cards with hover effects */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6">
          {cities.map((city, index) => (
            <Link
              key={city.name}
              href={`/discover?city=${city.name.toLowerCase().replace(" ", "-")}`}
              onMouseEnter={() => setHoveredCity(city.name)}
              onMouseLeave={() => setHoveredCity(null)}
              className={`group relative rounded-2xl overflow-hidden ${
                index === 0 ? "col-span-2 lg:col-span-2 row-span-2" : ""
              }`}
            >
              <div className={`${index === 0 ? "aspect-square lg:aspect-[4/5]" : "aspect-[3/4]"}`}>
                <img
                  src={city.image || "/placeholder.svg"}
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
                    <p className="text-background/70 text-sm mt-1">{city.schools} schools</p>
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
          ))}
        </div>
      </div>
    </section>
  )
}
