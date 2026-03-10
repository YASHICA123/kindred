"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowUpRight, IndianRupee } from "lucide-react"

const feeColors: Record<string, string> = {
  "under-50k": "from-green-400 to-emerald-500",
  "50k-1lakh": "from-blue-400 to-sky-500",
  "1-2lakh": "from-purple-400 to-violet-500",
  "2-5lakh": "from-amber-400 to-yellow-500",
  "above-5lakh": "from-rose-400 to-pink-500",
}

const staticFallback = [
  { name: "Under ₹50,000", slug: "under-50k", schoolCount: 0 },
  { name: "₹50,000 - ₹1 Lakh", slug: "50k-1lakh", schoolCount: 0 },
  { name: "₹1 - 2 Lakh", slug: "1-2lakh", schoolCount: 0 },
  { name: "₹2 - 5 Lakh", slug: "2-5lakh", schoolCount: 0 },
  { name: "Above ₹5 Lakh", slug: "above-5lakh", schoolCount: 0 },
]

interface FeeRangeData {
  name: string
  slug: string
  schoolCount: number
}

export function FeesExplorer() {
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredFee, setHoveredFee] = useState<string | null>(null)
  const [feeRanges, setFeeRanges] = useState<FeeRangeData[]>(staticFallback)
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
    fetch("/api/fee-ranges?counts=true")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setFeeRanges(data)
        }
      })
      .catch(() => {})
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
            href="/fees"
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
              key={fee.slug}
              href={`/fees/${fee.slug}`}
              onMouseEnter={() => setHoveredFee(fee.slug)}
              onMouseLeave={() => setHoveredFee(null)}
              className={`group relative rounded-2xl p-6 overflow-hidden transition-all duration-700 border border-transparent ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              } hover:shadow-xl hover:-translate-y-1 hover:border-primary/30`}
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              {/* Background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feeColors[fee.slug] || "from-gray-400 to-gray-500"} opacity-10 group-hover:opacity-20 transition-opacity duration-300`} />
              
              {/* Content */}
              <div className="relative z-10">
                <div className="mb-4">
                  <IndianRupee className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-serif text-xl lg:text-2xl text-foreground mb-1">{fee.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{fee.name}</p>
                <div className="flex items-end justify-between">
                  <p className="text-sm font-medium text-primary">
                    {fee.schoolCount > 0 ? `${fee.schoolCount} schools` : "Coming soon"}
                  </p>
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
