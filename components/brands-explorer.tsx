"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

interface BoardData {
  name: string
  slug: string
  full_name?: string
  description?: string
  schoolCount: number
}

const boardMeta: Record<string, { color: string; textColor: string }> = {
  CBSE: { color: "from-emerald-500/20 to-green-500/10", textColor: "text-emerald-700" },
  ICSE: { color: "from-violet-500/20 to-purple-500/10", textColor: "text-violet-700" },
  ISC: { color: "from-teal-500/20 to-teal-600/10", textColor: "text-teal-700" },
  IB: { color: "from-rose-500/20 to-pink-500/10", textColor: "text-rose-700" },
  Cambridge: { color: "from-cyan-500/20 to-teal-500/10", textColor: "text-cyan-700" },
  IGCSE: { color: "from-amber-500/20 to-orange-500/10", textColor: "text-amber-700" },
  "State Board": { color: "from-indigo-500/20 to-blue-500/10", textColor: "text-indigo-700" },
  Montessori: { color: "from-pink-500/20 to-rose-500/10", textColor: "text-pink-700" },
}

const fallbackBrands: BoardData[] = [
  { name: "CBSE", slug: "cbse", schoolCount: 0 },
  { name: "ICSE", slug: "icse", schoolCount: 0 },
  { name: "IB", slug: "ib", schoolCount: 0 },
  { name: "Cambridge", slug: "cambridge", schoolCount: 0 },
  { name: "State Board", slug: "state-board", schoolCount: 0 },
  { name: "Montessori", slug: "montessori", schoolCount: 0 },
]

export function BrandsExplorer() {
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredBrand, setHoveredBrand] = useState<string | null>(null)
  const [brands, setBrands] = useState<BoardData[]>(fallbackBrands)
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
    async function loadBoards() {
      try {
        const res = await fetch("/api/boards?counts=true")
        if (!res.ok) return
        const data = await res.json()
        if (Array.isArray(data) && data.length > 0) {
          setBrands(data)
        }
      } catch {
        // keep fallback
      }
    }
    loadBoards()
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
            href="/boards"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:gap-3 transition-all mt-8"
          >
            View all boards
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Brands Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {brands.map((brand, index) => {
            const meta = boardMeta[brand.name] || { color: "from-gray-500/20 to-gray-500/10", textColor: "text-gray-700" }
            return (
              <Link
                key={brand.name}
                href={`/boards/${brand.slug}`}
                onMouseEnter={() => setHoveredBrand(brand.name)}
                onMouseLeave={() => setHoveredBrand(null)}
                className={`group relative rounded-2xl p-8 lg:p-10 overflow-hidden transition-all duration-700 border border-border/30 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                } hover:shadow-lg hover:border-primary/20 hover:-translate-y-1`}
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${meta.color}`} />

                {/* Content */}
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className={`font-serif text-2xl lg:text-3xl font-medium ${meta.textColor}`}>
                        {brand.name}
                      </h3>
                      {brand.full_name && (
                        <p className="text-sm text-muted-foreground mt-1">{brand.full_name}</p>
                      )}
                    </div>
                    <div className="p-2.5 rounded-full bg-white/10 group-hover:bg-primary/20 transition-colors backdrop-blur-sm">
                      <ArrowUpRight className="h-5 w-5 text-primary" />
                    </div>
                  </div>

                  <div className="flex items-end justify-between pt-6 border-t border-white/10">
                    <div>
                      <p className="text-sm text-muted-foreground">Schools</p>
                      <p className="font-serif text-2xl font-medium">
                        {brand.schoolCount > 0 ? brand.schoolCount : "Coming soon"}
                      </p>
                    </div>
                    <div className={`text-xs font-medium px-3 py-1.5 rounded-full bg-primary/10 ${meta.textColor}`}>
                      {brand.name}
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
