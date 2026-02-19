"use client"

import { useState } from "react"
import { useApplicationForm } from "@/hooks/use-application-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

export function StudentDetails() {
  const { state, setStudentDetails, setCurrentStep } = useApplicationForm()
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (key: string, value: string | boolean) => {
    setStudentDetails({
      ...state.studentDetails,
      [key]: value,
    })
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!state.studentDetails.firstName.trim()) newErrors.firstName = "Student first name is required"
    if (!state.studentDetails.lastName.trim()) newErrors.lastName = "Student last name is required"
    if (!state.studentDetails.dateOfBirth.trim()) newErrors.dateOfBirth = "Date of birth is required"
    if (!state.studentDetails.gender.trim()) newErrors.gender = "Gender is required"
    if (!state.studentDetails.currentGrade.trim()) newErrors.currentGrade = "Current grade is required"

    if (state.studentDetails.specialNeeds && !state.studentDetails.specialNeedsDetails.trim()) {
      newErrors.specialNeedsDetails = "Please describe special needs"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateForm()) {
      setCurrentStep(2)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">Student Details</h2>
        <p className="text-gray-600">Please provide information about the student</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">First Name *</label>
          <Input
            placeholder="John"
            value={state.studentDetails.firstName}
            onChange={(e) => handleChange("firstName", e.target.value)}
            className={errors.firstName ? "border-red-500" : ""}
          />
          {errors.firstName && <p className="text-sm text-red-500">{errors.firstName}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Last Name *</label>
          <Input
            placeholder="Doe"
            value={state.studentDetails.lastName}
            onChange={(e) => handleChange("lastName", e.target.value)}
            className={errors.lastName ? "border-red-500" : ""}
          />
          {errors.lastName && <p className="text-sm text-red-500">{errors.lastName}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Date of Birth *</label>
          <Input
            type="date"
            value={state.studentDetails.dateOfBirth}
            onChange={(e) => handleChange("dateOfBirth", e.target.value)}
            className={errors.dateOfBirth ? "border-red-500" : ""}
          />
          {errors.dateOfBirth && <p className="text-sm text-red-500">{errors.dateOfBirth}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Gender *</label>
          <Select value={state.studentDetails.gender} onValueChange={(v) => handleChange("gender", v)}>
            <SelectTrigger className={errors.gender ? "border-red-500" : ""}>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          {errors.gender && <p className="text-sm text-red-500">{errors.gender}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Current Grade *</label>
          <Select value={state.studentDetails.currentGrade} onValueChange={(v) => handleChange("currentGrade", v)}>
            <SelectTrigger className={errors.currentGrade ? "border-red-500" : ""}>
              <SelectValue placeholder="Select grade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pre-primary">Pre-Primary</SelectItem>
              <SelectItem value="grade-1">Grade 1</SelectItem>
              <SelectItem value="grade-2">Grade 2</SelectItem>
              <SelectItem value="grade-3">Grade 3</SelectItem>
              <SelectItem value="grade-4">Grade 4</SelectItem>
              <SelectItem value="grade-5">Grade 5</SelectItem>
              <SelectItem value="grade-6">Grade 6</SelectItem>
              <SelectItem value="grade-7">Grade 7</SelectItem>
              <SelectItem value="grade-8">Grade 8</SelectItem>
              <SelectItem value="grade-9">Grade 9</SelectItem>
              <SelectItem value="grade-10">Grade 10</SelectItem>
              <SelectItem value="grade-11">Grade 11</SelectItem>
              <SelectItem value="grade-12">Grade 12</SelectItem>
            </SelectContent>
          </Select>
          {errors.currentGrade && <p className="text-sm text-red-500">{errors.currentGrade}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Current School</label>
          <Input
            placeholder="Current school name"
            value={state.studentDetails.currentSchool}
            onChange={(e) => handleChange("currentSchool", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Previous School</label>
        <Input
          placeholder="Previous school name (if applicable)"
          value={state.studentDetails.previousSchool}
          onChange={(e) => handleChange("previousSchool", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Caste</label>
          <Select value={state.studentDetails.caste} onValueChange={(v) => handleChange("caste", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select caste (optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">General</SelectItem>
              <SelectItem value="obc">OBC</SelectItem>
              <SelectItem value="sc">SC</SelectItem>
              <SelectItem value="st">ST</SelectItem>
              <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Religion</label>
          <Select value={state.studentDetails.religion} onValueChange={(v) => handleChange("religion", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select religion (optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hinduism">Hinduism</SelectItem>
              <SelectItem value="islam">Islam</SelectItem>
              <SelectItem value="christianity">Christianity</SelectItem>
              <SelectItem value="sikhism">Sikhism</SelectItem>
              <SelectItem value="buddhism">Buddhism</SelectItem>
              <SelectItem value="jainism">Jainism</SelectItem>
              <SelectItem value="other">Other</SelectItem>
              <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border rounded-lg p-4 bg-gray-50">
        <div className="flex items-start gap-3">
          <Checkbox
            id="special-needs"
            checked={state.studentDetails.specialNeeds}
            onCheckedChange={(checked) => handleChange("specialNeeds", !!checked)}
          />
          <label htmlFor="special-needs" className="text-sm font-medium text-gray-700 flex-1 cursor-pointer">
            Does the student have special needs or require special accommodations?
          </label>
        </div>

        {state.studentDetails.specialNeeds && (
          <div className="mt-4 space-y-2">
            <label className="text-sm font-medium text-gray-700">Please describe *</label>
            <textarea
              placeholder="Describe any special needs..."
              value={state.studentDetails.specialNeedsDetails}
              onChange={(e) => handleChange("specialNeedsDetails", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
            {errors.specialNeedsDetails && <p className="text-sm text-red-500">{errors.specialNeedsDetails}</p>}
          </div>
        )}
      </div>

      <div className="flex justify-between gap-3 pt-6">
        <Button variant="outline" onClick={() => setCurrentStep(0)}>
          Previous
        </Button>
        <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700">
          Next: Documents
        </Button>
      </div>
    </div>
  )
}
