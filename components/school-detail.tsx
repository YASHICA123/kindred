"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { 
  ArrowLeft, MapPin, Users, Calendar, DollarSign, BookOpen, Award, 
  Phone, Mail, Globe, Heart, Share2, CheckCircle2, ChevronDown, 
  Star, MessageSquare, Shield, Clock, FileText, Gift, HelpCircle, 
  Trophy, GraduationCap, X, ChevronRight, Check, Sparkles, AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { supabase } from "@/lib/supabase"
import { 
  saveSchool, 
  removeSavedSchool, 
  isSchoolSaved, 
  saveSchoolEnquiry,
  saveSchoolVisit 
} from "@/lib/supabase-data"

interface SchoolDetailProps {
  school: {
    id: number
    slug: string
    name: string
    location: string
    city: string
    state: string
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
      imageUrl?: string
      image_url?: string
      caption?: string
      category?: string
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
    // Premium fields matching suggested migration schema
    seat_availability?: Record<string, string>
    admission_process?: { step: number; title: string; description: string }[]
    documents_required?: string[]
    highlights_structured?: { title: string; description: string; icon: string }[]
    scholarships?: { title: string; description: string }[]
    withdrawal_policy?: string
    awards?: { title: string; year: string; details: string }[]
  }
}

type SectionId = "overview" | "fees" | "facilities" | "admissions" | "gallery" | "reviews" | "faqs" | "why-us"

