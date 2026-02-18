"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { Search, MapPin, Users, IndianRupee, BookOpen, ArrowRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { SmartSearchDialog } from "@/components/smart-search-dialog"

const indianCities = [
  "Delhi NCR", "Mumbai", "Bangalore", "Hyderabad", "Chennai",
  "Pune", "Kolkata", "Ahmedabad", "Jaipur", "Lucknow"
]

const boards = ["CBSE", "ICSE", "IB", "IGCSE", "State Board"]
const classes = ["Nursery", "KG", "1-5", "6-8", "9-10", "11-12"]
const feeRanges = [
  { label: "Under ₹2L", value: "0-200000" },
  { label: "₹2L - ₹5L", value: "200000-500000" },
  { label: "₹5L - ₹10L", value: "500000-1000000" },
  { label: "Above ₹10L", value: "1000000+" },
]

interface SecondaryHeaderProps {
  isVisible: boolean
}

export function SecondaryHeader({ isVisible }: SecondaryHeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [selectedCity, setSelectedCity] = useState("")
  const [selectedClass, setSelectedClass] = useState("")
  const [selectedBoard, setSelectedBoard] = useState("")
  const [selectedFeeRange, setSelectedFeeRange] = useState("")

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (selectedCity) params.append("city", selectedCity)
    if (selectedClass) params.append("class", selectedClass)
    if (selectedBoard) params.append("board", selectedBoard)
    if (selectedFeeRange) params.append("fees", selectedFeeRange)
    
    const queryString = params.toString()
    window.location.href = `/discover?${queryString}`
  }

  return (
    <>
      <div
        className={`sticky top-20 lg:top-24 left-0 right-0 z-40 transition-all duration-500 ${
          isVisible ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-3 pointer-events-none"
        }`}
      >
        <div className="bg-white/98 backdrop-blur-2xl border-b border-white/20 shadow-2xl shadow-black/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 lg:py-6">
            {/* Premium Search Container */}
            <div className="relative">
              {/* Glow effect on focus */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 via-transparent to-accent/20 rounded-3xl opacity-0 transition-opacity duration-300 pointer-events-none group-focus-within:opacity-100 blur-2xl" />
              
              <div className="relative bg-white rounded-3xl border border-white/60 shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 overflow-hidden group">
                {/* Animated gradient border on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                {/* Desktop Grid Layout - Premium Spacing */}
                <div className="hidden lg:grid lg:grid-cols-5 gap-0">
                  {/* City Select */}
                  <div className="flex items-center px-6 py-4 border-r border-white/40 hover:bg-primary/2 transition-colors duration-200">
                    <Select value={selectedCity} onValueChange={setSelectedCity}>
                      <SelectTrigger className="border-0 p-0 h-auto bg-transparent focus:ring-0 text-sm font-medium focus:bg-transparent hover:bg-transparent data-[state=open]:bg-transparent">
                        <div className="flex items-center gap-3 w-full">
                          <MapPin className="h-5 w-5 text-primary/60 flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
                          <SelectValue placeholder="City" className="text-foreground/80" />
                        </div>
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-0 shadow-2xl">
                        {indianCities.map((city) => (
                          <SelectItem key={city} value={city} className="rounded-lg transition-colors duration-200">
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Class Select */}
                  <div className="flex items-center px-6 py-4 border-r border-white/40 hover:bg-primary/2 transition-colors duration-200">
                    <Select value={selectedClass} onValueChange={setSelectedClass}>
                      <SelectTrigger className="border-0 p-0 h-auto bg-transparent focus:ring-0 text-sm font-medium focus:bg-transparent hover:bg-transparent data-[state=open]:bg-transparent">
                        <div className="flex items-center gap-3 w-full">
                          <Users className="h-5 w-5 text-primary/60 flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
                          <SelectValue placeholder="Class" className="text-foreground/80" />
                        </div>
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-0 shadow-2xl">
                        {classes.map((cls) => (
                          <SelectItem key={cls} value={cls} className="rounded-lg transition-colors duration-200">
                            {cls}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Board Select */}
                  <div className="flex items-center px-6 py-4 border-r border-white/40 hover:bg-primary/2 transition-colors duration-200">
                    <Select value={selectedBoard} onValueChange={setSelectedBoard}>
                      <SelectTrigger className="border-0 p-0 h-auto bg-transparent focus:ring-0 text-sm font-medium focus:bg-transparent hover:bg-transparent data-[state=open]:bg-transparent">
                        <div className="flex items-center gap-3 w-full">
                          <BookOpen className="h-5 w-5 text-primary/60 flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
                          <SelectValue placeholder="Board" className="text-foreground/80" />
                        </div>
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-0 shadow-2xl">
                        {boards.map((board) => (
                          <SelectItem key={board} value={board} className="rounded-lg transition-colors duration-200">
                            {board}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Fee Range Select */}
                  <div className="flex items-center px-6 py-4 border-r border-white/40 hover:bg-primary/2 transition-colors duration-200">
                    <Select value={selectedFeeRange} onValueChange={setSelectedFeeRange}>
                      <SelectTrigger className="border-0 p-0 h-auto bg-transparent focus:ring-0 text-sm font-medium focus:bg-transparent hover:bg-transparent data-[state=open]:bg-transparent">
                        <div className="flex items-center gap-3 w-full">
                          <IndianRupee className="h-5 w-5 text-primary/60 flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
                          <SelectValue placeholder="Fees" className="text-foreground/80" />
                        </div>
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-0 shadow-2xl">
                        {feeRanges.map((range) => (
                          <SelectItem key={range.value} value={range.value} className="rounded-lg transition-colors duration-200">
                            {range.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Premium Search Button */}
                  <Button
                    onClick={handleSearch}
                    className="h-full px-8 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/95 hover:to-primary/80 text-primary-foreground font-semibold rounded-r-3xl rounded-l-none border-0 transition-all duration-300 hover:shadow-xl hover:shadow-primary/40 active:scale-95 group-button relative overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center gap-2.5">
                      <Search className="h-5 w-5 transition-transform duration-300 group-button:group-hover:scale-110" />
                      <span>Search</span>
                      <ArrowRight className="h-4 w-4 transition-all duration-300 group-button:group-hover:translate-x-0.5" />
                    </span>
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-button:group-hover:translate-x-full transition-transform duration-700" />
                  </Button>
                </div>

                {/* Tablet Layout (md) - Premium Spacing */}
                <div className="hidden md:grid md:grid-cols-3 gap-0 lg:hidden">
                  <div className="flex items-center px-5 py-4 border-r border-white/40 hover:bg-primary/2 transition-colors duration-200">
                    <Select value={selectedCity} onValueChange={setSelectedCity}>
                      <SelectTrigger className="border-0 p-0 h-auto bg-transparent focus:ring-0 text-sm font-medium focus:bg-transparent hover:bg-transparent data-[state=open]:bg-transparent">
                        <div className="flex items-center gap-2.5 w-full">
                          <MapPin className="h-5 w-5 text-primary/60 flex-shrink-0" />
                          <SelectValue placeholder="City" />
                        </div>
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-0 shadow-2xl">
                        {indianCities.map((city) => (
                          <SelectItem key={city} value={city} className="rounded-lg">
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center px-5 py-4 border-r border-white/40 hover:bg-primary/2 transition-colors duration-200">
                    <Select value={selectedClass} onValueChange={setSelectedClass}>
                      <SelectTrigger className="border-0 p-0 h-auto bg-transparent focus:ring-0 text-sm font-medium focus:bg-transparent hover:bg-transparent data-[state=open]:bg-transparent">
                        <div className="flex items-center gap-2.5 w-full">
                          <Users className="h-5 w-5 text-primary/60 flex-shrink-0" />
                          <SelectValue placeholder="Class" />
                        </div>
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-0 shadow-2xl">
                        {classes.map((cls) => (
                          <SelectItem key={cls} value={cls} className="rounded-lg">
                            {cls}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    onClick={handleSearch}
                    className="px-5 py-4 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/95 hover:to-primary/80 text-primary-foreground font-semibold rounded-r-3xl rounded-l-none border-0 text-sm transition-all duration-300 hover:shadow-lg hover:shadow-primary/40 active:scale-95"
                  >
                    <Search className="h-5 w-5 mr-2" />
                    Search
                  </Button>
                </div>

                {/* Mobile Layout */}
                <div className="md:hidden flex flex-col gap-0 p-0">
                  <button
                    onClick={() => setSearchOpen(true)}
                    className="w-full flex items-center gap-4 px-6 py-4 bg-white text-left hover:bg-primary/2 transition-colors duration-200 rounded-3xl"
                  >
                    <Search className="h-5 w-5 text-primary/60 flex-shrink-0" />
                    <span className="text-sm font-medium text-foreground/60">Search schools...</span>
                  </button>
                  <SmartSearchDialog 
                    open={searchOpen} 
                    onOpenChange={setSearchOpen}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
