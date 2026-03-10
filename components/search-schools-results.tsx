"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Star, MapPin, IndianRupee, Globe, ChevronRight, Loader2 } from "lucide-react"
import {
  searchSchoolsAdvanced,
  searchSchoolsFromView,
  fetchAllStates,
  fetchCitiesByState,
} from "@/lib/supabase-queries"
import { Button } from "@/components/ui/button"

interface SearchParams {
  q?: string
  state?: string
  city?: string
  board?: string
  fees?: string
  type?: string
  sort?: string
  page?: string
}

interface SchoolResult {
  id: string
  name: string
  slug: string
  board?: string
  type?: string
  rating?: number
  fees_min?: number
  fees_max?: number
  address?: string
  phone?: string
  website_url?: string
  image?: string
  city_name?: string
  state_name?: string
  tags?: string[]
}

interface SearchFilters {
  stateSlug?: string
  citySlug?: string
  board?: string
  type?: string
  feesMin?: number
  feesMax?: number
  sort?: "rating_desc" | "fees_asc" | "name_asc"
}

export function SearchSchoolsResults({ searchParams }: { searchParams: SearchParams }) {
  const [schools, setSchools] = useState<SchoolResult[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [states, setStates] = useState<any[]>([])
  const [selectedFilters, setSelectedFilters] = useState<SearchFilters>({})
  const [totalResults, setTotalResults] = useState(0)

  // Parse search params into filters
  useEffect(() => {
    const filters: SearchFilters = {}

    if (searchParams.state) {
      filters.stateSlug = searchParams.state
    }
    if (searchParams.city) {
      filters.citySlug = searchParams.city
    }
    if (searchParams.board) {
      filters.board = searchParams.board
    }
    if (searchParams.type) {
      filters.type = searchParams.type
    }

    // Parse fees range
    if (searchParams.fees) {
      const [min, max] = searchParams.fees.split("-").map((v) => parseInt(v))
      if (min) filters.feesMin = min
      if (max) filters.feesMax = max
    }

    filters.sort = (searchParams.sort as any) || "rating_desc"

    setSelectedFilters(filters)
  }, [searchParams])

  // Load states for reference
  useEffect(() => {
    fetchAllStates().then(setStates)
  }, [])

  // Fetch schools based on filters
  useEffect(() => {
    const fetchSchools = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Try RPC first, fallback to view-based search
        let result = await searchSchoolsAdvanced({
          stateSlug: selectedFilters.stateSlug,
          citySlug: selectedFilters.citySlug,
          board: selectedFilters.board,
          type: selectedFilters.type,
          feesMin: selectedFilters.feesMin,
          feesMax: selectedFilters.feesMax,
          sort: selectedFilters.sort || "rating_desc",
          limit: 20,
          offset: 0,
        })

        // If RPC returns empty, try view-based search
        if (!result.schools || result.schools.length === 0) {
          result = await searchSchoolsFromView({
            stateSlug: selectedFilters.stateSlug,
            citySlug: selectedFilters.citySlug,
            board: selectedFilters.board,
            type: selectedFilters.type,
            feesMin: selectedFilters.feesMin,
            feesMax: selectedFilters.feesMax,
            limit: 20,
            offset: 0,
          })
        }

        setSchools(result.schools || [])
        setTotalResults(result.total || 0)
      } catch (err) {
        console.error("Failed to fetch schools:", err)
        setError("Failed to load schools. Please try again.")
        setSchools([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchSchools()
  }, [selectedFilters])

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading schools...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded-lg p-6">
        <p className="text-red-800 dark:text-red-200">{error}</p>
      </div>
    )
  }

  if (schools.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mb-4">
          <div className="h-16 w-16 mx-auto bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
            <MapPin className="h-8 w-8 text-slate-400" />
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-2">No schools found</h3>
        <p className="text-muted-foreground mb-6">
          Try adjusting your filters or search criteria
        </p>
        <Link href="/schools">
          <Button variant="outline">View all schools</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Results summary */}
      <div className="text-sm text-muted-foreground">
        Found <span className="font-semibold text-foreground">{totalResults}</span> schools
      </div>

      {/* School cards grid */}
      <div className="grid gap-6">
        {schools.map((school) => (
          <SchoolResultCard key={school.id} school={school} />
        ))}
      </div>
    </div>
  )
}

function SchoolResultCard({ school }: { school: SchoolResult }) {
  return (
    <Link href={`/schools/${school.slug}`}>
      <div className="group bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden hover:border-primary hover:shadow-lg transition-all duration-300">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          {/* Image */}
          <div className="md:col-span-1 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-700 aspect-square md:aspect-auto relative overflow-hidden">
            {school.image ? (
              <img
                src={school.image}
                alt={school.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-slate-400 text-4xl">📚</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="md:col-span-2 p-6 flex flex-col justify-between">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold group-hover:text-primary transition-colors mb-2">
                    {school.name}
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {school.board && (
                      <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                        {school.board}
                      </span>
                    )}
                    {school.type && (
                      <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-full">
                        {school.type}
                      </span>
                    )}
                  </div>
                </div>

                {/* Rating */}
                {school.rating && (
                  <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 px-3 py-2 rounded-lg">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="font-semibold text-amber-900 dark:text-amber-200">
                      {school.rating.toFixed(1)}
                    </span>
                  </div>
                )}
              </div>

              {/* Location */}
              {(school.city_name || school.address) && (
                <div className="flex items-start gap-2 text-sm text-muted-foreground mb-3">
                  <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span>
                    {school.city_name && <span>{school.city_name}</span>}
                    {school.address && (
                      <>
                        {school.city_name && <span>, </span>}
                        <span className="line-clamp-1">{school.address}</span>
                      </>
                    )}
                  </span>
                </div>
              )}

              {/* Fees */}
              {(school.fees_min || school.fees_max) && (
                <div className="flex items-center gap-2 text-sm font-medium mb-4">
                  <IndianRupee className="h-4 w-4" />
                  <span>
                    {school.fees_min && <span>₹{(school.fees_min / 100000).toFixed(1)}L</span>}
                    {school.fees_min && school.fees_max && <span> - </span>}
                    {school.fees_max && <span>₹{(school.fees_max / 100000).toFixed(1)}L</span>}
                    {!school.fees_min && !school.fees_max && <span>Fees on request</span>}
                  </span>
                  <span className="text-xs text-muted-foreground">/year</span>
                </div>
              )}
            </div>

            {/* Footer with CTA */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex gap-3">
                {school.website_url && (
                  <a
                    href={school.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                  >
                    <Globe className="h-3 w-3" />
                    Website
                  </a>
                )}
                {school.phone && (
                  <a
                    href={`tel:${school.phone}`}
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
                  >
                    Call
                  </a>
                )}
              </div>

              <button
                onClick={(e) => {
                  e.preventDefault()
                  // Can add compare functionality here
                }}
                className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:gap-2 transition-all"
              >
                View Details
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
