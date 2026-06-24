"use client"

import { useState } from "react"
import Image from "next/image"
import { SchoolDetailData } from "./types"

interface SchoolGalleryProps {
  school: SchoolDetailData
  galleryCategory: string
  setGalleryCategory: (category: string) => void
}

export default function SchoolGallery({
  school,
  galleryCategory,
  setGalleryCategory
}: SchoolGalleryProps) {
  
  const galleryImages = school.gallery || []

  // Mapped list of images
  const imagesList = galleryImages

  // Dynamically resolve categories from the database images
  const categoriesFromDb = Array.from(new Set(galleryImages.map(img => img.category || "Campus").filter(Boolean))) as string[]
  const defaultCategories = ["All", ...(categoriesFromDb.length > 0 ? categoriesFromDb : ["Campus", "Classroom", "Sports", "Activity"])]

  const filteredImages = galleryCategory.toLowerCase() === "all"
    ? imagesList
    : imagesList.filter(
        img => (img.category || "Campus").toLowerCase() === galleryCategory.toLowerCase()
      )

  const [activeIndex, setActiveIndex] = useState(0)
  
  // Get active image URL / details
  const activeImg = filteredImages[activeIndex] || filteredImages[0] || imagesList[0]
  const activeUrl = activeImg?.imageUrl || activeImg?.image_url || ""

  return (
    <section 
      id="gallery" 
      className="scroll-mt-[120px]"
      style={{
        background: "#fff",
        border: "1px solid #e9edf3",
        borderRadius: "16px",
        padding: "26px 28px",
        boxShadow: "0 1px 2px rgba(15,27,51,.05),0 10px 26px -16px rgba(15,27,51,.1)"
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "14px", marginBottom: "18px" }}>
        <div>
          <div style={{ fontSize: "12px", fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--primary)", marginBottom: "4px" }}>
            Gallery
          </div>
          <h2 style={{ fontSize: "21px", fontWeight: 800, letterSpacing: "-.02em", margin: 0, color: "#0f1b33" }}>
            Campus gallery
          </h2>
        </div>
        <button 
          style={{
            background: "rgba(0, 82, 204, 0.08)",
            color: "var(--primary)",
            border: 0,
            padding: "11px 18px",
            borderRadius: "10px",
            fontSize: "14px",
            fontWeight: 700,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          ▶ 360° Virtual Tour
        </button>
      </div>

      {galleryImages.length > 0 ? (
        <>
          {/* Tabs */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "14px", flexWrap: "wrap" }}>
        {defaultCategories.map(cat => {
          const isActive = galleryCategory.toLowerCase() === cat.toLowerCase()
          return (
            <button
              key={cat}
              onClick={() => {
                setGalleryCategory(cat)
                setActiveIndex(0)
              }}
              style={{
                border: 0,
                padding: "9px 16px",
                borderRadius: "9px",
                fontSize: "14px",
                fontWeight: 700,
                cursor: "pointer",
                background: isActive ? "var(--primary)" : "#f3f5f9",
                color: isActive ? "#fff" : "#5b6b86",
                transition: "all 0.2s"
              }}
            >
              {cat}
            </button>
          )
        })}
      </div>

      {/* Main Viewport */}
      <div 
        style={{
          position: "relative",
          height: "330px",
          borderRadius: "14px",
          overflow: "hidden",
          background: "repeating-linear-gradient(45deg,#e3e9f3,#e3e9f3 13px,#dae2ef 13px,#dae2ef 26px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        {activeUrl ? (
          <Image
            src={activeUrl}
            alt={activeImg?.caption || "Campus photo"}
            fill
            className="object-cover"
          />
        ) : (
          <span 
            id="gis-gal-main" 
            style={{
              fontFamily: "monospace",
              fontSize: "13px",
              color: "#7d8aa0",
              background: "rgba(255,255,255,.78)",
              padding: "6px 14px",
              borderRadius: "8px"
            }}
          >
            {galleryCategory} photo · {activeImg?.caption || "Demo aspect ratio"}
          </span>
        )}
        
        {imagesList.length > 4 && (
          <span style={{ position: "absolute", bottom: "14px", right: "14px", background: "rgba(15,27,51,.7)", color: "#fff", fontSize: "12px", fontWeight: 600, padding: "5px 11px", borderRadius: "999px" }}>
            + {imagesList.length} photos
          </span>
        )}
      </div>

      {/* Thumbnails List */}
      <div className="scrollbar-hide" style={{ display: "flex", gap: "8px", marginTop: "8px", overflowX: "auto", paddingBottom: "4px" }}>
        {filteredImages.map((img, idx) => {
          const isSelected = activeIndex === idx
          const url = img.imageUrl || img.image_url || ""
          
          return (
            <div 
              key={img.id || idx}
              onClick={() => setActiveIndex(idx)}
              style={{
                width: "90px",
                height: "74px",
                flexShrink: 0,
                borderRadius: "9px",
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
                border: isSelected ? "2.5px solid var(--primary)" : "1px solid #dfe6f0",
                background: "repeating-linear-gradient(45deg,#e8edf5,#e8edf5 9px,#dfe6f0 9px,#dfe6f0 18px)"
              }}
            >
              {url && (
                <Image
                  src={url}
                  alt={img.caption || "Thumbnail"}
                  fill
                  className="object-cover"
                />
              )}
            </div>
          )
        })}
      </div>
    </>
  ) : (
        <div style={{ border: "1px solid #eef1f5", borderRadius: "12px", padding: "26px 20px", textAlign: "center", fontSize: "14.5px", color: "#6c7a92", fontWeight: 500 }}>
          Campus gallery images have not been uploaded yet.
        </div>
      )}
    </section>
  )
}
