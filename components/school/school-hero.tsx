"use client"

import { useState } from "react"
import { Heart, Share2, MapPin, ChevronLeft, ChevronRight, Calendar, Users } from "lucide-react"
import Link from "next/link"

const heroImages = [
  "/modern-school-building-with-green-campus-architect.jpg",
  "/diverse-students-science-lab-modern-equipment.jpg",
  "/montessori-classroom-natural-materials-children-ex.jpg",
  "/school-children-playing-outdoor-campus-sunny.jpg",
]

export function SchoolHero() {
  const [currentImage, setCurrentImage] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % heroImages.length)
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + heroImages.length) % heroImages.length)

  return (
    <section className="pt-20 lg:pt-24">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <span>/</span>
          <Link href="/discover" className="hover:text-foreground">
            Schools
          </Link>
          <span>/</span>
          <span className="text-foreground">The Heritage School</span>
        </nav>
      </div>

      {/* Hero image gallery */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden">
          <div className="aspect-[21/9] relative">
            <img
              src={heroImages[currentImage] || "/placeholder.svg"}
              alt="School campus"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
          </div>

          {/* Navigation arrows */}
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Image dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImage(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentImage ? "w-8 bg-background" : "w-2 bg-background/50"
                }`}
              />
            ))}
          </div>

          {/* Action buttons */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className={`p-3 rounded-full transition-colors ${
                isFavorite
                  ? "bg-accent text-accent-foreground"
                  : "bg-background/80 backdrop-blur-sm hover:bg-background"
              }`}
            >
              <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
            </button>
            <button className="p-3 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background transition-colors">
              <Share2 className="h-5 w-5" />
            </button>
          </div>

          {/* School info overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-10">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className="px-3 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-full">
                STEAM Excellence
              </span>
              <span className="px-3 py-1 bg-background/20 backdrop-blur-sm text-background text-sm font-medium rounded-full">
                IB World School
              </span>
              <span className="px-3 py-1 bg-background/20 backdrop-blur-sm text-background text-sm font-medium rounded-full">
                International
              </span>
            </div>
            <h1 className="font-serif text-3xl lg:text-4xl xl:text-5xl text-background">The Heritage School</h1>
            <div className="flex flex-wrap items-center gap-4 lg:gap-6 mt-4 text-background/90">
              <span className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Gurgaon, Haryana
              </span>
              <span className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                1,200 students
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Est. 2002
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
