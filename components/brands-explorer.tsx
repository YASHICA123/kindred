"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

const brands = [
  {
    name: "Montessori",
    description: "Child-led, hands-on learning",
    schools: 240,
    color: "from-amber-500/20 to-orange-500/10",
    textColor: "text-amber-700",
  },
  {
    name: "International",
    description: "Global curriculum focus",
    schools: 180,
    color: "from-sky-500/20 to-blue-500/10",
    textColor: "text-sky-700",
  },
  {
    name: "CBSE",
    description: "National curriculum",
    schools: 520,
    color: "from-emerald-500/20 to-green-500/10",
    textColor: "text-emerald-700",
  },
  {
    name: "ICSE",
    description: "Application-focused",
    schools: 310,
    color: "from-violet-500/20 to-purple-500/10",
    textColor: "text-violet-700",
  },
  {
    name: "IB World",
    description: "Inquiry-based learning",
    schools: 95,
    color: "from-rose-500/20 to-pink-500/10",
    textColor: "text-rose-700",
  },
  {
    name: "Cambridge",
    description: "International excellence",
    schools: 145,
    color: "from-cyan-500/20 to-teal-500/10",
    textColor: "text-cyan-700",
  },
]

export function BrandsExplorer() {
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredBrand, setHoveredBrand] = useState<string | null>(null)
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
    <section
      ref={sectionRef}
      className="py-12 lg:py-16 bg-white border-b border-border/20"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div
          className={`text-left mb-8 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 text-sm font-medium text-primary tracking-wide mb-4">
              <span className="w-8 h-px bg-primary" />
              Educational Brands
            </span>
            <h2 className="font-serif text-3xl lg:text-5xl leading-[1.1]">
              Explore by Educational Brands
            </h2>
          </div>
          <Link
            href="/discover"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:gap-3 transition-all mt-8"
          >
            View all brands
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Brands Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {brands.map((brand, index) => (
            <Link
              key={brand.name}
              href={`/discover?board=${brand.name.toLowerCase()}`}
              onMouseEnter={() => setHoveredBrand(brand.name)}
              onMouseLeave={() => setHoveredBrand(null)}
              className={`group relative rounded-2xl p-8 lg:p-10 overflow-hidden transition-all duration-700 border border-border/30 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              } hover:shadow-lg hover:border-primary/20 hover:-translate-y-1`}
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              {/* Background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${brand.color}`} />

              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className={`font-serif text-2xl lg:text-3xl font-medium ${brand.textColor}`}>
                      {brand.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">{brand.description}</p>
                  </div>
                  <div className="p-2.5 rounded-full bg-white/10 group-hover:bg-primary/20 transition-colors backdrop-blur-sm">
                    <ArrowUpRight className="h-5 w-5 text-primary" />
                  </div>
                </div>

                <div className="flex items-end justify-between pt-6 border-t border-white/10">
                  <div>
                    <p className="text-sm text-muted-foreground">Available Schools</p>
                    <p className="font-serif text-2xl font-medium">{brand.schools}+</p>
                  </div>
                  <div className={`text-xs font-medium px-3 py-1.5 rounded-full bg-primary/10 ${brand.textColor}`}>
                    {brand.name}
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
