"use client"

import { CheckCircle, Circle, AlertCircle } from "lucide-react"
import { useApplicationForm } from "@/hooks/use-application-form"

const steps = [
  { id: 0, name: "Parent Profile", description: "Your information" },
  { id: 1, name: "Student Details", description: "Student information" },
  { id: 2, name: "Document Upload", description: "Required documents" },
  { id: 3, name: "School Selection", description: "Choose schools" },
  { id: 4, name: "Review & Submit", description: "Confirm details" },
  { id: 5, name: "Confirmation", description: "Application submitted" },
]

export function ApplicationStepper() {
  const { state, setCurrentStep } = useApplicationForm()

  const isStepCompleted = (stepId: number) => state.currentStep > stepId
  const isStepCurrent = (stepId: number) => state.currentStep === stepId

  return (
    <div className="w-full">
      <div className="hidden md:block">
        <div className="flex justify-between items-start mb-8">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className="flex flex-col items-center flex-1"
              onClick={() => state.currentStep >= step.id && setCurrentStep(step.id)}
            >
              <button
                className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full transition-all ${
                  isStepCompleted(step.id)
                    ? "bg-green-500 text-white cursor-pointer hover:bg-green-600"
                    : isStepCurrent(step.id)
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-600"
                } ${state.currentStep >= step.id ? "cursor-pointer" : ""}`}
              >
                {isStepCompleted(step.id) ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  <Circle className="w-6 h-6" />
                )}
              </button>
              <p className="mt-2 text-sm font-medium text-gray-900">{step.name}</p>
              <p className="text-xs text-gray-500">{step.description}</p>

              {index < steps.length - 1 && (
                <div
                  className={`absolute top-6 left-1/2 w-1/2 h-1 transition-colors ${
                    isStepCompleted(step.id) ? "bg-green-500" : "bg-gray-200"
                  }`}
                  style={{ marginLeft: "-0.5px" }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile view */}
      <div className="md:hidden mb-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-gray-700">
            Step {state.currentStep + 1} of {steps.length}
          </span>
          <span className="text-sm font-medium text-gray-900">{steps[state.currentStep]?.name}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${((state.currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}
