"use client"

import { Search } from "lucide-react"
import { useState } from "react"

export function DiscoverHero() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <section className="pt-24 lg:pt-32 pb-8 lg:pb-12 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-3xl">
          <h1 className="font-serif text-3xl lg:text-4xl xl:text-5xl leading-tight">
            Find schools that match
            <span className="block text-primary">your family's vision</span>
          </h1>
          <p className="text-muted-foreground mt-4 text-lg max-w-xl">
            Explore over 1,200 schools across India. Filter by philosophy, location, and what matters most to you.
          </p>

          {/* Search bar */}
          <div className="mt-8 relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by school name, location, or curriculum..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-full border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
          </div>

          {/* Quick filters */}
          <div className="mt-6 flex flex-wrap gap-2">
            <span className="text-sm text-muted-foreground py-2">Popular:</span>
            {["CBSE Schools", "Near Me", "IB World Schools", "Montessori"].map((filter) => (
              <button
                key={filter}
                className="px-4 py-2 text-sm font-medium rounded-full border border-border hover:border-primary hover:text-primary transition-colors"
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
