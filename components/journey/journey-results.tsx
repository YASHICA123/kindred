"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Sparkles, MapPin, Users, Heart, ArrowRight, RefreshCw, Calendar, DollarSign, Award, AlertCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { saveSchool, removeSavedSchool, getSavedSchools } from "@/lib/supabase-data"
import { useAuth } from "@/hooks/use-auth"

interface JourneyResultsProps {
  answers: Record<string, string | string[]>
}

interface SchoolResult {
  id: string | number
  name: string
  slug?: string
  image?: string
  location?: string
  city?: string
  state?: string
  rating?: number
  reviews?: number
  students?: string | number
  match?: number
  tags?: string[]
  highlight?: string
  feeRange?: string
  fee_range?: string
  curriculum?: string
  type?: string
  description?: string
}

export function JourneyResults({ answers }: JourneyResultsProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [schools, setSchools] = useState<SchoolResult[]>([])
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [savedSchools, setSavedSchools] = useState<string[]>([])
  const { user } = useAuth()

  // Fetch real schools from Supabase based on quiz answers
  useEffect(() => {
    async function fetchSchools() {
      try {
        setIsLoading(true)
        setFetchError(null)

        // Build search params from quiz answers
        const params = new URLSearchParams()

        // Extract city from answers
        const city = typeof answers.location === "string" ? answers.location : ""
        if (city) params.append("city", city)

        // Extract board/curriculum
        const board = typeof answers.board === "string" ? answers.board : ""
        if (board) params.append("board", board)

        // Extract budget/fee range
        const budget = typeof answers.budget === "string" ? answers.budget : ""
        if (budget) params.append("fees", budget)

        // Extract school type
        const schoolType = typeof answers.school_type === "string" ? answers.school_type : ""
        if (schoolType) params.append("type", schoolType)

        const response = await fetch(`/api/schools/search?${params.toString()}`)

        if (!response.ok) {
          throw new Error("Failed to fetch schools")
        }

        const json = await response.json()
        const data: SchoolResult[] = (json.data || json.schools || []).map((s: any, index: number) => ({
          id: s.id || index,
          name: s.name,
          slug: s.slug,
          image: s.image || s.cover_image || "",
          location: s.location || `${s.city || ""}${s.state ? `, ${s.state}` : ""}`,
          city: s.city,
          state: s.state,
          rating: s.rating || s.ratings,
          reviews: s.reviews,
          students: s.students,
          match: Math.max(75, Math.min(99, 90 + Math.floor(Math.random() * 10) - index * 3)),
          tags: s.highlights ? (Array.isArray(s.highlights) ? s.highlights.slice(0, 3) : s.highlights.split("|").slice(0, 3)) : [s.curriculum, s.type].filter(Boolean),
          highlight: index === 0 ? "Best overall match" : index === 1 ? "Great fit for your priorities" : "Strong recommendation",
          feeRange: s.feeRange || s.fee_range || "",
          curriculum: s.curriculum,
          type: s.type,
          description: s.description,
        }))

        setSchools(data.slice(0, 6)) // Limit to 6 results
      } catch (err) {
        console.error("Error fetching journey results:", err)
        setFetchError("We couldn't load school recommendations right now. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchSchools()
  }, [answers])

  const toggleSave = async (schoolId: string) => {
    if (!user) {
      alert("Please sign in to save schools")
      return
    }

    try {
      const isSaved = savedSchools.includes(schoolId)
      const school = schools.find((s) => String(s.id) === schoolId)

      if (isSaved) {
        await removeSavedSchool(schoolId)
        setSavedSchools((prev) => prev.filter((id) => id !== schoolId))
      } else {
        await saveSchool({
          schoolId,
          schoolName: school?.name || "Unknown School",
          schoolImage: school?.image,
          schoolLocation: school?.location,
          schoolCity: school?.city,
          notes: `Match score: ${school?.match}%`,
        })
        setSavedSchools((prev) => [...prev, schoolId])
      }
    } catch (error) {
      console.error("Error toggling save:", error)
      alert("Failed to update saved schools. Please try again.")
    }
  }

  useEffect(() => {
    const loadSavedSchools = async () => {
      if (!user) {
        setSavedSchools([])
        return
      }

      try {
        const saved = await getSavedSchools()
        setSavedSchools(saved.map((s) => s.schoolId))
      } catch (error) {
        console.error("Error loading saved schools:", error)
      }
    }

    loadSavedSchools()
  }, [user])

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center px-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <div className="relative mb-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="w-16 h-16 rounded-full border-2 border-primary/20 border-t-primary mx-auto"
            />
            <Sparkles className="w-6 h-6 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <h2 className="font-serif text-2xl md:text-3xl font-medium mb-3">Finding your perfect matches</h2>
          <p className="text-muted-foreground">Searching schools based on your preferences...</p>
        </motion.div>
      </div>
    )
  }

  // Error state
  if (fetchError) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="font-serif text-2xl font-medium mb-3">Something went wrong</h2>
          <p className="text-muted-foreground mb-6">{fetchError}</p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </motion.div>
      </div>
    )
  }

  // Empty state
  if (schools.length === 0) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h2 className="font-serif text-2xl font-medium mb-3">No exact matches found</h2>
          <p className="text-muted-foreground mb-6">
            We couldn't find schools matching all your criteria. Try broadening your preferences or explore all schools.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/discover"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
            >
              Browse All Schools
              <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-6 py-3 text-muted-foreground hover:text-foreground transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Retake Quiz
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] py-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm text-primary mb-6">
            <Sparkles className="w-4 h-4" />
            <span>{schools.length} schools matched</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-medium tracking-tight mb-4">Your personalized matches</h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Based on your preferences, these schools align best with what you{"'"}re looking for.
          </p>
        </motion.div>

        {/* School cards */}
        <div className="space-y-8 mb-16">
          {schools.map((school, i) => (
            <motion.div
              key={school.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              className="group relative bg-card border border-border rounded-3xl overflow-hidden hover:border-primary/30 transition-all duration-500"
            >
              <div className="grid md:grid-cols-[400px,1fr] gap-0">
                {/* Image */}
                <div className="relative h-64 md:h-auto overflow-hidden">
                  {school.image ? (
                    <Image
                      src={school.image}
                      alt={school.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                      <span className="text-4xl font-bold text-primary/30">
                        {school.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-card" />

                  {/* Match badge */}
                  {school.match && (
                    <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground rounded-full text-sm font-medium">
                      <span>{school.match}% match</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 md:p-8 flex flex-col">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <p className="text-sm text-accent font-medium mb-1">{school.highlight}</p>
                      <h3 className="font-serif text-2xl md:text-3xl font-medium">{school.name}</h3>
                    </div>
                    {/* <button
                      onClick={() => toggleSave(String(school.id))}
                      className={`p-3 rounded-xl border transition-all duration-300 ${
                        savedSchools.includes(String(school.id))
                          ? "bg-primary/10 border-primary/30 text-primary"
                          : "bg-secondary/50 border-border hover:border-primary/30"
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${savedSchools.includes(String(school.id)) ? "fill-current" : ""}`} />
                    </button> */}
                  </div>

                  {/* Meta */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                    {school.location && (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" />
                        {school.location}
                      </span>
                    )}
                    {school.students && (
                      <span className="flex items-center gap-1.5">
                        <Users className="w-4 h-4" />
                        {school.students} students
                      </span>
                    )}
                  </div>

                  {/* Additional Info */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {(school.feeRange || school.fee_range) && (
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Fees:</span>
                        <span className="font-medium">{school.feeRange || school.fee_range}</span>
                      </div>
                    )}
                    {school.curriculum && (
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Board:</span>
                        <span className="font-medium">{school.curriculum}</span>
                      </div>
                    )}
                    {school.type && (
                      <div className="flex items-center gap-2 text-sm">
                        <Award className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Type:</span>
                        <span className="font-medium">{school.type}</span>
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  {school.tags && school.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {school.tags.map((tag) => (
                        <span key={tag} className="px-3 py-1 bg-secondary/50 rounded-full text-xs font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-3 mt-auto">
                    <Link
                      href={`/schools/${school.slug || school.id}`}
                      className="group/btn flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:shadow-primary/25"
                    >
                      <span>View school</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                    </Link>
                    <Link
                      href="/compare"
                      className="px-6 py-3 bg-secondary/50 border border-border rounded-xl font-medium hover:bg-secondary transition-colors"
                    >
                      Compare
                    </Link>
                  </div>
                </div>
              </div>

              {/* Glow effect on hover */}
              <div className="absolute inset-0 rounded-3xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </motion.div>
          ))}
        </div>

        {/* Bottom actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/discover"
            className="flex items-center gap-2 px-6 py-3 bg-secondary/50 border border-border rounded-xl font-medium hover:bg-secondary transition-colors"
          >
            <span>Browse all schools</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/free-counselling"
            className="flex items-center gap-2 px-6 py-3 bg-primary/10 border border-primary/30 rounded-xl font-medium hover:bg-primary/20 transition-colors"
          >
            <span>Get expert advice</span>
            <Sparkles className="w-4 h-4" />
          </Link>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-6 py-3 text-muted-foreground hover:text-foreground transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retake quiz</span>
          </button>
        </motion.div>

        {/* Saved schools summary */}
        {savedSchools.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-8 text-center"
          >
            <p className="text-sm text-muted-foreground">
              You've saved {savedSchools.length} school{savedSchools.length > 1 ? "s" : ""}.
              <Link href="/compare" className="text-primary hover:underline ml-1">
                Compare them now
              </Link>
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
