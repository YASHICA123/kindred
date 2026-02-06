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

export default function SchoolDetail({ school }: SchoolDetailProps) {
  const [isSaved, setIsSaved] = useState(false)

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
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
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
                  <Button className="w-full">Get Free Counselling</Button>
                  <Button variant="outline" className="w-full">Download Brochure</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Detailed Information */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">About {school.name}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {school.description || `Welcome to ${school.name}, a premier ${school.type} institution located in ${school.location}. 
                  Our school is committed to providing excellence in education through our ${school.curriculum} curriculum, 
                  fostering an environment where students can thrive academically, socially, and personally.`}
                </p>
              </CardContent>
            </Card>

            {/* Highlights */}
            {school.highlights && school.highlights.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4">Key Highlights</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {school.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <Award className="w-5 h-5 text-primary" />
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Facilities */}
            {school.facilities && school.facilities.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4">Facilities</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {school.facilities.map((facility, index) => (
                      <Badge key={index} variant="secondary" className="justify-center py-2">
                        {facility}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">Address</p>
                      <p className="text-sm text-muted-foreground">{school.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-sm text-muted-foreground">
                        {school.contact?.phone || "+91 12345 67890"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">
                        {school.contact?.email || "info@school.com"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">Website</p>
                      <a 
                        href={school.contact?.website || "#"} 
                        className="text-sm text-primary hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {school.contact?.website || "www.school.com"}
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <Button className="w-full" variant="default">
                    Schedule a Visit
                  </Button>
                  <Button className="w-full" variant="outline">
                    Request Information
                  </Button>
                  <Button className="w-full" variant="outline">
                    Apply Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
