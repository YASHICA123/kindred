"use client"

import { Download, CheckCircle, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useApplicationForm } from "@/hooks/use-application-form"

export function SubmissionConfirmation() {
  const { state, resetForm } = useApplicationForm()

  const applicationId = state.submittedApplicationId || "APP-" + Date.now()

  return (
    <div className="space-y-8">
      {/* Success Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="bg-green-100 rounded-full p-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-900">Application Submitted Successfully!</h2>
        <p className="text-gray-600 max-w-md mx-auto">
          Your application has been received. Schools will review and contact you within 5-7 business days.
        </p>
      </div>

      {/* Application ID Card */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 text-center space-y-2">
        <p className="text-sm text-gray-600">Your Application ID</p>
        <p className="text-2xl font-bold text-gray-900 font-mono">{applicationId}</p>
        <p className="text-xs text-gray-600">Keep this ID for reference</p>
      </div>

      {/* Next Steps */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">What Happens Next?</h3>
        <div className="space-y-3">
          {[
            {
              step: 1,
              title: "Application Review",
              description: "Schools review your application and verify documents",
            },
            {
              step: 2,
              title: "Initial Assessment",
              description: "Schools assess your eligibility and profile",
            },
            {
              step: 3,
              title: "Interview Invitation",
              description: "You'll receive interview invitations from interested schools",
            },
            {
              step: 4,
              title: "Final Decision",
              description: "Receive admission decisions and enrollment details",
            },
          ].map((item) => (
            <div key={item.step} className="flex gap-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-semibold">
                {item.step}
              </div>
              <div className="pt-1">
                <p className="font-medium text-gray-900">{item.title}</p>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Information Box */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-3">
        <h4 className="font-semibold text-gray-900">Important Information</h4>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>Check your email for confirmation and updates</span>
          </li>
          <li className="flex gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>You can track your application status in your dashboard</span>
          </li>
          <li className="flex gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>Schools may request additional information or documents</span>
          </li>
          <li className="flex gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>Keep your application ID safe for any follow-up inquiries</span>
          </li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="outline"
          className="flex items-center justify-center gap-2"
          onClick={() => {
            // Generate and download PDF confirmation
            const element = document.createElement("a")
            element.href = "#" // In real app, generate PDF
            element.download = `confirmation-${applicationId}.pdf`
            document.body.appendChild(element)
            element.click()
            document.body.removeChild(element)
          }}
        >
          <Download className="w-4 h-4" />
          Download Confirmation
        </Button>

        <Link href="/dashboard" className="flex-1 sm:flex-none">
          <Button className="w-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2">
            <ArrowRight className="w-4 h-4" />
            Go to Dashboard
          </Button>
        </Link>
      </div>

      {/* New Application Button */}
      <div className="border-t border-gray-200 pt-6">
        <Button
          variant="ghost"
          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          onClick={resetForm}
        >
          Start New Application
        </Button>
      </div>
    </div>
  )
}
