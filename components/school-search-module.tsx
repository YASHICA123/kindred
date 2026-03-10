"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Search, ChevronDown, Loader2 } from "lucide-react"
import {
  parseSchoolQuery,
  getRotatingPlaceholder,
  type ParsedSchoolQuery,
  type SchoolQueryDictionaries,
} from "@/lib/parse-school-query"
import { fetchAllStates, fetchCitiesByState, searchSchoolsAdvanced } from "@/lib/supabase-queries"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

interface State {
  id: string
  name: string
  slug: string
  code?: string
}

interface City {
  id: string
  name: string
  slug: string
  postal_code?: string
  state_id: string
}

export function SchoolSearchModule() {
  const router = useRouter()

  // States
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedState, setSelectedState] = useState<State | null>(null)
  const [selectedCity, setSelectedCity] = useState<City | null>(null)
  const [selectedBoard, setSelectedBoard] = useState<string>("")
  const [selectedFeeRange, setSelectedFeeRange] = useState<string>("")

  // Data
  const [states, setStates] = useState<State[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [isLoadingStates, setIsLoadingStates] = useState(false)
  const [isLoadingCities, setIsLoadingCities] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [placeholder, setPlaceholder] = useState("Best schools in India")

  // Dropdowns visibility
  const [showStateDropdown, setShowStateDropdown] = useState(false)
  const [showCityDropdown, setShowCityDropdown] = useState(false)
  const [showBoardDropdown, setShowBoardDropdown] = useState(false)
  const [showFeeDropdown, setShowFeeDropdown] = useState(false)

  // Board options
  const BOARDS = ["CBSE", "ICSE", "IB", "Cambridge", "State Board", "Montessori"]
  const FEE_RANGES = [
    { label: "Under ₹50,000", value: "0-50000" },
    { label: "₹50,000 - ₹1 Lakh", value: "50000-100000" },
    { label: "₹1 - 2 Lakh", value: "100000-200000" },
    { label: "₹2 - 5 Lakh", value: "200000-500000" },
    { label: "Above ₹5 Lakh", value: "500000-10000000" },
  ]

  // Load states on mount
  useEffect(() => {
    const loadStates = async () => {
      setIsLoadingStates(true)
      const stateList = await fetchAllStates()
      setStates(stateList || [])
      setIsLoadingStates(false)
    }
    loadStates()
  }, [])

  // Set rotating placeholder
  useEffect(() => {
    setPlaceholder(getRotatingPlaceholder())
    const interval = setInterval(() => {
      setPlaceholder(getRotatingPlaceholder())
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  // Load cities when state changes
  useEffect(() => {
    const loadCities = async () => {
      if (!selectedState) {
        setCities([])
        setSelectedCity(null)
        return
      }

      setIsLoadingCities(true)
      const cityList = await fetchCitiesByState(selectedState.slug)
      setCities(cityList || [])
      setSelectedCity(null)
      setIsLoadingCities(false)
    }
    loadCities()
  }, [selectedState])

  // Parse search query and sync with filters
  const parseAndSyncQuery = useCallback(
    (query: string) => {
      if (!query.trim()) return null

      const dictionaries: SchoolQueryDictionaries = {
        states: states.map((s) => ({ name: s.name, slug: s.slug })),
        cities: cities.map((c) => ({
          name: c.name,
          slug: c.slug,
          state_slug: c.state_id,
        })),
        boards: BOARDS,
        types: ["Day School", "Boarding", "Co-educational", "Boys Only", "Girls Only"],
      }

      const parsed = parseSchoolQuery(query, dictionaries)

      // Sync state
      if (parsed.stateSlug) {
        const state = states.find((s) => s.slug === parsed.stateSlug)
        if (state) setSelectedState(state)
      }

      // Sync city
      if (parsed.citySlug) {
        const city = cities.find((c) => c.slug === parsed.citySlug)
        if (city) setSelectedCity(city)
      }

      // Sync board
      if (parsed.board) {
        setSelectedBoard(parsed.board)
      }

      return parsed
    },
    [states, cities]
  )

  // Handle search submission
  const handleSearch = async () => {
    setIsSearching(true)

    // Parse the text query
    const textParsed = parseAndSyncQuery(searchQuery)

    // Build final filter object from UI selections + parsed query
    const finalParsed: ParsedSchoolQuery = {
      stateSlug: selectedState?.slug || textParsed?.stateSlug,
      citySlug: selectedCity?.slug || textParsed?.citySlug,
      board: selectedBoard || textParsed?.board,
      sort: textParsed?.sort,
    }

    // Parse fees range
    if (selectedFeeRange) {
      const [min, max] = selectedFeeRange.split("-").map((v) => parseInt(v))
      if (min) finalParsed.feesMin = min
      if (max) finalParsed.feesMax = max
    }

    // Build URL based on selected filters
    let url = "/schools"
    if (finalParsed.stateSlug) {
      url += `/${finalParsed.stateSlug}`
    }
    if (finalParsed.citySlug) {
      url += `/${finalParsed.citySlug}`
    }

    // Add query params for other filters
    const params = new URLSearchParams()
    if (finalParsed.board) params.append("board", finalParsed.board)
    if (selectedFeeRange) params.append("fees", selectedFeeRange)
    if (searchQuery) params.append("q", searchQuery)

    const urlWithParams = params.toString() ? `${url}?${params.toString()}` : url
    router.push(urlWithParams)
    setIsSearching(false)
  }

  // Handle Enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  // Filter states by search
  const filteredStates = useMemo(() => {
    if (!searchQuery) return states
    const q = searchQuery.toLowerCase()
    return states.filter((s) => s.name.toLowerCase().includes(q) || s.slug.includes(q))
  }, [states, searchQuery])

  // Filter cities by search
  const filteredCities = useMemo(() => {
    if (!searchQuery || !selectedState) return cities
    const q = searchQuery.toLowerCase()
    return cities.filter((c) => c.name.toLowerCase().includes(q) || c.slug.includes(q))
  }, [cities, searchQuery, selectedState])

  return (
    <div className="w-full max-w-4xl mx-auto px-6">
      {/* Search Bar */}
      <div className="bg-white dark:bg-slate-950 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 p-6 lg:p-8">
        {/* Text Query Input */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
            <Input
              type="text"
              placeholder={placeholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pl-12 h-12 text-lg bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700"
            />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Try: &quot;best IB schools in Gurgaon under 2 lakh&quot;
          </p>
        </div>

        {/* Filter Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* State Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowStateDropdown(!showStateDropdown)}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-left font-medium flex items-center justify-between hover:border-primary hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <span className="truncate text-sm">
                {selectedState ? selectedState.name : "Select State"}
              </span>
              <ChevronDown className="h-4 w-4 flex-shrink-0" />
            </button>

            {showStateDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-50">
                <ScrollArea className="h-48">
                  <div className="p-2">
                    {isLoadingStates ? (
                      <div className="flex items-center justify-center py-4">
                        <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                      </div>
                    ) : (
                      filteredStates.map((state) => (
                        <button
                          key={state.id}
                          onClick={() => {
                            setSelectedState(state)
                            setShowStateDropdown(false)
                          }}
                          className={`w-full text-left px-3 py-2 rounded text-sm font-medium transition-colors ${
                            selectedState?.id === state.id
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-slate-100 dark:hover:bg-slate-800"
                          }`}
                        >
                          {state.name}
                        </button>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>

          {/* City Dropdown */}
          <div className="relative">
            <button
              disabled={!selectedState || isLoadingCities}
              onClick={() => setShowCityDropdown(!showCityDropdown)}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-left font-medium flex items-center justify-between hover:border-primary hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="truncate text-sm">
                {selectedCity ? selectedCity.name : "Select City"}
              </span>
              <ChevronDown className="h-4 w-4 flex-shrink-0" />
            </button>

            {showCityDropdown && selectedState && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-50">
                <ScrollArea className="h-48">
                  <div className="p-2">
                    {isLoadingCities ? (
                      <div className="flex items-center justify-center py-4">
                        <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                      </div>
                    ) : filteredCities.length === 0 ? (
                      <p className="text-sm text-slate-500 px-3 py-2">No cities found</p>
                    ) : (
                      filteredCities.map((city) => (
                        <button
                          key={city.id}
                          onClick={() => {
                            setSelectedCity(city)
                            setShowCityDropdown(false)
                          }}
                          className={`w-full text-left px-3 py-2 rounded text-sm font-medium transition-colors ${
                            selectedCity?.id === city.id
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-slate-100 dark:hover:bg-slate-800"
                          }`}
                        >
                          {city.name}
                        </button>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>

          {/* Board Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowBoardDropdown(!showBoardDropdown)}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-left font-medium flex items-center justify-between hover:border-primary hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <span className="truncate text-sm">{selectedBoard || "Select Board"}</span>
              <ChevronDown className="h-4 w-4 flex-shrink-0" />
            </button>

            {showBoardDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-50">
                <div className="p-2">
                  <button
                    onClick={() => {
                      setSelectedBoard("")
                      setShowBoardDropdown(false)
                    }}
                    className="w-full text-left px-3 py-2 rounded text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    All Boards
                  </button>
                  {BOARDS.map((board) => (
                    <button
                      key={board}
                      onClick={() => {
                        setSelectedBoard(board)
                        setShowBoardDropdown(false)
                      }}
                      className={`w-full text-left px-3 py-2 rounded text-sm font-medium transition-colors ${
                        selectedBoard === board
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      {board}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Fee Range Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowFeeDropdown(!showFeeDropdown)}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-left font-medium flex items-center justify-between hover:border-primary hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <span className="truncate text-sm">
                {selectedFeeRange
                  ? FEE_RANGES.find((f) => f.value === selectedFeeRange)?.label
                  : "Fee Range"}
              </span>
              <ChevronDown className="h-4 w-4 flex-shrink-0" />
            </button>

            {showFeeDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-50">
                <div className="p-2">
                  <button
                    onClick={() => {
                      setSelectedFeeRange("")
                      setShowFeeDropdown(false)
                    }}
                    className="w-full text-left px-3 py-2 rounded text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    All Fees
                  </button>
                  {FEE_RANGES.map((range) => (
                    <button
                      key={range.value}
                      onClick={() => {
                        setSelectedFeeRange(range.value)
                        setShowFeeDropdown(false)
                      }}
                      className={`w-full text-left px-3 py-2 rounded text-sm font-medium transition-colors ${
                        selectedFeeRange === range.value
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Search Button */}
        <Button
          onClick={handleSearch}
          disabled={isSearching}
          className="w-full h-12 text-lg font-semibold"
        >
          {isSearching ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Searching...
            </>
          ) : (
            <>
              <Search className="h-5 w-5 mr-2" />
              Search Schools
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
