"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { MessageCircle, Star, Calendar, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const counsellors = [
  {
    id: 1,
    name: "Ms. Priya Sharma",
    expertise: "K-5 Education, Montessori Methods",
    bio: "10+ years of experience in curriculum design and elementary education",
    rating: 4.9,
    reviews: 247,
    availability: "Mon-Wed, 3-6 PM",
    sessions: 156,
  },
  {
    id: 2,
    name: "Mr. Rajesh Kumar",
    expertise: "Senior Secondary, Engineering Prep",
    bio: "Specialized in preparing students for competitive exams and IIT entrance",
    rating: 4.8,
    reviews: 198,
    availability: "Tue-Thu, 2-5 PM",
    sessions: 142,
  },
  {
    id: 3,
    name: "Dr. Neha Singh",
    expertise: "Special Needs, Inclusive Education",
    bio: "PhD in special education with focus on neurodiversity and learning differences",
    rating: 5.0,
    reviews: 165,
    availability: "Wed-Fri, 4-7 PM",
    sessions: 128,
  },
  {
    id: 4,
    name: "Ms. Isha Patel",
    expertise: "International Boards (IB, Cambridge)",
    bio: "IB Diploma graduate with expertise in global curriculum and college admissions",
    rating: 4.9,
    reviews: 213,
    availability: "Mon-Thu, 3-6 PM",
    sessions: 169,
  },
]

export function CounsellorsSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="counsellors"
      ref={sectionRef}
      className="py-16 lg:py-24 bg-white border-b border-border/20 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-primary/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
        {/* Header */}
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <MessageCircle className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Expert Guidance</span>
          </div>
          <h2 className="font-serif text-3xl lg:text-5xl max-w-3xl mx-auto mb-6">
            Connect with Expert Education
            <span className="text-primary"> Counsellors</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our team of experienced counsellors are here to guide you through your school selection journey with personalized insights and expert recommendations.
          </p>
        </div>

        {/* Connect CTA Section */}
        <div className="relative z-10 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-3xl border border-primary/20 p-8 lg:p-12 text-center">
          <h3 className="font-serif text-2xl lg:text-3xl mb-4">Ready to get expert guidance?</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Book a free consultation with our counsellors and explore personalized school recommendations tailored to your child's unique needs.
          </p>
          <Link href="/free-counselling">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Book Free Consultation
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
