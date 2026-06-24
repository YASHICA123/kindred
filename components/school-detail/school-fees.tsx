"use client"

import { SchoolDetailData } from "./types"

interface SchoolFeesProps {
  school: SchoolDetailData
  onOpenCallback: () => void
}

export default function SchoolFees({ school, onOpenCallback }: SchoolFeesProps) {
  
  const feesToRender = school.fees || []
  
  const scholarshipsList = school.scholarships && school.scholarships.length > 0
    ? school.scholarships.filter(sc => sc && (sc.title || sc.description))
    : []

  return (
    <div className="space-y-5">
      
      {/* FEES STRUCTURE SECTION */}
      <section 
        id="fees" 
        className="scroll-mt-[120px]"
        style={{
          background: "#fff",
          border: "1px solid #e9edf3",
          borderRadius: "16px",
          padding: "26px 28px",
          boxShadow: "0 1px 2px rgba(15,27,51,.05),0 10px 26px -16px rgba(15,27,51,.1)"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px", marginBottom: "18px" }}>
          <div>
            <div style={{ fontSize: "12px", fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--primary)", marginBottom: "4px" }}>
              Fees
            </div>
            <h2 style={{ fontSize: "21px", fontWeight: 800, letterSpacing: "-.02em", margin: 0, color: "#0f1b33" }}>
              Fee structure (indicative)
            </h2>
          </div>
          <span 
            style={{
              fontSize: "12px",
              color: "#8a96aa",
              background: "#f5f7fa",
              border: "1px solid #e9edf3",
              padding: "6px 12px",
              borderRadius: "999px",
              alignSelf: "center",
              fontWeight: 600
            }}
          >
            Session 2026–27
          </span>
        </div>

        {feesToRender.length > 0 ? (
          <div style={{ border: "1px solid #eef1f5", borderRadius: "12px", overflow: "hidden" }}>
            <div 
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "14px 18px",
                background: "#f7f9fc",
                fontSize: "12px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: ".05em",
                color: "#8a96aa"
              }}
            >
              <span>Component</span>
              <span>Amount</span>
            </div>
            {feesToRender.map((fee, idx) => (
              <div 
                key={fee.id || idx} 
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "14px 18px",
                  borderTop: "1px solid #eef1f5",
                  fontSize: "15px"
                }}
              >
                <span style={{ color: "#3a4a66", fontWeight: 500 }}>
                  {fee.level}{" "}
                  {fee.notes && (
                    <span style={{ fontSize: "12px", color: "#aab3c4" }}>
                      ({fee.notes})
                    </span>
                  )}
                </span>
                <span style={{ fontWeight: 700, color: "#0f1b33" }}>
                  {fee.totalFee || fee.tuitionFee || "—"}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div 
            style={{ 
              border: "1px solid #eef1f5", 
              borderRadius: "12px", 
              padding: "26px 20px", 
              textAlign: "center",
              fontSize: "14.5px",
              color: "#6c7a92",
              fontWeight: 500
            }}
          >
            Detailed class-wise fee structure has not been registered yet. Please click below to request the fee details from the school office.
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", marginTop: "18px" }}>
          <div style={{ fontSize: "13px", color: "#8a96aa", maxWidth: "340px", lineHeight: 1.5, fontWeight: 500 }}>
            Figures are indicative. Download the official, class-wise fee sheet for exact amounts.
          </div>
          <button 
            onClick={onOpenCallback}
            style={{
              background: "var(--primary)",
              color: "#fff",
              border: 0,
              padding: "13px 22px",
              borderRadius: "11px",
              fontSize: "15px",
              fontWeight: 700,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            ↓ Download Complete Fee Structure
          </button>
        </div>
      </section>

      {/* SCHOLARSHIP SECTION */}
      {scholarshipsList.length > 0 && (
        <section 
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
            Financial support
          </div>
          <h2 style={{ fontSize: "21px", fontWeight: 800, letterSpacing: "-.02em", margin: "0 0 18px", color: "#0f1b33" }}>
            Scholarships
          </h2>
          
          <div 
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "14px",
              marginBottom: "18px"
            }}
          >
            {scholarshipsList.map((sc, i) => (
              <div 
                key={i} 
                style={{
                  border: "1px solid #eef1f5",
                  borderRadius: "13px",
                  padding: "18px"
                }}
              >
                <div style={{ fontSize: "15px", fontWeight: 700, marginBottom: "4px", color: "#0f1b33" }}>
                  {sc.title}
                </div>
                <div style={{ fontSize: "13px", color: "#6c7a92", lineHeight: 1.5 }}>
                  {sc.description}
                </div>
              </div>
            ))}
          </div>
          
          <button 
            onClick={onOpenCallback}
            style={{
              background: "var(--primary)",
              color: "#fff",
              border: 0,
              padding: "13px 22px",
              borderRadius: "11px",
              fontSize: "15px",
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            Check Scholarship Eligibility
          </button>
        </section>
      )}

    </div>
  )
}