export default function SchoolDetail({ school }: SchoolDetailProps) {
  // Saved state
  const [isSaved, setIsSaved] = useState(false)
  const [loadingSaved, setLoadingSaved] = useState(true)

  // Local reviews to support instant display on submission
  const [localReviews, setLocalReviews] = useState<any[]>([])

  // Modal open states
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false)
  const [isCallbackModalOpen, setIsCallbackModalOpen] = useState(false)
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)

  // Active navigation section state
  const [activeSection, setActiveSection] = useState<SectionId>("overview")

  // Form submission states
  const [submittingApply, setSubmittingApply] = useState(false)
  const [submittingCallback, setSubmittingCallback] = useState(false)
  const [submittingVisit, setSubmittingVisit] = useState(false)
  const [submittingReview, setSubmittingReview] = useState(false)

  // Toast status states
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null)

  // Accordion active keys
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)
  const [isWithdrawalOpen, setIsWithdrawalOpen] = useState(false)
  
  // Gallery category filter
  const [galleryCategory, setGalleryCategory] = useState<string>("All")

  // Description Read More toggle
  const [isDescExpanded, setIsDescExpanded] = useState(false)

  // Form fields states
  const [applyForm, setApplyForm] = useState({ parentName: "", mobile: "", childClass: "Nursery", email: "" })
  const [callbackForm, setCallbackForm] = useState({ name: "", phone: "", childClass: "Nursery", email: "" })
  const [visitForm, setVisitForm] = useState({ parentName: "", mobile: "", childClass: "Nursery", visitDate: "", email: "" })
  const [reviewForm, setReviewForm] = useState({ author: "", rating: 5, title: "", body: "" })

  // References for scroll navigation
  const sectionRefs = {
    overview: useRef<HTMLDivElement>(null),
    "why-us": useRef<HTMLDivElement>(null),
    fees: useRef<HTMLDivElement>(null),
    facilities: useRef<HTMLDivElement>(null),
    admissions: useRef<HTMLDivElement>(null),
    gallery: useRef<HTMLDivElement>(null),
    reviews: useRef<HTMLDivElement>(null),
    faqs: useRef<HTMLDivElement>(null),
  }

  // Toast helper
  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type })
    setTimeout(() => {
      setToastMessage(null)
    }, 4000)
  }

  // Fetch saved status, record visit & initialize reviews
  useEffect(() => {
    async function checkSavedStatus() {
      try {
        const saved = await isSchoolSaved(school.id.toString())
        setIsSaved(saved)
      } catch (err) {
        console.warn("Could not check saved status, guest mode assumed:", err)
      } finally {
        setLoadingSaved(false)
      }
    }

    async function fetchRealtimeReviews() {
      try {
        const { data, error } = await supabase
          .from('school_reviews')
          .select('*')
          .eq('school_id', school.id)
          .order('created_at', { ascending: false })

        if (error) throw error
        if (data) {
          const mapped = data.map((r: any) => ({
            id: r.id,
            author: r.author,
            rating: Number(r.rating) || 5,
            title: r.title || "Parent Review",
            body: r.body,
            createdAt: r.created_at
              ? new Date(r.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })
              : 'Recent'
          }))
          setLocalReviews(mapped)
        }
      } catch (err) {
        console.error("Error fetching realtime reviews:", err)
      }
    }

    // Record this school visit (silently — no error shown to user)
    saveSchoolVisit({
      schoolId: school.id,
      schoolSlug: school.slug,
      schoolName: school.name,
    }).catch(() => {})

    checkSavedStatus()
    fetchRealtimeReviews()
  }, [school.id, school.slug, school.name])

  // Handle intersection observer to highlight active tab on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 160 // Header offset
      
      // Find the current section
      let currentSection: SectionId = "overview"
      
      for (const [section, ref] of Object.entries(sectionRefs)) {
        if (ref.current) {
          const top = ref.current.offsetTop
          const height = ref.current.offsetHeight
          if (scrollPosition >= top && scrollPosition < top + height) {
            currentSection = section as SectionId
            break
          }
        }
      }
      setActiveSection(currentSection)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Smooth scroll helper
  const scrollToSection = (sectionId: SectionId) => {
    const ref = sectionRefs[sectionId]
    if (ref.current) {
      const offsetTop = ref.current.offsetTop - 140 // Spacing for sticky sub-nav & header
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth"
      })
      setActiveSection(sectionId)
    }
  }

  // Toggle saved status
  const handleSaveToggle = async () => {
    try {
      if (isSaved) {
        await removeSavedSchool(school.id.toString())
        setIsSaved(false)
        showToast("School removed from your saved list")
      } else {
        await saveSchool({
          schoolId: school.id.toString(),
          schoolName: school.name,
          schoolImage: school.image,
          schoolLocation: school.location,
          schoolCity: school.city,
          schoolState: school.state
        })
        setIsSaved(true)
        showToast("School saved successfully!")
      }
    } catch (err: any) {
      // Friendly fallback for unauthenticated users
      showToast("Sign in to save this school to your bookmarks!", "error")
    }
  }

  // Handle Apply Now form submission
  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!applyForm.parentName || !applyForm.mobile) {
      showToast("Please fill in all required fields", "error")
      return
    }
    setSubmittingApply(true)
    try {
      await saveSchoolEnquiry({
        schoolId: school.id,
        schoolName: school.name,
        schoolSlug: school.slug,
        enquiryType: 'apply',
        parentName: applyForm.parentName,
        parentEmail: applyForm.email || undefined,
        parentPhone: applyForm.mobile,
        childClass: applyForm.childClass,
        message: `Apply Now enquiry for ${school.name} — Class: ${applyForm.childClass}`,
      })
      showToast("Application enquiry submitted successfully! The school will contact you shortly.")
      setIsApplyModalOpen(false)
      setApplyForm({ parentName: "", mobile: "", childClass: "Nursery", email: "" })
    } catch (err: any) {
      showToast("Could not submit. Please try again later.", "error")
    } finally {
      setSubmittingApply(false)
    }
  }

  // Handle Request Callback form submission
  const handleCallbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!callbackForm.name || !callbackForm.phone) {
      showToast("Please fill in all required fields", "error")
      return
    }
    setSubmittingCallback(true)
    try {
      await saveSchoolEnquiry({
        schoolId: school.id,
        schoolName: school.name,
        schoolSlug: school.slug,
        enquiryType: 'callback',
        parentName: callbackForm.name,
        parentEmail: callbackForm.email || undefined,
        parentPhone: callbackForm.phone,
        childClass: callbackForm.childClass,
        message: `Callback requested for ${school.name} — Child class: ${callbackForm.childClass}`,
      })
      showToast("Callback request submitted! Our educational advisor will call you within 15 minutes.")
      setIsCallbackModalOpen(false)
      setCallbackForm({ name: "", phone: "", childClass: "Nursery", email: "" })
    } catch (err: any) {
      showToast("Could not submit request. Please try again.", "error")
    } finally {
      setSubmittingCallback(false)
    }
  }

  // Handle Schedule Visit form submission
  const handleVisitSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!visitForm.parentName || !visitForm.mobile || !visitForm.visitDate) {
      showToast("Please fill in all required fields", "error")
      return
    }
    setSubmittingVisit(true)
    try {
      await saveSchoolEnquiry({
        schoolId: school.id,
        schoolName: school.name,
        schoolSlug: school.slug,
        enquiryType: 'visit',
        parentName: visitForm.parentName,
        parentEmail: visitForm.email || undefined,
        parentPhone: visitForm.mobile,
        childClass: visitForm.childClass,
        visitDate: visitForm.visitDate,
        message: `Campus visit scheduled at ${school.name} on ${visitForm.visitDate}`,
      })
      showToast(`Campus visit scheduled for ${visitForm.visitDate}! The school coordinator will call to confirm.`)
      setVisitForm({ parentName: "", mobile: "", childClass: "Nursery", visitDate: "", email: "" })
    } catch (err: any) {
      showToast("Error scheduling visit. Please try again.", "error")
    } finally {
      setSubmittingVisit(false)
    }
  }

  // Handle Write Review form submission
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reviewForm.author || !reviewForm.body) {
      showToast("Please fill in all review details", "error")
      return
    }
    setSubmittingReview(true)
    try {
      const reviewPayload = {
        school_id: school.id,
        author: reviewForm.author,
        rating: Number(reviewForm.rating),
        title: reviewForm.title || "Parent Review",
        body: reviewForm.body,
        created_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('school_reviews')
        .insert(reviewPayload)
        .select('*')
        .single()

      if (error) throw error

      // Update reviews list immediately
      const newReview = {
        id: data.id || Date.now(),
        author: data.author,
        rating: Number(data.rating),
        title: data.title,
        body: data.body,
        createdAt: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
      }
      
      setLocalReviews([newReview, ...localReviews])
      showToast("Thank you! Your review has been submitted and is now visible.")
      setIsReviewModalOpen(false)
      setReviewForm({ author: "", rating: 5, title: "", body: "" })
    } catch (err: any) {
      console.error("Error submitting review:", err)
      // Local fallback in case table fails
      const fallbackReview = {
        id: Date.now(),
        author: reviewForm.author,
        rating: reviewForm.rating,
        title: reviewForm.title || "Parent Review",
        body: reviewForm.body,
        createdAt: "Just now"
      }
      setLocalReviews([fallbackReview, ...localReviews])
      showToast("Review saved locally! (Review tables schema update pending in Supabase)")
      setIsReviewModalOpen(false)
      setReviewForm({ author: "", rating: 5, title: "", body: "" })
    } finally {
      setSubmittingReview(false)
    }
  }

  // Database-driven fields (from schools table in Supabase)
  const seatAvailability = school.seat_availability && Object.keys(school.seat_availability).length > 0
    ? school.seat_availability
    : null

  const admissionProcess = school.admission_process && school.admission_process.length > 0
    ? school.admission_process
    : null

  const documentsRequired = school.documents_required && school.documents_required.length > 0
    ? school.documents_required
    : null

  let highlightsArray: string[] = []
  if (Array.isArray(school.highlights)) {
    highlightsArray = school.highlights
  }

  const highlightsToRender = (school.highlights_structured && school.highlights_structured.length > 0)
    ? school.highlights_structured
    : highlightsArray.length > 0
      ? highlightsArray.map((hl: string) => ({
          title: hl,
          description: "",
          icon: "CheckCircle2"
        }))
      : null

  const scholarshipsList = school.scholarships && school.scholarships.length > 0
    ? school.scholarships
    : null

  const withdrawalPolicyText = school.withdrawal_policy || null

  const awardsList = school.awards && school.awards.length > 0
    ? school.awards
    : null

  const dropdownGrades = ["Nursery", "Kindergarten", "Primary (Grades 1-5)", "Middle School (Grades 6-8)", "Secondary (Grades 9-10)", "Sr. Secondary (Grades 11-12)"]

  const faqsList = (school.faqs && school.faqs.length > 0) ? school.faqs : null
  const feesToRender = school.fees || []
  const galleryImages = school.gallery || []

  // Unique categories of gallery images
  const galleryCategories = ["All", ...Array.from(new Set(galleryImages.map(img => img.category || "Campus")))]

  // Filter gallery
  const filteredGallery = galleryCategory === "All" 
    ? galleryImages 
    : galleryImages.filter(img => (img.category || "Campus") === galleryCategory)

  // Calculate review score stats
  const totalReviewsCount = localReviews.length
  const averageRating = totalReviewsCount > 0 
    ? (localReviews.reduce((sum, r) => sum + (r.rating || 0), 0) / totalReviewsCount).toFixed(1)
    : "0.0"

  const hasContact = !!(school.contact?.phone || school.contact?.email || school.contact?.website)

  return (
    <div className="min-h-screen bg-[#FAFBFC] font-sans antialiased text-[#0F1724]">
      <Header />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Breadcrumb & Saved Info */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/schools" className="hover:text-primary transition-colors">
              Schools
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-foreground font-medium truncate max-w-[200px] sm:max-w-none">
              {school.name}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            {/* <Button
              variant="outline"
              size="sm"
              className="text-[#6B7280] hover:text-[#0F1724] border-border hover:bg-muted"
              onClick={handleSaveToggle}
            >
              <Heart className={`w-4 h-4 mr-2 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
              {isSaved ? "Saved" : "Save School"}
            </Button> */}
            <Button
              variant="outline"
              size="sm"
              className="text-[#6B7280] hover:text-[#0F1724] border-border hover:bg-muted"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: school.name,
                    text: `Check out ${school.name} on Kindred!`,
                    url: window.location.href
                  }).catch(() => {})
                } else {
                  navigator.clipboard.writeText(window.location.href)
                  showToast("School link copied to clipboard!")
                }
              }}
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* Hero Banner Section */}
        <div className="relative rounded-2xl overflow-hidden border border-border shadow-sm mb-8 bg-white">
          <div className="relative h-60 sm:h-80 md:h-[420px] w-full">
            {school.image ? (
              <Image
                src={school.image}
                alt={school.name}
                fill
                priority
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                <span className="text-muted-foreground font-medium">No cover image uploaded</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            
            {/* Admissions Open Badge */}
            <div className="absolute top-4 left-4 bg-secondary text-white px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase shadow-md flex items-center gap-1.5 animate-pulse">
              <span className="h-2 w-2 rounded-full bg-white block"></span>
              Admissions Open 2026-27
            </div>
          </div>

          {/* School Basic Details Box (Overlapping) */}
          <div className="relative px-6 pb-6 pt-16 sm:pt-6 sm:px-8 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            
            {/* Logo Badge (Floating Circle) */}
            <div className="absolute -top-16 left-6 sm:left-8 w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-4 border-white bg-white shadow-lg flex items-center justify-center bg-gradient-to-br from-primary to-[#003B99]">
              <span className="text-white text-3xl sm:text-4xl font-extrabold tracking-wider">
                {school.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
              </span>
            </div>

            {/* School Name & Core Meta */}
            <div className="flex-1 mt-2 sm:mt-8 md:mt-0 md:pl-32">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#0F1724]">
                {school.name}
              </h1>
              
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-sm text-[#6B7280]">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-primary" />
                  {school.location || `${school.city}, ${school.state}`}
                </span>
                <span className="hidden sm:inline text-border">•</span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-secondary"></span>
                  {school.type}
                </span>
                <span className="hidden sm:inline text-border">•</span>
                <span className="font-semibold text-primary">
                  {school.curriculum} Curriculum
                </span>
                {Number(averageRating) > 0 && (
                  <>
                    <span className="hidden sm:inline text-border">•</span>
                    <span className="flex items-center gap-1 text-amber-500 font-bold bg-amber-50/50 px-2 py-0.5 rounded border border-amber-200/40">
                      <Star className="w-3.5 h-3.5 fill-amber-500" />
                      {averageRating} ({totalReviewsCount} reviews)
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Core Action CTAs in Hero */}
            <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
              <Button 
                onClick={() => setIsCallbackModalOpen(true)}
                variant="outline" 
                className="border-primary/20 hover:bg-primary/5 text-primary font-semibold py-5"
              >
                Request Advisor Call
              </Button>
              <Button 
                onClick={() => setIsApplyModalOpen(true)}
                className="bg-primary hover:bg-primary/95 text-white font-bold py-5 px-6 shadow-md shadow-primary/20"
              >
                Apply Direct
              </Button>
            </div>
          </div>
        </div>

        {/* Sticky Sub-navigation Bar */}
        <div className="sticky top-[64px] z-30 -mx-4 px-4 sm:mx-0 sm:px-0 bg-white border-y border-border shadow-sm mb-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between py-2.5 gap-4 px-4 sm:px-0">
            <div className="flex gap-2 overflow-x-auto flex-nowrap scrollbar-hide shrink min-w-0 pr-4">
              {(Object.keys(sectionRefs) as SectionId[])
                .filter((sectId) => sectId !== "why-us" || highlightsToRender)
                .map((sectId) => {
                // Map section ID to label
                const labelMap: Record<SectionId, string> = {
                  overview: "Overview",
                  "why-us": "Why Us",
                  fees: "Fees Structure",
                  facilities: "Facilities",
                  admissions: "Admissions",
                  gallery: "Campus Gallery",
                  reviews: "Parent Reviews",
                  faqs: "FAQs"
                }
                
                const active = activeSection === sectId
                
                return (
                  <button
                    key={sectId}
                    onClick={() => scrollToSection(sectId)}
                    className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold tracking-wide transition-all whitespace-nowrap shrink-0 ${
                      active 
                        ? "bg-primary text-white shadow-sm"
                        : "text-[#6B7280] hover:text-[#0f1724] hover:bg-muted"
                    }`}
                  >
                    {labelMap[sectId]}
                  </button>
                )
              })}
            </div>
            
            {/* Quick Fee Badge in Sub-nav (Desktop) */}
            {school.feeRange && school.feeRange.trim() !== "" && school.feeRange !== "N/A" && (
              <div className="hidden lg:flex items-center gap-2 text-xs font-semibold text-[#0F1724] bg-secondary/10 px-3 py-1.5 rounded-full shrink-0">
                <DollarSign className="w-3.5 h-3.5 text-secondary" />
                Annual Fees: {school.feeRange}
              </div>
            )}
          </div>
        </div>

        {/* PAGE DUAL COLUMN GRID LAYOUT */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: Main Stacked Information */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* SECTION: Overview & Facts */}
            <div ref={sectionRefs.overview} className="scroll-mt-36 space-y-6">
              
              {/* Quick Facts Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <Card className="border border-border shadow-none hover:border-primary/20 transition-all bg-white">
                  <CardContent className="p-4 flex flex-col justify-between h-24">
                    <span className="text-[#6B7280] text-xs font-medium uppercase tracking-wider">Established</span>
                    <span className="text-[#0F1724] font-bold text-lg">{school.established || "N/A"}</span>
                  </CardContent>
                </Card>
                <Card className="border border-border shadow-none hover:border-primary/20 transition-all bg-white">
                  <CardContent className="p-4 flex flex-col justify-between h-24">
                    <span className="text-[#6B7280] text-xs font-medium uppercase tracking-wider">Student Strength</span>
                    <span className="text-[#0F1724] font-bold text-lg">{school.students ? `${school.students}+` : "N/A"}</span>
                  </CardContent>
                </Card>
                <Card className="border border-border shadow-none hover:border-primary/20 transition-all bg-white">
                  <CardContent className="p-4 flex flex-col justify-between h-24">
                    <span className="text-[#6B7280] text-xs font-medium uppercase tracking-wider">Curriculum</span>
                    <span className="text-[#0F1724] font-bold text-lg">{school.curriculum}</span>
                  </CardContent>
                </Card>
                <Card className="border border-border shadow-none hover:border-primary/20 transition-all bg-white">
                  <CardContent className="p-4 flex flex-col justify-between h-24">
                    <span className="text-[#6B7280] text-xs font-medium uppercase tracking-wider">School Type</span>
                    <span className="text-[#0F1724] font-bold text-lg">{school.type}</span>
                  </CardContent>
                </Card>
                <Card className="border border-border shadow-none hover:border-primary/20 transition-all bg-white">
                  <CardContent className="p-4 flex flex-col justify-between h-24">
                    <span className="text-[#6B7280] text-xs font-medium uppercase tracking-wider">City Location</span>
                    <span className="text-[#0F1724] font-bold text-lg">{school.city}</span>
                  </CardContent>
                </Card>
                <Card className="border border-border shadow-none hover:border-primary/20 transition-all bg-white">
                  <CardContent className="p-4 flex flex-col justify-between h-24">
                    <span className="text-[#6B7280] text-xs font-medium uppercase tracking-wider">Rating Score</span>
                    <span className="text-[#0F1724] font-bold text-lg flex items-center gap-1">
                      <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                      {averageRating === "0.0" ? "No reviews" : averageRating}
                    </span>
                  </CardContent>
                </Card>
              </div>

              {/* Collapsible About Text */}
              <Card className="border border-border shadow-sm bg-white">
                <CardContent className="p-6 sm:p-8">
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    About {school.name}
                  </h2>
                  <div className="relative text-sm sm:text-base leading-relaxed text-[#4B5563]">
                    <div className={isDescExpanded ? "" : "max-h-36 overflow-hidden relative"}>
                      <p>{school.description || `No overview description available for ${school.name}.`}</p>
                      
                      {!isDescExpanded && school.description && school.description.length > 200 && (
                        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                      )}
                    </div>
                    
                    {school.description && school.description.length > 200 && (
                      <button
                        onClick={() => setIsDescExpanded(!isDescExpanded)}
                        className="text-primary hover:text-primary/80 font-bold text-sm mt-3 inline-flex items-center gap-1.5 focus:outline-none"
                      >
                        {isDescExpanded ? "Read Less" : "Read More"}
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDescExpanded ? 'rotate-180' : ''}`} />
                      </button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Class-wise Seat Availability */}
              <Card className="border border-border shadow-sm bg-white">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    Class Seat Availability (Academic Year 2026-27)
                  </h3>
                  
                  {seatAvailability ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {Object.entries(seatAvailability).map(([grade, status]) => {
                        let statusBg = "bg-gray-100 text-gray-800"
                        let statusText = status
                        
                        if (status.toLowerCase().includes("open")) {
                          statusBg = "bg-green-50 text-green-700 border border-green-200"
                          statusText = "● Seats Open"
                        } else if (status.toLowerCase().includes("limited")) {
                          statusBg = "bg-amber-50 text-amber-700 border border-amber-200"
                          statusText = "⏳ Limited Slots"
                        } else if (status.toLowerCase().includes("contact") || status.toLowerCase().includes("closed")) {
                          statusBg = "bg-red-50/50 text-red-700 border border-red-200"
                          statusText = "⚠️ Enquire Admin"
                        }

                        return (
                          <div key={grade} className="flex flex-col justify-between p-3 rounded-lg bg-[#FAFBFC] border border-border/80 text-xs">
                            <span className="font-semibold text-[#0F1724]">{grade}</span>
                            <span className={`mt-1.5 px-2 py-0.5 rounded-full inline-block font-semibold text-[10px] w-fit ${statusBg}`}>
                              {statusText}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-6 bg-slate-50 border border-dashed border-slate-200 rounded-xl">
                      <p className="text-xs text-[#6B7280]">Class seat availability is not currently available for online viewing. Please request a callback or contact the school admissions desk.</p>
                    </div>
                  )}

                  {/* Seat alert callout */}
                  <div className="mt-4 bg-primary/[0.03] border border-primary/10 rounded-xl p-4 flex gap-3 text-sm text-[#4B5563]">
                    <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-[#0F1724]">Admissions Filling Fast!</span> Due to limited seats in specific grades, applications are prioritized on a submission-date basis. Complete the direct registration form to secure your place.
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* SECTION: Why Choose Us */}
            {highlightsToRender && (
              <div ref={sectionRefs["why-us"]} className="scroll-mt-36">
                <Card className="border border-border shadow-sm bg-white">
                  <CardContent className="p-6 sm:p-8">
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-6 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary" />
                      Why Choose Us
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                      {highlightsToRender.map((hl: any, i: number) => (
                        <div key={i} className="flex gap-4">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                            {hl.icon === "BookOpen" && <BookOpen className="w-5 h-5" />}
                            {hl.icon === "Sparkles" && <Sparkles className="w-5 h-5" />}
                            {hl.icon === "Shield" && <Shield className="w-5 h-5" />}
                            {hl.icon === "GraduationCap" && <GraduationCap className="w-5 h-5" />}
                            {hl.icon === "Users" && <Users className="w-5 h-5" />}
                            {hl.icon === "Award" && <Award className="w-5 h-5" />}
                            {(!hl.icon || hl.icon === "CheckCircle2") && <CheckCircle2 className="w-5 h-5" />}
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-[#0F1724] mb-1">{hl.title}</h4>
                            {hl.description && (
                              <p className="text-xs text-[#6B7280] leading-relaxed">{hl.description}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* SECTION: Fees Structure */}
            <div ref={sectionRefs.fees} className="scroll-mt-36">
              <Card className="border border-border shadow-sm bg-white">
                <CardContent className="p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-primary" />
                        Fee Structure Detail
                      </h2>
                      <p className="text-xs text-[#6B7280] mt-1">Class-wise broken down fee structure</p>
                    </div>
                    <Button variant="outline" size="sm" className="w-fit text-primary border-primary/20 hover:bg-primary/5 font-semibold">
                      Download Fee Booklet
                    </Button>
                  </div>

                  {feesToRender.length > 0 ? (
                    <div className="overflow-x-auto border border-border/80 rounded-xl">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-[#FAFBFC] border-b border-border text-left">
                            <th className="p-3 font-semibold text-[#0F1724] text-xs">Class Level</th>
                            <th className="p-3 font-semibold text-[#0F1724] text-xs">Tuition Fee</th>
                            <th className="p-3 font-semibold text-[#0F1724] text-xs">Admission Fee</th>
                            <th className="p-3 font-semibold text-[#0F1724] text-xs">Transport</th>
                            <th className="p-3 font-semibold text-[#0F1724] text-xs">Meals/Canteen</th>
                            <th className="p-3 font-semibold text-[#0F1724] text-xs text-right">Total Annual</th>
                          </tr>
                        </thead>
                        <tbody>
                          {feesToRender.map((fee, idx) => (
                            <tr key={fee.id || idx} className="border-b border-border/60 last:border-none hover:bg-muted/30">
                              <td className="p-3 font-bold text-[#0F1724] text-xs">{fee.level}</td>
                              <td className="p-3 text-xs text-[#4B5563]">{fee.tuitionFee || "Included"}</td>
                              <td className="p-3 text-xs text-[#4B5563]">{fee.registrationFee || "—"}</td>
                              <td className="p-3 text-xs text-[#4B5563]">{fee.transportFee || "Optional"}</td>
                              <td className="p-3 text-xs text-[#4B5563]">{fee.mealFee || "Optional"}</td>
                              <td className="p-3 font-extrabold text-primary text-xs text-right">{fee.totalFee || school.feeRange}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-6 bg-slate-50 border border-dashed border-slate-200 rounded-xl">
                      <p className="text-sm font-semibold text-[#0F1724] mb-1">Estimated Annual Fee Range</p>
                      <p className="text-2xl font-extrabold text-primary">{school.feeRange}</p>
                      <p className="text-xs text-[#6B7280] mt-2 max-w-sm mx-auto">Detailed class-by-class fees are subject to direct confirmation. Click Apply or callback for specifics.</p>
                    </div>
                  )}

                  {/* Scholarships & Financial Assistance */}
                  {scholarshipsList && (
                    <div className="mt-6 pt-6 border-t border-border">
                      <h4 className="font-bold text-sm text-[#0F1724] mb-3 flex items-center gap-1.5">
                        <Gift className="w-4 h-4 text-primary" />
                        Scholarships & Concessions
                      </h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        {scholarshipsList.map((sc, i) => (
                          <div key={i} className="p-4 rounded-xl bg-secondary/[0.02] border border-secondary/10 hover:border-secondary/20 transition-all">
                            <h5 className="font-semibold text-xs text-secondary mb-1">{sc.title}</h5>
                            <p className="text-xs text-[#6B7280] leading-relaxed">{sc.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* SECTION: Admissions Timeline & Docs */}
            <div ref={sectionRefs.admissions} className="scroll-mt-36 space-y-6">
              
              {/* Timeline admissions process */}
              <Card className="border border-border shadow-sm bg-white">
                <CardContent className="p-6 sm:p-8">
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-8 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Admission Process & Timelines
                  </h2>

                  {/* step admissions process */}
                  {admissionProcess ? (
                    <div className="relative border-l border-border pl-6 ml-4 space-y-8">
                      {admissionProcess.map((proc, i) => (
                        <div key={i} className="relative">
                          {/* Circle Indicator */}
                          <div className="absolute -left-[35px] top-0 w-[18px] h-[18px] rounded-full border-2 border-white bg-primary text-white flex items-center justify-center text-[9px] font-bold shadow-sm">
                            {proc.step || i+1}
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-[#0F1724] mb-1">{proc.title}</h4>
                            <p className="text-xs text-[#6B7280] leading-relaxed">{proc.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 bg-slate-50 border border-dashed border-slate-200 rounded-xl">
                      <p className="text-xs text-[#6B7280]">Detailed admission process guidelines have not been published by the school yet. Please check the website or enquire with the admissions desk.</p>
                    </div>
                  )}

                  {/* Documents Required Checklist */}
                  <div className="mt-8 pt-8 border-t border-border">
                    <h3 className="font-bold text-sm text-[#0F1724] mb-4 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      Documents Checklist (Required at Enrollment)
                    </h3>
                    {documentsRequired ? (
                      <div className="grid sm:grid-cols-2 gap-3">
                        {documentsRequired.map((doc, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-[#4B5563]">
                            <Check className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                            <span>{doc}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-[#6B7280]">Required enrollment documents list is not specified. Commonly required items include birth certificate, transfer certificate, residential proof, and parent ID.</p>
                    )}
                  </div>

                  {/* Withdrawal Accordion */}
                  <div className="mt-8 pt-6 border-t border-border">
                    <button
                      onClick={() => setIsWithdrawalOpen(!isWithdrawalOpen)}
                      className="w-full flex items-center justify-between font-bold text-sm text-[#0F1724] hover:text-primary transition-colors focus:outline-none"
                    >
                      <span className="flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 text-primary" />
                        Withdrawal & Refund Policy
                      </span>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isWithdrawalOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isWithdrawalOpen && (
                      <p className="text-xs text-[#6B7280] leading-relaxed mt-3 bg-slate-50 p-4 rounded-xl border border-border">
                        {withdrawalPolicyText || "Withdrawal and refund policies are subject to standard board guidelines. Please consult the school office for the official policy document."}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* SECTION: Campus Facilities */}
            <div ref={sectionRefs.facilities} className="scroll-mt-36">
              <Card className="border border-border shadow-sm bg-white">
                <CardContent className="p-6 sm:p-8">
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-6 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-primary" />
                    Campus Facilities
                  </h2>

                  {school.facilities && school.facilities.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {school.facilities.map((fac, idx) => (
                        <div key={idx} className="flex items-center gap-2.5 p-3 rounded-lg border border-border hover:border-primary/20 hover:bg-slate-50/50 transition-colors">
                          <div className="w-2.5 h-2.5 rounded-full bg-primary/80"></div>
                          <span className="text-xs font-semibold text-[#0F1724]">{fac}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">Detailed facility list is not uploaded. Standard amenities include Science labs, computing, library and play zones.</p>
                  )}

                   {/* Awards and Recognitions */}
                  {awardsList && (
                    <div className="mt-8 pt-8 border-t border-border">
                      <h3 className="font-bold text-sm text-[#0F1724] mb-4 flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-primary" />
                        Awards & School Recognitions
                      </h3>
                      <div className="grid sm:grid-cols-3 gap-4">
                        {awardsList.map((aw, i) => (
                          <div key={i} className="p-4 rounded-xl border border-border bg-[#FAFBFC] hover:border-primary/15 transition-all text-xs">
                            <span className="font-bold text-[10px] text-amber-500 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded uppercase">
                              🏆 {aw.year}
                            </span>
                            <h5 className="font-bold text-[#0f1724] mt-2 mb-1">{aw.title}</h5>
                            <p className="text-[11px] text-[#6B7280] leading-relaxed">{aw.details}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* SECTION: Campus Gallery */}
            <div ref={sectionRefs.gallery} className="scroll-mt-36">
              <Card className="border border-border shadow-sm bg-white">
                <CardContent className="p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2">
                        <Image className="w-5 h-5 text-primary" src="/favicon.ico" alt="" width={20} height={20} />
                        Campus Gallery
                      </h2>
                      <p className="text-xs text-[#6B7280] mt-1">Virtual tour across campus premises</p>
                    </div>

                    {/* Category Tabs */}
                    {galleryImages.length > 0 && galleryCategories.length > 2 && (
                      <div className="flex flex-wrap gap-1.5">
                        {galleryCategories.map(cat => (
                          <button
                            key={cat}
                            onClick={() => setGalleryCategory(cat)}
                            className={`px-2.5 py-1 rounded-md text-[11px] font-bold border transition-all ${
                              galleryCategory === cat
                                ? "bg-primary text-white border-primary"
                                : "text-muted-foreground hover:text-foreground border-border hover:bg-slate-50"
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {galleryImages.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {filteredGallery.map((img, idx) => (
                        <div key={img.id || idx} className="group relative h-32 sm:h-44 rounded-xl overflow-hidden border border-border bg-slate-100 shadow-sm">
                          <Image
                            src={img.imageUrl || img.image_url || ""}
                            alt={img.caption || school.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {img.caption && (
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2 sm:p-3">
                              <span className="text-white text-[10px] sm:text-xs line-clamp-2">{img.caption}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-slate-50 border border-dashed border-slate-200 rounded-xl">
                      <p className="text-sm font-semibold text-muted-foreground">Gallery is empty</p>
                      <p className="text-xs text-[#6B7280] mt-1">Campus tour pictures will be uploaded soon by school coordinators.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* SECTION: Parent Reviews */}
            <div ref={sectionRefs.reviews} className="scroll-mt-36">
              <Card className="border border-border shadow-sm bg-white">
                <CardContent className="p-6 sm:p-8">
                  
                  {/* Reviews Summary Stats */}
                  <div className="grid md:grid-cols-3 gap-6 mb-8 items-center border-b border-border pb-6">
                    <div className="text-center md:border-r border-border md:pr-6">
                      <p className="text-xs text-[#6B7280] uppercase tracking-wider font-semibold">Average Rating</p>
                      <h3 className="text-5xl font-extrabold text-[#0F1724] mt-1">{averageRating}</h3>
                      <div className="flex justify-center gap-0.5 mt-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-5 h-5 ${
                              i < Math.round(Number(averageRating))
                                ? "fill-amber-500 text-amber-500" 
                                : "text-gray-200"
                            }`} 
                          />
                        ))}
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-1.5">{totalReviewsCount} parent testimonials</p>
                    </div>

                    <div className="col-span-2 space-y-2 text-xs">
                      {Array.from({ length: 5 }).map((_, idx) => {
                        const stars = 5 - idx
                        // Count reviews with this star rating
                        const count = localReviews.filter(r => Math.round(r.rating || 5) === stars).length
                        const percentage = totalReviewsCount > 0 ? (count / totalReviewsCount) * 100 : 0
                        
                        return (
                          <div key={idx} className="flex items-center gap-3">
                            <span className="w-10 text-right font-medium text-[#6B7280]">{stars} stars</span>
                            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-amber-500 rounded-full" style={{ width: `${percentage}%` }}></div>
                            </div>
                            <span className="w-8 text-[#6B7280] font-medium">{count}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-[#0F1724] flex items-center gap-1.5">
                      <MessageSquare className="w-5 h-5 text-primary" />
                      Parent Testimonials ({totalReviewsCount})
                    </h3>
                    <Button 
                      onClick={() => setIsReviewModalOpen(true)}
                      size="sm" 
                      className="bg-primary hover:bg-primary/95 text-white font-bold"
                    >
                      Write a Review
                    </Button>
                  </div>

                  {/* Reviews List */}
                  {localReviews.length > 0 ? (
                    <div className="space-y-4">
                      {localReviews.map((rev) => (
                        <div key={rev.id} className="p-5 rounded-xl border border-border bg-[#FAFBFC] hover:border-primary/10 transition-colors">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <h5 className="font-bold text-sm text-[#0F1724]">{rev.title}</h5>
                              <p className="text-[11px] text-[#6B7280] mt-0.5">by {rev.author} • {rev.createdAt || "Recent review"}</p>
                            </div>
                            <div className="flex gap-0.5">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`w-3.5 h-3.5 ${
                                    i < (rev.rating || 5)
                                      ? "fill-amber-500 text-amber-500" 
                                      : "text-gray-200"
                                  }`} 
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-xs text-[#4B5563] leading-relaxed mt-3 font-normal border-t border-border/40 pt-3">{rev.body}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 border border-dashed border-border rounded-xl">
                      <p className="text-sm text-[#0F1724] font-semibold">No reviews yet</p>
                      <p className="text-xs text-muted-foreground mt-1 mb-3">Be the first to share your experience with other parents!</p>
                      <Button onClick={() => setIsReviewModalOpen(true)} variant="outline" size="sm" className="text-primary border-primary/20">Write Review</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* SECTION: Frequently Asked Questions */}
            <div ref={sectionRefs.faqs} className="scroll-mt-36">
              <Card className="border border-border shadow-sm bg-white">
                <CardContent className="p-6 sm:p-8">
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-6 flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-primary" />
                    Frequently Asked Questions
                  </h2>

                  {faqsList && faqsList.length > 0 ? (
                    <div className="space-y-3">
                      {faqsList.map((faq, idx) => {
                        const isOpen = openFaqIndex === idx
                        return (
                          <div key={faq.id || idx} className="border border-border/80 rounded-xl overflow-hidden transition-all bg-[#FAFBFC]">
                            <button
                              onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                              className="w-full flex items-center justify-between p-4 font-bold text-xs sm:text-sm text-left text-[#0F1724] hover:text-primary transition-colors focus:outline-none"
                            >
                              <span>{faq.question}</span>
                              <ChevronDown className={`w-4 h-4 text-[#6B7280] transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-primary' : ''}`} />
                            </button>
                            {isOpen && (
                              <div className="px-4 pb-4 pt-1 border-t border-border/60 text-xs sm:text-sm text-[#4B5563] leading-relaxed bg-white">
                                {faq.answer}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-6 bg-slate-50 border border-dashed border-slate-200 rounded-xl">
                      <p className="text-xs text-[#6B7280]">No FAQs are currently available for this school. Please contact the admissions department for query assistance.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Schedule Visit Inline Form Panel */}
            <Card className="border border-[#E6E9EE] shadow-md bg-gradient-to-br from-[#0052CC]/5 to-[#0052CC]/[0.01]">
              <CardContent className="p-6 sm:p-8">
                <h3 className="text-lg sm:text-xl font-bold text-[#0F1724] mb-2">Schedule a Campus Visit</h3>
                <p className="text-xs text-[#6B7280] mb-6">Select your preferred date to tour the campus and meet with admission advisors.</p>
                
                <form onSubmit={handleVisitSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#4B5563]" htmlFor="visit-name">Parent Name *</label>
                      <input
                        id="visit-name"
                        type="text"
                        placeholder="John Doe"
                        value={visitForm.parentName}
                        onChange={(e) => setVisitForm({ ...visitForm, parentName: e.target.value })}
                        className="w-full text-xs p-3 rounded-lg border border-border bg-white text-[#0F1724] focus:outline-none focus:ring-1 focus:ring-primary"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#4B5563]" htmlFor="visit-phone">Mobile Number *</label>
                      <input
                        id="visit-phone"
                        type="tel"
                        placeholder="9876543210"
                        value={visitForm.mobile}
                        onChange={(e) => setVisitForm({ ...visitForm, mobile: e.target.value })}
                        className="w-full text-xs p-3 rounded-lg border border-border bg-white text-[#0F1724] focus:outline-none focus:ring-1 focus:ring-primary"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#4B5563]" htmlFor="visit-class">Preferred Grade *</label>
                      <select
                        id="visit-class"
                        value={visitForm.childClass}
                        onChange={(e) => setVisitForm({ ...visitForm, childClass: e.target.value })}
                        className="w-full text-xs p-3 rounded-lg border border-border bg-white text-[#0F1724] focus:outline-none focus:ring-1 focus:ring-primary"
                      >
                        {dropdownGrades.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#4B5563]" htmlFor="visit-date">Preferred Date *</label>
                      <input
                        id="visit-date"
                        type="date"
                        value={visitForm.visitDate}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setVisitForm({ ...visitForm, visitDate: e.target.value })}
                        className="w-full text-xs p-3 rounded-lg border border-border bg-white text-[#0F1724] focus:outline-none focus:ring-1 focus:ring-primary"
                        required
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/95 text-white font-bold py-5 mt-2"
                    disabled={submittingVisit}
                  >
                    {submittingVisit ? "Scheduling Tour..." : "Confirm Schedule Visit"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT COLUMN: Sticky Info Box */}
          <div className="space-y-6">
            
            {/* Sidebar Floating Box */}
            <div className="sticky top-[140px] space-y-4 hidden lg:block">
              
              <Card className="border border-border shadow-md bg-white">
                <CardContent className="p-6">
                  
                  {/* Status Banner */}
                  <div className="flex items-center gap-2 text-xs font-bold text-secondary bg-secondary/10 px-3 py-2 rounded-lg mb-4">
                    <span className="h-2.5 w-2.5 rounded-full bg-secondary block animate-pulse"></span>
                    Accepting Admission Enquiries
                  </div>

                  {/* Fee Range Details */}
                  <div className="mb-4">
                    <p className="text-2xl font-extrabold text-primary">{school.feeRange}</p>
                    <p className="text-[10px] text-[#6B7280] font-medium tracking-wide uppercase">ESTIMATED ANNUAL FEE RANGE</p>
                  </div>

                  <Separator className="my-4 border-border" />

                  {/* Metadata Checklist */}
                  <div className="space-y-3 mb-6 text-xs text-[#4B5563]">
                    <div className="flex justify-between">
                      <span className="flex items-center gap-2 text-[#6B7280] font-semibold">
                        <Users className="w-4 h-4 text-primary" />
                        Students Capacity
                      </span>
                      <span className="font-bold text-[#0F1724]">{school.students ? `${school.students}+` : "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="flex items-center gap-2 text-[#6B7280] font-semibold">
                        <BookOpen className="w-4 h-4 text-primary" />
                        Curriculum
                      </span>
                      <span className="font-bold text-[#0F1724]">{school.curriculum}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="flex items-center gap-2 text-[#6B7280] font-semibold">
                        <Calendar className="w-4 h-4 text-primary" />
                        Established In
                      </span>
                      <span className="font-bold text-[#0F1724]">{school.established}</span>
                    </div>
                  </div>

                  {/* Buttons List */}
                  <div className="space-y-2.5">
                    <Button 
                      onClick={() => setIsApplyModalOpen(true)}
                      className="w-full bg-primary hover:bg-primary/95 text-white font-bold py-5 shadow-sm"
                    >
                      Apply Now / Register
                    </Button>
                    <Button 
                      onClick={() => {
                        const ref = sectionRefs.fees
                        if (ref.current) scrollToSection("fees")
                      }}
                      variant="outline" 
                      className="w-full border-border hover:bg-slate-50 font-semibold"
                    >
                      Check Class Fees structure
                    </Button>
                    <Button 
                      onClick={() => setIsCallbackModalOpen(true)}
                      variant="outline" 
                      className="w-full border-primary/20 text-primary hover:bg-primary/5 font-semibold"
                    >
                      Get Call Back Call
                    </Button>
                  </div>

                  <p className="text-[10px] text-center text-muted-foreground mt-4">
                    ✓ Direct Application · Free expert counselling assistance
                  </p>
                </CardContent>
              </Card>

              {/* Sidebar Quick Contact */}
              <Card className="border border-border shadow-sm bg-white">
                <CardContent className="p-6">
                  <h4 className="font-bold text-sm text-[#0F1724] mb-4">Official Contact Desk</h4>
                  {hasContact ? (
                    <div className="space-y-3.5 text-xs">
                      {school.contact?.phone && (
                        <a 
                          href={`tel:${school.contact.phone}`} 
                          className="flex items-center gap-3 text-[#4B5563] hover:text-primary transition-colors font-medium"
                        >
                          <div className="w-8 h-8 rounded-lg bg-slate-50 border border-border flex items-center justify-center shrink-0">
                            <Phone className="w-4 h-4 text-primary" />
                          </div>
                          {school.contact.phone}
                        </a>
                      )}
                      {school.contact?.email && (
                        <a 
                          href={`mailto:${school.contact.email}`} 
                          className="flex items-center gap-3 text-[#4B5563] hover:text-primary transition-colors font-medium"
                        >
                          <div className="w-8 h-8 rounded-lg bg-slate-50 border border-border flex items-center justify-center shrink-0">
                            <Mail className="w-4 h-4 text-primary" />
                          </div>
                          <span className="truncate">{school.contact.email}</span>
                        </a>
                      )}
                      {school.contact?.website && (
                        <a 
                          href={school.contact.website.startsWith('http') ? school.contact.website : `https://${school.contact.website}`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex items-center gap-3 text-[#4B5563] hover:text-primary transition-colors font-medium"
                        >
                          <div className="w-8 h-8 rounded-lg bg-slate-50 border border-border flex items-center justify-center shrink-0">
                            <Globe className="w-4 h-4 text-primary" />
                          </div>
                          <span>Visit Official Website</span>
                        </a>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">Official channels not registered yet.</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* MOBILE STICKY BOTTOM ACTION BAR */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border p-3 z-40 flex items-center justify-between gap-3 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
        <div className="flex-1">
          <p className="text-sm font-extrabold text-primary">{school.feeRange}</p>
          <p className="text-[9px] text-[#6B7280] font-bold">ANNUAL FEES</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => setIsCallbackModalOpen(true)}
            variant="outline" 
            size="sm"
            className="border-primary/20 text-primary font-bold px-4 py-4"
          >
            Callback
          </Button>
          <Button 
            onClick={() => setIsApplyModalOpen(true)}
            size="sm" 
            className="bg-primary hover:bg-primary/95 text-white font-bold px-5 py-4"
          >
            Apply Now
          </Button>
        </div>
      </div>

      {/* ============================================================================
          MODAL: APPLY NOW / REGISTER INTEREST FORM
          ============================================================================ */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-border shadow-xl overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsApplyModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-[#6B7280] focus:outline-none"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="p-6">
              <h3 className="text-lg font-bold text-[#0F1724] mb-1">Direct Registration Request</h3>
              <p className="text-xs text-[#6B7280] mb-6">Register your child's profile to start the official application journey with {school.name}.</p>
              
              <form onSubmit={handleApplySubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#4B5563]" htmlFor="apply-name">Parent Full Name *</label>
                  <input
                    id="apply-name"
                    type="text"
                    placeholder="Enter your name"
                    value={applyForm.parentName}
                    onChange={(e) => setApplyForm({ ...applyForm, parentName: e.target.value })}
                    className="w-full text-xs p-3 rounded-lg border border-border bg-white text-[#0F1724] focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#4B5563]" htmlFor="apply-phone">Mobile Contact Number *</label>
                  <input
                    id="apply-phone"
                    type="tel"
                    placeholder="Enter 10 digit number"
                    value={applyForm.mobile}
                    onChange={(e) => setApplyForm({ ...applyForm, mobile: e.target.value })}
                    className="w-full text-xs p-3 rounded-lg border border-border bg-white text-[#0F1724] focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#4B5563]" htmlFor="apply-email">Email Address (Optional)</label>
                  <input
                    id="apply-email"
                    type="email"
                    placeholder="name@example.com"
                    value={applyForm.email}
                    onChange={(e) => setApplyForm({ ...applyForm, email: e.target.value })}
                    className="w-full text-xs p-3 rounded-lg border border-border bg-white text-[#0F1724] focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#4B5563]" htmlFor="apply-class">Admission Grade Level *</label>
                  <select
                    id="apply-class"
                    value={applyForm.childClass}
                    onChange={(e) => setApplyForm({ ...applyForm, childClass: e.target.value })}
                    className="w-full text-xs p-3 rounded-lg border border-border bg-white text-[#0F1724] focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    {dropdownGrades.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary/95 text-white font-bold py-5 mt-4"
                  disabled={submittingApply}
                >
                  {submittingApply ? "Submitting Registration..." : "Submit Direct Application"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================================
          MODAL: REQUEST CALLBACK / ADVISOR CALL
          ============================================================================ */}
      {isCallbackModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-border shadow-xl overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsCallbackModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-[#6B7280] focus:outline-none"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="p-6">
              <h3 className="text-lg font-bold text-[#0F1724] mb-1">Request Callback Advice</h3>
              <p className="text-xs text-[#6B7280] mb-6">Talk directly with our senior educational advisor to discuss curriculum comparisons and fee breaks.</p>
              
              <form onSubmit={handleCallbackSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#4B5563]" htmlFor="callback-name">Name *</label>
                  <input
                    id="callback-name"
                    type="text"
                    placeholder="Enter your name"
                    value={callbackForm.name}
                    onChange={(e) => setCallbackForm({ ...callbackForm, name: e.target.value })}
                    className="w-full text-xs p-3 rounded-lg border border-border bg-white text-[#0F1724] focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#4B5563]" htmlFor="callback-phone">Phone Number *</label>
                  <input
                    id="callback-phone"
                    type="tel"
                    placeholder="10 digit mobile number"
                    value={callbackForm.phone}
                    onChange={(e) => setCallbackForm({ ...callbackForm, phone: e.target.value })}
                    className="w-full text-xs p-3 rounded-lg border border-border bg-white text-[#0F1724] focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#4B5563]" htmlFor="callback-class">Grade Level</label>
                  <select
                    id="callback-class"
                    value={callbackForm.childClass}
                    onChange={(e) => setCallbackForm({ ...callbackForm, childClass: e.target.value })}
                    className="w-full text-xs p-3 rounded-lg border border-border bg-white text-[#0F1724] focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    {dropdownGrades.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary/95 text-white font-bold py-5 mt-4"
                  disabled={submittingCallback}
                >
                  {submittingCallback ? "Requesting Call..." : "Call Me Back"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================================
          MODAL: WRITE A TESTIMONIAL REVIEW
          ============================================================================ */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-border shadow-xl overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsReviewModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-[#6B7280] focus:outline-none"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="p-6">
              <h3 className="text-lg font-bold text-[#0F1724] mb-1">Share School Experience</h3>
              <p className="text-xs text-[#6B7280] mb-4">Your reviews help hundreds of other parents in search of the best education.</p>
              
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                
                {/* Stars selector */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#4B5563]">Rating Score *</label>
                  <div className="flex gap-1.5 py-1">
                    {Array.from({ length: 5 }).map((_, i) => {
                      const starValue = i + 1
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setReviewForm({ ...reviewForm, rating: starValue })}
                          className="focus:outline-none scale-110"
                        >
                          <Star 
                            className={`w-7 h-7 transition-colors ${
                              starValue <= reviewForm.rating
                                ? "fill-amber-500 text-amber-500" 
                                : "text-gray-200 hover:text-amber-200"
                            }`} 
                          />
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#4B5563]" htmlFor="rev-author">Your Name *</label>
                  <input
                    id="rev-author"
                    type="text"
                    placeholder="e.g. Sarah Connor (Parent)"
                    value={reviewForm.author}
                    onChange={(e) => setReviewForm({ ...reviewForm, author: e.target.value })}
                    className="w-full text-xs p-3 rounded-lg border border-border bg-white text-[#0F1724] focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#4B5563]" htmlFor="rev-title">Review Summary *</label>
                  <input
                    id="rev-title"
                    type="text"
                    placeholder="e.g. Excellent academics & support"
                    value={reviewForm.title}
                    onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                    className="w-full text-xs p-3 rounded-lg border border-border bg-white text-[#0F1724] focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#4B5563]" htmlFor="rev-body">Detailed Experience *</label>
                  <textarea
                    id="rev-body"
                    placeholder="Detail the school curriculum, teaching staff, support system, and extra activities..."
                    value={reviewForm.body}
                    onChange={(e) => setReviewForm({ ...reviewForm, body: e.target.value })}
                    className="w-full text-xs p-3 rounded-lg border border-border bg-white text-[#0F1724] focus:outline-none focus:ring-1 focus:ring-primary h-24 resize-none"
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary/95 text-white font-bold py-5 mt-2"
                  disabled={submittingReview}
                >
                  {submittingReview ? "Submitting Review..." : "Publish Testimonial"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================================
          DYNAMIC CUSTOM TOAST NOTIFICATION POPUP
          ============================================================================ */}
      {toastMessage && (
        <div className="fixed bottom-20 sm:bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-200">
          <div className={`p-4 rounded-xl shadow-lg border flex items-center gap-3 text-xs sm:text-sm font-semibold max-w-sm ${
            toastMessage.type === "success" 
              ? "bg-[#FAFBFC] border-secondary text-[#0F1724] shadow-secondary/10" 
              : "bg-red-50 border-red-200 text-red-800 shadow-red-100"
          }`}>
            {toastMessage.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-secondary shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            )}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  )
}
