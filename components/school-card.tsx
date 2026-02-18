"use client"

import { Heart, MapPin, Star } from "lucide-react"
import Link from "next/link"
import { useSavedSchools } from "@/hooks/use-saved-schools"
import { useAuth } from "@/hooks/use-auth"
import { useState } from "react"

interface SchoolCardProps {
  school: {
    id: string | number
    slug: string
    name: string
    location: string
    city?: string
    image: string
    rating?: number
    reviews?: number
    feeRange?: string
    type?: string
  }
}

export function SchoolCard({ school }: SchoolCardProps) {
  const { isSaved, toggleSave } = useSavedSchools()
  const { user } = useAuth()
  const [savingState, setSavingState] = useState(false)
  const saved = isSaved(school.id)

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      alert("Please login to save schools")
      return
    }

    setSavingState(true)
    try {
      await toggleSave({
        schoolId: school.id,
        schoolName: school.name,
        schoolImage: school.image,
        schoolLocation: school.location,
        savedAt: new Date().toISOString(),
      })
    } catch (error) {
      console.error("Error saving school:", error)
    } finally {
      setSavingState(false)
    }
  }

  return (
    <Link
      href={`/schools/${school.slug || school.id}`}
      className="group block bg-card rounded-2xl overflow-hidden border hover:shadow-lg hover:border-primary/30 transition-all duration-300"
    >
      <div className="aspect-video overflow-hidden relative bg-secondary">
        <img
          src={school.image}
          alt={school.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={savingState}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white shadow-md transition-all duration-200 z-10"
        >
          <Heart
            className={`h-5 w-5 ${
              saved ? "fill-red-500 text-red-500" : "text-gray-400 hover:text-red-500"
            } transition-colors`}
          />
        </button>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-medium line-clamp-2">{school.name}</h3>

        <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{school.location}</span>
        </div>

        {school.rating && (
          <div className="flex items-center gap-2 mt-2">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">
              {school.rating} ({school.reviews || 0})
            </span>
          </div>
        )}

        {school.feeRange && (
          <p className="text-sm font-medium text-primary mt-3">{school.feeRange}/year</p>
        )}
      </div>
    </Link>
  )
}
