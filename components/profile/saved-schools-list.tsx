"use client"

import { useState, useEffect } from "react"
import { Heart, MapPin, Star, Loader2 } from "lucide-react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { useAuth } from "@/hooks/use-auth"

interface SavedSchool {
  schoolId: string | number
  schoolName: string
  schoolImage: string
  schoolLocation: string
  savedAt: string
}

export function SavedSchoolsList() {
  const { user } = useAuth()
  const [savedSchools, setSavedSchools] = useState<SavedSchool[]>([])
  const [loading, setLoading] = useState(true)
  const [hoveredId, setHoveredId] = useState<string | number | null>(null)

  useEffect(() => {
    if (!user?.uid) {
      setLoading(false)
      return
    }

    const fetchSavedSchools = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/user/saved-schools?userId=${user.uid}`)
        const data = await response.json()
        setSavedSchools(data.savedSchools || [])
      } catch (error) {
        console.error("Error fetching saved schools:", error)
        setSavedSchools([])
      } finally {
        setLoading(false)
      }
    }

    fetchSavedSchools()
  }, [user?.uid])

  if (!user) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground mb-4">Please log in to view saved schools</p>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card className="p-8 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </Card>
    )
  }

  if (savedSchools.length === 0) {
    return (
      <Card className="p-8 text-center">
        <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No saved schools yet</h3>
        <p className="text-muted-foreground mb-6">
          Explore schools and save your favorites to compare and track them later.
        </p>
        <Link
          href="/discover"
          className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
        >
          Browse Schools
        </Link>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Saved Schools</h2>
          <p className="text-muted-foreground mt-1">You have {savedSchools.length} saved school{savedSchools.length !== 1 ? "s" : ""}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {savedSchools.map((school) => (
          <Link
            key={school.schoolId}
            href={`/schools/${school.schoolId}`}
            onMouseEnter={() => setHoveredId(school.schoolId)}
            onMouseLeave={() => setHoveredId(null)}
            className="group block"
          >
            <div className="relative rounded-2xl overflow-hidden bg-card border hover:shadow-lg hover:border-primary/30 transition-all duration-300 h-full flex flex-col">
              {/* Image */}
              <div className="aspect-video overflow-hidden bg-secondary relative">
                <img
                  src={school.schoolImage}
                  alt={school.schoolName}
                  className={`w-full h-full object-cover transition-transform duration-300 ${
                    hoveredId === school.schoolId ? "scale-110" : "scale-100"
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Content */}
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                  {school.schoolName}
                </h3>

                <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span className="line-clamp-1">{school.schoolLocation}</span>
                </div>

                <div className="flex-1" />

                <div className="flex items-center justify-between pt-4 mt-4 border-t border-border/50">
                  <div className="flex items-center gap-1 text-sm">
                    <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                    <span className="text-muted-foreground">Saved</span>
                  </div>
                  <time className="text-xs text-muted-foreground">
                    {new Date(school.savedAt).toLocaleDateString()}
                  </time>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
