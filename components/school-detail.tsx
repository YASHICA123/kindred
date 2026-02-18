"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, MapPin, Star, Users, Calendar, DollarSign, BookOpen, Award, Phone, Mail, Globe, Heart, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SchoolOverview } from "@/components/school/school-overview"
import { SchoolFees } from "@/components/school/school-fees"
import { SchoolFacilities } from "@/components/school/school-facilities"
import { SchoolAdmission } from "@/components/school/school-admission"
import { SchoolCurriculum } from "@/components/school/school-curriculum"
import { SchoolGallery } from "@/components/school/school-gallery"
import { SchoolReviews } from "@/components/school/school-reviews"
import { SchoolFAQ } from "@/components/school/school-faq"

interface SchoolDetailProps {
  school: {
    id: number
    slug: string
    name: string
    location: string
    city: string
    type: string
    curriculum: string
    rating: number
    reviews: number
    students: number
    feeRange: string
    established: string
    image: string
    description?: string
    highlights?: string[]
    facilities?: string[]
    contact?: {
      phone: string
      email: string
      website: string
    }
  }
}

type TabType = "overview" | "fees" | "facilities" | "admission" | "curriculum" | "gallery" | "reviews" | "faq"

export default function SchoolDetail({ school }: SchoolDetailProps) {
  const [isSaved, setIsSaved] = useState(false)
  const [activeTab, setActiveTab] = useState<TabType>("overview")

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: "overview", label: "Overview", icon: "📋" },
    { id: "fees", label: "Fees Structure", icon: "💰" },
    { id: "facilities", label: "Facilities", icon: "🏛️" },
    { id: "admission", label: "Admissions", icon: "📝" },
    { id: "curriculum", label: "Curriculum", icon: "📚" },
    { id: "gallery", label: "Gallery", icon: "📸" },
    { id: "reviews", label: "Reviews", icon: "⭐" },
    { id: "faq", label: "FAQs", icon: "❓" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Schools
        </Link>

        {/* Hero Section */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="relative h-64 md:h-96 rounded-xl overflow-hidden">
              <Image
                src={school.image}
                alt={school.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <Badge className="mb-2">{school.type}</Badge>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{school.name}</h1>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {school.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    {school.rating} ({school.reviews} reviews)
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Info Card */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-2xl font-bold text-primary">{school.feeRange}</p>
                    <p className="text-sm text-muted-foreground">Annual Fee Range</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsSaved(!isSaved)}
                    >
                      <Heart className={`w-4 h-4 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4" />
                      Students
                    </span>
                    <span className="font-medium">{school.students.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center gap-2 text-sm">
                      <BookOpen className="w-4 h-4" />
                      Curriculum
                    </span>
                    <span className="font-medium">{school.curriculum}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4" />
                      Established
                    </span>
                    <span className="font-medium">{school.established}</span>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-2">
                  <Button className="w-full bg-primary hover:bg-primary/90" onClick={() => setActiveTab("admission")}>
                    Apply Now
                  </Button>
                  <Button variant="outline" className="w-full">
                    Download Brochure
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Contact Card */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Quick Contact</h3>
                <div className="space-y-3">
                  <a href={`tel:${school.contact?.phone}`} className="flex items-center gap-3 text-sm hover:text-primary transition-colors">
                    <Phone className="w-4 h-4" />
                    {school.contact?.phone || "+91 12345 67890"}
                  </a>
                  <a href={`mailto:${school.contact?.email}`} className="flex items-center gap-3 text-sm hover:text-primary transition-colors">
                    <Mail className="w-4 h-4" />
                    {school.contact?.email || "info@school.com"}
                  </a>
                  <a href={school.contact?.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm hover:text-primary transition-colors">
                    <Globe className="w-4 h-4" />
                    Visit Website
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-12">
          <div className="flex flex-wrap gap-2 p-2 bg-secondary/50 rounded-xl overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-foreground hover:bg-secondary"
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="mb-12">
          {activeTab === "overview" && (
            <div>
              <SchoolOverview />
              <Card className="mt-8">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4">About {school.name}</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {school.description || `Welcome to ${school.name}, a premier ${school.type} institution located in ${school.location}. 
                    Our school is committed to providing excellence in education through our ${school.curriculum} curriculum, 
                    fostering an environment where students can thrive academically, socially, and personally.`}
                  </p>

                  {/* Highlights */}
                  {school.highlights && school.highlights.length > 0 && (
                    <div className="mt-6">
                      <h3 className="font-semibold mb-4">Key Highlights</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {school.highlights.map((highlight, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <Award className="w-5 h-5 text-primary" />
                            <span>{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "fees" && <SchoolFees />}
          {activeTab === "facilities" && <SchoolFacilities />}
          {activeTab === "admission" && <SchoolAdmission />}
          {activeTab === "curriculum" && <SchoolCurriculum />}
          {activeTab === "gallery" && <SchoolGallery />}
          {activeTab === "reviews" && <SchoolReviews />}
          {activeTab === "faq" && <SchoolFAQ />}
        </div>

        {/* CTA Section */}
        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
          <CardContent className="p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Ready to Join {school.name}?</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Take the next step towards an exceptional educational experience. Apply now or schedule a campus visit.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-primary hover:bg-primary/90" size="lg">
                  Apply Now
                </Button>
                <Button variant="outline" size="lg">
                  Schedule Campus Visit
                </Button>
                <Button variant="outline" size="lg">
                  Request Information
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
