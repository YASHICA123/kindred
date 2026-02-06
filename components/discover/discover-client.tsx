"use client"

import React, { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { DiscoverFilters, filterCategories } from "@/components/discover/discover-filters"
import { SchoolGrid } from "@/components/discover/school-grid"

export default function DiscoverClient() {
  const searchParams = useSearchParams()

  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({})
  const [cityOptions, setCityOptions] = useState<string[] | undefined>(undefined)
  const [stateOptions, setStateOptions] = useState<string[] | undefined>(undefined)

  const mapping: Record<string, string> = {
    Curriculum: "curriculum",
    "Grade Level": "grade",
    "School Type": "type",
    Facilities: "facilities",
    "Fee Range": "fee",
    State: "state",
    City: "city",
  }

  // reverse map: param key -> category name
  const reverseMap: Record<string, string> = Object.fromEntries(
    Object.entries(mapping).map(([k, v]) => [v, k]),
  )

  // initialize from URL params (e.g., ?type=montessori)
  useEffect(() => {
    const params = Object.fromEntries(new URLSearchParams(String(searchParams)).entries())
    if (!Object.keys(params).length) return

    const next: Record<string, string[]> = {}
    Object.entries(params).forEach(([k, v]) => {
      const category = reverseMap[k] || k
      const rawVals = v.split(",").map((x) => decodeURIComponent(x))

      // canonicalize values to match the display options (e.g., "Montessori", "CBSE")
      const fc = filterCategories.find((f) => f.name === category)
      const vals = rawVals.map((rv) => {
        if (!fc) {
          // fallback: title-case common words, preserve all-uppercase acronyms
          if (rv.toUpperCase() === rv) return rv
          return rv
            .split(" ")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
            .join(" ")
        }

        const match = fc.options.find((o) => o.toLowerCase() === rv.toLowerCase())
        return match ?? rv
      })

      next[category] = vals
    })

    setSelectedFilters(next)
  }, [searchParams])

  // fetch available cities from our server API (bundled + Strapi union)
  useEffect(() => {
    let mounted = true
    fetch("/api/cities")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch cities")
        return r.json()
      })
      .then((json) => {
        if (!mounted) return
        const cities = (json.data || []).map((c: any) => String(c).trim())
        setCityOptions(cities)
      })
      .catch(() => {
        if (mounted) setCityOptions(undefined)
      })

    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    let mounted = true
    fetch("/api/states")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch states")
        return r.json()
      })
      .then((json) => {
        if (!mounted) return
        const states = (json.data || []).map((s: any) => String(s).trim())
        setStateOptions(states)
      })
      .catch(() => {
        if (mounted) setStateOptions(undefined)
      })

    return () => {
      mounted = false
    }
  }, [])

  function onToggle(category: string, option: string) {
    setSelectedFilters((prev) => {
      const current = prev[category] || []
      const updated = current.includes(option) ? current.filter((o) => o !== option) : [...current, option]
      return { ...prev, [category]: updated }
    })
  }

  function onClear() {
    setSelectedFilters({})
  }

  // map category keys to normalized filter keys used by SchoolGrid
  const filters: Record<string, string[]> = {}
  Object.entries(selectedFilters).forEach(([cat, vals]) => {
    const key = mapping[cat] || cat.toLowerCase().replace(/\s+/g, "-")
    filters[key] = vals
  })

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <aside className="lg:w-72 flex-shrink-0">
        <div className="sticky top-24">
          <DiscoverFilters
            selectedFilters={selectedFilters}
            onToggle={onToggle}
            onClear={onClear}
            cityOptions={cityOptions}
            stateOptions={stateOptions}
          />
        </div>
      </aside>

      <div className="flex-1">
        <SchoolGrid filters={filters} />
      </div>
    </div>
  )
}
