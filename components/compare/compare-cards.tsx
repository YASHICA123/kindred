"use client"

import { useState } from "react"
import Link from "next/link"
import { MapPin, Users, Award, Heart, ArrowRight } from "lucide-react"

export function CompareCards({ schools }: { schools?: any[] }) {
  const [favorited, setFavorited] = useState<number[]>([])

  const toggleFavorite = (id: number) => {
    setFavorited((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]))
  }

  const visible = schools && schools.length > 0 ? schools : []

  return (
    <section className="py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Visual comparison cards */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {visible.map((school: any, index: number) => (
            <div
              key={school.id}
              className={`relative rounded-3xl overflow-hidden border-2 ${
                index === 0 ? "border-primary" : "border-border"
              }`}
            >
              {/* School image header */}
              <div className="relative aspect-[16/9]">
                <img src={school.image || "/placeholder.svg"} alt={school.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />

                {/* Badges */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  {index === 0 && (
                    <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">Best Match</span>
                  )}
                  <span className="px-3 py-1 bg-background/80 backdrop-blur-sm text-xs font-medium rounded-full">{school.type}</span>
                </div>

                {/* Favorite button */}
                <button
                  onClick={() => toggleFavorite(school.id)}
                  className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
                    favorited.includes(school.id) ? "bg-accent text-accent-foreground" : "bg-background/80 backdrop-blur-sm hover:bg-background"
                  }`}
                >
                  <Heart className={`h-5 w-5 ${favorited.includes(school.id) ? "fill-current" : ""}`} />
                </button>

                {/* School name overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-serif text-2xl text-background">{school.name}</h3>
                  <p className="text-background/80 flex items-center gap-2 mt-1">
                    <MapPin className="h-4 w-4" />
                    {school.location || school.city}
                  </p>
                </div>
              </div>

              {/* Card content */}
              <div className="p-6">
                {/* Key metrics */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-3 bg-secondary/50 rounded-xl">
                    <div className="flex items-center justify-center gap-1">
                      <Users className="h-4 w-4 text-primary" />
                      <span className="font-semibold">{school.students || "—"}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">students</p>
                  </div>
                  <div className="text-center p-3 bg-secondary/50 rounded-xl">
                    <div className="flex items-center justify-center gap-1">
                      <Award className="h-4 w-4 text-primary" />
                      <span className="font-semibold">{school.established || "—"}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">established</p>
                  </div>
                </div>

                {/* Highlights */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-muted-foreground mb-3">Key Highlights</h4>
                  <div className="flex flex-wrap gap-2">
                    {(school.tags || []).slice(0, 4).map((highlight: string) => (
                      <span key={highlight} className="px-3 py-1.5 bg-primary/5 text-primary text-sm rounded-full">
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Best for */}
                <div className="p-4 bg-primary/5 rounded-xl mb-6">
                  <h4 className="text-sm font-medium text-primary mb-1">Best For</h4>
                  <p className="text-sm text-muted-foreground">{school.tagline || "—"}</p>
                </div>

                {/* Fee and curriculum */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div>
                    <p className="text-sm text-muted-foreground">Annual Fee</p>
                    <p className="font-semibold text-primary">{school.feeRange || school.fee || "—"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Curriculum</p>
                    <p className="font-medium">{school.curriculum || "—"}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex gap-3">
                  <Link
                    href={`/school/${school.slug || school.id}`}
                    className="flex-1 py-3 text-center bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors"
                  >
                    View School
                  </Link>
                  <button className="px-4 py-3 border border-border rounded-full hover:bg-secondary transition-colors">
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
