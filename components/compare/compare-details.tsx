"use client"

import { useState } from "react"
import { Check, X, Minus, ChevronDown } from "lucide-react"

type ComparisonValue = boolean | string | undefined

function CompareValue({ value, note }: { value: ComparisonValue; note?: string }) {
  if (typeof value === "boolean") {
    return (
      <div className="flex flex-col items-center">
        {value ? (
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Check className="h-5 w-5 text-primary" />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
            <X className="h-5 w-5 text-muted-foreground" />
          </div>
        )}
        {note && <span className="text-xs text-muted-foreground mt-1">{note}</span>}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center">
      <span className="font-medium">{value || <Minus className="h-4 w-4 text-muted-foreground" />}</span>
      {note && <span className="text-xs text-muted-foreground mt-1">{note}</span>}
    </div>
  )
}

export function CompareDetails({ schools }: { schools?: any[] }) {
  const [expandedSections, setExpandedSections] = useState<string[]>(["overview"])

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => (prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]))
  }

  const schoolNames = (schools || []).map((s) => s.name || s.Name)

  return (
    <section className="py-12 lg:py-16 bg-secondary/30">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="font-serif text-2xl lg:text-3xl">Detailed Comparison</h2>
          <p className="text-muted-foreground mt-2">See how these schools compare across key areas</p>
        </div>

        {/* Sticky header with school names */}
        <div className="sticky top-20 z-10 bg-background/95 backdrop-blur-sm py-4 mb-6 rounded-xl">
          <div className="grid grid-cols-[1fr_1fr_1fr] gap-4 items-center">
            <div />
            {(schoolNames.length ? schoolNames : ["School A", "School B"]).map((name, index) => (
              <div key={name} className={`text-center ${index === 0 ? "font-medium text-primary" : ""}`}>
                <span className="text-sm lg:text-base">{name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison sections */}
        <div className="space-y-4">
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <button
              onClick={() => toggleSection("overview")}
              className="w-full p-5 flex items-center justify-between hover:bg-secondary/50 transition-colors"
            >
              <h3 className="font-serif text-lg">Overview</h3>
              <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${expandedSections.includes("overview") ? "rotate-180" : ""}`} />
            </button>

            {expandedSections.includes("overview") && (
              <div className="border-t border-border">
                <div className="grid grid-cols-[1fr_1fr_1fr] gap-4 p-4 items-center border-b border-border">
                  <span className="text-sm text-muted-foreground">Location</span>
                  {(schools || []).map((s) => (
                    <div key={s.id} className="flex justify-center">
                      <CompareValue value={s.location || s.city} />
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-[1fr_1fr_1fr] gap-4 p-4 items-center border-b border-border">
                  <span className="text-sm text-muted-foreground">Curriculum</span>
                  {(schools || []).map((s) => (
                    <div key={s.id} className="flex justify-center">
                      <CompareValue value={Array.isArray(s.curriculum) ? s.curriculum.join(", ") : s.curriculum} />
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-[1fr_1fr_1fr] gap-4 p-4 items-center border-b border-border">
                  <span className="text-sm text-muted-foreground">Rating</span>
                  {(schools || []).map((s) => (
                    <div key={s.id} className="flex justify-center">
                      <CompareValue value={s.rating?.toString()} />
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-[1fr_1fr_1fr] gap-4 p-4 items-center border-b border-border">
                  <span className="text-sm text-muted-foreground">Reviews</span>
                  {(schools || []).map((s) => (
                    <div key={s.id} className="flex justify-center">
                      <CompareValue value={s.reviews?.toString()} />
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-[1fr_1fr_1fr] gap-4 p-4 items-center">
                  <span className="text-sm text-muted-foreground">Annual Fee</span>
                  {(schools || []).map((s) => (
                    <div key={s.id} className="flex justify-center">
                      <CompareValue value={s.feeRange || s.fee} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">Need help deciding?</p>
          <button className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors">
            Talk to a Counselor
          </button>
        </div>
      </div>
    </section>
  )
}
