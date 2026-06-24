"use client"

import { SchoolDetailData } from "./types"

interface SchoolSidebarProps {
  school: SchoolDetailData
  onOpenApply: () => void
  onOpenVisit: () => void
  onOpenCallback: () => void
}

export default function SchoolSidebar({
  school,
  onOpenApply,
  onOpenVisit,
  onOpenCallback,
}: SchoolSidebarProps) {

  const feeDisplay = school.feeRange || 
    (school.fees_min && school.fees_max 
      ? `₹${(school.fees_min / 100000).toFixed(1)} – ${(school.fees_max / 100000).toFixed(1)} L` 
      : null)

  const boardVal = school.curriculum || school.board || null
  const classesVal = school.class_range || "Nursery – Class 10"
  const locationVal = school.location || school.city || null

  return (
    <aside className="gis-aside" style={{ position: "sticky", top: "120px" }}>
      <div style={{
        background: "#fff",
        borderRadius: "16px",
        border: "1px solid #e9edf3",
        boxShadow: "0 14px 34px -16px rgba(15,27,51,.24)",
        overflow: "hidden"
      }}>
        {/* Top: Status + Fee */}
        <div style={{ padding: "18px 20px", borderBottom: "1px solid #eef1f5" }}>
          <div style={{ fontSize: "13px", color: "#0c8b51", fontWeight: 700, marginBottom: "6px", display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#0c8b51", display: "inline-block" }}></span>
            Admissions Open
          </div>
          <div style={{ fontSize: "13px", color: "#5b6b86" }}>Estimated annual fee</div>
          {feeDisplay ? (
            <div style={{ fontSize: "26px", fontWeight: 800, letterSpacing: "-.02em", color: "#0f1b33" }}>
              {feeDisplay}<span style={{ fontSize: "13px", fontWeight: 600, color: "#8a96aa" }}> /yr</span>
            </div>
          ) : (
            <div style={{ fontSize: "14px", color: "#8a96aa", fontWeight: 500, marginTop: "4px" }}>Contact school for fee details</div>
          )}
        </div>

        {/* Middle: Key Info */}
        <div style={{ padding: "14px 20px", display: "flex", flexDirection: "column", gap: "11px" }}>
          {boardVal && (
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
              <span style={{ color: "#5b6b86" }}>Board</span>
              <span style={{ fontWeight: 700, color: "#0f1b33" }}>{boardVal}</span>
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
            <span style={{ color: "#5b6b86" }}>Classes</span>
            <span style={{ fontWeight: 700, color: "#0f1b33" }}>{classesVal}</span>
          </div>
          {locationVal && (
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
              <span style={{ color: "#5b6b86" }}>Location</span>
              <span style={{ fontWeight: 700, color: "#0f1b33", textAlign: "right", maxWidth: "160px" }}>{locationVal}</span>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div style={{ padding: "4px 20px 20px", display: "flex", flexDirection: "column", gap: "10px" }}>
          <button
            onClick={onOpenApply}
            className="w-full bg-primary hover:bg-primary/95 text-white py-3 px-4 rounded-[11px] text-[15px] font-bold cursor-pointer border-0 shadow-[0_8px_20px_-8px_rgba(0,82,204,0.4)] transition-all"
          >
            Apply Now
          </button>
          <button
            onClick={onOpenVisit}
            className="w-full bg-secondary hover:bg-secondary/95 text-white py-3 px-4 rounded-[11px] text-[15px] font-bold cursor-pointer border-0 shadow-[0_8px_20px_-8px_rgba(34,197,94,0.3)] transition-all"
          >
            Schedule Visit
          </button>
          <button
            onClick={onOpenCallback}
            className="w-full bg-white hover:bg-slate-50 text-primary border-[1.5px] border-border hover:border-primary/30 py-3 px-4 rounded-[11px] text-[14px] font-bold cursor-pointer transition-all"
          >
            ↓ Download Fee Structure
          </button>
        </div>

        {/* Footer note */}
        <div style={{ padding: "12px 20px", background: "#f7f9fc", borderTop: "1px solid #eef1f5", fontSize: "12px", color: "#8a96aa", textAlign: "center" }}>
          Free counselling · No platform fee
        </div>
      </div>
    </aside>
  )
}
