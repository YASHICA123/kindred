"use client"

import { useState } from "react"
import { useApplicationForm } from "@/hooks/use-application-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function ParentProfile() {
  const { state, setParentProfile, setCurrentStep } = useApplicationForm()
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (key: string, value: string) => {
    setParentProfile({
      ...state.parentProfile,
      [key]: value,
    })
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!state.parentProfile.firstName.trim()) newErrors.firstName = "First name is required"
    if (!state.parentProfile.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!state.parentProfile.email.trim()) newErrors.email = "Email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.parentProfile.email))
      newErrors.email = "Invalid email format"
    if (!state.parentProfile.phone.trim()) newErrors.phone = "Phone number is required"
    if (!state.parentProfile.address.trim()) newErrors.address = "Address is required"
    if (!state.parentProfile.city.trim()) newErrors.city = "City is required"
    if (!state.parentProfile.state.trim()) newErrors.state = "State is required"
    if (!state.parentProfile.zipCode.trim()) newErrors.zipCode = "Zip code is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateForm()) {
      setCurrentStep(1)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">Parent Profile</h2>
        <p className="text-gray-600">Please provide your contact information</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">First Name *</label>
          <Input
            placeholder="John"
            value={state.parentProfile.firstName}
            onChange={(e) => handleChange("firstName", e.target.value)}
            className={errors.firstName ? "border-red-500" : ""}
          />
          {errors.firstName && <p className="text-sm text-red-500">{errors.firstName}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Last Name *</label>
          <Input
            placeholder="Doe"
            value={state.parentProfile.lastName}
            onChange={(e) => handleChange("lastName", e.target.value)}
            className={errors.lastName ? "border-red-500" : ""}
          />
          {errors.lastName && <p className="text-sm text-red-500">{errors.lastName}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Email *</label>
          <Input
            type="email"
            placeholder="john@example.com"
            value={state.parentProfile.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Phone Number *</label>
          <Input
            type="tel"
            placeholder="+91 98765 43210"
            value={state.parentProfile.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            className={errors.phone ? "border-red-500" : ""}
          />
          {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Address *</label>
        <Input
          placeholder="123 Maple Street"
          value={state.parentProfile.address}
          onChange={(e) => handleChange("address", e.target.value)}
          className={errors.address ? "border-red-500" : ""}
        />
        {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">City *</label>
          <Input
            placeholder="Mumbai"
            value={state.parentProfile.city}
            onChange={(e) => handleChange("city", e.target.value)}
            className={errors.city ? "border-red-500" : ""}
          />
          {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">State *</label>
          <Input
            placeholder="Maharashtra"
            value={state.parentProfile.state}
            onChange={(e) => handleChange("state", e.target.value)}
            className={errors.state ? "border-red-500" : ""}
          />
          {errors.state && <p className="text-sm text-red-500">{errors.state}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Zip Code *</label>
          <Input
            placeholder="400001"
            value={state.parentProfile.zipCode}
            onChange={(e) => handleChange("zipCode", e.target.value)}
            className={errors.zipCode ? "border-red-500" : ""}
          />
          {errors.zipCode && <p className="text-sm text-red-500">{errors.zipCode}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Occupation</label>
          <Input
            placeholder="Software Engineer"
            value={state.parentProfile.occupation}
            onChange={(e) => handleChange("occupation", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Annual Income</label>
          <Select value={state.parentProfile.income} onValueChange={(v) => handleChange("income", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select income range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="below-5lakh">Below ₹5 Lakh</SelectItem>
              <SelectItem value="5-10lakh">₹5 - 10 Lakh</SelectItem>
              <SelectItem value="10-20lakh">₹10 - 20 Lakh</SelectItem>
              <SelectItem value="20-50lakh">₹20 - 50 Lakh</SelectItem>
              <SelectItem value="above-50lakh">Above ₹50 Lakh</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6">
        <Button variant="outline" disabled>
          Previous
        </Button>
        <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700">
          Next: Student Details
        </Button>
      </div>
    </div>
  )
}
