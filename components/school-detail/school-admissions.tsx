"use client"

import { SchoolDetailData } from "./types"

interface SchoolAdmissionsProps {
  school: SchoolDetailData
  isWithdrawalOpen: boolean
  onToggleWithdrawal: () => void
  onOpenApply: () => void
}

export default function SchoolAdmissions({
  school,
  isWithdrawalOpen,
  onToggleWithdrawal,
  onOpenApply
}: SchoolAdmissionsProps) {
  
  const seatAvailabilities = school.seat_availability
    ? Object.entries(school.seat_availability).map(([grades, status]) => {
        const lower = status.toLowerCase()
        let cardBg = "#f8f9fb"
        let cardBorder = "1px solid #eef1f5"
        let badgeColor = "#5b6b86"
        let badgeBg = "#fff"
        let badgeBorder = "1px solid #e2e7ef"
        
        if (lower.includes("open")) {
          cardBg = "#f4faf6"
          cardBorder = "1px solid #d8eee1"
          badgeColor = "#0c8b51"
          badgeBorder = "1px solid #cfe9da"
        } else if (lower.includes("limit")) {
          cardBg = "#fdfcf7"
          cardBorder = "1px solid #f0e6c8"
          badgeColor = "#b27d14"
          badgeBorder = "1px solid #f2e7c9"
        }
        
        return { grades, status, cardBg, cardBorder, badgeColor, badgeBg, badgeBorder }
      })
    : []

  const admissionProcess = school.admission_process && school.admission_process.length > 0
    ? school.admission_process
    : []

  const documentsRequired = school.documents_required && school.documents_required.length > 0
    ? school.documents_required
    : []

  const withdrawalPolicyText = school.withdrawal_policy || null

  const hasAnyAdmissionsData = seatAvailabilities.length > 0 || 
                               admissionProcess.length > 0 || 
                               documentsRequired.length > 0 || 
                               withdrawalPolicyText !== null

  // Show seat warning alert only if "limited" seats exist in the availability grid
  const hasLimitedSeats = seatAvailabilities.some(s => s.status.toLowerCase().includes("limit"))

  return (
    <div className="space-y-6">
      {/* Class Availability Grid */}
      <section 
        id="admissions" 
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
          Admissions 2026–27
        </div>
        <h2 style={{ fontSize: "21px", fontWeight: 800, letterSpacing: "-.02em", margin: "0 0 18px", color: "#0f1b33" }}>
          Class-wise seat availability
        </h2>

        {seatAvailabilities.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "12px", marginBottom: hasLimitedSeats ? "18px" : "0" }}>
            {seatAvailabilities.map((seat, index) => (
              <div 
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: seat.cardBg,
                  border: seat.cardBorder,
                  borderRadius: "11px",
                  padding: "13px 15px"
                }}
              >
                <span style={{ fontWeight: 700, fontSize: "15px", color: "#0f1b33" }}>{seat.grades}</span>
                <span 
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    color: seat.badgeColor,
                    background: seat.badgeBg,
                    border: seat.badgeBorder,
                    padding: "4px 10px",
                    borderRadius: "999px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px"
                  }}
                >
                  ● {seat.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ border: "1px solid #eef1f5", borderRadius: "12px", padding: "26px 20px", textAlign: "center", fontSize: "14.5px", color: "#6c7a92", fontWeight: 500 }}>
            Seat availability details for the upcoming session have not been published yet. Please click below to contact the admissions team directly.
            <div className="mt-4">
              <button 
                onClick={onOpenApply}
                style={{
                  background: "var(--primary)",
                  color: "#fff",
                  border: 0,
                  padding: "12px 22px",
                  borderRadius: "11px",
                  fontSize: "14px",
                  fontWeight: 700,
                  cursor: "pointer"
                }}
              >
                Enquire About Admissions
              </button>
            </div>
          </div>
        )}

        {/* Seat Alert Callout (only if limited seats found) */}
        {hasLimitedSeats && (
          <div 
            style={{
              background: "#fffdf6",
              border: "1px solid #f0e6c8",
              borderRadius: "13px",
              padding: "18px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "14px",
              marginTop: "18px"
            }}
          >
            <div style={{ display: "flex", gap: "12px", alignItems: "flex-start", maxWidth: "440px" }}>
              <span style={{ fontSize: "21px", marginTop: "-2px" }}>⚠️</span>
              <div>
                <div style={{ fontSize: "15px", fontWeight: 700, color: "#0f1b33" }}>Limited seats in higher grades</div>
                <div style={{ fontSize: "13px", color: "#6c7a92", lineHeight: 1.45, marginTop: "2px", fontWeight: 500 }}>
                  Admission is strictly subject to vacant seats. Click to reserve a seat callback.
                </div>
              </div>
            </div>
            <button 
              onClick={onOpenApply}
              style={{
                background: "var(--primary)",
                color: "#fff",
                border: 0,
                padding: "12px 22px",
                borderRadius: "11px",
                fontSize: "14px",
                fontWeight: 700,
                cursor: "pointer"
              }}
            >
              Enquire Now
            </button>
          </div>
        )}
      </section>

      {/* Timeline steps */}
      {admissionProcess.length > 0 && (
        <section
          style={{
            background: "#fff",
            border: "1px solid #e9edf3",
            borderRadius: "16px",
            padding: "26px 28px",
            boxShadow: "0 1px 2px rgba(15,27,51,.05),0 10px 26px -16px rgba(15,27,51,.1)"
          }}
        >
          <div style={{ fontSize: "12px", fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--primary)", marginBottom: "4px" }}>
            How it works
          </div>
          <h2 style={{ fontSize: "21px", fontWeight: 800, letterSpacing: "-.02em", margin: "0 0 20px", color: "#0f1b33" }}>
            Admission process in {admissionProcess.length} steps
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "14px" }}>
            {admissionProcess.map((proc, index) => {
              const isLast = index === admissionProcess.length - 1
              const cardBg = isLast ? "#f4faf6" : "#fff"
              const cardBorder = isLast ? "1px solid #d8eee1" : "1px solid #eef1f5"
              const badgeBg = isLast ? "#0c8b51" : "var(--primary)"
              
              return (
                <div 
                  key={index} 
                  style={{
                    border: cardBorder,
                    background: cardBg,
                    borderRadius: "13px",
                    padding: "18px",
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
                      background: badgeBg,
                      color: "#fff",
                      fontWeight: 800,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "15px",
                      gridRow: "span 2",
                      flexShrink: 0
                    }}
                  >
                    {proc.step || index + 1}
                  </div>
                  <div style={{ fontSize: "15px", fontWeight: 700, color: "#0f1b33" }}>
                    {proc.title}
                  </div>
                  <div style={{ fontSize: "13px", color: "#6c7a92", lineHeight: 1.5 }}>
                    {proc.description}
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* Documents checklist */}
      {documentsRequired.length > 0 && (
        <section
          style={{
            background: "#fff",
            border: "1px solid #e9edf3",
            borderRadius: "16px",
            padding: "26px 28px",
            boxShadow: "0 1px 2px rgba(15,27,51,.05),0 10px 26px -16px rgba(15,27,51,.1)"
          }}
        >
          <div style={{ fontSize: "12px", fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--primary)", marginBottom: "4px" }}>
            Get ready
          </div>
          <h2 style={{ fontSize: "21px", fontWeight: 800, letterSpacing: "-.02em", margin: "0 0 18px", color: "#0f1b33" }}>
            Documents required
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "11px" }}>
            {documentsRequired.map((doc, idx) => {
              const isSecondary = doc.toLowerCase().includes("transfer") || 
                                  doc.toLowerCase().includes("medical") || 
                                  doc.toLowerCase().includes("applicable") ||
                                  doc.toLowerCase().includes("secondary")
                                  
              const iconSymbol = isSecondary ? "∗" : "✓"
              const iconBg = isSecondary ? "#fff4e8" : "#e9f6ef"
              const iconColor = isSecondary ? "#c2410c" : "#0c8b51"
              
              return (
                <div 
                  key={idx} 
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "11px",
                    border: "1px solid #eef1f5",
                    borderRadius: "11px",
                    padding: "14px 16px"
                  }}
                >
                  <span 
                    style={{
                      width: "26px",
                      height: "26px",
                      borderRadius: "50%",
                      background: iconBg,
                      color: iconColor,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: isSecondary ? "16px" : "14px",
                      fontWeight: 700,
                      flexShrink: 0
                    }}
                  >
                    {iconSymbol}
                  </span>
                  <span style={{ fontSize: "14px", fontWeight: 600, color: "#3a4a66" }}>
                    {doc}
                  </span>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* Withdrawal Accordion */}
      {withdrawalPolicyText && (
        <section 
          style={{
            background: "#fff",
            border: "1px solid #e9edf3",
            borderRadius: "16px",
            padding: isWithdrawalOpen ? "8px 28px 22px" : "8px 28px",
            boxShadow: "0 1px 2px rgba(15,27,51,.05),0 10px 26px -16px rgba(15,27,51,.1)"
          }}
        >
          <button
            onClick={onToggleWithdrawal}
            style={{
              width: "100%",
              background: "none",
              border: 0,
              padding: "20px 0",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
              textAlign: "left"
            }}
          >
            <span style={{ fontSize: "17px", fontWeight: 700, color: "#0f1b33" }}>
              Withdrawal &amp; refund policy
            </span>
            <span 
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "8px",
                background: "#f0f3f8",
                color: "var(--primary)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px",
                flexShrink: 0
              }}
            >
              {isWithdrawalOpen ? "−" : "+"}
            </span>
          </button>
          {isWithdrawalOpen && (
            <div 
              style={{
                padding: "0 0 10px",
                fontSize: "14px",
                color: "#3a4a66",
                lineHeight: 1.65
              }}
            >
              <p className="whitespace-pre-line">{withdrawalPolicyText}</p>
            </div>
          )}
        </section>
      )}
    </div>
  )
}
