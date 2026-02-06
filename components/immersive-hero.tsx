"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { ArrowRight, Play } from "lucide-react"

export function ImmersiveHero() {
  const [scrollY, setScrollY] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsVisible(true)
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

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
    <section ref={heroRef} onMouseMove={handleMouseMove} className="relative min-h-[100svh] overflow-hidden">
      {/* Ambient gradient that follows cursor */}
      <div
        className="absolute inset-0 opacity-30 transition-all duration-1000 ease-out pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, var(--primary) 0%, transparent 50%)`,
        }}
      />

      <div className="relative z-10 min-h-[100svh] flex flex-col justify-center max-w-7xl mx-auto px-6 lg:px-8 pt-24 pb-20">
        {/* Badge */}
        <div
          className={`inline-flex self-start items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border/50 mb-8 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
          </span>
          <span className="text-sm text-muted-foreground">Trusted by 50,000+ families</span>
        </div>

        {/* Main headline with character-by-character reveal */}
        <h1 className="font-serif text-[clamp(2.5rem,8vw,6rem)] leading-[1.05] tracking-tight max-w-5xl">
          <span className="block overflow-hidden">
            <span
              className={`block transition-all duration-700 ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
              }`}
              style={{ transitionDelay: "100ms" }}
            >
              Where every
            </span>
          </span>
          <span className="block overflow-hidden">
            <span
              className={`block text-gradient transition-all duration-700 ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
              }`}
              style={{ transitionDelay: "200ms" }}
            >
              child belongs
            </span>
          </span>
        </h1>

        {/* Subheadline */}
        <p
          className={`mt-8 text-lg lg:text-xl text-muted-foreground max-w-2xl leading-relaxed transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "350ms" }}
        >
          A calm, intelligent guide through one of life's most important decisions. Discover schools where your child
          will truly flourish.
        </p>

        {/* CTA Group */}
        <div
          className={`mt-12 flex flex-wrap items-center gap-4 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "500ms" }}
        >
          {/* Primary CTA */}
          <Link
            href="/discover"
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-2xl text-base font-medium overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-primary/30"
          >
            <span className="relative z-10">Explore schools</span>
            <ArrowRight className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </Link>

          {/* Secondary CTA */}
          <button className="group inline-flex items-center gap-3 px-6 py-4 rounded-2xl text-base font-medium text-muted-foreground hover:text-foreground transition-colors duration-300">
            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-secondary border border-border group-hover:bg-primary/10 group-hover:border-primary/30 transition-all duration-300">
              <Play className="h-4 w-4 ml-0.5" />
            </span>
            Watch how it works
          </button>
        </div>

        {/* Floating image cards - positioned below content */}
        <div
          className={`mt-16 lg:mt-20 grid grid-cols-3 gap-4 lg:gap-6 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"
          }`}
          style={{
            transitionDelay: "650ms",
            transform: `translateY(${parallaxOffset * 0.2}px)`,
          }}
        >
          {/* Card 1 */}
          <div className="relative group aspect-[4/3] rounded-2xl lg:rounded-3xl overflow-hidden card-tilt">
            <img
              src="/happy-diverse-children-learning-in-bright-classroo.jpg"
              alt="Children learning together"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
              <span className="text-sm text-white/90 font-medium">Collaborative Learning</span>
            </div>
          </div>

          {/* Card 2 - Featured */}
          <div className="relative group aspect-[4/3] rounded-2xl lg:rounded-3xl overflow-hidden card-tilt ring-2 ring-primary/20">
            <img
              src="/children-playing-outdoor-school-garden-nature.jpg"
              alt="Children playing outdoors"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1.5 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                Featured
              </span>
            </div>
            <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
              <span className="text-sm text-white/90 font-medium">Nature-Based Play</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="relative group aspect-[4/3] rounded-2xl lg:rounded-3xl overflow-hidden card-tilt">
            <img
              src="/montessori-classroom-natural-materials-children-ex.jpg"
              alt="Montessori classroom"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
              <span className="text-sm text-white/90 font-medium">Montessori Method</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 transition-all duration-700 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        style={{
          transitionDelay: "900ms",
          opacity: Math.max(0, 1 - scrollY / 300),
        }}
      >
        <span className="text-xs text-muted-foreground/60 tracking-[0.2em] uppercase">Scroll to explore</span>
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
          <div className="w-1 h-2 rounded-full bg-muted-foreground/50 animate-bounce" />
        </div>
      </div>
    </section>
  )
}
