/**
 * Firebase Firestore Data Services
 * Handles all user data persistence to Firestore instead of localStorage
 */

import { db, auth, storage } from './firebase'
import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
  Timestamp,
  addDoc,
} from 'firebase/firestore'
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage'

// ========== FILE UPLOAD SERVICES ==========
export async function uploadApplicationDocument(userId: string, file: File, applicationId: string) {
  try {
    if (!file) {
      throw new Error('No file provided')
    }

    // Create storage reference: applications/{userId}/{applicationId}/{fileName}
    const fileRef = ref(storage, `applications/${userId}/${applicationId}/${Date.now()}_${file.name}`)
    
    // Upload file to storage
    const snapshot = await uploadBytes(fileRef, file)
    
    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref)
    
    console.log('✅ Document uploaded to Firebase Storage:', downloadURL)
    
    return {
      name: file.name,
      type: file.type,
      size: file.size,
      url: downloadURL,
      uploadedAt: new Date().toISOString(),
      storagePath: snapshot.ref.fullPath,
    }
  } catch (error) {
    console.error('❌ Error uploading document:', error)
    throw error
  }
}

export async function deleteApplicationDocument(storagePath: string) {
  try {
    const fileRef = ref(storage, storagePath)
    await deleteObject(fileRef)
    console.log('✅ Document deleted from Firebase Storage')
  } catch (error) {
    console.error('❌ Error deleting document:', error)
    throw error
  }
}

// ========== APPLICATION DATA WITH FILE HANDLING ==========
export interface EnquiryData {
  id?: string
  userId: string
  city: string
  class: string
  board?: string
  feeRange?: string
  schoolType?: string
  searchMode: string
  timestamp: string | Timestamp
  createdAt?: Timestamp
  updatedAt?: Timestamp
}

// Save user's search enquiry to Firestore
export async function saveEnquiry(enquiryData: Omit<EnquiryData, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    const user = auth.currentUser
    if (!user) {
      console.warn('User not authenticated - cannot save enquiry')
      return null
    }

    const dataToSave = {
      ...enquiryData,
      userId: user.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    // Add to 'enquiries' collection
    const enquiriesCollection = collection(db, 'users', user.uid, 'enquiries')
    const docRef = await addDoc(enquiriesCollection, dataToSave)
    
    console.log('✅ Enquiry saved to Firestore:', docRef.id)
    return { id: docRef.id, ...dataToSave }
  } catch (error) {
    console.error('❌ Error saving enquiry to Firestore:', error)
    throw error
  }
}

// Get user's last enquiry from Firestore
export async function getLastEnquiry(): Promise<EnquiryData | null> {
  try {
    const user = auth.currentUser
    if (!user) return null

    const enquiriesCollection = collection(db, 'users', user.uid, 'enquiries')
    const q = query(enquiriesCollection)
    const snapshot = await getDocs(q)
    
    if (snapshot.empty) return null

    // Get the most recent enquiry
    const enquiries = snapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data(),
      }))
      .sort((a, b) => {
        const dateA = a.createdAt instanceof Timestamp ? a.createdAt.toDate().getTime() : 0
        const dateB = b.createdAt instanceof Timestamp ? b.createdAt.toDate().getTime() : 0
        return dateB - dateA
      })

    console.log('✅ Last enquiry retrieved from Firestore')
    return enquiries[0] as EnquiryData || null
  } catch (error) {
    console.error('❌ Error fetching last enquiry from Firestore:', error)
    return null
  }
}

// ========== SAVED SCHOOLS DATA ==========
export interface SavedSchoolData {
  id: string
  userId: string
  schoolId: string
  schoolName: string
  schoolImage?: string
  schoolLocation?: string
  schoolCity?: string
  schoolState?: string
  savedAt: Timestamp
  notes?: string
  createdAt?: Timestamp
  updatedAt?: Timestamp
}

