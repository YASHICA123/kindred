"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { ArrowRight, Play, MapPin, BookOpen, IndianRupee, Zap, Search } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CITY_OPTIONS_WITH_PINCODES, FILTER_BOARDS, FILTER_FEE_RANGES, FILTER_SCHOOL_TYPES, extractSearchIntent } from "@/lib/discover-options"

export function ImmersiveHero() {
  const [scrollY, setScrollY] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [selectedCity, setSelectedCity] = useState("")
  const [selectedType, setSelectedType] = useState("")
  const [selectedBoard, setSelectedBoard] = useState("")
  const [selectedFeeRange, setSelectedFeeRange] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const heroRef = useRef<HTMLDivElement>(null)
  const [animatedPlaceholder, setAnimatedPlaceholder] = useState("")
  const [isTyping, setIsTyping] = useState(true)

  const placeholderExamples = [
    "Best schools in Delhi",
    "Top CBSE schools near me",
    "Boarding schools under 2 Lakh",
    "IB schools in Bangalore",
    "Montessori preschools in Mumbai",
  ]

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (selectedCity) params.append("city", selectedCity)
    if (selectedType) params.append("type", selectedType)
    if (selectedBoard) params.append("board", selectedBoard)
    if (selectedFeeRange) params.append("fee", selectedFeeRange)

    // Parse free-text query to extract city/state/board/type/fees
    if (searchTerm.trim()) {
      const intent = extractSearchIntent(searchTerm)
      if (intent.city && !selectedCity) params.append("city", intent.city)
      if (intent.state) params.append("state", intent.state)
      if (intent.board && !selectedBoard) params.append("curriculum", intent.board)
      if (intent.type && !selectedType) params.append("type", intent.type)
      if (intent.feeRange && !selectedFeeRange) params.append("fee", intent.feeRange)

      // Only pass raw search if nothing was extracted
      if (!intent.city && !intent.state && !intent.board && !intent.type && !intent.feeRange) {
        params.append("search", searchTerm.trim())
      }
    }

    const queryString = params.toString()
    window.location.href = `/discover?${queryString}`
  }

  useEffect(() => {
    setIsVisible(true)
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Parallax cursor effect for ambient glow
  // Typewriter animation for search placeholder
  useEffect(() => {
    if (searchTerm) return // Stop animation when user types

    let exampleIndex = 0
    let charIndex = 0
    let deleting = false
    let timeout: NodeJS.Timeout

    const tick = () => {
      const currentText = placeholderExamples[exampleIndex]

      if (!deleting) {
        charIndex++
        setAnimatedPlaceholder(currentText.slice(0, charIndex))
        if (charIndex === currentText.length) {
          deleting = true
          timeout = setTimeout(tick, 1800) // Pause before deleting
          return
        }
        timeout = setTimeout(tick, 80) // Typing speed
      } else {
        charIndex--
        setAnimatedPlaceholder(currentText.slice(0, charIndex))
        if (charIndex === 0) {
          deleting = false
          exampleIndex = (exampleIndex + 1) % placeholderExamples.length
          timeout = setTimeout(tick, 400) // Pause before next word
          return
        }
        timeout = setTimeout(tick, 40) // Deleting speed
      }
    }

    timeout = setTimeout(tick, 600) // Initial delay
    return () => clearTimeout(timeout)
  }, [searchTerm])

  // Parallax cursor effect for ambient glow
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!heroRef.current) return
    const rect = heroRef.current.getBoundingClientRect()
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    })
  }

  const parallaxOffset = scrollY * 0.4

  return (
    <>
      <section ref={heroRef} onMouseMove={handleMouseMove} className="relative min-h-screen overflow-hidden bg-gradient-to-b from-background via-primary/3 to-secondary/5">
        {/* Ambient gradient - more subtle and refined */}
        <div
          className="absolute inset-0 opacity-15 transition-all duration-1000 ease-out pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, var(--primary) 0%, transparent 60%)`,
          }}
        />

        {/* Base gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 w-full">
          {/* Hero Content with enhanced spacing */}
          <div className="min-h-screen flex flex-col justify-center max-w-7xl mx-auto px-6 lg:px-8 pt-28 lg:pt-36 pb-6 lg:pb-8">
            {/* Main headline with refined styling */}
            <h1 className="font-serif text-5xl lg:text-6xl xl:text-7xl leading-[1.15] tracking-tight max-w-5xl">
              <span className="block overflow-hidden">
                <span
                  className={`block transition-all duration-700 ${
                    isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
                  }`}
                  style={{ transitionDelay: "120ms" }}
                >
                  Where every
                </span>
              </span>
              <span className="block overflow-hidden">
                <span
                  className={`block bg-gradient-to-r from-primary via-primary to-primary/80 bg-clip-text text-transparent transition-all duration-700 relative ${
                    isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
                  }`}
                  style={{ transitionDelay: "200ms" }}
                >
                  child belongs
                  <div className="absolute bottom-2 left-0 w-16 h-1 bg-gradient-to-r from-primary/40 to-transparent rounded-full blur-sm" />
                </span>
              </span>
            </h1>

            {/* Enhanced Subheadline */}
            <p
              className={`mt-4 lg:mt-6 text-lg lg:text-xl text-foreground/70 max-w-3xl leading-relaxed transition-all duration-700 font-light ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: "280ms" }}
            >
              Discover schools aligned with your child's unique learning style and values. A thoughtful, 
              <span className="font-medium text-foreground/90"> personal guide </span>
              through one of life's most important decisions.
            </p>

            {/* Premium Search Bar - positioned between subheadline and CTAs */}
            <div
              className={`mt-6 lg:mt-8 transition-all duration-700 ${
                isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
              style={{ transitionDelay: "320ms" }}
            >
              <div className="bg-white rounded-3xl border border-white/60 shadow-lg hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 p-3 sm:p-4 flex flex-col gap-3">
                {/* Search Input - Full width on mobile */}
                <div className="w-full">
                  <Input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    placeholder={searchTerm ? "" : animatedPlaceholder || "Search school, city, board..."}
                    className="h-11 border-0 bg-white/80 hover:bg-white focus-visible:ring-2 focus-visible:ring-primary/25 text-sm"
                  />
                </div>

                {/* Filters Grid on mobile (2x2), Flex row on sm+ */}
                <div className="grid grid-cols-2 sm:flex gap-2 sm:gap-3 items-stretch sm:items-center">
                  {/* City Select */}
                  <Select value={selectedCity} onValueChange={setSelectedCity}>
                    <SelectTrigger className="border-0 h-10 sm:h-auto bg-white/80 hover:bg-white transition-colors text-xs sm:text-sm font-medium flex-1 sm:flex-1">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <MapPin className="h-3.5 sm:h-4 w-3.5 sm:w-4 text-primary/60 flex-shrink-0" />
                        <SelectValue placeholder="City" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl">
                      {CITY_OPTIONS_WITH_PINCODES.map((cityOption) => (
                        <SelectItem key={cityOption.city} value={cityOption.city}>
                          {cityOption.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Board Select */}
                  <Select value={selectedBoard} onValueChange={setSelectedBoard}>
                    <SelectTrigger className="border-0 h-10 sm:h-auto bg-white/80 hover:bg-white transition-colors text-xs sm:text-sm font-medium flex-1 sm:flex-1">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <BookOpen className="h-3.5 sm:h-4 w-3.5 sm:w-4 text-primary/60 flex-shrink-0" />
                        <SelectValue placeholder="Board" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl">
                      {FILTER_BOARDS.map((board) => (
                        <SelectItem key={board} value={board}>
                          {board}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Fees Select */}
                  <Select value={selectedFeeRange} onValueChange={setSelectedFeeRange}>
                    <SelectTrigger className="border-0 h-10 sm:h-auto bg-white/80 hover:bg-white transition-colors text-xs sm:text-sm font-medium flex-1 sm:flex-1">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <IndianRupee className="h-3.5 sm:h-4 w-3.5 sm:w-4 text-primary/60 flex-shrink-0" />
                        <SelectValue placeholder="Fees" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl">
                      {FILTER_FEE_RANGES.map((range) => (
                        <SelectItem key={range} value={range}>
                          {range}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Type Select */}
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="border-0 h-10 sm:h-auto bg-white/80 hover:bg-white transition-colors text-xs sm:text-sm font-medium flex-1 sm:flex-1">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <Zap className="h-3.5 sm:h-4 w-3.5 sm:w-4 text-primary/60 flex-shrink-0" />
                        <SelectValue placeholder="Type" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl">
                      {FILTER_SCHOOL_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Search Button - Full width on mobile, flex on sm+ */}
                <Button
                  onClick={handleSearch}
                  className="w-full sm:w-auto h-11 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/95 hover:to-primary/80 text-primary-foreground font-semibold rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-primary/40 whitespace-nowrap flex-shrink-0 text-sm"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>

            {/* Enhanced CTA Group */}
            <div
              className={`mt-4 lg:mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: "380ms" }}
            >
              {/* Premium Primary CTA */}
              <Link
                href="/discover"
                className="group relative inline-flex items-center gap-3 px-8 py-3.5 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground rounded-2xl text-base font-semibold overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/40 hover:scale-[1.02] active:scale-95"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Explore schools
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <div className="absolute inset-0 rounded-2xl ring-1 ring-white/20 group-hover:ring-white/40 transition-all duration-300" />
              </Link>

              {/* Apply for Schools CTA */}
              <Link
                href="/common-application"
                className="group relative inline-flex items-center gap-3 px-8 py-3.5 bg-gradient-to-r from-accent to-accent/90 text-accent-foreground rounded-2xl text-base font-semibold overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-accent/40 hover:scale-[1.02] active:scale-95"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Apply for Schools
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <div className="absolute inset-0 rounded-2xl ring-1 ring-white/20 group-hover:ring-white/40 transition-all duration-300" />
              </Link>

              {/* Enhanced Secondary CTA - Smart Recommender */}
              <Link
                href="/smart-recommender"
                className="group relative inline-flex items-center gap-3 px-6 py-3.5 rounded-2xl text-base font-semibold text-foreground/80 hover:text-foreground transition-all duration-300 hover:bg-white/40 backdrop-blur-sm border border-white/20 hover:border-white/40"
              >
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-all duration-300 group-hover:scale-110">
                  <span className="text-lg">✨</span>
                </span>
                <span className="relative">
                  Take AI Quiz
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
                </span>
              </Link>
            </div>
          </div>

          {/* Floating image cards - Refined with premium styling */}
          <div
            className={`mt-16 lg:mt-28 px-6 lg:px-8 max-w-7xl mx-auto transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            }`}
            style={{
              transitionDelay: "500ms",
              transform: `translateY(${parallaxOffset * 0.15}px)`,
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-8">
              {/* Card 1 */}
              <div className="group relative aspect-video rounded-2xl lg:rounded-3xl overflow-hidden cursor-pointer">
                <img
                  src="/happy-diverse-children-learning-in-bright-classroo.jpg"
                  alt="Children learning together"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 rounded-2xl lg:rounded-3xl ring-1 ring-white/10 group-hover:ring-white/20 transition-all duration-300" />
                <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <span className="text-sm font-semibold text-white">Collaborative Learning</span>
                </div>
              </div>

              {/* Card 2 - Featured with premium styling */}
              <div className="group relative aspect-video rounded-2xl lg:rounded-3xl overflow-hidden cursor-pointer md:row-span-1 md:col-span-1">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 z-10" />
                <img
                  src="/children-playing-outdoor-school-garden-nature.jpg"
                  alt="Children playing outdoors"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-4 right-4">
                  <div className="px-3.5 py-2 bg-white/95 backdrop-blur-xl text-xs font-bold text-primary rounded-full shadow-lg">
                    Featured
                  </div>
                </div>
                <div className="absolute inset-0 rounded-2xl lg:rounded-3xl ring-2 ring-white/20 group-hover:ring-white/40 transition-all duration-300" />
                <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <span className="text-sm font-semibold text-white">Nature-Based Play</span>
                </div>
              </div>

              {/* Card 3 */}
              <div className="group relative aspect-video rounded-2xl lg:rounded-3xl overflow-hidden cursor-pointer">
                <img
                  src="/montessori-classroom-natural-materials-children-ex.jpg"
                  alt="Montessori classroom"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 rounded-2xl lg:rounded-3xl ring-1 ring-white/10 group-hover:ring-white/20 transition-all duration-300" />
                <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <span className="text-sm font-semibold text-white">Montessori Method</span>
                </div>
              </div>
            </div>
          </div>

          {/* Spacing buffer before next section */}
          <div className="h-24 lg:h-32" />
        </div>
      </section>

      {/* Scroll indicator - Refined */}
      <div
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-all duration-700 pointer-events-none ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        style={{
          transitionDelay: "800ms",
          opacity: Math.max(0, 1 - scrollY / 400),
        }}
      >
        <span className="text-xs text-foreground/40 tracking-widest uppercase font-semibold">Scroll to explore</span>
        <div className="w-5 h-8 rounded-full border-2 border-foreground/30 flex items-start justify-center p-2 hover:border-foreground/50 transition-colors">
          <div className="w-0.5 h-1.5 rounded-full bg-foreground/40 animate-bounce" />
        </div>
      </div>
    </>
  )
}
