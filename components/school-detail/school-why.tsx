"use client"

import { SchoolDetailData } from "./types"

interface SchoolWhyProps {
  school: SchoolDetailData
}

export default function SchoolWhy({ school }: SchoolWhyProps) {
  
  let highlightsArray: string[] = []
  if (Array.isArray(school.highlights)) {
    highlightsArray = school.highlights
  }

  const highlightsToRender = (school.highlights_structured && school.highlights_structured.length > 0)
    ? school.highlights_structured
    : highlightsArray.length > 0
      ? highlightsArray.map((hl: string) => ({
          title: hl,
          description: "",
          icon: "✓"
        }))
      : null

  return (
    <section 
      id="why-us" 
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
        Why us
      </div>
      <h2 style={{ fontSize: "21px", fontWeight: 800, letterSpacing: "-.02em", margin: "0 0 18px", color: "#0f1b33" }}>
        Why you should consider this school
      </h2>
      
      {highlightsToRender && highlightsToRender.length > 0 ? (
        <div 
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(228px, 1fr))",
            gap: "14px"
          }}
        >
          {highlightsToRender.map((hl: any, i: number) => (
            <div 
              key={i} 
              style={{
                border: "1px solid #eef1f5",
                borderRadius: "13px",
                padding: "18px",
                background: "#fcfdff",
                display: "grid",
                gridTemplateColumns: "auto 1fr",
                columnGap: "13px",
                rowGap: "3px",
                alignItems: "center"
              }}
            >
              <div 
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "10px",
                  background: "#e9f6ef",
                  color: "#0c8b51",
                  fontWeight: 800,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "15px",
                  gridRow: hl.description ? "span 2" : "span 1",
                  flexShrink: 0
                }}
              >
                ✓
              </div>
              <div style={{ fontSize: "15px", fontWeight: 700, color: "#0f1b33" }}>
                {hl.title}
              </div>
              {hl.description && (
                <div style={{ fontSize: "13px", color: "#6c7a92", lineHeight: 1.5 }}>
                  {hl.description}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div style={{ border: "1px solid #eef1f5", borderRadius: "12px", padding: "26px 20px", textAlign: "center", fontSize: "14.5px", color: "#6c7a92", fontWeight: 500 }}>
          School highlights and key features have not been registered yet.
        </div>
      )}
    </section>
  )
}
