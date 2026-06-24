"use client"

import { SectionId } from "./types"

interface SchoolSubnavProps {
  activeSection: SectionId
  scrollToSection: (id: SectionId) => void
}

export default function SchoolSubnav({
  activeSection,
  scrollToSection
}: {
  activeSection: SectionId
  scrollToSection: (id: SectionId) => void
}) {
  
  const sections: { id: SectionId; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "about", label: "About" },
    { id: "admissions", label: "Admissions" },
    { id: "fees", label: "Fees" },
    { id: "why-us", label: "Why this school" },
    { id: "gallery", label: "Gallery" },
    { id: "facilities", label: "Facilities" },
    { id: "reviews", label: "Reviews" },
    { id: "faqs", label: "FAQs" }
  ]

  return (
    <div className="sticky top-[64px] z-30 bg-white/92 backdrop-blur-md border-b border-[#e9edf3] mt-[18px]">
      <div className="max-w-[1200px] mx-auto px-6 flex gap-[26px] overflow-x-auto scrollbar-none">
        {sections.map(({ id, label }) => {
          const active = activeSection === id
          return (
            <button
              key={id}
              onClick={() => scrollToSection(id)}
              className={`py-3.5 px-0.5 text-[14px] border-b-2 whitespace-nowrap bg-transparent shadow-none rounded-none cursor-pointer transition-all ${
                active 
                  ? "text-primary border-primary font-extrabold"
                  : "text-[#5b6b86] font-semibold border-transparent hover:text-primary hover:border-[#c3cede]"
              }`}
            >
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
