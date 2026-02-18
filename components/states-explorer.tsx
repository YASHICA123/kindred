"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

const states = [
  { name: "Maharashtra", schools: 580, image: "/mumbai-cityscape-gateway-of-india-sunset.jpg" },
  { name: "Gujarat", schools: 420, image: "/modern-school-building-with-green-campus-architect.jpg" },
  { name: "Karnataka", schools: 480, image: "/bangalore-garden-city-tech-park-green-trees.jpg" },
  { name: "Telangana", schools: 290, image: "/hyderabad-charminar-historical-architecture-evenin.jpg" },
  { name: "Tamil Nadu", schools: 350, image: "/chennai-marina-beach-temple-architecture.jpg" },
]

export function StatesExplorer() {
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredState, setHoveredState] = useState<string | null>(null)
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
    <section ref={sectionRef} className="py-12 lg:py-16 bg-white border-b border-border/20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className={`text-left mb-8 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
           <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 text-sm font-medium text-primary tracking-wide mb-4">
              <span className="w-8 h-px bg-primary" />
              Explore by State
            </span>
            <h2 className="font-serif text-3xl lg:text-5xl leading-[1.1]">
              Discover schools in top States
              <span className="text-muted-foreground"> find their spark</span>
            </h2>
          </div>
          <Link
            href="/discover"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:gap-3 transition-all mt-4"
          >
            View all states
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        

        <div className="grid grid-cols-6 lg:grid-cols-12 gap-4 lg:gap-5 auto-rows-[140px] lg:auto-rows-[180px]">
          {states.map((state, index) => {
            const sizes = [
              "col-span-6 lg:col-span-5 row-span-2",
              "col-span-3 lg:col-span-4 row-span-2",
              "col-span-3 lg:col-span-3 row-span-1",
              "col-span-3 lg:col-span-4 row-span-1",
              "col-span-3 lg:col-span-5 row-span-1",
            ]

            return (
              <Link
                key={state.name}
                href={`/discover?state=${state.name.toLowerCase().replace(/\s+/g, "-")}`}
                onMouseEnter={() => setHoveredState(state.name)}
                onMouseLeave={() => setHoveredState(null)}
                className={`group relative rounded-2xl lg:rounded-3xl overflow-hidden ${sizes[index]} transition-all duration-700 glow-hover ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                }`}
                style={{ transitionDelay: `${index * 60}ms` }}
              >
                {/* Image */}
                <img
                  src={state.image}
                  alt={state.name}
                  className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 ${
                    hoveredState === state.name ? "scale-110" : "scale-100"
                  }`}
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent dark:from-black/90" />
                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-between p-4 lg:p-6">
                  <div />
                  <div>
                    <h3 className="font-serif text-2xl lg:text-3xl font-bold text-white">{state.name}</h3>
                    <p className="text-sm text-white/80 mt-1">{state.schools} schools</p>
                  </div>
                </div>
                {/* Hover arrow */}
                <div className="absolute top-4 right-4 lg:top-6 lg:right-6 p-2 rounded-full bg-white/10 group-hover:bg-white/20 transition-all duration-300 backdrop-blur-sm">
                  <ArrowUpRight className="h-4 w-4 lg:h-5 lg:w-5 text-white" />
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
