"use client"

import { useState } from "react"
import { AlertCircle, FileText, MapPin, User, BookOpen, Upload, CheckCircle, Loader } from "lucide-react"
import { useApplicationForm } from "@/hooks/use-application-form"
import { Button } from "@/components/ui/button"

export function ReviewSubmit() {
  const { state, setCurrentStep, submitApplication } = useApplicationForm()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    setIsSubmitting(true)
    await submitApplication()
    setIsSubmitting(false)
  }

  const { parentProfile, studentDetails, documents, selectedSchools } = state

  const sections = [
    {
      title: "Parent/Guardian Information",
      icon: User,
      step: 0,
      items: [
        { label: "Name", value: `${parentProfile.firstName} ${parentProfile.lastName}` },
        { label: "Email", value: parentProfile.email },
        { label: "Phone", value: parentProfile.phone },
        { label: "Address", value: parentProfile.address },
        { label: "City", value: parentProfile.city },
        { label: "State", value: parentProfile.state },
        { label: "Zip Code", value: parentProfile.zipCode },
        { label: "Occupation", value: parentProfile.occupation },
        { label: "Annual Income", value: parentProfile.income },
      ],
    },
    {
      title: "Student Information",
      icon: BookOpen,
      step: 1,
      items: [
        { label: "Name", value: `${studentDetails.firstName} ${studentDetails.lastName}` },
        { label: "Date of Birth", value: studentDetails.dateOfBirth },
        { label: "Gender", value: studentDetails.gender },
        { label: "Current Grade", value: studentDetails.currentGrade },
        { label: "Current School", value: studentDetails.currentSchool },
        { label: "Previous School", value: studentDetails.previousSchool },
        { label: "Caste", value: studentDetails.caste },
        { label: "Religion", value: studentDetails.religion },
        {
          label: "Special Needs",
          value: studentDetails.specialNeeds ? `Yes: ${studentDetails.specialNeedsDetails}` : "No",
        },
      ],
    },
    {
      title: "Uploaded Documents",
      icon: FileText,
      step: 2,
      items: documents.map((doc) => ({
        label: doc.type,
        value: doc.name,
      })),
    },
    {
      title: "Selected Schools",
      icon: MapPin,
      step: 3,
      items: selectedSchools.map((school) => ({
        label: `${school.preference}. ${school.name}`,
        value: school.slug,
      })),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">Review Your Application</h2>
        <p className="text-gray-600">Please verify all information before submitting</p>
      </div>

      {state.submissionError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-red-700">{state.submissionError}</div>
        </div>
      )}

      <div className="space-y-4">
        {sections.map((section) => {
          const Icon = section.icon
          return (
            <div key={section.title} className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">{section.title}</h3>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentStep(section.step)}
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  Edit
                </Button>
              </div>

              <div className="px-6 py-4 space-y-3">
                {section.items.length > 0 ? (
                  section.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-start gap-4 py-2 border-b border-gray-100 last:border-0">
                      <span className="text-sm font-medium text-gray-700">{item.label}</span>
                      <span className="text-sm text-gray-900 text-right">{item.value || "—"}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 italic">No information provided</p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {selectedSchools.length === 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-700">
            Please select at least one school before submitting your application.
          </div>
        </div>
      )}

      {/* Confirmation Checkbox */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            defaultChecked
            className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">
            I confirm that all information provided is accurate and complete. I understand that providing false information may result in rejection of this application.
          </span>
        </label>
      </div>

      <div className="flex justify-between gap-3 pt-6">
        <Button variant="outline" onClick={() => setCurrentStep(3)}>
          Previous
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || selectedSchools.length === 0}
          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4" />
              Submit Application
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
