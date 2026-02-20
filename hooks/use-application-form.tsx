import { createContext, useContext, useState, ReactNode, useEffect } from "react"
import { saveApplicationForm, updateApplicationForm, getApplicationForm } from "@/lib/firebase-data"
import { auth } from "@/lib/firebase"

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
  url?: string  // Firebase Storage download URL
  storagePath?: string  // Firebase Storage path
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
  saveDraft: () => Promise<void>
  loadApplicationDraft: (applicationId: string) => Promise<void>
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
      // Check authentication
      if (!auth.currentUser) {
        throw new Error("Please sign in to submit an application")
      }

      console.log('📝 Starting application submission...')
      console.log('👤 User ID:', auth.currentUser.uid)
      console.log('📄 Documents to upload:', state.documents.length)

      // First, upload all documents to Firebase Storage
      const uploadedDocuments = []
      for (const doc of state.documents) {
        try {
          if (doc.file) {
            console.log('📤 Starting upload for:', doc.name, '(', doc.file.size, 'bytes)')
            const startTime = Date.now()
            
            // Dynamic import with better error handling
            const { uploadApplicationDocument } = await import('@/lib/firebase-data')
            console.log('✅ uploadApplicationDocument imported ')
            
            const uploadedDoc = await uploadApplicationDocument(
              auth.currentUser.uid,
              doc.file,
              "draft"
            )
            
            const duration = Date.now() - startTime
            console.log(`✅ Document uploaded in ${duration}ms:`, doc.name, '→', uploadedDoc.url?.substring(0, 50))
            
            uploadedDocuments.push({
              name: uploadedDoc.name,
              type: uploadedDoc.type,
              size: uploadedDoc.size,
              url: uploadedDoc.url,
              storagePath: uploadedDoc.storagePath,
            })
          } else if (doc.url) {
            // Document already uploaded, keep the URL
            console.log('✓ Document already has URL:', doc.name)
            uploadedDocuments.push({
              name: doc.name,
              type: doc.type,
              size: doc.size,
              url: doc.url,
              storagePath: doc.storagePath,
            })
          }
        } catch (uploadError) {
          console.error('❌ Error uploading document:', doc.name, uploadError)
          throw new Error(`Failed to upload ${doc.name}: ${uploadError instanceof Error ? uploadError.message : 'Unknown error'}`)
        }
      }

      console.log('💾 All documents uploaded. Saving to Firestore...')

      // Save application to Firebase Firestore (with file URLs, not File objects)
      const firebaseApp = await saveApplicationForm({
        userId: auth.currentUser.uid,
        currentStep: state.currentStep,
        parentProfile: state.parentProfile,
        studentDetails: state.studentDetails,
        documents: uploadedDocuments,
        selectedSchools: state.selectedSchools,
        isSubmitting: false,
        submissionError: null,
        submittedApplicationId: state.submittedApplicationId,
      } as any)

      console.log('✅ Application saved to Firestore:', firebaseApp.id)
      console.log('📡 Sending to API...')

      // Send to API for additional processing
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: auth.currentUser.uid,
          firebaseId: firebaseApp.id,
          parentProfile: state.parentProfile,
          studentDetails: state.studentDetails,
          selectedSchools: state.selectedSchools.filter((s) => s.selected),
          documents: uploadedDocuments,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ API error:', response.status, errorText)
        throw new Error(`API returned ${response.status}: ${errorText}`)
      }

      const data = await response.json()
      console.log('✅ API response:', data)

      setState((prev) => ({
        ...prev,
        isSubmitting: false,
        submittedApplicationId: firebaseApp.id || data.id,
        currentStep: 5,
      }))
      
      console.log('🎉 Application submitted successfully!')
    } catch (error) {
      console.error('❌ Submission error:', error)
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

  const saveDraft = async () => {
    try {
      if (!auth.currentUser) {
        throw new Error("Please sign in to save a draft")
      }

      // Upload any new documents that haven't been uploaded yet
      const uploadedDocuments = []
      for (const doc of state.documents) {
        try {
          if (doc.file && !doc.url) {
            // Document is a new File that hasn't been uploaded yet
            const { uploadApplicationDocument } = await import('@/lib/firebase-data')
            const uploadedDoc = await uploadApplicationDocument(
              auth.currentUser.uid,
              doc.file,
              state.submittedApplicationId || "draft"
            )
            uploadedDocuments.push({
              id: doc.id,
              name: uploadedDoc.name,
              type: uploadedDoc.type,
              size: uploadedDoc.size,
              url: uploadedDoc.url,
              storagePath: uploadedDoc.storagePath,
            })
          } else {
            // Document already has URL or no file
            uploadedDocuments.push({
              id: doc.id,
              name: doc.name,
              type: doc.type,
              size: doc.size,
              url: doc.url,
              storagePath: doc.storagePath,
            })
          }
        } catch (uploadError) {
          console.error('Error uploading document:', doc.name, uploadError)
          // Continue with other documents
        }
      }

      const draftData = {
        userId: auth.currentUser.uid,
        currentStep: state.currentStep,
        parentProfile: state.parentProfile,
        studentDetails: state.studentDetails,
        documents: uploadedDocuments, // Use documents with URLs
        selectedSchools: state.selectedSchools,
        isSubmitting: false,
        submissionError: null,
        submittedApplicationId: state.submittedApplicationId,
      }

      if (state.submittedApplicationId) {
        // Update existing draft
        await updateApplicationForm(state.submittedApplicationId, draftData)
      } else {
        // Create new draft
        const draft = await saveApplicationForm(draftData as any)
        setState((prev) => ({
          ...prev,
          submittedApplicationId: draft.id,
        }))
      }

      console.log('✅ Application draft saved successfully')
    } catch (error) {
      console.error('Error saving draft:', error)
      throw error
    }
  }

  const loadApplicationDraft = async (applicationId: string) => {
    try {
      if (!auth.currentUser) {
        throw new Error("Please sign in to load a draft")
      }

      const application = await getApplicationForm(applicationId)
      if (application) {
        setState((prev) => ({
          ...prev,
          currentStep: application.currentStep || 0,
          parentProfile: application.parentProfile,
          studentDetails: application.studentDetails,
          documents: application.documents || [],
          selectedSchools: application.selectedSchools || [],
          submittedApplicationId: applicationId,
        }))
      }
    } catch (error) {
      console.error('Error loading application draft:', error)
      throw error
    }
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
        saveDraft,
        loadApplicationDraft,
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
