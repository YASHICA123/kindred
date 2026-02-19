"use client"

import { useState, useEffect } from "react"
import { ArrowUpRight, Heart, MapPin, Users } from "lucide-react"
import Link from "next/link"

export function DiscoverySection() {
  const [hoveredSchool, setHoveredSchool] = useState<number | null>(null)
  const [schools, setSchools] = useState<any[]>([])

  useEffect(() => {
    let mounted = true
    fetch('/api/top-schools')
      .then((r) => {
        if (!r.ok) throw new Error('Failed to fetch schools')
        return r.json()
      })
      .then((json) => {
        if (mounted) setSchools(json.data || [])
      })
      .catch(() => {
        if (mounted) setSchools([])
      })

    return () => {
      mounted = false
    }
  }, [])

  return (
    <section className="py-20 lg:py-32 bg-card">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12 lg:mb-16">
          <div className="max-w-2xl">
            <span className="text-sm font-medium text-primary uppercase tracking-wider">Featured Schools</span>
            <h2 className="font-serif text-3xl lg:text-4xl xl:text-5xl mt-3 leading-tight text-balance">
              Handpicked for
              <br />
              <span className="text-muted-foreground">curious minds</span>
            </h2>
          </div>
          <Link
            href="/discover"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:gap-3 transition-all"
          >
            View all schools
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Asymmetric school cards grid */}
        {schools.length > 0 && (
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Large featured card */}
          <Link
            href={`/schools/${schools[0].slug}`}
            onMouseEnter={() => setHoveredSchool(0)}
            onMouseLeave={() => setHoveredSchool(null)}
            className="lg:col-span-7 group"
          >
            <div className="relative h-full rounded-3xl overflow-hidden">
              <div className="aspect-[16/10] lg:aspect-auto lg:h-full">
                <img
                  src={schools[0].image || "/placeholder.svg"}
                  alt={schools[0].name}
                  className={`w-full h-full object-cover transition-transform duration-700 ${
                    hoveredSchool === 0 ? "scale-105" : "scale-100"
                  }`}
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />

              {/* Card content overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                    {schools[0].highlight}
                  </span>
                  <span className="px-3 py-1 bg-background/20 backdrop-blur-sm text-background text-xs font-medium rounded-full">
                    {schools[0].type}
                  </span>
                </div>
                <h3 className="font-serif text-2xl lg:text-3xl text-background mb-2">{schools[0].name}</h3>
                <div className="flex items-center gap-4 text-background/80 text-sm">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {schools[0].location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {schools[0].students}
                  </span>
                </div>
              </div>

              {/* Favorite button */}
              <button className="absolute top-4 right-4 p-3 bg-background/20 backdrop-blur-sm rounded-full hover:bg-background/40 transition-colors">
                <Heart className="h-5 w-5 text-background" />
              </button>
            </div>
          </Link>

          {/* Stacked smaller cards */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {schools.map((school: any, index: number) => (
              <Link
                key={school.id}
                href={`/schools/${school.slug}`}
                onMouseEnter={() => setHoveredSchool(index + 1)}
                onMouseLeave={() => setHoveredSchool(null)}
                className="group relative rounded-2xl overflow-hidden"
              >
                <div className={`flex gap-4 p-4 ${school.accent} transition-all`}>
                  <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-xl overflow-hidden flex-shrink-0">
                    <img
                      src={school.image || "/placeholder.svg"}
                      alt={school.name}
                      className={`w-full h-full object-cover transition-transform duration-500 ${
                        hoveredSchool === index + 1 ? "scale-110" : "scale-100"
                      }`}
                    />
                  </div>
                  <div className="flex flex-col justify-between py-1">
                    <div>
                      <span className="text-xs font-medium text-primary">{school.highlight}</span>
                      <h3 className="font-serif text-lg lg:text-xl mt-1">{school.name}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3" />
                        {school.location} · {school.type}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-muted-foreground">{school.students} students</span>
                    </div>
                  </div>
                  <button className="absolute top-4 right-4 p-2 hover:bg-foreground/5 rounded-full transition-colors">
                    <Heart className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
              </Link>
            ))}
          </div>
        </div>
        )}
      </div>
    </section>
  )
}
