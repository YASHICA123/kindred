"use client"

import { SchoolDetailData } from "./types"

interface SchoolOverviewProps {
  school: SchoolDetailData
  averageRating: string
  isDescExpanded: boolean
  onToggleDesc: () => void
  aboutRef?: React.RefObject<HTMLDivElement | null>
}

export default function SchoolOverview({
  school,
  averageRating,
  isDescExpanded,
  onToggleDesc,
  aboutRef
}: SchoolOverviewProps) {
  
  const ratingText = averageRating === "0.0" ? "No reviews" : `★ ${averageRating}`

  // Parse school types dynamically from database
  const schoolTypes = school.school_types || []
  const genderType = schoolTypes.find(t => ["co-educational", "boys-only", "girls-only"].includes(t.slug))?.name || "Co-educational"
  const boardingType = schoolTypes.find(t => ["day-school", "boarding"].includes(t.slug))?.name || (school.type ? `${school.type} School` : "Day School")

  // Row 1 Fields
  const boardVal = school.curriculum || school.board || "Not Specified"
  const schoolTypeVal = `Private · ${boardingType.replace(" School", "")}`
  const genderVal = genderType

  let classesVal = school.class_range || "Not Specified"
  if (!school.class_range) {
    if (school.seat_availability && Object.keys(school.seat_availability).length > 0) {
      const keys = Object.keys(school.seat_availability)
      const hasNursery = keys.some(k => /nursery/i.test(k))
      const hasKG = keys.some(k => /kg/i.test(k))
      const has12 = keys.some(k => /12|twelve/i.test(k))
      const has10 = keys.some(k => /10|ten/i.test(k))
      const start = hasNursery ? "Nursery" : (hasKG ? "KG" : "Class 1")
      const end = has12 ? "Class 12" : (has10 ? "Class 10" : "Class 12")
      classesVal = `${start} – ${end}`
    } else if (school.description) {
      const match = school.description.match(/(nursery|kg|class\s*\d+|grade\s*\d+)\s*(to|–|-)\s*(class\s*\d+|grade\s*\d+)/i)
      if (match) {
        classesVal = match[0]
      }
    }
  }

  const annualFeeVal = school.feeRange || (school.fees_min && school.fees_max ? `₹${(school.fees_min / 100000).toFixed(1)} – ${(school.fees_max / 100000).toFixed(1)} L` : "Not Published")

  // Row 2 Fields
  let ratioVal = "Not Specified"
  if (school.description) {
    const match = school.description.match(/(\d+)\s*:\s*(\d+)/)
    if (match) {
      ratioVal = `${match[1]} : ${match[2]}`
    }
  }

  let campusVal = "Not Specified"
  if (school.description) {
    const match = school.description.match(/(\d+(\.\d+)?)\s*-?\s*acre/i)
    if (match) {
      campusVal = `${match[1]} Acres`
    }
  }

  const hasTransport = school.facilities?.some(f => /transport|bus/i.test(f)) || school.description?.toLowerCase().includes("transport")
  const transportVal = hasTransport ? "Available" : "Contact School"

  const sessionVal = "2026–27"
  const appVal = school.seat_availability && Object.keys(school.seat_availability).length > 0 ? "Open" : "Contact School"

  // Quick facts array matching the exact 5x2 grid layout
  const allFacts = [
    { label: "Board", value: boardVal },
    { label: "School Type", value: schoolTypeVal },
    { label: "Gender", value: genderVal },
    { label: "Classes", value: classesVal },
    { label: "Annual Fee", value: annualFeeVal },
    { label: "Student-Teacher Ratio", value: ratioVal },
    { label: "Campus", value: campusVal },
    { label: "Transport", value: transportVal },
    { label: "Session", value: sessionVal },
    { label: "Application", value: appVal, isStatus: true }
  ]

  // Splitting description into paragraphs for nicer rendering
  const descriptionText = school.description || ""
  const paragraphs = descriptionText.split('\n\n').filter(p => p.trim() !== '')
  const firstParagraph = paragraphs[0] || "No description registered yet for this school."
  const remainingParagraphs = paragraphs.slice(1)

  return (
    <div className="space-y-5">
      {/* QUICK FACTS SECTION */}
      <section 
        id="facts" 
        className="scroll-mt-[120px]"
        style={{
          background: "#fff",
          border: "1px solid #e9edf3",
          borderRadius: "16px",
          padding: "26px 28px",
          boxShadow: "0 1px 2px rgba(15,27,51,.05),0 10px 26px -16px rgba(15,27,51,.1)"
        }}
      >
        <div style={{ fontSize: "12px", fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--primary)", marginBottom: "4px" }}>
          Quick facts
        </div>
        <h2 style={{ fontSize: "21px", fontWeight: 800, letterSpacing: "-.02em", margin: "0 0 18px", color: "#0f1b33" }}>
          School overview &amp; highlights
        </h2>
        
        <div 
          className="grid grid-cols-2 md:grid-cols-5 gap-[1px] bg-[#eef1f5] border border-[#eef1f5] rounded-[12px] overflow-hidden"
        >
          {allFacts.map((fact, index) => (
            <div key={index} style={{ background: "#fff", padding: "16px 18px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div 
                style={{
                  fontSize: "11px",
                  color: "#8a96aa",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: ".04em",
                  marginBottom: "5px"
                }}
              >
                {fact.label}
              </div>
              <div 
                style={{ 
                  fontSize: "15px", 
                  fontWeight: 800, 
                  color: fact.isStatus ? "#0c8b51" : "#0f1b33",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px"
                }}
              >
                {fact.isStatus && (
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#0c8b51", display: "inline-block" }}></span>
                )}
                {fact.value}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section 
        ref={aboutRef}
        id="about" 
        className="scroll-mt-[120px]"
        style={{
          background: "#fff",
          border: "1px solid #e9edf3",
          borderRadius: "16px",
          padding: "26px 28px",
          boxShadow: "0 1px 2px rgba(15,27,51,.05),0 10px 26px -16px rgba(15,27,51,.1)"
        }}
      >
        <div style={{ fontSize: "12px", fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--primary)", marginBottom: "4px" }}>
          About
        </div>
        <h2 style={{ fontSize: "21px", fontWeight: 800, letterSpacing: "-.02em", margin: "0 0 16px", color: "#0f1b33" }}>
          About the school
        </h2>
        
        <div style={{ fontSize: "14.5px", color: "#3a4a66", lineHeight: 1.65, display: "flex", flexDirection: "column", gap: "12px" }}>
          <p>{firstParagraph}</p>
          
          {isDescExpanded && remainingParagraphs.length > 0 && (
            <div className="flex flex-col gap-3 animate-in fade-in duration-200">
              {remainingParagraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          )}

          {remainingParagraphs.length > 0 && (
            <div className="mt-2">
              <button 
                onClick={onToggleDesc}
                className="gis-readmore" 
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "11px",
                  background: "#fff",
                  color: "var(--primary)",
                  border: "1.5px solid #dbe2ec",
                  padding: "11px 13px 11px 22px",
                  borderRadius: "999px",
                  fontSize: "14px",
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "0 5px 16px -9px rgba(15,27,51,.28)"
                }}
              >
                <span>{isDescExpanded ? "Show less" : `Read more about the school`}</span>
                <span 
                  style={{
                    width: "23px",
                    height: "23px",
                    borderRadius: "50%",
                    background: "var(--primary)",
                    color: "#fff",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "9px",
                    flexShrink: 0,
                    transform: isDescExpanded ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s"
                  }}
                >
                  ▼
                </span>
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
