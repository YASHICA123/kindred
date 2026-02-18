"use client"

import React, { useState } from "react"
import { X, Search, MapPin, Users, BookOpen, IndianRupee, ChevronRight } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const indianCities = [
  "Delhi NCR", "Mumbai", "Bangalore", "Hyderabad", "Chennai",
  "Pune", "Kolkata", "Ahmedabad", "Jaipur", "Lucknow"
]

const boards = ["CBSE", "ICSE", "IB", "IGCSE", "State Board"]
const classes = ["Nursery", "KG", "1-5", "6-8", "9-10", "11-12"]
const feeRanges = [
  { label: "Under ₹2L", value: "0-200000" },
  { label: "₹2L - ₹5L", value: "200000-500000" },
  { label: "₹5L - ₹10L", value: "500000-1000000" },
  { label: "Above ₹10L", value: "1000000+" },
]

interface SmartSearchDialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function SmartSearchDialog({ open = true, onOpenChange }: SmartSearchDialogProps) {
  const [step, setStep] = useState<"search" | "enquire">("search")
  const [selectedCity, setSelectedCity] = useState("")
  const [selectedClass, setSelectedClass] = useState("")
  const [selectedBoard, setSelectedBoard] = useState("")
  const [selectedFeeRange, setSelectedFeeRange] = useState("")
  
  // Enquire form state
  const [parentName, setParentName] = useState("")
  const [parentEmail, setParentEmail] = useState("")
  const [parentPhone, setParentPhone] = useState("")
  const [childName, setChildName] = useState("")

  const handleSearch = () => {
    if (selectedCity && selectedClass) {
      setStep("enquire")
    }
  }

  const handleEnquireSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Build search params
    const params = new URLSearchParams()
    if (selectedCity) params.append("city", selectedCity)
    if (selectedClass) params.append("class", selectedClass)
    if (selectedBoard) params.append("board", selectedBoard)
    if (selectedFeeRange) params.append("fees", selectedFeeRange)
    
    // Store enquiry data in session/state
    const enquiryData = {
      parentName,
      parentEmail,
      parentPhone,
      childName,
      preferences: {
        city: selectedCity,
        class: selectedClass,
        board: selectedBoard,
        feeRange: selectedFeeRange
      },
      timestamp: new Date().toISOString()
    }
    
    // Save to localStorage for later use
    localStorage.setItem('lastEnquiry', JSON.stringify(enquiryData))
    
    // Redirect to discover page
    const queryString = params.toString()
    window.location.href = `/discover?${queryString}&enquiry=true`
  }

  const handleReset = () => {
    setStep("search")
    setSelectedCity("")
    setSelectedClass("")
    setSelectedBoard("")
    setSelectedFeeRange("")
    setParentName("")
    setParentEmail("")
    setParentPhone("")
    setChildName("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {step === "search" ? (
          <>
            <DialogHeader className="text-left">
              <DialogTitle className="text-2xl font-serif">
                Find Your Perfect School
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-2">
                Answer a few questions to get personalized school recommendations
              </p>
            </DialogHeader>

            <div className="space-y-5 py-6">
              {/* City Selection */}
              <div>
                <label className="block text-sm font-semibold mb-3 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Where are you located?
                </label>
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="Select your city" />
                  </SelectTrigger>
                  <SelectContent>
                    {indianCities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Class Selection */}
              <div>
                <label className="block text-sm font-semibold mb-3 flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  What class is your child in?
                </label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((cls) => (
                      <SelectItem key={cls} value={cls}>
                        Class {cls}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Board Selection (Optional) */}
              <div>
                <label className="block text-sm font-semibold mb-3 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Preferred board (optional)
                </label>
                <Select value={selectedBoard} onValueChange={setSelectedBoard}>
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="Any board" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any board</SelectItem>
                    {boards.map((board) => (
                      <SelectItem key={board} value={board}>
                        {board}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Fee Range Selection (Optional) */}
              <div>
                <label className="block text-sm font-semibold mb-3 flex items-center gap-2">
                  <IndianRupee className="h-5 w-5 text-primary" />
                  Budget preference (optional)
                </label>
                <Select value={selectedFeeRange} onValueChange={setSelectedFeeRange}>
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="Any budget" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any budget</SelectItem>
                    {feeRanges.map((range) => (
                      <SelectItem key={range.value} value={range.value}>
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => onOpenChange?.(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSearch}
                disabled={!selectedCity || !selectedClass}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                Next: Enquire Now
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </>
        ) : (
          <>
            <DialogHeader className="text-left">
              <DialogTitle className="text-2xl font-serif">
                Almost there!
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-2">
                Share your details to get expert guidance and personalized recommendations
              </p>
            </DialogHeader>

            <form onSubmit={handleEnquireSubmit} className="space-y-5 py-6">
              {/* Parent Name */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Your name *
                </label>
                <Input
                  type="text"
                  placeholder="Enter your full name"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  required
                  className="h-11"
                />
              </div>

              {/* Parent Email */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Email address *
                </label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={parentEmail}
                  onChange={(e) => setParentEmail(e.target.value)}
                  required
                  className="h-11"
                />
              </div>

              {/* Parent Phone */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Phone number *
                </label>
                <Input
                  type="tel"
                  placeholder="+91 XXXXX XXXXX"
                  value={parentPhone}
                  onChange={(e) => setParentPhone(e.target.value)}
                  required
                  className="h-11"
                />
              </div>

              {/* Child Name */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Child's name
                </label>
                <Input
                  type="text"
                  placeholder="Optional"
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  className="h-11"
                />
              </div>

              {/* Summary */}
              <div className="bg-secondary/50 rounded-xl p-4 border border-border/50">
                <p className="text-sm font-medium mb-3">Your preferences:</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Location:</span>
                    <p className="font-medium">{selectedCity}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Class:</span>
                    <p className="font-medium">{selectedClass}</p>
                  </div>
                  {selectedBoard && (
                    <div>
                      <span className="text-muted-foreground">Board:</span>
                      <p className="font-medium">{selectedBoard}</p>
                    </div>
                  )}
                  {selectedFeeRange && (
                    <div>
                      <span className="text-muted-foreground">Budget:</span>
                      <p className="font-medium">
                        {feeRanges.find(r => r.value === selectedFeeRange)?.label}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  Get Recommendations
                </Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
