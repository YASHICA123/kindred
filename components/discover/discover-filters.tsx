"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { ChevronDown, SlidersHorizontal, X, Search } from "lucide-react"
import { FILTER_BOARDS, FILTER_FEE_RANGES, FILTER_SCHOOL_TYPES } from "@/lib/discover-options"
import indianStates from "@/data/indian-states.json"

const MAX_VISIBLE = 5

const POPULAR_CITIES = [
  "Mumbai", "Delhi", "Bengaluru", "Hyderabad", "Chennai",
  "Kolkata", "Pune", "Jaipur", "Lucknow", "Ahmedabad",
  "Chandigarh", "Kochi", "Dehradun", "Noida", "Gurgaon",
  "Indore", "Bhopal", "Patna", "Nagpur", "Coimbatore",
]

type Props = {
  selectedFilters: Record<string, string[]>
  onToggle: (category: string, option: string) => void
  onClear?: () => void
  cityOptions?: string[]
  stateOptions?: string[]
  boardOptions?: string[]
}

export const filterCategories = [
  {
    name: "School Type",
    options: FILTER_SCHOOL_TYPES,
  },
  {
    name: "Curriculum",
    options: FILTER_BOARDS,
  },
  {
    name: "Facilities",
    options: [
      "Sports Complex",
      "Swimming Pool",
      "Science Labs",
      "Library",
      "Computer Lab",
      "Auditorium",
      "Cafeteria",
      "Medical Facility",
      "Playground",
      "Basketball Court",
      "Football Field",
      "Tennis Court",
      "Badminton Court",
      "Cricket Field",
      "Indoor Games",
      "Dance Studio",
      "Music Room",
      "Art Studio",
      "Robotics Lab",
      "Language Lab",
      "Counseling Cell",
      "Transportation",
      "Hostel",
      "WiFi",
    ],
  },
  {
    name: "State",
    options: indianStates as string[],
  },
  {
    name: "Fee Range",
    options: FILTER_FEE_RANGES,
  },
  {
    name: "City",
    options: POPULAR_CITIES,
  },
]

const cityPlaceholders = [
  "Search by city name...",
  "Try 'Mumbai'",
  "Try 'Bangalore'",
  "Try 'Delhi NCR'",
  "Search by state name...",
  "Try 'Jaipur'",
]

