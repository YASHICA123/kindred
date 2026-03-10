"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowUpRight, BookOpen } from "lucide-react"

interface BoardData {
  name: string
  slug: string
  full_name?: string
  schoolCount: number
}

const boardColors: Record<string, string> = {
  "cbse": "from-blue-500/30 to-blue-700/10",
  "icse": "from-emerald-500/30 to-emerald-700/10",
  "isc": "from-teal-500/30 to-teal-700/10",
  "ib": "from-violet-500/30 to-violet-700/10",
  "igcse": "from-amber-500/30 to-amber-700/10",
  "state-board": "from-rose-500/30 to-rose-700/10",
  "cambridge": "from-indigo-500/30 to-indigo-700/10",
  "montessori": "from-pink-500/30 to-pink-700/10",
}

const fallbackBoards: BoardData[] = [
  { name: "CBSE", slug: "cbse", schoolCount: 0 },
  { name: "ICSE", slug: "icse", schoolCount: 0 },
  { name: "IB", slug: "ib", schoolCount: 0 },
  { name: "IGCSE", slug: "igcse", schoolCount: 0 },
  { name: "Cambridge", slug: "cambridge", schoolCount: 0 },
]

export function BoardsExplorer() {
  const [isVisible, setIsVisible] = useState(false)
  const [boards, setBoards] = useState<BoardData[]>(fallbackBoards)
  const sectionRef = useRef<HTMLDivElement>(null)

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

  useEffect(() => {
    async function loadBoards() {
      try {
        const res = await fetch("/api/boards?counts=true")
        if (!res.ok) return
        const data = await res.json()
        if (Array.isArray(data) && data.length > 0) {
          const sorted = [...data]
            .sort((a: BoardData, b: BoardData) => b.schoolCount - a.schoolCount)
            .slice(0, 5)
          if (sorted.length > 0) setBoards(sorted)
        }
      } catch {
        // keep fallback
      }
    }
    loadBoards()
  }, [])

  return (
    <section ref={sectionRef} className="py-12 lg:py-16 bg-white border-b border-border/20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className={`text-left mb-8 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 text-sm font-medium text-primary tracking-wide mb-4">
              <span className="w-8 h-px bg-primary" />
              Explore by Board
            </span>
            <h2 className="font-serif text-3xl lg:text-5xl leading-[1.1]">
              Discover schools by curriculum
              <span className="text-muted-foreground"> board &amp; programme</span>
            </h2>
          </div>
          <Link
            href="/boards"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:gap-3 transition-all mt-4"
          >
            View all boards
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Board Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-5">
          {boards.map((board, index) => (
            <Link
              key={board.slug}
              href={`/boards/${board.slug}`}
              className={`group relative rounded-2xl lg:rounded-3xl overflow-hidden aspect-[4/3] transition-all duration-700 glow-hover ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: `${index * 60}ms` }}
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${boardColors[board.slug] || "from-primary/20 to-primary/5"} group-hover:scale-110 transition-transform duration-500`} />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-between p-4 lg:p-5">
                <div className="flex justify-between items-start">
                  <BookOpen className="h-5 w-5 text-primary/60" />
                  <div className="p-1.5 rounded-full bg-white/10 group-hover:bg-white/20 transition-all duration-300 backdrop-blur-sm">
                    <ArrowUpRight className="h-3.5 w-3.5 text-foreground/60 group-hover:text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="font-serif text-xl lg:text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {board.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {board.schoolCount > 0 ? `${board.schoolCount} schools` : "Coming soon"}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
