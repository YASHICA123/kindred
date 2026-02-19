"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, MapPin, Users, Calendar, DollarSign, BookOpen, Award, Phone, Mail, Globe, Heart, Share2 } from "lucide-react"
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
      phone?: string
      email?: string
      website?: string
    }
    fees?: {
      id: number
      level?: string
      tuitionFee?: string
      registrationFee?: string
      developmentFee?: string
      transportFee?: string
      mealFee?: string
      totalFee?: string
      notes?: string
    }[]
    gallery?: {
      id: number
      imageUrl: string
      caption?: string
    }[]
    reviewsList?: {
      id: number
      author?: string
      rating?: number
      title?: string
      body?: string
      createdAt?: string
    }[]
    faqs?: {
      id: number
      question: string
      answer: string
    }[]
    admissions?: {
      id: number
      title?: string
      description?: string
      deadline?: string
      url?: string
    }[]
  }
}

type TabType = "overview" | "fees" | "facilities" | "admission" | "curriculum" | "gallery" | "reviews" | "faq"

export default function SchoolDetail({ school }: SchoolDetailProps) {
  const [isSaved, setIsSaved] = useState(false)
  const [activeTab, setActiveTab] = useState<TabType>("overview")

  const hasContact = Boolean(
    school.contact?.phone || school.contact?.email || school.contact?.website
  )
  const hasOverview = Boolean(
    school.description || (school.highlights && school.highlights.length > 0)
  )
  const hasFacilities = Boolean(school.facilities && school.facilities.length > 0)
  const hasFees = Boolean((school.fees && school.fees.length > 0) || school.feeRange)
  const hasCurriculum = Boolean(school.curriculum)
  const hasGallery = Boolean(school.gallery && school.gallery.length > 0)
  const hasReviews = Boolean(school.reviewsList && school.reviewsList.length > 0)
  const hasFaqs = Boolean(school.faqs && school.faqs.length > 0)
  const hasAdmissions = Boolean(school.admissions && school.admissions.length > 0)

  const tabs: { id: TabType; label: string; icon: string; show: boolean }[] = [
    { id: "overview", label: "Overview", icon: "📋", show: true },
    { id: "fees", label: "Fees Structure", icon: "💰", show: hasFees },
    { id: "facilities", label: "Facilities", icon: "🏛️", show: hasFacilities },
    { id: "admission", label: "Admissions", icon: "📝", show: hasAdmissions },
    { id: "curriculum", label: "Curriculum", icon: "📚", show: hasCurriculum },
    { id: "gallery", label: "Gallery", icon: "📸", show: hasGallery },
    { id: "reviews", label: "Reviews", icon: "💬", show: hasReviews },
    { id: "faq", label: "FAQs", icon: "❓", show: hasFaqs },
  ].filter((tab) => tab.show)

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
              {school.image ? (
                <>
                  <Image
                    src={school.image}
                    alt={school.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </>
              ) : (
                <div className="absolute inset-0 bg-muted flex items-center justify-center">
                  <span className="text-sm text-muted-foreground">No image available</span>
                </div>
              )}
              <div className="absolute bottom-4 left-4 text-white">
                <Badge className="mb-2">{school.type}</Badge>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{school.name}</h1>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {school.location}
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
                {hasContact ? (
                  <div className="space-y-3">
                    {school.contact?.phone && (
                      <a href={`tel:${school.contact.phone}`} className="flex items-center gap-3 text-sm hover:text-primary transition-colors">
                        <Phone className="w-4 h-4" />
                        {school.contact.phone}
                      </a>
                    )}
                    {school.contact?.email && (
                      <a href={`mailto:${school.contact.email}`} className="flex items-center gap-3 text-sm hover:text-primary transition-colors">
                        <Mail className="w-4 h-4" />
                        {school.contact.email}
                      </a>
                    )}
                    {school.contact?.website && (
                      <a href={school.contact.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm hover:text-primary transition-colors">
                        <Globe className="w-4 h-4" />
                        Visit Website
                      </a>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Contact details are not available yet.</p>
                )}
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
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4">About {school.name}</h2>
                  {hasOverview ? (
                    <>
                      {school.description && (
                        <p className="text-muted-foreground leading-relaxed mb-4">
                          {school.description}
                        </p>
                      )}

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
                    </>
                  ) : (
                    <p className="text-muted-foreground">Overview data is not available yet.</p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "fees" && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">Fee Range</h2>
                {hasFees ? (
                  school.fees && school.fees.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border text-left">
                            <th className="py-2 pr-4">Level</th>
                            <th className="py-2 pr-4">Tuition</th>
                            <th className="py-2 pr-4">Registration</th>
                            <th className="py-2 pr-4">Development</th>
                            <th className="py-2 pr-4">Transport</th>
                            <th className="py-2 pr-4">Meals</th>
                            <th className="py-2">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {school.fees.map((fee) => (
                            <tr key={fee.id} className="border-b border-border/60">
                              <td className="py-2 pr-4 font-medium">{fee.level || "-"}</td>
                              <td className="py-2 pr-4">{fee.tuitionFee || "-"}</td>
                              <td className="py-2 pr-4">{fee.registrationFee || "-"}</td>
                              <td className="py-2 pr-4">{fee.developmentFee || "-"}</td>
                              <td className="py-2 pr-4">{fee.transportFee || "-"}</td>
                              <td className="py-2 pr-4">{fee.mealFee || "-"}</td>
                              <td className="py-2 font-semibold text-primary">{fee.totalFee || "-"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {school.fees.some((fee) => fee.notes) && (
                        <div className="mt-4 space-y-2">
                          {school.fees
                            .filter((fee) => fee.notes)
                            .map((fee) => (
                              <p key={fee.id} className="text-sm text-muted-foreground">
                                {fee.notes}
                              </p>
                            ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-3xl font-semibold text-primary">{school.feeRange}</p>
                  )
                ) : (
                  <p className="text-muted-foreground">Fee details are not available yet.</p>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === "facilities" && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">Facilities</h2>
                {hasFacilities ? (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {school.facilities?.map((facility, index) => (
                      <div key={index} className="flex items-center gap-3 rounded-lg border border-border px-4 py-3">
                        <Award className="w-5 h-5 text-primary" />
                        <span>{facility}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Facilities data is not available yet.</p>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === "admission" && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">Admissions</h2>
                {hasAdmissions ? (
                  <div className="space-y-4">
                    {school.admissions?.map((item) => (
                      <div key={item.id} className="rounded-lg border border-border p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-semibold">{item.title || "Admission Update"}</h3>
                            {item.description && (
                              <p className="text-sm text-muted-foreground mt-2">{item.description}</p>
                            )}
                          </div>
                          {item.deadline && (
                            <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full">
                              Deadline: {item.deadline}
                            </span>
                          )}
                        </div>
                        {item.url && (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-primary hover:text-primary/80 mt-3 inline-flex"
                          >
                            View Details
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Admission details are not available yet.</p>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === "curriculum" && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">Curriculum</h2>
                {hasCurriculum ? (
                  <p className="text-muted-foreground">{school.curriculum}</p>
                ) : (
                  <p className="text-muted-foreground">Curriculum details are not available yet.</p>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === "gallery" && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">Gallery</h2>
                {hasGallery ? (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {school.gallery?.map((image) => (
                      <div key={image.id} className="rounded-lg overflow-hidden border border-border">
                        <img
                          src={image.imageUrl}
                          alt={image.caption || school.name}
                          className="w-full h-40 object-cover"
                        />
                        {image.caption && (
                          <div className="p-3 text-sm text-muted-foreground">{image.caption}</div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Gallery images are not available yet.</p>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === "reviews" && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">Reviews</h2>
                {hasReviews ? (
                  <div className="space-y-4">
                    {school.reviewsList?.map((review) => (
                      <div key={review.id} className="rounded-lg border border-border p-4">
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="font-semibold">{review.title || "Review"}</p>
                            {review.author && (
                              <p className="text-xs text-muted-foreground">by {review.author}</p>
                            )}
                          </div>
                        </div>
                        {review.body && (
                          <p className="text-sm text-muted-foreground mt-3">{review.body}</p>
                        )}
                        {review.createdAt && (
                          <p className="text-xs text-muted-foreground mt-3">{review.createdAt}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Reviews are not available yet.</p>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === "faq" && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">FAQs</h2>
                {hasFaqs ? (
                  <div className="space-y-4">
                    {school.faqs?.map((faq) => (
                      <div key={faq.id} className="rounded-lg border border-border p-4">
                        <p className="font-semibold">{faq.question}</p>
                        <p className="text-sm text-muted-foreground mt-2">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">FAQs are not available yet.</p>
                )}
              </CardContent>
            </Card>
          )}
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
