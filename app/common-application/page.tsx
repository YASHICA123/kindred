"use client"

import { ApplicationFormProvider, useApplicationForm } from "@/hooks/use-application-form"
import { ApplicationStepper } from "@/components/common-application/application-stepper"
import { ParentProfile } from "@/components/common-application/parent-profile"
import { StudentDetails } from "@/components/common-application/student-details"
import { DocumentUpload } from "@/components/common-application/document-upload"
import { MultiSchoolSelection } from "@/components/common-application/multi-school-selection"
import { ReviewSubmit } from "@/components/common-application/review-submit"
import { SubmissionConfirmation } from "@/components/common-application/submission-confirmation"

function ApplicationFormContent() {
  const { state } = useApplicationForm()

  const renderStep = () => {
    switch (state.currentStep) {
      case 0:
        return <ParentProfile />
      case 1:
        return <StudentDetails />
      case 2:
        return <DocumentUpload />
      case 3:
        return <MultiSchoolSelection />
      case 4:
        return <ReviewSubmit />
      case 5:
        return <SubmissionConfirmation />
      default:
        return <ParentProfile />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Apply for Schools</h1>
          <p className="mt-2 text-gray-600">Complete your application in 6 simple steps</p>
        </div>

        {/* Stepper */}
        {state.currentStep !== 5 && <ApplicationStepper />}

        {/* Form Content */}
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">{renderStep()}</div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>Need help? Contact our support team at support@kindred.com</p>
        </div>
      </div>
    </div>
  )
}

export default function CommonApplicationPage() {
  return (
    <ApplicationFormProvider>
      <ApplicationFormContent />
    </ApplicationFormProvider>
  )
}
