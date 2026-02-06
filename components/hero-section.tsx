"use client"

import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

const schoolTypes = [
  { name: "Montessori", count: "240+" },
  { name: "International", count: "180+" },
  { name: "CBSE", count: "520+" },
  { name: "ICSE", count: "310+" },
  { name: "IB World", count: "95+" },
]

export function HeroSection() {
  const [hoveredType, setHoveredType] = useState<string | null>(null)

  return (
    <section className="pt-32 lg:pt-40 pb-20 lg:pb-32 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 rounded-full border border-secondary/20">
              <Sparkles className="h-4 w-4 text-secondary" />
              <span className="text-sm font-medium text-secondary">50,000+ families trust us</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl leading-tight tracking-tight font-serif font-bold text-foreground">
              Find the right school for your child
            </h1>

            <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
              Discover schools that match your child's learning style. Our thoughtful approach helps you make informed decisions about your child's future.
            </p>

            {/* School type explorer */}
            <div className="space-y-4 pt-4">
              <p className="text-sm font-medium text-foreground">Explore by type</p>
              <div className="flex flex-wrap gap-2">
                {schoolTypes.map((type) => (
                  <Link
                    key={type.name}
                    href={`/discover?type=${type.name.toLowerCase()}`}
                    onMouseEnter={() => setHoveredType(type.name)}
                    onMouseLeave={() => setHoveredType(null)}
                    className={`px-4 py-2.5 rounded-lg border font-medium text-sm transition-all duration-200 ${
                      hoveredType === type.name
                        ? "bg-primary text-white border-primary"
                        : "bg-white border-border hover:border-primary/40 text-foreground"
                    }`}
                  >
                    {type.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center gap-4 pt-6">
              <Link
                href="/discover"
                className="px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Explore Schools
              </Link>
              <Link
                href="/journey"
                className="px-8 py-3 bg-secondary/10 text-secondary rounded-lg font-semibold border border-secondary/20 hover:bg-secondary/15 transition-all duration-200"
              >
                Start Journey
              </Link>
            </div>
          </div>

          {/* Right side - Clean image showcase */}
          <div className="relative">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl overflow-hidden h-64 bg-secondary shadow-lg">
                  <img
                    src="/happy-diverse-children-learning-in-bright-classroo.jpg"
                    alt="Children learning"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden h-64 bg-primary/10 p-6 flex flex-col justify-end border border-primary/10">
                  <div className="text-4xl font-bold text-primary mb-2">1,200+</div>
                  <div className="text-sm text-muted-foreground font-medium">Schools listed</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl overflow-hidden h-64 bg-accent/10 p-6 flex flex-col justify-end border border-accent/10">
                  <div className="text-4xl font-bold text-accent mb-2">98%</div>
                  <div className="text-sm text-muted-foreground font-medium">Happy parents</div>
                </div>
                <div className="rounded-2xl overflow-hidden h-64 bg-secondary shadow-lg">
                  <img
                    src="/children-playing-outdoor-school-garden-nature.jpg"
                    alt="Children playing"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
            <Link
              href="/discover"
              className="absolute -bottom-6 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 px-6 py-4 bg-foreground text-background rounded-full font-medium shadow-lg hover:gap-4 transition-all duration-300 group"
            >
              Start your search
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
