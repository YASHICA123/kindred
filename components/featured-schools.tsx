"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowUpRight, MapPin, Heart, ChevronLeft, ChevronRight } from "lucide-react"

const fallbackFeatured = [] // Removed local data - using only Strapi

export function FeaturedSchools() {
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredSchool, setHoveredSchool] = useState<number | null>(null)
  const [schools, setSchools] = useState<any[] | null>(null)
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})
  const [isAutoScrolling, setIsAutoScrolling] = useState(true)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const sectionRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const autoScrollIntervalRef = useRef<NodeJS.Timeout | null>(null)

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

  // fetch top 6 schools from server API
  useEffect(() => {
    let mounted = true
    fetch('/api/top-schools')
      .then((r) => {
        if (!r.ok) throw new Error('Failed to fetch top schools')
        return r.json()
      })
      .then((json) => {
        if (!mounted) return
        // Limit to 6 schools
        const topSix = (json.data || []).slice(0, 6)
        console.log('📚 Featured schools fetched:', {
          count: topSix.length,
          source: json.source,
          firstSchool: topSix[0],
          firstSchoolImage: topSix[0]?.image,
        })
        setSchools(topSix)
      })
      .catch((err) => {
        console.error('❌ Error fetching featured schools:', err)
      })

    return () => {
      mounted = false
    }
  }, [])

  // Handle scroll position updates
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  // Scroll to direction
  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400
      const targetScroll = direction === 'left'
        ? scrollContainerRef.current.scrollLeft - scrollAmount
        : scrollContainerRef.current.scrollLeft + scrollAmount
      
      scrollContainerRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth',
      })
      setIsAutoScrolling(false) // Pause auto-scroll when user manually scrolls
    }
  }

  // Auto-scroll effect
  useEffect(() => {
    if (!isAutoScrolling || !scrollContainerRef.current) return

    autoScrollIntervalRef.current = setInterval(() => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
        const isAtEnd = scrollLeft >= scrollWidth - clientWidth - 10

        if (isAtEnd) {
          // Reset to beginning
          scrollContainerRef.current.scrollTo({
            left: 0,
            behavior: 'smooth',
          })
        } else {
          // Scroll right
          scrollContainerRef.current.scrollBy({
            left: 400,
            behavior: 'smooth',
          })
        }
      }
    }, 4000) // Auto-scroll every 4 seconds

    return () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current)
      }
    }
  }, [isAutoScrolling])

  return (
    <section ref={sectionRef} className="py-12 lg:py-16 bg-white border-b border-border/20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section header - Premium styling */}
        <div
          className={`mb-8 lg:mb-12 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex items-end justify-between gap-8 flex-col sm:flex-row">
            <div className="max-w-2xl">
              <span className="text-xs font-bold text-secondary tracking-widest mb-4 block uppercase">All Schools</span>
              <h2 className="text-4xl lg:text-5xl xl:text-6xl leading-tight font-serif font-bold text-foreground">
                Discover <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">quality schools</span>
              </h2>
            </div>
            <Link
              href="/discover"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-all duration-300 group whitespace-nowrap px-4 py-2 rounded-full hover:bg-primary/5"
            >
              Explore all
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
          </div>
        </div>

        {/* Featured cards horizontal scroll - Premium layout */}
        <div className="relative group">
          {/* Left scroll button */}
          {canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 lg:p-3 rounded-full bg-white/80 hover:bg-white shadow-lg hover:shadow-xl transition-all duration-200 border border-white/60 hover:border-primary/30 group/btn hidden sm:flex items-center justify-center"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5 lg:w-6 lg:h-6 text-foreground group-hover/btn:text-primary transition-colors" />
            </button>
          )}

          {/* Right scroll button */}
          {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 lg:p-3 rounded-full bg-white/80 hover:bg-white shadow-lg hover:shadow-xl transition-all duration-200 border border-white/60 hover:border-primary/30 group/btn hidden sm:flex items-center justify-center"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6 text-foreground group-hover/btn:text-primary transition-colors" />
            </button>
          )}

          {/* Scroll indicator for mobile */}
          <div className="absolute right-4 top-2 z-10 sm:hidden flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
            <span className="text-xs text-primary font-semibold">Scroll</span>
            <ChevronRight className="w-4 h-4 text-primary animate-bounce" />
          </div>

          {/* Scroll container */}
          {/* Scroll container */}
          <div 
            ref={scrollContainerRef}
            className="flex gap-6 lg:gap-8 overflow-x-auto pb-4 -mx-6 lg:-mx-8 px-6 lg:px-8 snap-x snap-mandatory scrollbar-hide"
            style={{
              scrollBehavior: 'smooth',
            }}
            onScroll={handleScroll}
            onMouseEnter={() => setIsAutoScrolling(false)}
            onMouseLeave={() => setIsAutoScrolling(true)}
          >
          {/* Featured cards */}
          {((schools && schools.length > 0 ? schools : []) as any[]).map((s, i) => (
            <Link
              key={s.id}
              href={`/schools/${s.slug}`}
              onMouseEnter={() => setHoveredSchool(i)}
              onMouseLeave={() => setHoveredSchool(null)}
              className={`group transition-all duration-700 flex-shrink-0 w-full sm:w-96 snap-center ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="relative h-full rounded-3xl overflow-hidden bg-white border border-white/60 shadow-lg hover:shadow-2xl hover:shadow-primary/15 transition-all duration-300 hover:border-primary/30 flex flex-col group-hover:scale-[1.02]">
                {/* Image container - show if image exists AND hasn't failed to load */}
                {s.image && !imageErrors[s.id as string] && (
                  <div className="aspect-video overflow-hidden bg-gray-100 relative">
                    <img
                      src={s.image}
                      alt={s.name}
                      onError={() => {
                        console.warn(`Image failed to load for ${s.name}: ${s.image}`)
                        setImageErrors(prev => ({ ...prev, [s.id as string]: true }))
                      }}
                      className={`w-full h-full object-cover transition-transform duration-500 ${
                        hoveredSchool === i ? "scale-110" : "scale-100"
                      }`}
                    />
                    {/* Gradient overlay on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 ${
                      hoveredSchool === i ? "opacity-100" : ""
                    }`} />
                  </div>
                )}

                {/* Content section - Premium spacing */}
                <div className={`flex flex-col flex-1 ${s.image ? 'p-6 lg:p-7' : 'p-8 lg:p-9'}`}>
                  {/* Tag & Heart button row */}
                  <div className="flex items-start justify-between mb-4 gap-3">
                    <div className="flex items-center gap-2 flex-wrap flex-1">
                      {(s.tags || []).slice(0, 1).map((tag: string) => (
                        <span
                          key={tag}
                          className="px-3 py-1.5 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full text-xs font-semibold text-primary whitespace-nowrap transition-all duration-200 group-hover:from-primary/15 group-hover:to-accent/15"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <button
                      className="p-2 rounded-full hover:bg-primary/5 transition-all duration-200 flex-shrink-0 hover:scale-110 active:scale-95"
                      onClick={(e) => e.preventDefault()}
                    >
                      <Heart className="w-5 h-5 text-gray-300 hover:text-primary transition-colors duration-200" />
                    </button>
                  </div>
                  
                  {/* School name - Premium typography */}
                  <h3 className="font-serif text-xl lg:text-2xl font-bold text-foreground mb-3 line-clamp-2 leading-tight">
                    {s.name}
                  </h3>
                  
                  {/* Description - Better contrast */}
                  <p className="text-foreground/65 text-sm mb-6 line-clamp-2 leading-relaxed flex-1 font-light">
                    {s.description || s.highlight}
                  </p>
                  
                  {/* Info section - Refined divider */}
                  <div className="space-y-3 text-sm text-foreground/70 border-t border-white/40 pt-5">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-primary/70 flex-shrink-0" />
                      <span className="truncate font-medium">{s.location}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-foreground/50">Parent feedback</span>
                    </div>
                  </div>
                </div>

                {/* Hover indicator line */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-t-full" />
              </div>
            </Link>
          ))}
          </div>
        </div>
      </div>
    </section>
  )
}
