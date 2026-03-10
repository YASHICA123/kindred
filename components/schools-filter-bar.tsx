"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { X, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface FilterChip {
  label: string
  value: string
  category: string
}

export function SchoolsFilterBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showFilter, setShowFilter] = useState(false)

  const filterChips: FilterChip[] = []

  // Build chips from search params
  if (searchParams.get("board")) {
    filterChips.push({
      label: `Board: ${searchParams.get("board")}`,
      value: searchParams.get("board") || "",
      category: "board",
    })
  }

  if (searchParams.get("fees")) {
    const feesMap: Record<string, string> = {
      "0-50000": "Under ₹50K",
      "50000-100000": "₹50K - ₹1L",
      "100000-200000": "₹1L - ₹2L",
      "200000-500000": "₹2L - ₹5L",
      "500000-10000000": "Above ₹5L",
    }
    const label = feesMap[searchParams.get("fees") || ""]
    filterChips.push({
      label: `Fees: ${label}`,
      value: searchParams.get("fees") || "",
      category: "fees",
    })
  }

  if (searchParams.get("type")) {
    filterChips.push({
      label: `Type: ${searchParams.get("type")}`,
      value: searchParams.get("type") || "",
      category: "type",
    })
  }

  const handleRemoveFilter = (category: string) => {
    const params = new URLSearchParams(searchParams)
    params.delete(category)
    const newUrl = new URL(window.location.href)
    newUrl.search = params.toString()
    router.push(newUrl.pathname + newUrl.search)
  }

  const handleClearAll = () => {
    const newUrl = new URL(window.location.href)
    newUrl.search = ""
    router.push(newUrl.pathname)
  }

  if (filterChips.length === 0) return null

  return (
    <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 mb-6">
      <div className="flex flex-wrap items-center gap-3">
        <Filter className="h-5 w-5 text-slate-500" />

        {filterChips.map((chip) => (
          <div
            key={chip.category}
            className="inline-flex items-center gap-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-full px-3 py-1.5"
          >
            <span className="text-sm font-medium">{chip.label}</span>
            <button
              onClick={() => handleRemoveFilter(chip.category)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              aria-label={`Remove ${chip.label} filter`}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}

        {filterChips.length > 0 && (
          <button
            onClick={handleClearAll}
            className="text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
          >
            Clear All
          </button>
        )}
      </div>
    </div>
  )
}
