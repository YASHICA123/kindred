"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowUpRight, IndianRupee } from "lucide-react"

const feeRanges = [
  { name: "Budget Friendly", range: "₹1-3 Lakhs/year", schools: 680, color: "from-green-400 to-emerald-500" },
  { name: "Affordable", range: "₹3-6 Lakhs/year", schools: 1420, color: "from-blue-400 to-sky-500" },
  { name: "Mid-Range", range: "₹6-12 Lakhs/year", schools: 2150, color: "from-purple-400 to-violet-500" },
  { name: "Premium", range: "₹12-20 Lakhs/year", schools: 980, color: "from-amber-400 to-yellow-500" },
  { name: "Luxury", range: "₹20+ Lakhs/year", schools: 520, color: "from-rose-400 to-pink-500" },
]

export function FeesExplorer() {
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredFee, setHoveredFee] = useState<string | null>(null)
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
              Explore by Fees
            </span>
            <h2 className="font-serif text-3xl lg:text-5xl leading-[1.1]">
              Find the perfect school within
              <span className="text-muted-foreground"> your budget</span>
            </h2>
          </div>
          <Link
            href="/discover"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:gap-3 transition-all mt-8"
          >
            Explore all fee ranges
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Fee Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {feeRanges.map((fee, index) => (
            <Link
              key={fee.name}
              href={`/discover?feeRange=${fee.name.toLowerCase().replace(/\s+/g, "-")}`}
              onMouseEnter={() => setHoveredFee(fee.name)}
              onMouseLeave={() => setHoveredFee(null)}
              className={`group relative rounded-2xl p-6 overflow-hidden transition-all duration-700 border border-transparent ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              } hover:shadow-xl hover:-translate-y-1 hover:border-primary/30`}
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              {/* Background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${fee.color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`} />
              
              {/* Content */}
              <div className="relative z-10">
                <div className="mb-4">
                  <IndianRupee className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-serif text-xl lg:text-2xl text-foreground mb-1">{fee.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{fee.range}</p>
                <div className="flex items-end justify-between">
                  <p className="text-sm font-medium text-primary">{fee.schools} schools</p>
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
