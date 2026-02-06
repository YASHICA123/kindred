"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock, MessageCircle, User, Mail, Phone, Baby, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

export default function CounselorConnectPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
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

    try {
      const response = await fetch("/api/counselor-booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Booking Confirmed! 🎉",
          description: "Our counselor will reach out to you within 24 hours.",
        })
        // Reset form
        setFormData({
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
        setTimeout(() => router.push("/"), 2000)
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center">
          <Link href="/" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-16 pb-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-secondary text-primary mb-6">
            <MessageCircle className="h-8 w-8" />
          </div>
          <h1 className="font-serif text-4xl lg:text-5xl mb-4">Counselor Connect</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Book a personalized session with our education counselors who understand each school's unique culture and can guide you to the perfect fit for your child.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="pb-20 px-6">
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
                      <SelectTrigger id="childAge">
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
                      <SelectTrigger id="preferredTime">
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
                    <SelectTrigger id="consultationType">
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
      </section>
    </div>
  )
}
