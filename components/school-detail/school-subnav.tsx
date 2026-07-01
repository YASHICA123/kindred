"use client"

import { useEffect, useRef } from "react"
import { SectionId } from "./types"

/* ─── Tab definitions with inline SVG icons ──────────────────────────────── */
const TABS: { id: SectionId; label: string; icon: React.ReactNode }[] = [
  {
    id: "overview",
    label: "Overview",
    icon: (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
        <rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity=".9"/>
        <rect x="9" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity=".5"/>
        <rect x="1" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity=".5"/>
        <rect x="9" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity=".9"/>
      </svg>
    ),
  },
  {
    id: "about",
    label: "About",
    icon: (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
        <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.6"/>
        <path d="M8 7v5M8 5v.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: "admissions",
    label: "Admissions",
    icon: (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
        <rect x="2" y="1.5" width="12" height="13" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M5 5.5h6M5 8.5h6M5 11.5h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: "fees",
    label: "Fees",
    icon: (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
        <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
        <text x="8" y="12" textAnchor="middle" fontSize="8" fontWeight="700" fill="currentColor">₹</text>
      </svg>
    ),
  },
  {
    id: "why-us",
    label: "Why Us",
    icon: (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path d="M8 1l1.9 3.8 4.1.6-3 2.9.7 4.1L8 10.4l-3.7 1.9.7-4.1-3-2.9 4.1-.6L8 1z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: "gallery",
    label: "Gallery",
    icon: (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
        <rect x="1.5" y="1.5" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="5.5" cy="5.5" r="1.5" fill="currentColor" opacity=".8"/>
        <path d="M1.5 10.5l3.5-3.5 2.5 2.5 2-2 4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: "facilities",
    label: "Facilities",
    icon: (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path d="M1 14h14M3 14V8l5-5 5 5v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="6" y="10" width="4" height="4" rx="0.5" stroke="currentColor" strokeWidth="1.2"/>
      </svg>
    ),
  },
  {
    id: "reviews",
    label: "Reviews",
    icon: (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path d="M2 2h12a1 1 0 011 1v7a1 1 0 01-1 1H5l-3 3V3a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M5 6.5h6M5 9h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: "faqs",
    label: "FAQs",
    icon: (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
        <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M6.5 6a1.5 1.5 0 012.8.7c0 1-1.3 1.3-1.3 2.3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="8" cy="11.5" r=".75" fill="currentColor"/>
      </svg>
    ),
  },
]

/* ─── Component ───────────────────────────────────────────────────────────── */
export default function SchoolSubnav({
  activeSection,
  scrollToSection,
}: {
  activeSection: SectionId
  scrollToSection: (id: SectionId) => void
}) {
  const stripRef = useRef<HTMLDivElement>(null)
  const buttonRefs = useRef<Map<SectionId, HTMLButtonElement>>(new Map())

  // Auto-scroll the active tab into view whenever it changes
  useEffect(() => {
    const btn = buttonRefs.current.get(activeSection)
    const strip = stripRef.current
    if (!btn || !strip) return
    const btnCenter = btn.offsetLeft + btn.offsetWidth / 2
    strip.scrollTo({ left: btnCenter - strip.clientWidth / 2, behavior: "smooth" })
  }, [activeSection])

  return (
    <div
      className="sticky top-[64px] z-30"
      style={{
        background: "rgba(255,255,255,0.96)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderBottom: "1px solid #e4eaf3",
        boxShadow: "0 2px 16px -6px rgba(15,27,51,0.08)",
      }}
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div
          ref={stripRef}
          role="tablist"
          aria-label="School sections"
          className="flex overflow-x-auto"
          style={{ scrollbarWidth: "none", gap: "2px" }}
        >
          {TABS.map(({ id, label, icon }) => {
            const isActive = activeSection === id
            return (
              <button
                key={id}
                role="tab"
                aria-selected={isActive}
                ref={(el) => {
                  if (el) buttonRefs.current.set(id, el)
                  else buttonRefs.current.delete(id)
                }}
                onClick={() => scrollToSection(id)}
                className="group relative flex items-center gap-[6px] py-[13px] px-[14px] whitespace-nowrap cursor-pointer select-none transition-colors duration-150 flex-shrink-0"
                style={{
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  fontSize: "13.5px",
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? "#0052CC" : "#64748b",
                  borderBottom: isActive
                    ? "2.5px solid #0052CC"
                    : "2.5px solid transparent",
                  transition: "color 0.15s, border-color 0.15s, font-weight 0.1s",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLButtonElement).style.color = "#1a2a44"
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLButtonElement).style.color = "#64748b"
                  }
                }}
              >
                {/* Icon pill */}
                <span
                  className="flex items-center justify-center rounded-[6px] transition-all duration-150 flex-shrink-0"
                  style={{
                    width: "22px",
                    height: "22px",
                    background: isActive ? "rgba(0,82,204,0.10)" : "rgba(100,116,139,0.08)",
                    color: isActive ? "#0052CC" : "#94a3b8",
                    transition: "background 0.15s, color 0.15s",
                  }}
                >
                  {icon}
                </span>
                {label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Hide webkit scrollbar */}
      <style>{`
        [role="tablist"]::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  )
}
