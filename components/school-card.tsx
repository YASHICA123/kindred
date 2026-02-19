"use client"

import { Heart, MapPin } from "lucide-react"
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
  const { isSaved, toggleSavedSchools } = useSavedSchools()
  const { user } = useAuth()
  const [savingState, setSavingState] = useState(false)
  const [imageError, setImageError] = useState(false)
  const saved = isSaved(school.id)

  // Use cover_image if available, fallback to image
  const imageUrl = school.image || ''

  const handleImageError = () => {
    console.error(`Image failed to load for ${school.name}:`, imageUrl)
    setImageError(true)
  }

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      alert("Please login to save schools")
      return
    }

    setSavingState(true)
    try {
      await toggleSavedSchools({
        schoolId: school.id,
        schoolName: school.name,
        schoolImage: imageUrl,
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
        {!imageError && imageUrl ? (
          <img
            src={imageUrl}
            alt={school.name}
            onError={handleImageError}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 text-gray-400">
            <span className="text-sm">No image available</span>
          </div>
        )}

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

        {school.feeRange && (
          <p className="text-sm font-medium text-primary mt-3">{school.feeRange}/year</p>
        )}
      </div>
    </Link>
  )
}
