"use client"

import { useState, useRef, useEffect } from "react"
import { Search, MapPin, IndianRupee, BookOpen, Zap, X, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const cities = [
  "Delhi NCR", "Mumbai", "Bangalore", "Hyderabad", "Chennai",
  "Pune", "Kolkata", "Ahmedabad", "Jaipur", "Lucknow"
]

const boards = ["CBSE", "ICSE", "IB", "Cambridge", "State Board", "Montessori"]

const feeRanges = [
  { label: "Under ₹2L", value: "0-200000" },
  { label: "₹2L - ₹5L", value: "200000-500000" },
  { label: "₹5L - ₹10L", value: "500000-1000000" },
  { label: "Above ₹10L", value: "1000000+" },
]

const schoolTypes = ["Co-educational", "Boys Only", "Girls Only", "Day School", "Boarding"]

export function UniversalSearch() {
  const [isVisible, setIsVisible] = useState(false)
  const [city, setCity] = useState("")
  const [board, setBoard] = useState("")
  const [feeRange, setFeeRange] = useState("")
  const [schoolType, setSchoolType] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [hasSearched, setHasSearched] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const handleSearch = () => {
    const params = new URLSearchParams()
    
    if (city) params.append("city", city)
    if (board) params.append("board", board)
    if (feeRange) params.append("feeRange", feeRange)
    if (schoolType) params.append("type", schoolType)
    if (searchTerm) params.append("search", searchTerm)

    setHasSearched(true)
    router.push(`/discover?${params.toString()}`)
  }

  const handleClear = () => {
    setCity("")
    setBoard("")
    setFeeRange("")
    setSchoolType("")
    setSearchTerm("")
    setHasSearched(false)
  }

  const hasFilters = city || board || feeRange || schoolType || searchTerm

  return (
    <section
      ref={sectionRef}
      className="py-20 lg:py-28 bg-gradient-to-b from-white via-primary/3 to-white border-b border-border/20"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header Section - Refined */}
        <div
          className={`text-center mb-16 lg:mb-20 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "100ms" }}
        >
          <h2 className="font-serif text-4xl lg:text-5xl leading-tight mb-4">
            Find Your <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">Perfect School</span>
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto leading-relaxed font-light">
            Refine your search with intelligent filters. Discover schools that align with your values and your child's learning style.
          </p>
        </div>

        {/* Premium Search Container */}
        <div
          className={`transition-all duration-700 ${
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
          style={{ transitionDelay: "200ms" }}
        >
          <div className="relative group">
            {/* Glow background on hover - Premium effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-accent/10 to-primary/20 rounded-3xl lg:rounded-4xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl -z-10" />

            {/* Main search container with refined styling */}
            <div className="bg-white rounded-3xl lg:rounded-4xl border border-white/60 shadow-2xl shadow-black/8 hover:shadow-2xl hover:shadow-primary/15 transition-all duration-300 p-8 lg:p-10 space-y-8">
              {/* Premium text search input */}
              <div className="group/search relative">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/60 to-accent/60 rounded-l-2xl opacity-0 group-focus-within/search:opacity-100 transition-opacity duration-300" />
                <div className="relative flex items-center">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/50 transition-all duration-300 group-focus-within/search:scale-110 group-focus-within/search:text-primary/70" />
                  <input
                    type="text"
                    placeholder="Search by school name, city, or philosophy..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    className="w-full pl-14 pr-5 py-4 lg:py-5 text-base font-medium bg-white/80 group-hover/search:bg-white placeholder:text-foreground/40 border-0 rounded-2xl outline-none transition-all duration-300 focus:bg-white focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </div>

              {/* Filter Grid - With soft dividers and premium spacing */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-1 lg:gap-0 lg:divide-x lg:divide-white/20 -mx-2 lg:-mx-0">
                {/* City Select - Enhanced */}
                <div className="group/filter px-2 lg:px-6 py-4 lg:py-0 lg:flex lg:flex-col lg:justify-center hover:bg-primary/2 transition-colors duration-200 rounded-xl lg:rounded-none">
                  <Select value={city} onValueChange={setCity}>
                    <SelectTrigger className="h-12 lg:h-auto border-0 p-0 bg-transparent focus:ring-0 focus:bg-transparent data-[state=open]:bg-transparent text-base font-medium">
                      <div className="flex items-center gap-3 w-full justify-start lg:justify-start">
                        <MapPin className="h-5 w-5 text-primary/60 flex-shrink-0 transition-transform duration-300 group-hover/filter:scale-110 group-hover/filter:text-primary/80" />
                        <SelectValue placeholder="City" className="text-foreground/80" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="rounded-3xl border-0 shadow-2xl shadow-black/15">
                      <div className="p-2 space-y-1">
                        {cities.map((c) => (
                          <SelectItem key={c} value={c} className="rounded-xl transition-colors duration-150 cursor-pointer hover:bg-primary/10">
                            {c}
                          </SelectItem>
                        ))}
                      </div>
                    </SelectContent>
                  </Select>
                </div>

                {/* Board Select - Enhanced */}
                <div className="group/filter px-2 lg:px-6 py-4 lg:py-0 lg:flex lg:flex-col lg:justify-center hover:bg-primary/2 transition-colors duration-200 rounded-xl lg:rounded-none">
                  <Select value={board} onValueChange={setBoard}>
                    <SelectTrigger className="h-12 lg:h-auto border-0 p-0 bg-transparent focus:ring-0 focus:bg-transparent data-[state=open]:bg-transparent text-base font-medium">
                      <div className="flex items-center gap-3 w-full justify-start lg:justify-start">
                        <BookOpen className="h-5 w-5 text-primary/60 flex-shrink-0 transition-transform duration-300 group-hover/filter:scale-110 group-hover/filter:text-primary/80" />
                        <SelectValue placeholder="Board" className="text-foreground/80" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="rounded-3xl border-0 shadow-2xl shadow-black/15">
                      <div className="p-2 space-y-1">
                        {boards.map((b) => (
                          <SelectItem key={b} value={b} className="rounded-xl transition-colors duration-150 cursor-pointer hover:bg-primary/10">
                            {b}
                          </SelectItem>
                        ))}
                      </div>
                    </SelectContent>
                  </Select>
                </div>

                {/* Fee Range Select - Enhanced */}
                <div className="group/filter px-2 lg:px-6 py-4 lg:py-0 lg:flex lg:flex-col lg:justify-center hover:bg-primary/2 transition-colors duration-200 rounded-xl lg:rounded-none">
                  <Select value={feeRange} onValueChange={setFeeRange}>
                    <SelectTrigger className="h-12 lg:h-auto border-0 p-0 bg-transparent focus:ring-0 focus:bg-transparent data-[state=open]:bg-transparent text-base font-medium">
                      <div className="flex items-center gap-3 w-full justify-start lg:justify-start">
                        <IndianRupee className="h-5 w-5 text-primary/60 flex-shrink-0 transition-transform duration-300 group-hover/filter:scale-110 group-hover/filter:text-primary/80" />
                        <SelectValue placeholder="Fees" className="text-foreground/80" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="rounded-3xl border-0 shadow-2xl shadow-black/15">
                      <div className="p-2 space-y-1">
                        {feeRanges.map((range) => (
                          <SelectItem key={range.value} value={range.value} className="rounded-xl transition-colors duration-150 cursor-pointer hover:bg-primary/10">
                            {range.label}
                          </SelectItem>
                        ))}
                      </div>
                    </SelectContent>
                  </Select>
                </div>

                {/* School Type Select - Enhanced */}
                <div className="group/filter px-2 lg:px-6 py-4 lg:py-0 lg:flex lg:flex-col lg:justify-center hover:bg-primary/2 transition-colors duration-200 rounded-xl lg:rounded-none">
                  <Select value={schoolType} onValueChange={setSchoolType}>
                    <SelectTrigger className="h-12 lg:h-auto border-0 p-0 bg-transparent focus:ring-0 focus:bg-transparent data-[state=open]:bg-transparent text-base font-medium">
                      <div className="flex items-center gap-3 w-full justify-start lg:justify-start">
                        <Zap className="h-5 w-5 text-primary/60 flex-shrink-0 transition-transform duration-300 group-hover/filter:scale-110 group-hover/filter:text-primary/80" />
                        <SelectValue placeholder="Type" className="text-foreground/80" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="rounded-3xl border-0 shadow-2xl shadow-black/15">
                      <div className="p-2 space-y-1">
                        {schoolTypes.map((type) => (
                          <SelectItem key={type} value={type} className="rounded-xl transition-colors duration-150 cursor-pointer hover:bg-primary/10">
                            {type}
                          </SelectItem>
                        ))}
                      </div>
                    </SelectContent>
                  </Select>
                </div>

                {/* Premium Search Button */}
                <div className="sm:col-span-2 lg:sm:col-span-1 lg:flex lg:flex-col lg:justify-center">
                  <button
                    onClick={handleSearch}
                    className="w-full group/btn relative h-12 lg:h-auto lg:py-4 px-8 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/95 hover:to-primary/80 text-primary-foreground font-semibold text-base rounded-2xl lg:rounded-none lg:rounded-r-3xl transition-all duration-300 hover:shadow-xl hover:shadow-primary/40 active:scale-95 overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <Search className="h-5 w-5 transition-transform duration-300 group-hover/btn:scale-110" />
                      <span className="hidden lg:inline">Search</span>
                      <ArrowRight className="h-4 w-4 transition-all duration-300 group-hover/btn:translate-x-1" />
                    </span>
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                  </button>
                </div>
              </div>

              {/* Active Filters Display - Premium styling */}
              {hasFilters && (
                <div className="pt-8 border-t border-white/20 space-y-4">
                  <div className="flex flex-wrap gap-3">
                    {searchTerm && (
                      <div className="inline-flex items-center gap-2.5 px-4 py-2.5 bg-gradient-to-r from-primary/10 to-accent/10 text-primary text-sm font-medium rounded-full border border-primary/20 transition-all duration-200 hover:border-primary/40 hover:bg-gradient-to-r hover:from-primary/15 hover:to-accent/15">
                        <span>{searchTerm}</span>
                        <button 
                          onClick={() => setSearchTerm("")}
                          className="hover:scale-110 transition-transform duration-200 rounded-full p-0.5 hover:bg-primary/20"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                    {city && (
                      <div className="inline-flex items-center gap-2.5 px-4 py-2.5 bg-gradient-to-r from-primary/10 to-accent/10 text-primary text-sm font-medium rounded-full border border-primary/20 transition-all duration-200 hover:border-primary/40 hover:bg-gradient-to-r hover:from-primary/15 hover:to-accent/15">
                        <span>{city}</span>
                        <button 
                          onClick={() => setCity("")}
                          className="hover:scale-110 transition-transform duration-200 rounded-full p-0.5 hover:bg-primary/20"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                    {board && (
                      <div className="inline-flex items-center gap-2.5 px-4 py-2.5 bg-gradient-to-r from-primary/10 to-accent/10 text-primary text-sm font-medium rounded-full border border-primary/20 transition-all duration-200 hover:border-primary/40 hover:bg-gradient-to-r hover:from-primary/15 hover:to-accent/15">
                        <span>{board}</span>
                        <button 
                          onClick={() => setBoard("")}
                          className="hover:scale-110 transition-transform duration-200 rounded-full p-0.5 hover:bg-primary/20"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                    {feeRange && (
                      <div className="inline-flex items-center gap-2.5 px-4 py-2.5 bg-gradient-to-r from-primary/10 to-accent/10 text-primary text-sm font-medium rounded-full border border-primary/20 transition-all duration-200 hover:border-primary/40 hover:bg-gradient-to-r hover:from-primary/15 hover:to-accent/15">
                        <span>Fee: {feeRanges.find(f => f.value === feeRange)?.label}</span>
                        <button 
                          onClick={() => setFeeRange("")}
                          className="hover:scale-110 transition-transform duration-200 rounded-full p-0.5 hover:bg-primary/20"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                    {schoolType && (
                      <div className="inline-flex items-center gap-2.5 px-4 py-2.5 bg-gradient-to-r from-primary/10 to-accent/10 text-primary text-sm font-medium rounded-full border border-primary/20 transition-all duration-200 hover:border-primary/40 hover:bg-gradient-to-r hover:from-primary/15 hover:to-accent/15">
                        <span>{schoolType}</span>
                        <button 
                          onClick={() => setSchoolType("")}
                          className="hover:scale-110 transition-transform duration-200 rounded-full p-0.5 hover:bg-primary/20"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={handleClear}
                    className="text-sm font-medium text-primary/70 hover:text-primary transition-colors duration-200 flex items-center gap-2"
                  >
                    Clear all filters →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
