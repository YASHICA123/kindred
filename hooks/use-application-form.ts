import { createContext, useContext, useState, ReactNode } from "react"

export interface ParentProfile {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  occupation: string
  income: string
}

export interface StudentDetails {
  firstName: string
  lastName: string
  dateOfBirth: string
  gender: string
  currentGrade: string
  currentSchool: string
  previousSchool: string
  caste: string
  religion: string
  specialNeeds: boolean
  specialNeedsDetails: string
}

export interface DocumentFile {
  id: string
  name: string
  type: string
  size: number
  file?: File
}

export interface SchoolSelection {
  id: string
  name: string
  slug: string
  selected: boolean
  preference: number
}

export interface ApplicationFormState {
  currentStep: number
  parentProfile: ParentProfile
  studentDetails: StudentDetails
  documents: DocumentFile[]
  selectedSchools: SchoolSelection[]
  isSubmitting: boolean
  submissionError: string | null
  submittedApplicationId: string | null
}

interface ApplicationContextType {
  state: ApplicationFormState
  setParentProfile: (profile: ParentProfile) => void
  setStudentDetails: (details: StudentDetails) => void
  addDocument: (doc: DocumentFile) => void
  removeDocument: (docId: string) => void
  toggleSchoolSelection: (schoolId: string, preference?: number) => void
  setCurrentStep: (step: number) => void
  submitApplication: () => Promise<void>
  resetForm: () => void
}

const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined)

const initialState: ApplicationFormState = {
  currentStep: 0,
  parentProfile: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    occupation: "",
    income: "",
  },
  studentDetails: {
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    currentGrade: "",
    currentSchool: "",
    previousSchool: "",
    caste: "",
    religion: "",
    specialNeeds: false,
    specialNeedsDetails: "",
  },
  documents: [],
  selectedSchools: [],
  isSubmitting: false,
  submissionError: null,
  submittedApplicationId: null,
}

export function ApplicationFormProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ApplicationFormState>(initialState)

  const setParentProfile = (profile: ParentProfile) => {
    setState((prev) => ({ ...prev, parentProfile: profile }))
  }

  const setStudentDetails = (details: StudentDetails) => {
    setState((prev) => ({ ...prev, studentDetails: details }))
  }

  const addDocument = (doc: DocumentFile) => {
    setState((prev) => ({
      ...prev,
      documents: [...prev.documents, doc],
    }))
  }

  const removeDocument = (docId: string) => {
    setState((prev) => ({
      ...prev,
      documents: prev.documents.filter((d) => d.id !== docId),
    }))
  }

  const toggleSchoolSelection = (schoolId: string, preference = 1) => {
    setState((prev) => {
      const existing = prev.selectedSchools.find((s) => s.id === schoolId)
      if (existing) {
        return {
          ...prev,
          selectedSchools: prev.selectedSchools.filter((s) => s.id !== schoolId),
        }
      } else {
        const newSchools = [...prev.selectedSchools, { id: schoolId, name: "", slug: "", selected: true, preference }]
        // Sort by preference
        return {
          ...prev,
          selectedSchools: newSchools.sort((a, b) => a.preference - b.preference),
        }
      }
    })
  }

  const setCurrentStep = (step: number) => {
    setState((prev) => ({ ...prev, currentStep: step }))
  }

  const submitApplication = async () => {
    setState((prev) => ({ ...prev, isSubmitting: true, submissionError: null }))

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          parentProfile: state.parentProfile,
          studentDetails: state.studentDetails,
          selectedSchools: state.selectedSchools.filter((s) => s.selected),
          documents: state.documents.map((d) => ({
            name: d.name,
            type: d.type,
            size: d.size,
          })),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit application")
      }

      const data = await response.json()

      setState((prev) => ({
        ...prev,
        isSubmitting: false,
        submittedApplicationId: data.id,
        currentStep: 5,
      }))
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isSubmitting: false,
        submissionError: error instanceof Error ? error.message : "An error occurred",
      }))
      throw error
    }
  }

  const resetForm = () => {
    setState(initialState)
  }

  return (
    <ApplicationContext.Provider
      value={{
        state,
        setParentProfile,
        setStudentDetails,
        addDocument,
        removeDocument,
        toggleSchoolSelection,
        setCurrentStep,
        submitApplication,
        resetForm,
      }}
    >
      {children}
    </ApplicationContext.Provider>
  )
}

export function useApplicationForm() {
  const context = useContext(ApplicationContext)
  if (context === undefined) {
    throw new Error("useApplicationForm must be used within ApplicationFormProvider")
  }
  return context
}
