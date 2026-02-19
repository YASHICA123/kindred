"use client"

import { useEffect, useState } from "react"
import { Heart, MapPin, DollarSign, BookOpen } from "lucide-react"
import { useApplicationForm } from "@/hooks/use-application-form"
import { Button } from "@/components/ui/button"
import { fetchSchools } from "@/lib/strapi"

interface School {
  id: string | number
  slug: string
  name: string
  location: string
  city: string
  rating: number
  reviews: number
  feeRange: string
  type: string
  image: string
}

export function MultiSchoolSelection() {
  const { state, toggleSchoolSelection, setCurrentStep } = useApplicationForm()
  const [schools, setSchools] = useState<School[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadSchools = async () => {
      try {
        setLoading(true)
        const data = await fetchSchools()
        setSchools(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load schools")
      } finally {
        setLoading(false)
      }
    }

    loadSchools()
  }, [])

  const selectedSchoolIds = state.selectedSchools.map((s) => s.id)
  const selectedCount = selectedSchoolIds.length

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading schools...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">Select Schools</h2>
        <p className="text-gray-600">Choose schools you want to apply to (minimum 1 required)</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">{error}</div>
      )}

      <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-blue-900">
            {selectedCount} school{selectedCount !== 1 ? "s" : ""} selected
          </p>
          <p className="text-xs text-blue-700">You can apply to up to 5 schools</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {schools.length > 0 ? (
          schools.map((school) => {
            const isSelected = selectedSchoolIds.includes(school.id.toString())
            return (
              <div
                key={school.id}
                className={`border rounded-lg overflow-hidden cursor-pointer transition-all ${
                  isSelected
                    ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
                onClick={() => toggleSchoolSelection(school.id.toString())}
              >
                {/* Image */}
                <div className="relative h-40 bg-gray-200 overflow-hidden">
                  <img
                    src={school.image || "/placeholder.svg"}
                    alt={school.name}
                    className="w-full h-full object-cover"
                  />
                  <button
                    className={`absolute top-3 right-3 p-2 rounded-full transition-all ${
                      isSelected
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-white text-gray-400 hover:text-red-500"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleSchoolSelection(school.id.toString())
                    }}
                  >
                    <Heart className={`w-5 h-5 ${isSelected ? "fill-current" : ""}`} />
                  </button>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{school.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                      <MapPin className="w-4 h-4" />
                      {school.city}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <BookOpen className="w-4 h-4" />
                    {school.type}
                  </div>

                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <DollarSign className="w-4 h-4" />
                    {school.feeRange}
                  </div>

                  {isSelected && (
                    <div className="bg-blue-100 border border-blue-300 rounded px-3 py-2 text-xs font-medium text-blue-900">
                      ✓ Selected
                    </div>
                  )}
                </div>
              </div>
            )
          })
        ) : (
          <div className="col-span-2 text-center py-12">
            <p className="text-gray-600">No schools available</p>
          </div>
        )}
      </div>

      {schools.length === 0 && !loading && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-700">
          No schools found. Please check back later or contact support.
        </div>
      )}

      <div className="flex justify-between gap-3 pt-6">
        <Button variant="outline" onClick={() => setCurrentStep(2)}>
          Previous
        </Button>
        <Button
          onClick={() => setCurrentStep(4)}
          disabled={selectedCount === 0}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
        >
          Next: Review & Submit
        </Button>
      </div>
    </div>
  )
}