export function DiscoverFilters({ selectedFilters, onToggle, onClear, cityOptions, stateOptions, boardOptions }: Props) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["School Type", "Curriculum", "Fee Range", "City", "State"])
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [cityQuery, setCityQuery] = useState("")
  const [stateQuery, setStateQuery] = useState("")
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})
  // City search results from API
  const [citySearchResults, setCitySearchResults] = useState<string[]>([])
  const [citySearchLoading, setCitySearchLoading] = useState(false)
  // Animated placeholder for city search
  const [cityPlaceholder, setCityPlaceholder] = useState(cityPlaceholders[0])
  const cityPlaceholderIdx = useRef(0)
  const cityInputRef = useRef<HTMLInputElement>(null)
  const [isCityInputFocused, setIsCityInputFocused] = useState(false)
  // Ref for the scrollable container so we can preserve scroll position
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Typewriter animation for city search placeholder
  useEffect(() => {
    if (isCityInputFocused || cityQuery) return
    const interval = setInterval(() => {
      cityPlaceholderIdx.current = (cityPlaceholderIdx.current + 1) % cityPlaceholders.length
      setCityPlaceholder(cityPlaceholders[cityPlaceholderIdx.current])
    }, 2500)
    return () => clearInterval(interval)
  }, [isCityInputFocused, cityQuery])

  // Debounced city search from API
  useEffect(() => {
    if (!cityQuery || cityQuery.length < 2) {
      setCitySearchResults([])
      return
    }
    setCitySearchLoading(true)
    const timer = setTimeout(() => {
      fetch(`/api/cities?q=${encodeURIComponent(cityQuery)}&limit=20`)
        .then((r) => r.json())
        .then((json) => {
          const results = (json.data || []).map((c: any) =>
            typeof c === "string" ? c : c.city
          )
          setCitySearchResults(results)
        })
        .catch(() => setCitySearchResults([]))
        .finally(() => setCitySearchLoading(false))
    }, 300)
    return () => clearTimeout(timer)
  }, [cityQuery])

  const toggleCategory = (name: string) => {
    setExpandedCategories((prev) => (prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]))
  }

  const toggleFilter = (category: string, option: string) => {
    onToggle(category, option)
  }

  const toggleShowMore = (categoryName: string) => {
    setExpandedSections((prev) => ({ ...prev, [categoryName]: !prev[categoryName] }))
  }

  const activeFilterCount = Object.values(selectedFilters || {}).flat().length

  const getOptions = useCallback((category: { name: string; options: string[] }) => {
    if (category.name === "Curriculum" && boardOptions && boardOptions.length > 0) {
      return boardOptions
    }
    if (category.name === "City") {
      return cityOptions ?? category.options
    }
    if (category.name === "State") {
      return stateOptions ?? category.options
    }
    return category.options
  }, [boardOptions, cityOptions, stateOptions])

  const filterContent = (
    <div className="space-y-6">
      {/* Filter header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-primary" />
          <span className="font-medium">Filters</span>
        </div>
        {activeFilterCount > 0 && (
          <button
            onClick={() => {
              if (onClear) onClear()
              setCityQuery("")
              setStateQuery("")
            }}
            className="text-sm text-primary hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Active filters */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(selectedFilters).map(([category, options]) =>
            options.map((option) => (
              <button
                key={`${category}-${option}`}
                onClick={() => toggleFilter(category, option)}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary text-sm rounded-full hover:bg-primary/20 transition-colors"
              >
                {option}
                <X className="h-3 w-3" />
              </button>
            )),
          )}
        </div>
      )}

      {/* Filter categories */}
      <div className="space-y-4">
        {filterCategories.map((category) => {
          const allOptions = getOptions(category)
          const isCity = category.name === "City"
          const isState = category.name === "State"

          // For city: use API search results when searching, else show popular cities
          let filteredOptions: string[]
          if (isCity) {
            if (cityQuery && cityQuery.length >= 2) {
              filteredOptions = citySearchResults
            } else {
              filteredOptions = allOptions
            }
          } else if (isState && stateQuery) {
            filteredOptions = allOptions.filter((o) => o.toLowerCase().includes(stateQuery.toLowerCase()))
          } else {
            filteredOptions = allOptions
          }

          const isExpanded = expandedSections[category.name] || false
          const hasMore = filteredOptions.length > MAX_VISIBLE
          const visibleOptions = (isCity && cityQuery) || isExpanded
            ? filteredOptions
            : filteredOptions.slice(0, MAX_VISIBLE)
          const hiddenCount = filteredOptions.length - MAX_VISIBLE

          return (
            <div key={category.name} className="border-b border-border pb-4">
              <button
                onClick={() => toggleCategory(category.name)}
                className="flex items-center justify-between w-full py-2 text-left"
              >
                <span className="font-medium text-sm">{category.name}</span>
                <ChevronDown
                  className={`h-4 w-4 text-muted-foreground transition-transform ${
                    expandedCategories.includes(category.name) ? "rotate-180" : ""
                  }`}
                />
              </button>

              {expandedCategories.includes(category.name) && (
                <div className="mt-3 space-y-2">
                  {/* City search input with animated placeholder */}
                  {isCity && (
                    <div className="pb-2 relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                      <input
                        ref={cityInputRef}
                        type="search"
                        value={cityQuery}
                        onChange={(e) => setCityQuery(e.target.value)}
                        onFocus={(e) => {
                          setIsCityInputFocused(true)
                          // Prevent the browser from scrolling the sticky container
                          e.target.scrollIntoView({ block: "nearest" })
                        }}
                        onBlur={() => setIsCityInputFocused(false)}
                        placeholder={cityPlaceholder}
                        className="w-full pl-9 pr-3 py-2 rounded-md bg-secondary border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all"
                      />
                      {citySearchLoading && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <div className="h-3.5 w-3.5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                        </div>
                      )}
                    </div>
                  )}

                  {/* State search input */}
                  {isState && (
                    <div className="pb-2">
                      <input
                        type="search"
                        value={stateQuery}
                        onChange={(e) => setStateQuery(e.target.value)}
                        placeholder="Search states..."
                        className="w-full px-3 py-2 rounded-md bg-secondary border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/30"
                      />
                    </div>
                  )}

                  {/* "No results" message for city search */}
                  {isCity && cityQuery && cityQuery.length >= 2 && !citySearchLoading && filteredOptions.length === 0 && (
                    <p className="text-xs text-muted-foreground py-1">No cities found for &quot;{cityQuery}&quot;</p>
                  )}

                  {/* Options list with max-height scroll when many results */}
                  <div className={filteredOptions.length > 10 ? "max-h-48 overflow-y-auto pr-1 space-y-2" : "space-y-2"}>
                    {visibleOptions.map((option) => (
                      <label
                        key={option}
                        className="flex items-center gap-3 cursor-pointer group"
                        role="button"
                        tabIndex={0}
                        onClick={() => toggleFilter(category.name, option)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault()
                            toggleFilter(category.name, option)
                          }
                        }}
                      >
                        <div
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                            selectedFilters[category.name]?.includes(option)
                              ? "bg-primary border-primary"
                              : "border-border group-hover:border-primary/50"
                          }`}
                        >
                          {selectedFilters[category.name]?.includes(option) && (
                            <svg className="w-3 h-3 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>
                        <span
                          className={`text-sm transition-colors ${
                            selectedFilters[category.name]?.includes(option)
                              ? "text-foreground font-medium"
                              : "text-muted-foreground group-hover:text-foreground"
                          }`}
                        >
                          {option}
                        </span>
                      </label>
                    ))}
                  </div>

                  {/* Show more / Show less toggle */}
                  {hasMore && !(isCity && cityQuery) && (
                    <button
                      onClick={() => toggleShowMore(category.name)}
                      className="text-xs text-primary hover:underline mt-1 font-medium"
                    >
                      {isExpanded ? "Show less" : `+ ${hiddenCount} more`}
                    </button>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile filter button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full shadow-lg"
      >
        <SlidersHorizontal className="h-5 w-5" />
        Filters
        {activeFilterCount > 0 && (
          <span className="ml-1 px-2 py-0.5 bg-primary-foreground text-primary text-xs rounded-full">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Mobile filter drawer */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-foreground/50" onClick={() => setIsMobileOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-card rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-xl">Filters</h2>
              <button onClick={() => setIsMobileOpen(false)} className="p-2 hover:bg-secondary rounded-full">
                <X className="h-5 w-5" />
              </button>
            </div>
            {filterContent}
            <button
              onClick={() => setIsMobileOpen(false)}
              className="w-full mt-6 py-3 bg-primary text-primary-foreground rounded-full font-medium"
            >
              Show Results
            </button>
          </div>
        </div>
      )}

      {/* Desktop filters — scrollable */}
      <div
        ref={scrollContainerRef}
        className="hidden lg:block sticky top-24 bg-card rounded-2xl border border-border max-h-[calc(100vh-7rem)] overflow-y-auto overscroll-contain scroll-smooth"
      >
        <div className="p-6">
          {filterContent}
        </div>
      </div>
    </>
  )
}
