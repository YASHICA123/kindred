"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Calendar, Clock, User, Mail, Phone, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { saveFreeCounsellingBooking } from "@/lib/firebase-data"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/firebase"
import Link from "next/link"

const counsellors = [
  {
    name: "Ms. Priya Sharma",
    expertise: "K-5 Education, Montessori Methods",
    availability: "Mon-Wed, 3-6 PM",
  },
  {
    name: "Mr. Rajesh Kumar",
    expertise: "Senior Secondary, Engineering Prep",
    availability: "Tue-Thu, 2-5 PM",
  },
  {
    name: "Dr. Neha Singh",
    expertise: "Special Needs, Inclusive Education",
    availability: "Wed-Fri, 4-7 PM",
  },
  {
    name: "Ms. Isha Patel",
    expertise: "International Boards (IB, Cambridge)",
    availability: "Mon-Thu, 3-6 PM",
  },
]

export default function FreeCounsellingPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    childAge: "",
    currentSchool: "",
    concerns: "",
    preferredDate: "",
    preferredTime: "",
  })
  const [submitted, setSubmitted] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })
    return () => unsubscribe()
  }, [])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    if (!formData.name || !formData.email || !formData.phone || !formData.childAge || 
        !formData.concerns || !formData.preferredDate || !formData.preferredTime) {
      setError("Please fill in all required fields")
      return
    }

    setIsSaving(true)
    setError("")
    
    try {
      await saveFreeCounsellingBooking(formData)
      console.log("✅ Free counselling booking saved:", formData)
      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 5000)
      setFormData({
        name: "",
        email: "",
        phone: "",
        childAge: "",
        currentSchool: "",
        concerns: "",
        preferredDate: "",
        preferredTime: "",
      })
    } catch (err) {
      console.error("❌ Error submitting counselling booking:", err)
      setError("Failed to book consultation. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-secondary/30 to-background">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <MessageSquare className="h-8 w-8 text-primary" />
            <span className="text-sm font-medium text-primary">Expert Guidance</span>
          </div>
          <h1 className="font-serif text-5xl lg:text-6xl font-medium mb-6">
            Free Expert Counselling
          </h1>
          <p className="text-xl text-muted-foreground">
            Get personalized guidance from our team of education experts. Book a free consultation today.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Form */}
            <div className="lg:col-span-2">
              <div className="bg-card rounded-3xl p-8 lg:p-10 border">
                <h2 className="font-serif text-3xl font-medium mb-8">Book Your Consultation</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">Your Name *</label>
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      required
                      className="h-12"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">Email Address *</label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      required
                      className="h-12"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">Phone Number *</label>
                    <Input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 XXXXX XXXXX"
                      required
                      className="h-12"
                    />
                  </div>

                  {/* Child Age */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">Child's Age/Grade *</label>
                    <Input
                      type="text"
                      name="childAge"
                      value={formData.childAge}
                      onChange={handleChange}
                      placeholder="e.g., 7 years old, Grade 3"
                      required
                      className="h-12"
                    />
                  </div>

                  {/* Current School */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">Current School</label>
                    <Input
                      type="text"
                      name="currentSchool"
                      value={formData.currentSchool}
                      onChange={handleChange}
                      placeholder="School name (optional)"
                      className="h-12"
                    />
                  </div>

                  {/* Concerns */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">Your Concerns *</label>
                    <textarea
                      name="concerns"
                      value={formData.concerns}
                      onChange={handleChange}
                      placeholder="Tell us about your concerns and what you're looking for..."
                      required
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  {/* Preferred Date */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">Preferred Date *</label>
                    <Input
                      type="date"
                      name="preferredDate"
                      value={formData.preferredDate}
                      onChange={handleChange}
                      required
                      className="h-12"
                    />
                  </div>

                  {/* Preferred Time */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">Preferred Time *</label>
                    <select
                      name="preferredTime"
                      value={formData.preferredTime}
                      onChange={handleChange}
                      required
                      className="w-full h-12 px-4 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="">Select time</option>
                      <option value="10:00 AM">10:00 AM</option>
                      <option value="11:00 AM">11:00 AM</option>
                      <option value="2:00 PM">2:00 PM</option>
                      <option value="3:00 PM">3:00 PM</option>
                      <option value="4:00 PM">4:00 PM</option>
                      <option value="5:00 PM">5:00 PM</option>
                      <option value="6:00 PM">6:00 PM</option>
                    </select>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
                      <p className="font-semibold mb-1">Error</p>
                      <p className="text-sm">{error}</p>
                    </div>
                  )}

                  {submitted && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800">
                      <p className="font-semibold mb-1">Booking Confirmed!</p>
                      <p className="text-sm">Our counsellor will contact you shortly to confirm the appointment.</p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isSaving || submitted}
                    className="w-full h-12 bg-primary hover:bg-primary/90 text-base font-medium"
                  >
                    {isSaving ? "Booking..." : submitted ? "Booking Confirmed" : "Book Free Consultation"}
                  </Button>
                </form>
              </div>
            </div>

            {/* Counsellors Sidebar */}
            <div className="space-y-6">
              <div className="bg-primary/5 border border-primary/20 rounded-3xl p-6">
                <h3 className="font-semibold text-lg mb-4">Expert Counsellors</h3>
                <div className="space-y-4">
                  {counsellors.map((counsellor, i) => (
                    <div key={i} className="bg-card rounded-xl p-4 border">
                      <p className="font-semibold text-sm mb-1">{counsellor.name}</p>
                      <p className="text-xs text-muted-foreground mb-2">{counsellor.expertise}</p>
                      <p className="text-xs text-primary font-medium">{counsellor.availability}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Why Counselling */}
              <div className="bg-card rounded-3xl p-6 border">
                <h3 className="font-semibold text-lg mb-4">Why Counselling?</h3>
                <ul className="space-y-3">
                  <li className="flex gap-2">
                    <span className="text-primary">✓</span>
                    <span className="text-sm">Personalized school recommendations</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">✓</span>
                    <span className="text-sm">Admission process guidance</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">✓</span>
                    <span className="text-sm">Completely free & confidential</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">✓</span>
                    <span className="text-sm">Save time & make informed decisions</span>
                  </li>
                </ul>
              </div>

              {/* Contact Info */}
              <div className="bg-secondary/30 rounded-3xl p-6 border">
                <h3 className="font-semibold text-lg mb-4">Need Help?</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex gap-2">
                    <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                    <a href="tel:+919876543210" className="text-primary hover:underline">
                      +91 98765 43210
                    </a>
                  </div>
                  <div className="flex gap-2">
                    <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                    <a href="mailto:counselling@kindred.school" className="text-primary hover:underline">
                      counselling@kindred.school
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-secondary/20">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <h2 className="font-serif text-4xl font-medium text-center mb-16">What You'll Get</h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="bg-card rounded-2xl p-8 border text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <User className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">One-on-One Session</h3>
              <p className="text-sm text-muted-foreground">
                30-minute personalized consultation with our expert
              </p>
            </div>

            <div className="bg-card rounded-2xl p-8 border text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Custom Recommendations</h3>
              <p className="text-sm text-muted-foreground">
                School suggestions tailored to your requirements
              </p>
            </div>

            <div className="bg-card rounded-2xl p-8 border text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Admission Timeline</h3>
              <p className="text-sm text-muted-foreground">
                Guidance on application deadlines and procedures
              </p>
            </div>

            <div className="bg-card rounded-2xl p-8 border text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Follow-up Support</h3>
              <p className="text-sm text-muted-foreground">
                Post-consultation assistance and updates
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
