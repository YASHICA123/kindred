"use client"

import React, { useEffect, useState } from "react"
import { SchoolCard } from "@/components/school-card"

type SortOption = "fees-low-to-high" | "fees-high-to-low" | "name-asc" | "newest"

type Props = {
  filters?: Record<string, string[]>
  sortBy?: SortOption
}
export function SchoolGrid({ filters, sortBy = "newest" }: Props) {
  const [schools, setSchools] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    
    // Use the API endpoint instead of lib directly to ensure consistent field mapping
    fetch('/api/top-schools')
      .then(r => {
        if (!r.ok) throw new Error('Failed to fetch schools')
        return r.json()
      })
      .then((data) => {
        if (mounted) setSchools(data.data || [])
      })
      .catch((error) => {
        console.error('Error fetching schools:', error)
        if (mounted) setSchools([])
      })
      .finally(() => mounted && setLoading(false))

    return () => {
      mounted = false
    }
  }, [])

  function matchesFilters(school: any) {
    if (!filters) return true
    const normalize = (v: any): string[] => {
      if (v == null) return []
      if (Array.isArray(v)) {
        return v
          .map((x) => {
            if (!x) return ""
            if (typeof x === "string") return x
            if (typeof x === "object") return (x.name || x.Name || x.title || x.Type || "").toString()
            return String(x)
          })
          .filter(Boolean)
      }
      if (typeof v === "object") {
        const str = v.name || v.Name || v.title || v.Type || v.curriculum || ""
        return str ? [String(str)] : []
      }
      return [String(v)]
    }

    const matchAny = (field: any, allowed: string[]) => {
      if (!allowed || !allowed.length) return true
      const vals = normalize(field).map((x) => x.toLowerCase())
      if (!vals.length) return false
      return allowed.some((f) => {
        const needle = f.toLowerCase()
        return vals.some((v) => v === needle || v.includes(needle) || needle.includes(v))
      })
    }

    if (!matchAny(school.curriculum, filters.curriculum || [])) return false
    // Use school_type_names from junction table if available, fallback to raw type
    if (!matchAny(school.school_type_names?.length ? school.school_type_names : school.type, filters.type || [])) return false
    if (!matchAny(school.feeRange || school.fee || school.fee_range, filters.fee || [])) return false
    if (!matchAny(school.facilities, filters.facilities || [])) return false
    if ((filters.search || []).length) {
      const searchWords = filters.search
        .flatMap((s) => s.toLowerCase().split(/\s+/))
        .filter((w) => w.length > 2 && !["the", "and", "for", "best", "top", "schools", "school", "in"].includes(w))
      if (searchWords.length > 0) {
        const haystack = [school.name, school.city, school.location, school.curriculum, school.type, school.state]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
        const matchesSearch = searchWords.some((word) => haystack.includes(word))
        if (!matchesSearch) return false
      }
    }
    // City filter: match against `city` or fallback to `location`
    if (!matchAny(school.city || school.location, filters.city || [])) return false

    // State filter: some entries may have `state`, otherwise try `location`
    if (!matchAny(school.state ?? school.location ?? null, filters.state || [])) return false

    return true
  }

  const sortSchools = (schoolsToSort: any[]) => {
    const sorted = [...schoolsToSort]
    
    switch (sortBy) {
      case "fees-low-to-high": {
        return sorted.sort((a, b) => {
          const aFee = extractFeeNumber(a.feeRange)
          const bFee = extractFeeNumber(b.feeRange)
          return aFee - bFee
        })
      }
      case "fees-high-to-low": {
        return sorted.sort((a, b) => {
          const aFee = extractFeeNumber(a.feeRange)
          const bFee = extractFeeNumber(b.feeRange)
          return bFee - aFee
        })
      }
      case "name-asc":
        return sorted.sort((a, b) => a.name.localeCompare(b.name))
      case "newest":
        return sorted.sort((a, b) => (b.id || 0) - (a.id || 0))
      default:
        return sorted
    }
  }

  const extractFeeNumber = (feeRange: string): number => {
    if (!feeRange) return 0
    const match = feeRange.match(/\d+/)
    return match ? parseInt(match[0], 10) : 0
  }

  const visible = schools.filter(matchesFilters)
  const sorted = sortSchools(visible)

  if (loading) return <div className="h-96 bg-secondary animate-pulse rounded-2xl" />
  if (!schools.length) return <p className="text-center py-20">No schools found</p>

  return (
    <div>
      <p className="text-muted-foreground mb-6">
        Showing <span className="font-medium text-foreground">{sorted.length}</span> schools
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sorted.map((s) => (
          <SchoolCard key={s.id} school={s} />
        ))}
      </div>
    </div>
  )
}
