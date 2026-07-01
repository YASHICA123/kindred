"use client"

import Image from "next/image"
import { ChevronRight } from "lucide-react"
import Link from "next/link"
import { SchoolDetailData } from "./types"

interface SchoolHeaderProps {
  school: SchoolDetailData
  averageRating: string
  totalReviewsCount: number
  onOpenApply: () => void
  onOpenCallback: () => void
  onOpenVisit: () => void
  onShowToast: (msg: string, type?: "success" | "error") => void
}

export default function SchoolHeader({
  school,
  averageRating,
  totalReviewsCount,
  onOpenApply,
  onOpenCallback,
  onOpenVisit,
  onShowToast
}: SchoolHeaderProps) {
  
  const logoText = school.name
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const establishedText = school.established ? `Estd. ${school.established}` : "Estd. 2004"
  const curriculumText = school.curriculum || "CBSE"

  const schoolTypes = school.school_types || []
  const genderType = schoolTypes.find(t => ["co-educational", "boys-only", "girls-only"].includes(t.slug))?.name || "Co-educational"
  const boardingType = schoolTypes.find(t => ["day-school", "boarding"].includes(t.slug))?.name || (school.type ? `${school.type} School` : "Day School")

  return (
    <div className="w-full">
      {/* Hero Banner Section */}
      <div className="bg-white rounded-[18px] overflow-hidden border border-[#e9edf3] shadow-[0_1px_2px_rgba(15,27,51,0.06),0_14px_34px_-18px_rgba(15,27,51,0.18)]">
        
        {/* Banner */}
        <div 
          className="relative h-[180px] sm:h-[300px] w-full"
          style={{
            background: !school.image ? "repeating-linear-gradient(45deg,#dbe3f0,#dbe3f0 12px,#d2dbeb 12px,#d2dbeb 24px)" : undefined
          }}
        >
          {school.image && (
            <Image
              src={school.image}
              alt={school.name}
              fill
              priority
              className="object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-primary/20" />
          
          {/* Admissions Open Badge */}
          <span className="absolute top-[18px] right-[20px] inline-flex items-center gap-1.5 bg-[#0c8b51] text-white text-[13px] font-bold py-2 px-3.5 rounded-full shadow-[0_6px_16px_rgba(12,139,81,0.4)]">
            <span className="w-2 h-2 rounded-full bg-white block"></span>
            Admissions Open 2026–27
          </span>
        </div>

        {/* Hero Pad Details */}
        <div className="px-5 pb-6 pt-16 sm:pt-6 sm:px-[30px] sm:pb-[26px] relative">
          
          {/* Logo & Title overlapping */}
          <div className="flex gap-5 items-end -mt-[46px] sm:-mt-[46px] flex-wrap">
            {/* Logo */}
            <div className="w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] rounded-[20px] bg-white border border-[#e9edf3] shadow-[0_10px_28px_-10px_rgba(15,27,51,0.28)] flex items-center justify-center text-[#9aa7bd] font-mono text-[11px] shrink-0">
              {logoText || "logo"}
            </div>
            
            {/* Info */}
            <div className="pb-1.5 flex-1 min-w-[200px]">
              <div className="text-[13px] text-primary font-bold mb-1 tracking-[0.01em]">
                {curriculumText} · {boardingType} · {genderType} · {establishedText}
              </div>
              <h1 className="text-[22px] sm:text-[30px] font-extrabold text-[#0f1b33] tracking-[-0.025em] leading-[1.08] m-0">
                {school.name}
              </h1>
            </div>
          </div>

          {/* Meta details */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 mt-4 text-[13px] sm:text-[14px] font-medium text-[#5b6b86]">
            <span>📍 {school.location || `${school.city}, ${school.state}`}</span>
            <span className="text-[#d6dde7]">•</span>
            <span>{school.class_range || school.classRange || "Nursery – Class 12"}</span>
            <span className="text-[#d6dde7]">•</span>
            <span className="text-[#0f1b33] font-bold">
              ★ {averageRating} <span className="font-normal text-[#8a96aa]">({totalReviewsCount} reviews)</span>
            </span>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-3 mt-[22px]">
            <button 
              onClick={onOpenApply}
              className="bg-primary hover:bg-primary/95 text-white font-bold py-3 px-6 sm:py-3.5 sm:px-7 rounded-[11px] text-[15px] cursor-pointer shadow-[0_8px_20px_-8px_rgba(0,82,204,0.4)] border-0 transition-all"
            >
              Apply Now
            </button>
            <button 
              onClick={onOpenVisit}
              className="bg-secondary hover:bg-secondary/95 text-white font-bold py-3 px-5 sm:py-3.5 sm:px-6 rounded-[11px] text-[15px] cursor-pointer border-0 transition-all shadow-[0_8px_20px_-8px_rgba(34,197,94,0.3)]"
            >
              Schedule Visit
            </button>
            <button 
              onClick={onOpenCallback}
              className="bg-white hover:bg-slate-50 text-primary font-bold py-3 px-5 sm:py-3.5 sm:px-6 rounded-[11px] text-[15px] cursor-pointer border-[1.5px] border-border hover:border-primary/30 transition-all"
            >
              Get Callback
            </button>
          </div>

        </div>

      </div>
    </div>
  )
}
