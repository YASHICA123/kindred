"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MessageCircle, 
  User, 
  Mail, 
  Phone, 
  Baby, 
  Send, 
  Loader2, 
  CheckCircle2, 
  ClipboardList, 
  Video, 
  PhoneCall, 
  FileText, 
  Trash2, 
  ArrowRight,
  Sparkles
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { supabase } from "@/lib/supabase"
import { AuthDialog } from "@/components/auth-dialog"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function CounselorConnectPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user, loading: authLoading } = useAuth()
  const [activeTab, setActiveTab] = useState<"book" | "history">("book")
  const [authDialogOpen, setAuthDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Data history states
  const [counselorBookings, setCounselorBookings] = useState<any[]>([])
  const [freeCounsellingBookings, setFreeCounsellingBookings] = useState<any[]>([])
  const [applications, setApplications] = useState<any[]>([])
  const [enquiries, setEnquiries] = useState<any[]>([])
  const [loadingData, setLoadingData] = useState(false)

  const [formData, setFormData] = useState({
    parentName: "",
    email: "",
    phone: "",
    childName: "",
    childAge: "",
    preferredDate: "",
    preferredTime: "",
    consultationType: "",
    message: "",
  })

  // Check URL query parameters for default tab selection
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      if (params.get("tab") === "history") {
        setActiveTab("history")
      }
    }
  }, [])

  // Auto-fill user information when authenticated
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        parentName: user.user_metadata?.full_name || prev.parentName || "",
        email: user.email || prev.email || "",
        phone: user.user_metadata?.phone || prev.phone || "",
      }))
    }
  }, [user])

  // Fetch all user-submitted forms
  const loadUserHistory = async () => {
    if (!user) return
    setLoadingData(true)
    try {
      // 1. Fetch Counselor Connect bookings
      const res1 = await fetch(`/api/counselor-booking?userId=${user.uid}`)
      if (res1.ok) {
        const data1 = await res1.json()
        setCounselorBookings(data1.bookings || [])
      }
      
      // 2. Fetch Free Counselling bookings
      const res2 = await fetch(`/api/free-counselling-booking?userId=${user.uid}`)
      if (res2.ok) {
        const data2 = await res2.json()
        setFreeCounsellingBookings(data2.bookings || [])
      }

      // 3. Fetch applications
      const { data: apps } = await supabase
        .from('applications')
        .select('*')
        .eq('user_id', user.uid)
        .order('created_at', { ascending: false })
      if (apps) {
        setApplications(apps)
      }

      // 4. Fetch direct enquiries
      const { data: enqs } = await supabase
        .from('school_enquiries')
        .select('*')
        .eq('user_id', user.uid)
        .order('created_at', { ascending: false })
      if (enqs) {
        setEnquiries(enqs)
      }
    } catch (err) {
      console.error("Error loading user history:", err)
    } finally {
      setLoadingData(false)
    }
  }

  // Load history data when history tab is active and user is logged in
  useEffect(() => {
    if (user && activeTab === "history") {
      loadUserHistory()
    }
  }, [user, activeTab])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Ensure we have a valid identifier for the record
    const targetUserId = user?.uid || `guest_${Date.now()}`

    try {
      const response = await fetch("/api/counselor-booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userId: targetUserId,
          counselorId: "general-counselor",
          counselorName: "Education Counsellor",
          counselorEmail: "counselor@kindred.com",
          bookingDate: formData.preferredDate,
          bookingTime: formData.preferredTime,
          topic: formData.consultationType,
          notes: formData.message || "General Consultation",
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Booking Confirmed! 🎉",
          description: "Our counselor will reach out to you within 24 hours.",
        })
        // Reset form
        setFormData({
          parentName: user?.user_metadata?.full_name || "",
          email: user?.email || "",
          phone: user?.user_metadata?.phone || "",
          childName: "",
          childAge: "",
          preferredDate: "",
          preferredTime: "",
          consultationType: "",
          message: "",
        })
        
        // Refresh history automatically and direct user to see their booking
        loadUserHistory()
        setTimeout(() => setActiveTab("history"), 1500)
      } else {
        toast({
          title: "Booking Failed",
          description: data.error || "Something went wrong. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Submission error:", error)
      toast({
        title: "Error",
        description: "Unable to submit your booking. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Cancel Counselor Booking handler
  const handleCancelCounselorBooking = async (bookingId: string) => {
    if (!user) return
    if (!confirm("Are you sure you want to cancel this booking?")) return
    try {
      const res = await fetch('/api/counselor-booking', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.uid, bookingId })
      })
      if (res.ok) {
        toast({
          title: "Booking Cancelled",
          description: "Your consultation session has been successfully cancelled.",
        })
        loadUserHistory()
      } else {
        toast({
          title: "Cancellation Failed",
          description: "Could not cancel the session. Please try again.",
          variant: "destructive"
        })
      }
    } catch (err) {
      console.error("Error cancelling booking:", err)
    }
  }

  // Cancel Free Booking handler
  const handleCancelFreeBooking = async (bookingId: string) => {
    if (!user) return
    if (!confirm("Are you sure you want to cancel this free session request?")) return
    try {
      const res = await fetch(`/api/free-counselling-booking?bookingId=${bookingId}&userId=${user.uid}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        toast({
          title: "Request Cancelled",
          description: "Your free guidance session request has been successfully cancelled.",
        })
        loadUserHistory()
      } else {
        toast({
          title: "Cancellation Failed",
          description: "Could not cancel the session. Please try again.",
          variant: "destructive"
        })
      }
    } catch (err) {
      console.error("Error cancelling free booking:", err)
    }
  }

  // Helper to safely parse selected schools from JSON list
  const renderSchools = (schoolsJson: any) => {
    if (!schoolsJson) return "N/A"
    try {
      const list = typeof schoolsJson === 'string' ? JSON.parse(schoolsJson) : schoolsJson
      if (Array.isArray(list)) {
        return list.map((s: any) => s.name || s.schoolName || s).join(', ')
      }
    } catch (e) {
      console.error(e)
    }
    return "N/A"
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10 pt-24 lg:pt-28">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="pt-8 pb-10 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-secondary text-primary mb-6">
            <MessageCircle className="h-8 w-8" />
          </div>
          <h1 className="font-serif text-4xl lg:text-5xl mb-4">Counselor Connect</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Connect with our education counselors to find the ideal match for your child, or review all form submissions and scheduled sessions in one place.
          </p>
        </div>
      </section>

      {/* Tab Navigation */}
      <div className="flex justify-center mb-12">
        <div className="inline-flex p-1 bg-secondary/30 backdrop-blur-sm rounded-full border border-border">
          <button
            onClick={() => setActiveTab("book")}
            className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
              activeTab === "book"
                ? "bg-primary text-primary-foreground shadow-sm font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Calendar className="h-4 w-4" />
            Book a Session
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
              activeTab === "history"
                ? "bg-primary text-primary-foreground shadow-sm font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <ClipboardList className="h-4 w-4" />
            Your Sessions & Forms
          </button>
        </div>
      </div>

      {/* Main Tab Render */}
      <section className="pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          {activeTab === "book" ? (
            <div className="max-w-3xl mx-auto">
              <div className="bg-card rounded-3xl border border-border p-8 lg:p-12 shadow-sm">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Parent Information */}
                  <div className="space-y-4">
                    <h2 className="font-serif text-2xl flex items-center gap-2">
                      <User className="h-5 w-5 text-primary" />
                      Parent Information
                    </h2>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="parentName">Your Name *</Label>
                        <Input
                          id="parentName"
                          name="parentName"
                          type="text"
                          placeholder="Enter your full name"
                          value={formData.parentName}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="your.email@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Child Information */}
                  <div className="space-y-4 pt-4 border-t">
                    <h2 className="font-serif text-2xl flex items-center gap-2">
                      <Baby className="h-5 w-5 text-primary" />
                      Child Information
                    </h2>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="childName">Child's Name</Label>
                        <Input
                          id="childName"
                          name="childName"
                          type="text"
                          placeholder="Enter child's name"
                          value={formData.childName}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="childAge">Child's Age</Label>
                        <Select value={formData.childAge} onValueChange={(value) => handleSelectChange("childAge", value)}>
                          <SelectTrigger id="childAge" className="w-full">
                            <SelectValue placeholder="Select age" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="2-3">2-3 years</SelectItem>
                            <SelectItem value="4-5">4-5 years</SelectItem>
                            <SelectItem value="6-7">6-7 years</SelectItem>
                            <SelectItem value="8-10">8-10 years</SelectItem>
                            <SelectItem value="11-13">11-13 years</SelectItem>
                            <SelectItem value="14-16">14-16 years</SelectItem>
                            <SelectItem value="17+">17+ years</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Appointment Details */}
                  <div className="space-y-4 pt-4 border-t">
                    <h2 className="font-serif text-2xl flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      Appointment Details
                    </h2>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="preferredDate">Preferred Date *</Label>
                        <Input
                          id="preferredDate"
                          name="preferredDate"
                          type="date"
                          value={formData.preferredDate}
                          onChange={handleChange}
                          min={new Date().toISOString().split('T')[0]}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="preferredTime">Preferred Time *</Label>
                        <Select value={formData.preferredTime} onValueChange={(value) => handleSelectChange("preferredTime", value)} required>
                          <SelectTrigger id="preferredTime" className="w-full">
                            <SelectValue placeholder="Select time slot" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="9:00 AM - 10:00 AM">9:00 AM - 10:00 AM</SelectItem>
                            <SelectItem value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</SelectItem>
                            <SelectItem value="11:00 AM - 12:00 PM">11:00 AM - 12:00 PM</SelectItem>
                            <SelectItem value="2:00 PM - 3:00 PM">2:00 PM - 3:00 PM</SelectItem>
                            <SelectItem value="3:00 PM - 4:00 PM">3:00 PM - 4:00 PM</SelectItem>
                            <SelectItem value="4:00 PM - 5:00 PM">4:00 PM - 5:00 PM</SelectItem>
                            <SelectItem value="5:00 PM - 6:00 PM">5:00 PM - 6:00 PM</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="consultationType">Consultation Type *</Label>
                      <Select value={formData.consultationType} onValueChange={(value) => handleSelectChange("consultationType", value)} required>
                        <SelectTrigger id="consultationType" className="w-full">
                          <SelectValue placeholder="What would you like to discuss?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="school-selection">School Selection Guidance</SelectItem>
                          <SelectItem value="curriculum-advice">Curriculum & Pedagogy Advice</SelectItem>
                          <SelectItem value="admission-process">Admission Process Help</SelectItem>
                          <SelectItem value="school-comparison">School Comparison</SelectItem>
                          <SelectItem value="special-needs">Special Needs Education</SelectItem>
                          <SelectItem value="general-consultation">General Consultation</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Additional Message</Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Tell us more about what you're looking for in a school or any specific concerns..."
                        value={formData.message}
                        onChange={handleChange}
                        rows={4}
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>Processing...</>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Book Your Session
                        </>
                      )}
                    </Button>
                    <p className="text-sm text-muted-foreground text-center mt-4">
                      Our counselor will contact you within 24 hours to confirm your appointment.
                    </p>
                  </div>
                </form>
              </div>

              {/* Benefits Section */}
              <div className="mt-12 grid md:grid-cols-3 gap-6">
                {[
                  {
                    title: "Expert Guidance",
                    description: "Get insights from counselors with 10+ years of experience",
                  },
                  {
                    title: "Personalized Support",
                    description: "Tailored advice based on your child's unique needs",
                  },
                  {
                    title: "Free Consultation",
                    description: "Your first 30-minute session is completely free",
                  },
                ].map((benefit) => (
                  <div key={benefit.title} className="text-center p-6 rounded-2xl bg-card border border-border">
                    <h3 className="font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* User History Section */
            <div className="max-w-6xl mx-auto">
              {!user ? (
                <div className="text-center py-16 bg-card border border-border rounded-3xl max-w-2xl mx-auto px-6 shadow-sm">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <User className="h-8 w-8 text-primary" />
                  </div>
                  <h2 className="text-2xl font-serif font-semibold mb-3">Sign in to view your history</h2>
                  <p className="text-muted-foreground mb-8">
                    To see your booked counseling sessions, direct school inquiries, and admission applications, please sign in to your account.
                  </p>
                  <Button 
                    onClick={() => setAuthDialogOpen(true)} 
                    className="bg-primary hover:bg-primary/90 text-white px-8 py-6 rounded-full font-medium"
                  >
                    Sign In / Create Account
                  </Button>
                </div>
              ) : loadingData ? (
                <div className="flex flex-col items-center justify-center py-32 gap-3">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">Loading your submitted sessions & forms...</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Left Column: Counseling & Guidance */}
                  <div className="space-y-8">
                    {/* Counselor Connect */}
                    <div className="space-y-4">
                      <h3 className="font-serif text-xl font-semibold flex items-center gap-2 border-b border-border/60 pb-3">
                        <Video className="h-5 w-5 text-indigo-500" />
                        1-on-1 Consultations
                      </h3>
                      {counselorBookings.length === 0 ? (
                        <div className="p-6 text-center border border-dashed rounded-2xl bg-card/30">
                          <p className="text-xs text-muted-foreground italic">No 1-on-1 consultations booked yet.</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {counselorBookings.map((b) => (
                            <div key={b.id} className="p-5 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all relative group shadow-sm">
                              <div className="flex items-start justify-between gap-3 mb-1 pr-2">
                                <h4 className="font-semibold text-sm text-foreground">{b.counselorName || "Education Counsellor"}</h4>
                                <span className="px-2.5 py-0.5 text-[10px] font-semibold rounded-full bg-amber-100 text-amber-800 capitalize shrink-0">
                                  {b.status || 'pending'}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                                {b.bookingDate} | {b.bookingTime}
                              </p>
                              {b.topic && (
                                <p className="text-xs text-muted-foreground mb-3 bg-secondary/50 p-2 rounded-lg">
                                  <strong>Topic:</strong> {b.topic === 'school-selection' ? 'School Selection' : b.topic}
                                </p>
                              )}
                              {b.notes && (
                                <p className="text-xs text-muted-foreground line-clamp-3 italic mb-2">"{b.notes}"</p>
                              )}
                              <button
                                onClick={() => handleCancelCounselorBooking(b.id)}
                                className="text-xs text-red-500 hover:text-red-700 font-semibold flex items-center gap-1 mt-2 transition-colors"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                Cancel Session
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Free Guidance requests */}
                    <div className="space-y-4 pt-4">
                      <h3 className="font-serif text-xl font-semibold flex items-center gap-2 border-b border-border/60 pb-3">
                        <PhoneCall className="h-5 w-5 text-emerald-500" />
                        Free Guidance Sessions
                      </h3>
                      {freeCounsellingBookings.length === 0 ? (
                        <div className="p-6 text-center border border-dashed rounded-2xl bg-card/30">
                          <p className="text-xs text-muted-foreground italic">No free guidance sessions requested yet.</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {freeCounsellingBookings.map((b) => (
                            <div key={b.id} className="p-5 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all relative group shadow-sm">
                              <div className="flex items-start justify-between gap-3 mb-1 pr-2">
                                <h4 className="font-semibold text-sm text-foreground">Free Consultation Request</h4>
                                <span className="px-2.5 py-0.5 text-[10px] font-semibold rounded-full bg-emerald-100 text-emerald-800 shrink-0">
                                  Requested
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                                Preferred: {b.preferredDate} ({b.preferredTime})
                              </p>
                              <div className="space-y-1.5 text-xs text-muted-foreground bg-secondary/50 p-3 rounded-lg mb-2">
                                <p><strong>Child Profile:</strong> Age {b.childAge} {b.currentSchool ? `(Currently at ${b.currentSchool})` : ''}</p>
                                <p><strong>Concerns:</strong> {b.concerns}</p>
                              </div>
                              <button
                                onClick={() => handleCancelFreeBooking(b.id)}
                                className="text-xs text-red-500 hover:text-red-700 font-semibold flex items-center gap-1 mt-2 transition-colors"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                Cancel Request
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Applications & Direct School Enquiries */}
                  <div className="space-y-8">
                    {/* Common Admission Applications */}
                    <div className="space-y-4">
                      <h3 className="font-serif text-xl font-semibold flex items-center gap-2 border-b border-border/60 pb-3">
                        <FileText className="h-5 w-5 text-blue-500" />
                        Common Admission Applications
                      </h3>
                      {applications.length === 0 ? (
                        <div className="p-8 text-center border border-dashed rounded-2xl bg-card/30">
                          <p className="text-xs text-muted-foreground mb-4 italic">No admission applications submitted yet.</p>
                          <Link href="/common-application">
                            <Button size="sm" variant="outline" className="text-xs gap-1.5">
                              Start Admission Form <ArrowRight className="h-3.5 w-3.5" />
                            </Button>
                          </Link>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {applications.map((app) => (
                            <div key={app.id} className="p-5 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all relative shadow-sm">
                              <div className="flex items-start justify-between gap-3 mb-1 pr-2">
                                <h4 className="font-semibold text-sm text-foreground">
                                  Student: {app.student_first_name} {app.student_last_name}
                                </h4>
                                <span className="px-2.5 py-0.5 text-[10px] font-semibold rounded-full bg-blue-100 text-blue-800 capitalize shrink-0">
                                  {app.status}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground mb-3">
                                Grade: {app.student_current_grade || 'N/A'} | Submitted: {app.submitted_at ? new Date(app.submitted_at).toLocaleDateString('en-IN', {day: 'numeric', month: 'short'}) : new Date(app.created_at).toLocaleDateString('en-IN', {day: 'numeric', month: 'short'})}
                              </p>
                              <div className="text-xs text-muted-foreground bg-secondary/50 p-3 rounded-lg">
                                <p className="font-semibold text-foreground mb-1">Applied Schools:</p>
                                <p className="line-clamp-2">{renderSchools(app.selected_schools)}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Direct Callback / Visit requests at schools */}
                    <div className="space-y-4 pt-4">
                      <h3 className="font-serif text-xl font-semibold flex items-center gap-2 border-b border-border/60 pb-3">
                        <Sparkles className="h-5 w-5 text-amber-500" />
                        School Enquiries & Visits
                      </h3>
                      {enquiries.length === 0 ? (
                        <div className="p-6 text-center border border-dashed rounded-2xl bg-card/30">
                          <p className="text-xs text-muted-foreground italic">No inquiries or callback requests sent yet.</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {enquiries.map((enq) => (
                            <div key={enq.id} className="p-5 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all relative shadow-sm">
                              <div className="flex items-start justify-between gap-3 mb-1 pr-2">
                                <h4 className="font-semibold text-sm text-foreground">{enq.school_name}</h4>
                                <span className="px-2.5 py-0.5 text-[10px] font-semibold rounded-full bg-slate-100 text-slate-800 capitalize shrink-0">
                                  {enq.status}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1.5">
                                <span className="font-semibold text-primary capitalize bg-primary/10 px-2 py-0.5 rounded text-[10px]">
                                  {enq.enquiry_type === 'callback' ? 'Callback' : enq.enquiry_type === 'visit' ? 'Campus Visit' : enq.enquiry_type}
                                </span>
                                {enq.visit_date && <span>• Visit Date: {enq.visit_date}</span>}
                              </p>
                              {enq.message && (
                                <p className="text-xs text-muted-foreground bg-secondary/50 p-3 rounded-lg italic">
                                  "{enq.message}"
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Auth Dialog */}
      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />

      {/* Footer */}
      <Footer />
    </div>
  )
}