// Save a school to user's favorites
export async function saveSchool(schoolData: {
  schoolId: string
  schoolName: string
  schoolImage?: string
  schoolLocation?: string
  schoolCity?: string
  schoolState?: string
  notes?: string
}) {
  try {
    const user = auth.currentUser
    if (!user) {
      console.warn('User not authenticated - cannot save school')
      return null
    }

    const dataToSave = {
      userId: user.uid,
      ...schoolData,
      savedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    // Save to 'savedSchools' subcollection with schoolId as document ID for easy retrieval
    const schoolDocRef = doc(db, 'users', user.uid, 'savedSchools', schoolData.schoolId.toString())
    await setDoc(schoolDocRef, dataToSave)

    console.log('✅ School saved to Firestore:', schoolData.schoolId)
    return dataToSave
  } catch (error) {
    console.error('❌ Error saving school to Firestore:', error)
    throw error
  }
}

// Get all saved schools for current user
export async function getSavedSchools(): Promise<SavedSchoolData[]> {
  try {
    const user = auth.currentUser
    if (!user) return []

    const savedSchoolsCollection = collection(db, 'users', user.uid, 'savedSchools')
    const snapshot = await getDocs(savedSchoolsCollection)

    if (snapshot.empty) {
      console.log('ℹ️  No saved schools found')
      return []
    }

    const schools = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as SavedSchoolData[]

    console.log('✅ Saved schools retrieved from Firestore:', schools.length)
    return schools
  } catch (error) {
    console.error('❌ Error fetching saved schools from Firestore:', error)
    return []
  }
}

// Remove a school from saved schools
export async function removeSavedSchool(schoolId: string) {
  try {
    const user = auth.currentUser
    if (!user) {
      console.warn('User not authenticated - cannot remove school')
      return
    }

    const schoolDocRef = doc(db, 'users', user.uid, 'savedSchools', schoolId.toString())
    await deleteDoc(schoolDocRef)

    console.log('✅ School removed from Firestore:', schoolId)
  } catch (error) {
    console.error('❌ Error removing school from Firestore:', error)
    throw error
  }
}

// Check if a school is saved
export async function isSchoolSaved(schoolId: string): Promise<boolean> {
  try {
    const user = auth.currentUser
    if (!user) return false

    const schoolDocRef = doc(db, 'users', user.uid, 'savedSchools', schoolId.toString())
    const docSnapshot = await getDoc(schoolDocRef)
    
    return docSnapshot.exists()
  } catch (error) {
    console.error('❌ Error checking if school is saved:', error)
    return false
  }
}

// ========== APPLICATION FORM DATA ==========
export interface ApplicationFormData {
  id?: string
  userId: string
  currentStep: number
  parentProfile: {
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
  studentDetails: {
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
  documents: Array<{
    id: string
    name: string
    type: string
    size: number
    url?: string
  }>
  selectedSchools: Array<{
    id: string
    name: string
    slug: string
    selected: boolean
    preference: number
  }>
  isSubmitting?: boolean
  submissionError?: string | null
  submittedApplicationId?: string | null
  createdAt?: Timestamp
  updatedAt?: Timestamp
}

// Save application form to Firestore
export async function saveApplicationForm(formData: ApplicationFormData) {
  try {
    const user = auth.currentUser
    if (!user) {
      console.warn('User not authenticated - cannot save application')
      return null
    }

    const dataToSave = {
      ...formData,
      userId: user.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    // Save as a document in 'applications' subcollection
    const applicationsCollection = collection(db, 'users', user.uid, 'applications')
    const docRef = await addDoc(applicationsCollection, dataToSave)

    console.log('✅ Application form saved to Firestore:', docRef.id)
    return { id: docRef.id, ...dataToSave }
  } catch (error) {
    console.error('❌ Error saving application form to Firestore:', error)
    throw error
  }
}

// Update application form in Firestore
export async function updateApplicationForm(applicationId: string, formData: Partial<ApplicationFormData>) {
  try {
    const user = auth.currentUser
    if (!user) {
      console.warn('User not authenticated - cannot update application')
      return
    }

    const applicationDocRef = doc(db, 'users', user.uid, 'applications', applicationId)
    
    await updateDoc(applicationDocRef, {
      ...formData,
      updatedAt: serverTimestamp(),
    })

    console.log('✅ Application form updated in Firestore:', applicationId)
  } catch (error) {
    console.error('❌ Error updating application form in Firestore:', error)
    throw error
  }
}

// Get application form from Firestore
export async function getApplicationForm(applicationId: string): Promise<ApplicationFormData | null> {
  try {
    const user = auth.currentUser
    if (!user) return null

    const applicationDocRef = doc(db, 'users', user.uid, 'applications', applicationId)
    const docSnapshot = await getDoc(applicationDocRef)

    if (!docSnapshot.exists()) {
      console.log('ℹ️  Application form not found')
      return null
    }

    console.log('✅ Application form retrieved from Firestore:', applicationId)
    return {
      id: docSnapshot.id,
      ...docSnapshot.data(),
    } as ApplicationFormData
  } catch (error) {
    console.error('❌ Error fetching application form from Firestore:', error)
    return null
  }
}

// Get all applications for current user
export async function getUserApplications(): Promise<ApplicationFormData[]> {
  try {
    const user = auth.currentUser
    if (!user) return []

    const applicationsCollection = collection(db, 'users', user.uid, 'applications')
    const snapshot = await getDocs(applicationsCollection)

    if (snapshot.empty) {
      console.log('ℹ️  No applications found')
      return []
    }

    const applications = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as ApplicationFormData[]

    console.log('✅ Applications retrieved from Firestore:', applications.length)
    return applications
  } catch (error) {
    console.error('❌ Error fetching applications from Firestore:', error)
    return []
  }
}

// Delete application from Firestore
export async function deleteApplicationForm(applicationId: string) {
  try {
    const user = auth.currentUser
    if (!user) {
      console.warn('User not authenticated - cannot delete application')
      return
    }

    const applicationDocRef = doc(db, 'users', user.uid, 'applications', applicationId)
    await deleteDoc(applicationDocRef)

    console.log('✅ Application deleted from Firestore:', applicationId)
  } catch (error) {
    console.error('❌ Error deleting application from Firestore:', error)
    throw error
  }
}

// ========== POINTS CALCULATOR DATA ==========
export interface PointsCalculatorData {
  schoolName: string
  criteria: Array<{
    label: string
    maxPoints: number
    current: number
  }>
  totalPoints: number
  maxTotalPoints: number
  percentage: number
  prediction: string
  createdAt?: Timestamp
  updatedAt?: Timestamp
}

export async function savePointsCalculation(calculationData: Omit<PointsCalculatorData, 'createdAt' | 'updatedAt'>) {
  try {
    const user = auth.currentUser
    if (!user) {
      console.warn('User not authenticated - cannot save calculation')
      return null
    }

    const dataToSave = {
      ...calculationData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    const calculatorDocRef = doc(db, 'users', user.uid, 'pointsCalculations', 'current')
    await setDoc(calculatorDocRef, dataToSave)

    console.log('✅ Points calculation saved to Firestore')
    return { id: 'current', ...dataToSave }
  } catch (error) {
    console.error('❌ Error saving points calculation:', error)
    throw error
  }
}

export async function getPointsCalculation() {
  try {
    const user = auth.currentUser
    if (!user) {
      console.warn('User not authenticated - cannot fetch calculation')
      return null
    }

    const docRef = doc(db, 'users', user.uid, 'pointsCalculations', 'current')
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      console.log('✅ Points calculation retrieved from Firestore')
      return { id: docSnap.id, ...docSnap.data() } as PointsCalculatorData
    }
    return null
  } catch (error) {
    console.error('❌ Error fetching points calculation:', error)
    return null
  }
}

// ========== QUIZ ANSWERS DATA ==========
export interface QuizAnswersData {
  learning_style?: string
  budget?: string
  location?: string
  board?: string
  special_needs?: string
  createdAt?: Timestamp
  updatedAt?: Timestamp
}

export async function saveQuizAnswers(answersData: Omit<QuizAnswersData, 'createdAt' | 'updatedAt'>) {
  try {
    const user = auth.currentUser
    if (!user) {
      console.warn('User not authenticated - cannot save quiz answers')
      return null
    }

    const dataToSave = {
      ...answersData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    const quizDocRef = doc(db, 'users', user.uid, 'quizzes', 'latestRecommendation')
    await setDoc(quizDocRef, dataToSave)

    console.log('✅ Quiz answers saved to Firestore')
    return { id: 'latestRecommendation', ...dataToSave }
  } catch (error) {
    console.error('❌ Error saving quiz answers:', error)
    throw error
  }
}

export async function getQuizAnswers() {
  try {
    const user = auth.currentUser
    if (!user) {
      console.warn('User not authenticated - cannot fetch quiz answers')
      return null
    }

    const docRef = doc(db, 'users', user.uid, 'quizzes', 'latestRecommendation')
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      console.log('✅ Quiz answers retrieved from Firestore')
      return { id: docSnap.id, ...docSnap.data() } as QuizAnswersData
    }
    return null
  } catch (error) {
    console.error('❌ Error fetching quiz answers:', error)
    return null
  }
}

// ========== CONTACT FORM DATA ==========
export interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
  phone?: string
  createdAt?: Timestamp
  updatedAt?: Timestamp
}

export async function saveContactSubmission(contactData: Omit<ContactFormData, 'createdAt' | 'updatedAt'>) {
  try {
    const user = auth.currentUser
    // Contact form may be submitted without auth, so use email as identifier if no user
    const userId = user?.uid || contactData.email.replace(/[^a-zA-Z0-9]/g, '_')

    const dataToSave = {
      ...contactData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    // Save to Firebase (with or without user auth)
    const submissionsCollection = user 
      ? collection(db, 'users', user.uid, 'contactSubmissions')
      : collection(db, 'contactSubmissions')
    
    const docRef = await addDoc(submissionsCollection, dataToSave)

    console.log('✅ Contact submission saved to Firestore:', docRef.id)
    return { id: docRef.id, ...dataToSave }
  } catch (error) {
    console.error('❌ Error saving contact submission:', error)
    throw error
  }
}

export async function getContactSubmissions() {
  try {
    const user = auth.currentUser
    if (!user) {
      console.warn('User not authenticated - cannot fetch contact submissions')
      return []
    }

    const submissionsCollection = collection(db, 'users', user.uid, 'contactSubmissions')
    const snapshot = await getDocs(submissionsCollection)

    const submissions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as ContactFormData[]

    console.log('✅ Contact submissions retrieved from Firestore:', submissions.length)
    return submissions
  } catch (error) {
    console.error('❌ Error fetching contact submissions:', error)
    return []
  }
}

// ========== AGE CALCULATOR DATA ==========
export interface AgeCalculationData {
  dateOfBirth: string
  admissionYear: string
  currentAge: number | null
  admissionAge: number | null
  admissionAgeDecimal: string
  eligibleGrades: Array<{
    grade: string
    minAge: number
    maxAge: number
  }>
  createdAt?: Timestamp
  updatedAt?: Timestamp
}

export async function saveAgeCalculation(calculationData: Omit<AgeCalculationData, 'createdAt' | 'updatedAt'>) {
  try {
    const user = auth.currentUser
    if (!user) {
      console.warn('User not authenticated - cannot save age calculation')
      return null
    }

    const dataToSave = {
      ...calculationData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    const calcDocRef = doc(db, 'users', user.uid, 'ageCalculations', 'current')
    await setDoc(calcDocRef, dataToSave)

    console.log('✅ Age calculation saved to Firestore')
    return { id: 'current', ...dataToSave }
  } catch (error) {
    console.error('❌ Error saving age calculation:', error)
    throw error
  }
}

export async function getAgeCalculation() {
  try {
    const user = auth.currentUser
    if (!user) {
      console.warn('User not authenticated - cannot fetch age calculation')
      return null
    }

    const docRef = doc(db, 'users', user.uid, 'ageCalculations', 'current')
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      console.log('✅ Age calculation retrieved from Firestore')
      return { id: docSnap.id, ...docSnap.data() } as AgeCalculationData
    }
    return null
  } catch (error) {
    console.error('❌ Error fetching age calculation:', error)
    return null
  }
}

// ========== COMPARE SCHOOLS DATA ==========
export interface ComparisonData {
  schoolIds: (string | number)[]
  schoolNames: string[]
  comparedAt: Timestamp
  createdAt?: Timestamp
  updatedAt?: Timestamp
}

export async function saveSchoolComparison(comparisonData: Omit<ComparisonData, 'createdAt' | 'updatedAt'>) {
  try {
    const user = auth.currentUser
    if (!user) {
      console.warn('User not authenticated - cannot save comparison')
      return null
    }

    const dataToSave = {
      ...comparisonData,
      comparedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    const comparisonDocRef = doc(db, 'users', user.uid, 'comparisons', 'latest')
    await setDoc(comparisonDocRef, dataToSave)

    console.log('✅ School comparison saved to Firestore')
    return { id: 'latest', ...dataToSave }
  } catch (error) {
    console.error('❌ Error saving school comparison:', error)
    throw error
  }
}

export async function getSchoolComparison() {
  try {
    const user = auth.currentUser
    if (!user) {
      console.warn('User not authenticated - cannot fetch comparison')
      return null
    }

    const docRef = doc(db, 'users', user.uid, 'comparisons', 'latest')
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      console.log('✅ School comparison retrieved from Firestore')
      return { id: docSnap.id, ...docSnap.data() } as ComparisonData
    }
    return null
  } catch (error) {
    console.error('❌ Error fetching school comparison:', error)
    return null
  }
}

// ========== DISCOVER FILTERS DATA ==========
export interface DiscoverFiltersData {
  searchTerm?: string
  selectedBoard?: string
  selectedCity?: string
  selectedClass?: string
  selectedFeeRange?: string
  selectedSchoolType?: string
  createdAt?: Timestamp
  updatedAt?: Timestamp
}

export async function saveDiscoverFilters(filtersData: Omit<DiscoverFiltersData, 'createdAt' | 'updatedAt'>) {
  try {
    const user = auth.currentUser
    if (!user) {
      console.warn('User not authenticated - cannot save filters')
      return null
    }

    const dataToSave = {
      ...filtersData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    const filtersDocRef = doc(db, 'users', user.uid, 'preferences', 'discoverFilters')
    await setDoc(filtersDocRef, dataToSave)

    console.log('✅ Discover filters saved to Firestore')
    return { id: 'discoverFilters', ...dataToSave }
  } catch (error) {
    console.error('❌ Error saving discover filters:', error)
    throw error
  }
}

export async function getDiscoverFilters() {
  try {
    const user = auth.currentUser
    if (!user) {
      console.warn('User not authenticated - cannot fetch filters')
      return null
    }

    const docRef = doc(db, 'users', user.uid, 'preferences', 'discoverFilters')
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      console.log('✅ Discover filters retrieved from Firestore')
      return { id: docSnap.id, ...docSnap.data() } as DiscoverFiltersData
    }
    return null
  } catch (error) {
    console.error('❌ Error fetching discover filters:', error)
    return null
  }
}

// ========== FREE COUNSELLING BOOKINGS ==========
export interface CounsellingBookingData {
  id?: string
  name: string
  email: string
  phone: string
  childAge: string
  currentSchool?: string
  concerns: string
  preferredDate: string
  preferredTime: string
  userId?: string
  createdAt?: Timestamp
  updatedAt?: Timestamp
}

// Save free counselling booking to Firestore
export async function saveFreeCounsellingBooking(bookingData: Omit<CounsellingBookingData, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    const user = auth.currentUser
    
    if (!user) {
      console.warn('User not authenticated - saving as guest booking')
    }

    const dataToSave = {
      ...bookingData,
      userId: user?.uid || 'guest',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    // Save to public counselling bookings collection
    const bookingsCollection = collection(db, 'freeCounsellingBookings')
    const docRef = await addDoc(bookingsCollection, dataToSave)
    
    console.log('✅ Free counselling booking saved to Firestore:', docRef.id)
    return { id: docRef.id, ...dataToSave }
  } catch (error) {
    console.error('❌ Error saving free counselling booking:', error)
    throw error
  }
}

// Get user's free counselling bookings from Firestore
export async function getFreeCounsellingBookings(): Promise<CounsellingBookingData[]> {
  try {
    const user = auth.currentUser
    if (!user) {
      console.warn('User not authenticated - cannot fetch bookings')
      return []
    }

    const bookingsCollection = collection(db, 'freeCounsellingBookings')
    const q = query(bookingsCollection, where('userId', '==', user.uid))
    const snapshot = await getDocs(q)

    const bookings = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as CounsellingBookingData[]

    console.log('✅ Free counselling bookings retrieved from Firestore:', bookings.length)
    return bookings
  } catch (error) {
    console.error('❌ Error fetching free counselling bookings:', error)
    return []
  }
}

export default {
  // File Upload
  uploadApplicationDocument,
  deleteApplicationDocument,
  // Enquiry
  saveEnquiry,
  getLastEnquiry,
  // Saved Schools
  saveSchool,
  getSavedSchools,
  removeSavedSchool,
  isSchoolSaved,
  // Applications
  saveApplicationForm,
  updateApplicationForm,
  getApplicationForm,
  getUserApplications,
  deleteApplicationForm,
  // Points Calculator
  savePointsCalculation,
  getPointsCalculation,
  // Quiz
  saveQuizAnswers,
  getQuizAnswers,
  // Contact Form
  saveContactSubmission,
  getContactSubmissions,
  // Age Calculator
  saveAgeCalculation,
  getAgeCalculation,
  // School Comparison
  saveSchoolComparison,
  getSchoolComparison,
  // Discover Filters
  saveDiscoverFilters,
  getDiscoverFilters,
  // Free Counselling
  saveFreeCounsellingBooking,
  getFreeCounsellingBookings,
}
