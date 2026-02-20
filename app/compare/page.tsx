"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { ArrowLeft, BookOpen, Search, AlertCircle, X, ExternalLink, ChevronDown, ArrowDown, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { saveSchoolComparison } from "@/lib/firebase-data"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"

export default function ComparePage() {
  const [schools, setSchools] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSchools, setSelectedSchools] = useState<any[]>([])
  const [filteredSchools, setFilteredSchools] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const [saveMessage, setSaveMessage] = useState("")
  const comparisonRef = useRef<HTMLDivElement>(null)

  const scrollToComparison = () => {
    comparisonRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // Load user on mount
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })

    return () => unsubscribeAuth()
  }, [])

  const handleSaveComparison = async () => {
    if (!user) {
      setSaveMessage("Please log in to save comparisons")
      setTimeout(() => setSaveMessage(""), 3000)
      return
    }

    if (selectedSchools.length === 0) {
      setSaveMessage("Please select schools to compare")
      setTimeout(() => setSaveMessage(""), 3000)
      return
    }

    try {
      await saveSchoolComparison({
        schoolIds: selectedSchools.map(s => s.id),
        schoolNames: selectedSchools.map(s => s.name),
      })
      setSaveMessage("✅ Comparison saved successfully!")
      setTimeout(() => setSaveMessage(""), 3000)
    } catch (error) {
      setSaveMessage("❌ Error saving comparison. Please try again.")
      console.error("Save error:", error)
      setTimeout(() => setSaveMessage(""), 3000)
    }
  }

  // Helper function to get school image URL
  const getSchoolImageUrl = (school: any): string => {
    // If we have an image URL, use it (API should return full URLs)
    if (school.image) {
      return school.image
    }
    
    // Fallback to placeholder
    return '/placeholder.jpg'
  }

  useEffect(() => {
    async function loadSchools() {
      try {
        // Use the same API endpoint as discover/featured components
        const response = await fetch('/api/top-schools')
        if (!response.ok) throw new Error('Failed to fetch schools')
        
        const json = await response.json()
        const data = json.data || []
        
        console.log('Loaded schools from API:', data.length)
        if (data.length > 0) {
          console.log('Sample school data:', {
            name: data[0].name,
            image: data[0].image,
            hasImage: !!data[0].image,
            imageLength: data[0].image?.length
          })
        }
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
        const newSelection = [...selectedSchools, school]
        setSelectedSchools(newSelection)
        // Auto-scroll to comparison when second school is selected
        if (newSelection.length === 2) {
          setTimeout(() => scrollToComparison(), 300)
        }
      }
    }
  }

  const removeSchool = (schoolId: string | number) => {
    setSelectedSchools(selectedSchools.filter((s) => s.id !== schoolId))
  }

  const isSelected = (schoolId: string | number) => {
    return selectedSchools.some((s) => s.id === schoolId)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10" style={{ paddingBottom: selectedSchools.length > 0 ? '100px' : '0' }}>
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
          {/* Selection Counter */}
          {selectedSchools.length > 0 && (
            <div className="mb-4 p-4 bg-gradient-to-r from-primary/5 to-primary/10 border-2 border-primary/20 rounded-xl shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3 flex-wrap flex-1">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg shadow-md">
                    {selectedSchools.length}
                  </div>
                  <span className="font-semibold text-primary text-lg">
                    {selectedSchools.length === 1 ? "1 school selected" : "2 schools selected"}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {selectedSchools.map((school) => (
                    <span key={school.id} className="inline-flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full text-sm border-2 border-primary/20 font-medium shadow-sm">
                      {school.name.split(' ').slice(0, 3).join(' ')}
                      <button
                        onClick={() => removeSchool(school.id)}
                        className="hover:text-red-600 transition-colors hover:scale-110"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {selectedSchools.length === 2 && (
                  <Button
                    onClick={scrollToComparison}
                    variant="default"
                    size="sm"
                    className="gap-2 shadow-md"
                  >
                    View Comparison
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedSchools([])}
                  className="text-muted-foreground hover:text-red-600"
                >
                  Clear All
                </Button>
              </div>
            </div>
          )}

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
                <p className="text-muted-foreground">Loading schools...</p>
              </div>
            ) : error ? (
              <div className="col-span-full text-center py-12 bg-red-50/50 rounded-lg p-6">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Unable to Load Schools</h3>
                <p className="text-muted-foreground mb-4">
                  There was an error loading school data. Please check your database connection.
                </p>
                <div className="text-sm text-muted-foreground">
                  <p>Ensure Supabase credentials are configured in environment variables.</p>
                </div>
              </div>
            ) : filteredSchools.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">No schools found matching your search.</p>
              </div>
            ) : (
              filteredSchools.map((school) => (
                <div
                  key={school.id}
                  onClick={() => toggleSchool(school)}
                  className={`cursor-pointer rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
                    isSelected(school.id)
                      ? "border-primary bg-primary/5 shadow-lg shadow-primary/20 ring-2 ring-primary/20"
                      : selectedSchools.length >= 2
                      ? "border-border opacity-50 cursor-not-allowed"
                      : "border-border hover:border-primary/50 hover:shadow-md"
                  }`}
                >
                  <div className="aspect-video overflow-hidden bg-muted relative">
                    <img
                      src={getSchoolImageUrl(school)}
                      alt={school.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        if (target.src !== '/placeholder.jpg') {
                          console.error(`Failed to load image for ${school.name}:`, target.src)
                          target.src = '/placeholder.jpg'
                        }
                      }}
                    />
                    {isSelected(school.id) && (
                      <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg">
                          <span className="text-primary-foreground font-bold text-lg">✓</span>
                        </div>
                      </div>
                    )}
                    {selectedSchools.length >= 2 && !isSelected(school.id) && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="text-white text-sm font-medium bg-black/60 px-3 py-1 rounded-full">
                          Max 2 schools
                        </span>
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
                      {isSelected(school.id) && (
                        <span className="text-xs font-medium text-primary">Selected</span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground font-medium">
                      {isSelected(school.id)
                        ? "Click to deselect"
                        : selectedSchools.length < 2
                        ? "Click to select"
                        : "Maximum reached"}
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
        <section ref={comparisonRef} className="px-6 py-12 bg-secondary/5 border-t scroll-mt-20">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-serif text-3xl">
                Comparing {selectedSchools.length} School{selectedSchools.length > 1 ? "s" : ""}
              </h2>
              <Button
                variant="outline"
                onClick={() => setSelectedSchools([])}
              >
                Clear All
              </Button>
            </div>

            {selectedSchools.length === 1 && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  💡 Select one more school to see a side-by-side comparison
                </p>
              </div>
            )}

            {/* Comparison Table */}
            <div className="overflow-x-auto bg-white rounded-2xl border shadow-sm">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-secondary/30">
                    <th className="text-left p-4 font-semibold w-48">Feature</th>
                    {selectedSchools.map((school) => (
                      <th key={school.id} className="text-left p-4 font-semibold">
                        <div className="space-y-3">
                          {/* School Image */}
                          <div className="aspect-video w-full rounded-lg overflow-hidden bg-muted">
                            <img
                              src={getSchoolImageUrl(school)}
                              alt={school.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                if (target.src !== '/placeholder.jpg') {
                                  target.src = '/placeholder.jpg'
                                }
                              }}
                            />
                          </div>
                          {/* School Name and Remove Button */}
                          <div className="flex items-start justify-between gap-2">
                            <span className="line-clamp-2 flex-1">{school.name}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeSchool(school.id)}
                              className="h-6 w-6 p-0 hover:bg-red-50 hover:text-red-600 flex-shrink-0"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b hover:bg-secondary/20 transition-colors">
                    <td className="p-4 font-medium bg-secondary/10">City</td>
                    {selectedSchools.map((school) => (
                      <td key={school.id} className="p-4">
                        {school.city || "Not specified"}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b hover:bg-secondary/20 transition-colors">
                    <td className="p-4 font-medium bg-secondary/10">Location</td>
                    {selectedSchools.map((school) => (
                      <td key={school.id} className="p-4">
                        {school.location || "Not specified"}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b hover:bg-secondary/20 transition-colors">
                    <td className="p-4 font-medium bg-secondary/10">Curriculum</td>
                    {selectedSchools.map((school) => (
                      <td key={school.id} className="p-4">
                        <span className="bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium">
                          {school.curriculum || school.type || "Not specified"}
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b hover:bg-secondary/20 transition-colors">
                    <td className="p-4 font-medium bg-secondary/10">Annual Fees</td>
                    {selectedSchools.map((school) => (
                      <td key={school.id} className="p-4">
                        <span className="text-lg font-semibold text-primary">
                          {school.feeRange || school.fee_range || "Contact school"}
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b hover:bg-secondary/20 transition-colors">
                    <td className="p-4 font-medium bg-secondary/10">Grades Offered</td>
                    {selectedSchools.map((school) => (
                      <td key={school.id} className="p-4">
                        {school.grades || school.grade_levels || "Not specified"}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b hover:bg-secondary/20 transition-colors">
                    <td className="p-4 font-medium bg-secondary/10">Established</td>
                    {selectedSchools.map((school) => (
                      <td key={school.id} className="p-4">
                        {school.established || school.year_established || "Not specified"}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b hover:bg-secondary/20 transition-colors">
                    <td className="p-4 font-medium bg-secondary/10">Facilities</td>
                    {selectedSchools.map((school) => (
                      <td key={school.id} className="p-4">
                        <ul className="space-y-1.5">
                          {(school.facilities || []).slice(0, 5).map((facility: string) => (
                            <li key={facility} className="text-sm flex items-center gap-2">
                              <span className="text-green-500">✓</span>
                              {facility}
                            </li>
                          ))}
                          {(!school.facilities || school.facilities.length === 0) && (
                            <li className="text-sm text-muted-foreground">Not specified</li>
                          )}
                        </ul>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 space-y-4">
              {saveMessage && (
                <div className={`p-4 rounded-lg flex items-center gap-2 ${
                  saveMessage.includes('✅') 
                    ? 'bg-green-50 text-green-800 border border-green-200' 
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm">{saveMessage}</span>
                </div>
              )}
              <div className="flex gap-3 justify-center flex-wrap">
                <Button 
                  onClick={handleSaveComparison}
                  disabled={!user || selectedSchools.length === 0}
                  variant="default"
                  size="lg"
                  className="gap-2"
                  title={user ? "Save comparison to your profile" : "Login to save"}
                >
                  <Save className="h-4 w-4" />
                  Save Comparison
                </Button>
                {selectedSchools.map((school) => (
                  <Button key={school.id} asChild variant="default" size="lg">
                    <Link href={`/schools/${school.slug}`} className="gap-2">
                      View {school.name.split(' ').slice(0, 2).join(' ')}
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </Button>
                ))}
              </div>
              <div className="flex gap-3 justify-center flex-wrap">
                <Button asChild variant="outline" size="lg">
                  <Link href="/counselor-connect">
                    Get Expert Counselor Guidance
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/common-application">
                    Apply to Schools
                  </Link>
                </Button>
                <Button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  variant="outline"
                  size="lg"
                  className="gap-2"
                >
                  Back to Top
                  <ChevronDown className="h-4 w-4 rotate-180" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* No Selection Message */}
      {selectedSchools.length === 0 && !loading && (
        <section className="py-16 px-6 text-center bg-gradient-to-b from-secondary/5 to-transparent">
          <div className="max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
              <BookOpen className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-2xl font-serif mb-3">Start Comparing Schools</h3>
            <p className="text-lg text-muted-foreground mb-6">
              Select up to 2 schools from the list above to see a detailed side-by-side comparison of features, fees, curriculum, and facilities.
            </p>
            <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">1</div>
                <span>Select first school</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">2</div>
                <span>Select second school</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">3</div>
                <span>Compare details</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Sticky Floating Comparison Bar */}
      {selectedSchools.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-2xl border-t-4 border-primary/20 animate-in slide-in-from-bottom duration-300">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              {/* Selected Schools Display */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">
                    {selectedSchools.length}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">
                      {selectedSchools.length === 1 ? "1 school selected" : "Ready to compare"}
                    </p>
                    <p className="text-xs text-primary-foreground/80">
                      {selectedSchools.length === 1
                        ? "Select 1 more to compare"
                        : selectedSchools.map(s => s.name.split(' ').slice(0, 2).join(' ')).join(" vs ")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                {selectedSchools.length === 2 && (
                  <Button
                    onClick={scrollToComparison}
                    variant="secondary"
                    size="lg"
                    className="gap-2 bg-white text-primary hover:bg-white/90 font-semibold shadow-lg"
                  >
                    View Comparison
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  onClick={() => setSelectedSchools([])}
                  variant="ghost"
                  size="lg"
                  className="gap-2 text-primary-foreground hover:bg-white/10"
                >
                  <X className="h-4 w-4" />
                  Clear
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

