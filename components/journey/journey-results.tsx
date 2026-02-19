"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Sparkles, MapPin, Users, Heart, ArrowRight, RefreshCw, Calendar, DollarSign, Award } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface JourneyResultsProps {
  answers: Record<string, string | string[]>
}

const mockSchools = [
  {
    id: "1",
    name: "Evergreen Montessori Academy",
    image: "/montessori-school-children-outdoor-learning-garden.jpg",
    location: "Pacific Heights",
    rating: 4.9,
    reviews: 127,
    students: "180",
    match: 98,
    tags: ["Montessori", "Nature-based", "Small class sizes"],
    highlight: "Best overall match",
    fees: "$15,000 - $18,000",
    grades: "Pre-K - Grade 8",
    type: "Private",
    website: "https://evergreen-montessori.edu",
  },
  {
    id: "2",
    name: "The Innovation School",
    image: "/modern-school-stem-lab-children-building-robots.jpg",
    location: "SoMa",
    rating: 4.8,
    reviews: 89,
    students: "320",
    match: 94,
    tags: ["STEM focus", "Project-based", "Tech-forward"],
    highlight: "Great for curious minds",
    fees: "$22,000 - $25,000",
    grades: "Kindergarten - Grade 12",
    type: "Private",
    website: "https://innovationschool.edu",
  },
  {
    id: "3",
    name: "Redwood Forest School",
    image: "/children-outdoor-forest-school-nature-exploration.jpg",
    location: "Mill Valley",
    rating: 4.9,
    reviews: 64,
    students: "95",
    match: 91,
    tags: ["Outdoor education", "Waldorf-inspired", "Arts"],
    highlight: "Nature immersion",
    fees: "$18,000 - $21,000",
    grades: "Pre-K - Grade 6",
    type: "Private",
    website: "https://redwoodforest.edu",
  },
]

export function JourneyResults({ answers }: JourneyResultsProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [savedSchools, setSavedSchools] = useState<string[]>([])

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  // Enhanced matching logic based on answers
  const getMatchedSchools = () => {
    const schools = [...mockSchools]
    
    // Sort based on user preferences
    if (answers.priorities) {
      const priorities = Array.isArray(answers.priorities) ? answers.priorities : [answers.priorities]
      
      schools.forEach(school => {
        let score = school.match
        
        // Boost scores based on priorities
        if (priorities.includes('academics') && school.tags.some(tag => tag.includes('STEM') || tag.includes('Montessori'))) {
          score += 5
        }
        if (priorities.includes('arts') && school.tags.some(tag => tag.includes('Arts') || tag.includes('Creative'))) {
          score += 5
        }
        if (priorities.includes('nature') && school.tags.some(tag => tag.includes('Nature') || tag.includes('Outdoor'))) {
          score += 5
        }
        if (priorities.includes('tech') && school.tags.some(tag => tag.includes('STEM') || tag.includes('Tech'))) {
          score += 5
        }
        
        school.match = Math.min(score, 100)
      })
    }
    
    // Sort by match percentage
    return schools.sort((a, b) => b.match - a.match)
  }

  const matchedSchools = getMatchedSchools()

  const toggleSave = (schoolId: string) => {
    setSavedSchools((prev) => (prev.includes(schoolId) ? prev.filter((id) => id !== schoolId) : [...prev, schoolId]))
    
    // Save to localStorage for persistence
    const saved = savedSchools.includes(schoolId) 
      ? savedSchools.filter((id) => id !== schoolId)
      : [...savedSchools, schoolId]
    localStorage.setItem('savedSchools', JSON.stringify(saved))
  }

  useEffect(() => {
    const saved = localStorage.getItem('savedSchools')
    if (saved) {
      setSavedSchools(JSON.parse(saved))
    }
  }, [])

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
          <p className="text-muted-foreground">Analyzing your preferences...</p>
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
            <span>{matchedSchools.length} schools matched</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-medium tracking-tight mb-4">Your personalized matches</h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Based on your preferences, these schools align best with what you{"'"}re looking for.
          </p>
        </motion.div>

        {/* School cards */}
        <div className="space-y-8 mb-16">
          {matchedSchools.map((school, i) => (
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
                  <Image
                    src={school.image || "/placeholder.svg"}
                    alt={school.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-card" />

                  {/* Match badge */}
                  <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground rounded-full text-sm font-medium">
                    <span>{school.match}% match</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8 flex flex-col">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <p className="text-sm text-accent font-medium mb-1">{school.highlight}</p>
                      <h3 className="font-serif text-2xl md:text-3xl font-medium">{school.name}</h3>
                    </div>
                    <button
                      onClick={() => toggleSave(school.id)}
                      className={`p-3 rounded-xl border transition-all duration-300 ${
                        savedSchools.includes(school.id)
                          ? "bg-primary/10 border-primary/30 text-primary"
                          : "bg-secondary/50 border-border hover:border-primary/30"
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${savedSchools.includes(school.id) ? "fill-current" : ""}`} />
                    </button>
                  </div>

                  {/* Meta */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      {school.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users className="w-4 h-4" />
                      {school.students} students
                    </span>
                  </div>

                  {/* Additional Info */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Fees:</span>
                      <span className="font-medium">{school.fees}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Grades:</span>
                      <span className="font-medium">{school.grades}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Award className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Type:</span>
                      <span className="font-medium">{school.type}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {school.tags.map((tag) => (
                      <span key={tag} className="px-3 py-1 bg-secondary/50 rounded-full text-xs font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 mt-auto">
                    <Link
                      href={`/school/${school.id}`}
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
                    <a
                      href={school.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 bg-accent/10 border border-accent/30 rounded-xl font-medium hover:bg-accent/20 transition-colors"
                    >
                      Website
                    </a>
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
              You've saved {savedSchools.length} school{savedSchools.length > 1 ? 's' : ''}. 
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
