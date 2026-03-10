"use client"

import { Search } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { extractSearchIntent } from "@/lib/discover-options"

const placeholderExamples = [
  "Best schools in Delhi",
  "Top CBSE schools near me",
  "Boarding schools under 2 Lakh",
  "IB schools in Bangalore",
  "Montessori preschools in Mumbai",
]

export function DiscoverHero() {
  const [searchQuery, setSearchQuery] = useState("")
  const [animatedPlaceholder, setAnimatedPlaceholder] = useState("")
  const router = useRouter()

  // Typewriter animation for search placeholder
  useEffect(() => {
    if (searchQuery) return

    let exampleIndex = 0
    let charIndex = 0
    let deleting = false
    let timeout: NodeJS.Timeout

    const tick = () => {
      const currentText = placeholderExamples[exampleIndex]

      if (!deleting) {
        charIndex++
        setAnimatedPlaceholder(currentText.slice(0, charIndex))
        if (charIndex === currentText.length) {
          deleting = true
          timeout = setTimeout(tick, 1800)
          return
        }
        timeout = setTimeout(tick, 80)
      } else {
        charIndex--
        setAnimatedPlaceholder(currentText.slice(0, charIndex))
        if (charIndex === 0) {
          deleting = false
          exampleIndex = (exampleIndex + 1) % placeholderExamples.length
          timeout = setTimeout(tick, 400)
          return
        }
        timeout = setTimeout(tick, 40)
      }
    }

    timeout = setTimeout(tick, 600)
    return () => clearTimeout(timeout)
  }, [searchQuery])

  const handleSearch = () => {
    const query = searchQuery.trim()
    if (!query) return

    const params = new URLSearchParams()
    const intent = extractSearchIntent(query)

    if (intent.city) params.append("city", intent.city)
    if (intent.state) params.append("state", intent.state)
    if (intent.board) params.append("curriculum", intent.board)
    if (intent.type) params.append("type", intent.type)
    if (intent.feeRange) params.append("fee", intent.feeRange)

    if (!intent.city && !intent.state && !intent.board && !intent.type && !intent.feeRange) {
      params.append("search", query)
    }

    router.push(`/discover?${params.toString()}`)
  }

  return (
    <section className="pt-24 lg:pt-32 pb-8 lg:pb-12 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-3xl">
          <h1 className="font-serif text-3xl lg:text-4xl xl:text-5xl leading-tight">
            Find schools that match
            <span className="block text-primary">your family's vision</span>
          </h1>
          <p className="text-muted-foreground mt-4 text-lg max-w-xl">
            Explore over 1,200 schools across India. Filter by curriculum, location, and what matters most to you.
          </p>

          {/* Search bar */}
          <div className="mt-8 relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder={searchQuery ? "" : animatedPlaceholder || "Search by school name, location, or curriculum..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleSearch()
                  }
                }}
                className="w-full pl-12 pr-4 py-4 rounded-full border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
              <button
                type="button"
                onClick={handleSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Search
              </button>
            </div>
          </div>

          {/* Quick filters */}
          <div className="mt-6 flex flex-wrap gap-2">
            <span className="text-sm text-muted-foreground py-2">Popular:</span>
            {[
              { label: "CBSE Schools", query: "curriculum=CBSE" },
              { label: "IB World Schools", query: "curriculum=IB" },
              { label: "Montessori", query: "curriculum=Montessori" },
            ].map((filter) => (
              <button
                key={filter.label}
                onClick={() => router.push(`/discover?${filter.query}`)}
                className="px-4 py-2 text-sm font-medium rounded-full border border-border hover:border-primary hover:text-primary transition-colors"
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
