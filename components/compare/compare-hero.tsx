"use client"

import { useState } from "react"
import { Search, X, Plus } from "lucide-react"

const suggestedSchools = [
  { id: 1, name: "The Heritage School", location: "Gurgaon", type: "International" },
  { id: 2, name: "Greenwood Montessori", location: "Bangalore", type: "Montessori" },
  { id: 3, name: "Cambridge International", location: "Mumbai", type: "IB World" },
  { id: 4, name: "Sunrise Public School", location: "Delhi NCR", type: "CBSE" },
  { id: 5, name: "Vidya Valley International", location: "Pune", type: "ICSE" },
]

export function CompareHero() {
  const [selectedSchools, setSelectedSchools] = useState<number[]>([1, 2])
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const filteredSchools = suggestedSchools.filter(
    (school) =>
      !selectedSchools.includes(school.id) &&
      (school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        school.location.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const addSchool = (id: number) => {
    if (selectedSchools.length < 4) {
      setSelectedSchools([...selectedSchools, id])
      setSearchQuery("")
      setIsSearchOpen(false)
    }
  }

  const removeSchool = (id: number) => {
    setSelectedSchools(selectedSchools.filter((s) => s !== id))
  }

  return (
    <section className="pt-24 lg:pt-32 pb-8 lg:pb-12 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-sm font-medium text-primary uppercase tracking-wider">Side by Side</span>
          <h1 className="font-serif text-3xl lg:text-4xl xl:text-5xl mt-2">Compare Schools</h1>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            Add up to 4 schools to compare their features, facilities, and what makes each one unique.
          </p>
        </div>

        {/* Selected schools */}
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {selectedSchools.map((schoolId) => {
            const school = suggestedSchools.find((s) => s.id === schoolId)
            return school ? (
              <div
                key={school.id}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-full"
              >
                <span className="font-medium">{school.name}</span>
                <button
                  onClick={() => removeSchool(school.id)}
                  className="p-0.5 hover:bg-primary-foreground/20 rounded-full"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : null
          })}

          {selectedSchools.length < 4 && (
            <div className="relative">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="inline-flex items-center gap-2 px-4 py-2 border-2 border-dashed border-border rounded-full text-muted-foreground hover:border-primary hover:text-primary transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add school
              </button>

              {isSearchOpen && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-card rounded-xl border border-border shadow-lg z-50">
                  <div className="p-3 border-b border-border">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Search schools..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-secondary rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                        autoFocus
                      />
                    </div>
                  </div>
                  <div className="max-h-64 overflow-y-auto p-2">
                    {filteredSchools.map((school) => (
                      <button
                        key={school.id}
                        onClick={() => addSchool(school.id)}
                        className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-secondary text-left transition-colors"
                      >
                        <div>
                          <p className="font-medium">{school.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {school.location} · {school.type}
                          </p>
                        </div>
                        <Plus className="h-4 w-4 text-muted-foreground" />
                      </button>
                    ))}
                    {filteredSchools.length === 0 && (
                      <p className="text-center text-muted-foreground py-4 text-sm">No schools found</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {selectedSchools.length < 2 && (
          <p className="text-center text-muted-foreground text-sm">Select at least 2 schools to compare</p>
        )}
      </div>
    </section>
  )
}
