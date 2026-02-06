"use client"

import { useState } from "react"
import { X, ChevronLeft, ChevronRight, Play } from "lucide-react"

const galleryItems = [
  { type: "image", src: "/modern-school-building-with-green-campus-architect.jpg", alt: "School Campus" },
  { type: "image", src: "/diverse-students-science-lab-modern-equipment.jpg", alt: "Science Lab" },
  { type: "image", src: "/school-library-modern-reading-area-students.jpg", alt: "Library" },
  {
    type: "video",
    src: "/school-sports-field-aerial-view.jpg",
    alt: "Sports Facilities",
    thumbnail: "/school-sports-field-aerial-view.jpg",
  },
  { type: "image", src: "/school-auditorium-performing-arts-stage.jpg", alt: "Auditorium" },
  { type: "image", src: "/early-childhood-classroom-colorful-play-based.jpg", alt: "Early Years" },
]

export function SchoolGallery() {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const openLightbox = (index: number) => {
    setCurrentIndex(index)
    setLightboxOpen(true)
  }

  return (
    <section className="py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-sm font-medium text-primary uppercase tracking-wider">Campus Life</span>
            <h2 className="font-serif text-2xl lg:text-3xl mt-2">See Our School</h2>
          </div>
          <button className="text-sm font-medium text-primary hover:underline">View all photos</button>
        </div>

        {/* Masonry-style gallery */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {galleryItems.map((item, index) => (
            <button
              key={index}
              onClick={() => openLightbox(index)}
              className={`relative rounded-xl overflow-hidden group ${
                index === 0 ? "col-span-2 row-span-2 aspect-square" : "aspect-[4/3]"
              }`}
            >
              <img
                src={item.src || "/placeholder.svg"}
                alt={item.alt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {item.type === "video" && (
                <div className="absolute inset-0 flex items-center justify-center bg-foreground/20">
                  <div className="w-14 h-14 rounded-full bg-background/90 flex items-center justify-center">
                    <Play className="h-6 w-6 text-foreground ml-1" />
                  </div>
                </div>
              )}
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors" />
            </button>
          ))}
        </div>

        {/* Lightbox */}
        {lightboxOpen && (
          <div className="fixed inset-0 z-50 bg-foreground/95 flex items-center justify-center">
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 p-3 text-background hover:bg-background/10 rounded-full"
            >
              <X className="h-6 w-6" />
            </button>
            <button
              onClick={() => setCurrentIndex((prev) => (prev - 1 + galleryItems.length) % galleryItems.length)}
              className="absolute left-4 p-3 text-background hover:bg-background/10 rounded-full"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={() => setCurrentIndex((prev) => (prev + 1) % galleryItems.length)}
              className="absolute right-4 p-3 text-background hover:bg-background/10 rounded-full"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
            <img
              src={galleryItems[currentIndex].src || "/placeholder.svg"}
              alt={galleryItems[currentIndex].alt}
              className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
            />
          </div>
        )}
      </div>
    </section>
  )
}
