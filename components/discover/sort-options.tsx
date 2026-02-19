"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

type SortOption = "fees-low-to-high" | "fees-high-to-low" | "name-asc" | "newest"

interface SortOptionsProps {
  onSortChange: (sort: SortOption) => void
  currentSort: SortOption
}

const sortOptions = [
  { value: "fees-low-to-high" as const, label: "Fees (Low to High)" },
  { value: "fees-high-to-low" as const, label: "Fees (High to Low)" },
  { value: "name-asc" as const, label: "School Name (A-Z)" },
  { value: "newest" as const, label: "Newest First" },
]

export function SortOptions({ onSortChange, currentSort }: SortOptionsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const currentLabel = sortOptions.find((opt) => opt.value === currentSort)?.label || "Sort By"

  return (
    <div className="relative inline-block">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="gap-2 flex items-center"
      >
        {currentLabel}
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </Button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-50">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onSortChange(option.value)
                setIsOpen(false)
              }}
              className={`w-full text-left px-4 py-3 hover:bg-primary/10 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                currentSort === option.value ? "bg-primary/20 font-medium" : ""
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
