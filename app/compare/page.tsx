"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { ArrowLeft, BookOpen, Search, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { fetchSchoolsFromStrapiOnly } from "@/lib/strapi"

export default function ComparePage() {
  const [schools, setSchools] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSchools, setSelectedSchools] = useState<any[]>([])
  const [filteredSchools, setFilteredSchools] = useState<any[]>([])

  useEffect(() => {
    async function loadSchools() {
      try {
        const data = await fetchSchoolsFromStrapiOnly()
        setSchools(data)
        setFilteredSchools(data)
        if (data.length === 0) {
          setError(true)
        }
      } catch (err) {
        console.error("Error loading schools:", err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    loadSchools()
  }, [])

  useEffect(() => {
    const filtered = schools.filter(
      (school) =>
        school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.city.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredSchools(filtered)
  }, [searchTerm, schools])

  const toggleSchool = (school: any) => {
    if (selectedSchools.find((s) => s.id === school.id)) {
      setSelectedSchools(selectedSchools.filter((s) => s.id !== school.id))
    } else {
      if (selectedSchools.length < 2) {
        setSelectedSchools([...selectedSchools, school])
      }
    }
  }

  const isSelected = (schoolId: string | number) => {
    return selectedSchools.some((s) => s.id === schoolId)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center">
          <Link href="/" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 lg:py-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-secondary text-primary mb-4">
            <BookOpen className="h-8 w-8" />
          </div>
          <h1 className="font-serif text-4xl lg:text-5xl mb-3">Compare Schools</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Select up to 2 schools to compare their features, fees, curriculum, and facilities side-by-side.
          </p>
        </div>
      </section>

      {/* Search Section */}
      <section className="px-6 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="relative mb-6">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search schools by name or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 py-6 text-base"
            />
          </div>

          {/* Schools Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {loading ? (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">Loading schools from Strapi...</p>
              </div>
            ) : error ? (
              <div className="col-span-full text-center py-12 bg-red-50/50 rounded-lg p-6">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Strapi Connection Error</h3>
                <p className="text-muted-foreground mb-4">
                  Unable to connect to Strapi. Please ensure the Strapi server is running on http://localhost:1337
                </p>
                <div className="text-sm text-left bg-muted p-4 rounded font-mono">
                  <p>To start Strapi:</p>
                  <p>cd ../school-cms && npm run develop</p>
                </div>
              </div>
            ) : filteredSchools.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">No schools found in Strapi. Try adjusting your search or add schools to your CMS.</p>
              </div>
            ) : (
              filteredSchools.map((school) => (
                <div
                  key={school.id}
                  onClick={() => toggleSchool(school)}
                  className={`cursor-pointer rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
                    isSelected(school.id)
                      ? "border-primary bg-primary/5 shadow-lg shadow-primary/20"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="aspect-video overflow-hidden bg-muted relative">
                    <img
                      src={school.image}
                      alt={school.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.svg"
                      }}
                    />
                    {isSelected(school.id) && (
                      <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                          <span className="text-primary-foreground font-bold">✓</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-1 line-clamp-2">{school.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{school.city}</p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs bg-secondary/50 px-2 py-1 rounded">
                        {school.curriculum || school.type}
                      </span>
                      <span className="text-sm font-medium">⭐ {school.rating}</span>
                    </div>
                    <p className="text-xs text-muted-foreground font-medium">
                      {selectedSchools.length < 2 || isSelected(school.id)
                        ? "Click to select"
                        : "Max 2 schools"}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      {selectedSchools.length > 0 && (
        <section className="px-6 py-12 bg-secondary/5 border-t">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-serif text-3xl">
                Comparing {selectedSchools.length} School{selectedSchools.length > 1 ? "s" : ""}
              </h2>
              <Button
                variant="outline"
                onClick={() => setSelectedSchools([])}
              >
                Clear Selection
              </Button>
            </div>

            {/* Comparison Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-semibold">Feature</th>
                    {selectedSchools.map((school) => (
                      <th key={school.id} className="text-left p-4 font-semibold">
                        {school.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b hover:bg-secondary/30">
                    <td className="p-4 font-medium">City</td>
                    {selectedSchools.map((school) => (
                      <td key={school.id} className="p-4">
                        {school.city}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b hover:bg-secondary/30">
                    <td className="p-4 font-medium">Location</td>
                    {selectedSchools.map((school) => (
                      <td key={school.id} className="p-4">
                        {school.location}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b hover:bg-secondary/30">
                    <td className="Range || school.fee_range-4 font-medium">Curriculum</td>
                    {selectedSchools.map((school) => (
                      <td key={school.id} className="p-4">
                        <span className="bg-secondary/50 px-2 py-1 rounded text-sm">
                          {school.curriculum}
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b hover:bg-secondary/30">
                    <td className="p-4 font-medium">Annual Fees</td>
                    {selectedSchools.map((school) => (
                      <td key={school.id} className="p-4 font-semibold text-primary">
                        {school.fees}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b hover:bg-secondary/30">
                    <td className="p-4 font-medium">Rating</td>
                    {selectedSchools.map((school) => (
                      <td key={school.id} className="p-4">
                        <span className="text-lg">⭐ {school.rating}</span>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b hover:bg-secondary/30">
                    <td className="p-4 font-medium">Facilities</td>
                    {selectedSchools.map((school) => (
                      <td key={school.id} className="p-4">
                        <ul className="space-y-1">
                          {(school.facilities || []).map((facility: string) => (
                            <li key={facility} className="text-sm">
                              ✓ {facility}
                            </li>
                          ))}
                        </ul>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-center mt-8 flex-wrap">
              {selectedSchools.map((school) => (
                <Button key={school.id} asChild variant="default">
                  <Link href={`/schools/${school.slug}`}>
                    View {school.name}
                  </Link>
                </Button>
              ))}
              <Button asChild variant="outline">
                <Link href="/counselor-connect">
                  Get Counselor Guidance
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* No Selection Message */}
      {selectedSchools.length === 0 && (
        <section className="py-16 px-6 text-center">
          <div className="max-w-2xl mx-auto">
            <p className="text-lg text-muted-foreground mb-8">
              Select 2 schools from above to see a detailed comparison
            </p>
          </div>
        </section>
      )}
    </div>
  )
}

