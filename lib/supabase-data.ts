import { supabase } from './supabase'
import {
  deleteUserRecord,
  getUserRecord,
  insertUserRecord,
  listUserRecords,
  makeStoreKey,
  upsertUserRecord,
} from './supabase-store'

type Timestamp = string

const BUCKETS = {
  ENQUIRIES: 'enquiries',
  SAVED_SCHOOLS: 'saved-schools',
  APPLICATIONS: 'applications',
  POINTS: 'points-calculations',
  QUIZ: 'quiz-answers',
  CONTACT: 'contact-submissions',
  AGE: 'age-calculations',
  COMPARISON: 'school-comparisons',
  FILTERS: 'discover-filters',
  COUNSELLING: 'free-counselling-bookings',
} as const

async function getCurrentUserId() {
  const { data, error } = await supabase.auth.getUser()

  if (error) {
    throw error
  }

  return data.user?.id ?? null
}

function ensureUserId(userId: string | null, message: string) {
  if (!userId) {
    throw new Error(message)
  }
}

function guestUserId(email?: string) {
  if (!email) {
    return `guest_${Date.now()}`
  }

  return `guest_${email.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}`
}

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

export async function saveEnquiry(enquiryData: Omit<EnquiryData, 'id' | 'createdAt' | 'updatedAt'>) {
  const userId = await getCurrentUserId()
  ensureUserId(userId, 'User not authenticated - cannot save enquiry')

  const row = await insertUserRecord(supabase, {
    userId,
    bucket: BUCKETS.ENQUIRIES,
    keyPrefix: 'enquiry',
    payload: {
      ...enquiryData,
      userId,
      timestamp: enquiryData.timestamp || new Date().toISOString(),
    },
  })

  return {
    id: row.data_key,
    ...row.payload,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export async function getLastEnquiry(): Promise<EnquiryData | null> {
  const userId = await getCurrentUserId()
  if (!userId) {
    return null
  }

  const rows = await listUserRecords(supabase, {
    userId,
    bucket: BUCKETS.ENQUIRIES,
  })

  if (!rows.length) {
    return null
  }

  const row = rows[0]
  return {
    id: row.data_key,
    ...(row.payload as EnquiryData),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

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

export async function saveSchool(schoolData: {
  schoolId: string
  schoolName: string
  schoolImage?: string
  schoolLocation?: string
  schoolCity?: string
  schoolState?: string
  notes?: string
}) {
  const userId = await getCurrentUserId()
  ensureUserId(userId, 'User not authenticated - cannot save school')

  const row = await upsertUserRecord(supabase, {
    userId,
    bucket: BUCKETS.SAVED_SCHOOLS,
    dataKey: schoolData.schoolId.toString(),
    payload: {
      userId,
      ...schoolData,
      savedAt: new Date().toISOString(),
    },
  })

  return {
    id: row.data_key,
    ...row.payload,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export async function getSavedSchools(): Promise<SavedSchoolData[]> {
  const userId = await getCurrentUserId()
  if (!userId) {
    return []
  }

  const rows = await listUserRecords(supabase, {
    userId,
    bucket: BUCKETS.SAVED_SCHOOLS,
  })

  return rows.map((row) => ({
    id: row.data_key,
    ...(row.payload as SavedSchoolData),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }))
}

export async function removeSavedSchool(schoolId: string) {
  const userId = await getCurrentUserId()
  ensureUserId(userId, 'User not authenticated - cannot remove school')

  await deleteUserRecord(supabase, {
    userId,
    bucket: BUCKETS.SAVED_SCHOOLS,
    dataKey: schoolId,
  })
}

export async function isSchoolSaved(schoolId: string): Promise<boolean> {
  const userId = await getCurrentUserId()
  if (!userId) {
    return false
  }

  const row = await getUserRecord(supabase, {
    userId,
    bucket: BUCKETS.SAVED_SCHOOLS,
    dataKey: schoolId,
  })

  return Boolean(row)
}

export interface ApplicationFormData {
  id?: string
  userId: string
  currentStep: number
  parentProfile: Record<string, any>
  studentDetails: Record<string, any>
  documents: Array<Record<string, any>>
  selectedSchools: Array<Record<string, any>>
  isSubmitting?: boolean
  submissionError?: string | null
  submittedApplicationId?: string | null
  createdAt?: Timestamp
  updatedAt?: Timestamp
}

export async function saveApplicationForm(formData: ApplicationFormData) {
  const userId = await getCurrentUserId()
  ensureUserId(userId, 'User not authenticated - cannot save application')

  const row = await insertUserRecord(supabase, {
    userId,
    bucket: BUCKETS.APPLICATIONS,
    keyPrefix: 'application',
    payload: {
      ...formData,
      userId,
    },
  })

  return {
    id: row.data_key,
    ...row.payload,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export async function updateApplicationForm(applicationId: string, formData: Partial<ApplicationFormData>) {
  const userId = await getCurrentUserId()
  ensureUserId(userId, 'User not authenticated - cannot update application')

  const existing = await getUserRecord(supabase, {
    userId,
    bucket: BUCKETS.APPLICATIONS,
    dataKey: applicationId,
  })

  await upsertUserRecord(supabase, {
    userId,
    bucket: BUCKETS.APPLICATIONS,
    dataKey: applicationId,
    payload: {
      ...(existing?.payload || {}),
      ...formData,
      userId,
    },
  })
}

export async function getApplicationForm(applicationId: string): Promise<ApplicationFormData | null> {
  const userId = await getCurrentUserId()
  if (!userId) {
    return null
  }

  const row = await getUserRecord(supabase, {
    userId,
    bucket: BUCKETS.APPLICATIONS,
    dataKey: applicationId,
  })

  if (!row) {
    return null
  }

  return {
    id: row.data_key,
    ...(row.payload as ApplicationFormData),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export async function getUserApplications(): Promise<ApplicationFormData[]> {
  const userId = await getCurrentUserId()
  if (!userId) {
    return []
  }

  const rows = await listUserRecords(supabase, {
    userId,
    bucket: BUCKETS.APPLICATIONS,
  })

  return rows.map((row) => ({
    id: row.data_key,
    ...(row.payload as ApplicationFormData),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }))
}

export async function deleteApplicationForm(applicationId: string) {
  const userId = await getCurrentUserId()
  ensureUserId(userId, 'User not authenticated - cannot delete application')

  await deleteUserRecord(supabase, {
    userId,
    bucket: BUCKETS.APPLICATIONS,
    dataKey: applicationId,
  })
}

export async function uploadApplicationDocument(userId: string, file: File, applicationId: string) {
  if (!file) {
    throw new Error('No file provided')
  }
  if (typeof window !== 'undefined') {
    await fetch('/api/storage/ensure-application-documents', { method: 'POST' })
  }

  const fileName = `${Date.now()}_${file.name}`
  const storagePath = `${userId}/${applicationId}/${fileName}`

  const { error } = await supabase.storage
    .from('application-documents')
    .upload(storagePath, file, {
      upsert: false,
      contentType: file.type || 'application/octet-stream',
    })

  if (error) {
    throw error
  }

  const { data } = supabase.storage
    .from('application-documents')
    .getPublicUrl(storagePath)

  return {
    name: file.name,
    type: file.type,
    size: file.size,
    url: data.publicUrl,
    uploadedAt: new Date().toISOString(),
    storagePath,
  }
}

export async function deleteApplicationDocument(storagePath: string) {
  const { error } = await supabase.storage
    .from('application-documents')
    .remove([storagePath])

  if (error) {
    throw error
  }
}

export interface PointsCalculatorData {
  schoolName: string
  criteria: Array<{ label: string; maxPoints: number; current: number }>
  totalPoints: number
  maxTotalPoints: number
  percentage: number
  prediction: string
  createdAt?: Timestamp
  updatedAt?: Timestamp
}

export async function savePointsCalculation(calculationData: Omit<PointsCalculatorData, 'createdAt' | 'updatedAt'>) {
  const userId = await getCurrentUserId()
  ensureUserId(userId, 'User not authenticated - cannot save calculation')

  const row = await upsertUserRecord(supabase, {
    userId,
    bucket: BUCKETS.POINTS,
    dataKey: 'current',
    payload: calculationData,
  })

  return {
    id: row.data_key,
    ...row.payload,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export async function getPointsCalculation() {
  const userId = await getCurrentUserId()
  if (!userId) {
    return null
  }

  const row = await getUserRecord(supabase, {
    userId,
    bucket: BUCKETS.POINTS,
    dataKey: 'current',
  })

  if (!row) {
    return null
  }

  return {
    id: row.data_key,
    ...(row.payload as PointsCalculatorData),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

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
  const userId = await getCurrentUserId()
  ensureUserId(userId, 'User not authenticated - cannot save quiz answers')

  const row = await upsertUserRecord(supabase, {
    userId,
    bucket: BUCKETS.QUIZ,
    dataKey: 'latestRecommendation',
    payload: answersData,
  })

  return {
    id: row.data_key,
    ...row.payload,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export async function getQuizAnswers() {
  const userId = await getCurrentUserId()
  if (!userId) {
    return null
  }

  const row = await getUserRecord(supabase, {
    userId,
    bucket: BUCKETS.QUIZ,
    dataKey: 'latestRecommendation',
  })

  if (!row) {
    return null
  }

  return {
    id: row.data_key,
    ...(row.payload as QuizAnswersData),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

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
  const userId = (await getCurrentUserId()) || guestUserId(contactData.email)

  const row = await insertUserRecord(supabase, {
    userId,
    bucket: BUCKETS.CONTACT,
    keyPrefix: 'contact',
    payload: contactData,
  })

  return {
    id: row.data_key,
    ...row.payload,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export async function getContactSubmissions() {
  const userId = await getCurrentUserId()
  if (!userId) {
    return []
  }

  const rows = await listUserRecords(supabase, {
    userId,
    bucket: BUCKETS.CONTACT,
  })

  return rows.map((row) => ({
    id: row.data_key,
    ...(row.payload as ContactFormData),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }))
}

export interface AgeCalculationData {
  dateOfBirth: string
  admissionYear: string
  currentAge: number | null
  admissionAge: number | null
  admissionAgeDecimal: string
  eligibleGrades: Array<{ grade: string; minAge: number; maxAge: number }>
  createdAt?: Timestamp
  updatedAt?: Timestamp
}

export async function saveAgeCalculation(calculationData: Omit<AgeCalculationData, 'createdAt' | 'updatedAt'>) {
  const userId = await getCurrentUserId()
  ensureUserId(userId, 'User not authenticated - cannot save age calculation')

  const row = await upsertUserRecord(supabase, {
    userId,
    bucket: BUCKETS.AGE,
    dataKey: 'current',
    payload: calculationData,
  })

  return {
    id: row.data_key,
    ...row.payload,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export async function getAgeCalculation() {
  const userId = await getCurrentUserId()
  if (!userId) {
    return null
  }

  const row = await getUserRecord(supabase, {
    userId,
    bucket: BUCKETS.AGE,
    dataKey: 'current',
  })

  if (!row) {
    return null
  }

  return {
    id: row.data_key,
    ...(row.payload as AgeCalculationData),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export interface ComparisonData {
  schoolIds: (string | number)[]
  schoolNames: string[]
  comparedAt?: Timestamp
  createdAt?: Timestamp
  updatedAt?: Timestamp
}

export async function saveSchoolComparison(comparisonData: Omit<ComparisonData, 'createdAt' | 'updatedAt'>) {
  const userId = await getCurrentUserId()
  ensureUserId(userId, 'User not authenticated - cannot save comparison')

  const row = await upsertUserRecord(supabase, {
    userId,
    bucket: BUCKETS.COMPARISON,
    dataKey: 'latest',
    payload: {
      ...comparisonData,
      comparedAt: new Date().toISOString(),
    },
  })

  return {
    id: row.data_key,
    ...row.payload,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export async function getSchoolComparison() {
  const userId = await getCurrentUserId()
  if (!userId) {
    return null
  }

  const row = await getUserRecord(supabase, {
    userId,
    bucket: BUCKETS.COMPARISON,
    dataKey: 'latest',
  })

  if (!row) {
    return null
  }

  return {
    id: row.data_key,
    ...(row.payload as ComparisonData),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

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
  const userId = await getCurrentUserId()
  ensureUserId(userId, 'User not authenticated - cannot save filters')

  const row = await upsertUserRecord(supabase, {
    userId,
    bucket: BUCKETS.FILTERS,
    dataKey: 'discoverFilters',
    payload: filtersData,
  })

  return {
    id: row.data_key,
    ...row.payload,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export async function getDiscoverFilters() {
  const userId = await getCurrentUserId()
  if (!userId) {
    return null
  }

  const row = await getUserRecord(supabase, {
    userId,
    bucket: BUCKETS.FILTERS,
    dataKey: 'discoverFilters',
  })

  if (!row) {
    return null
  }

  return {
    id: row.data_key,
    ...(row.payload as DiscoverFiltersData),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

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

export async function saveFreeCounsellingBooking(bookingData: Omit<CounsellingBookingData, 'id' | 'createdAt' | 'updatedAt'>) {
  const userId = (await getCurrentUserId()) || guestUserId(bookingData.email)

  const row = await insertUserRecord(supabase, {
    userId,
    bucket: BUCKETS.COUNSELLING,
    keyPrefix: 'counselling',
    payload: {
      ...bookingData,
      userId,
    },
  })

  return {
    id: row.data_key,
    ...row.payload,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export async function getFreeCounsellingBookings(): Promise<CounsellingBookingData[]> {
  const userId = await getCurrentUserId()
  if (!userId) {
    return []
  }

  const rows = await listUserRecords(supabase, {
    userId,
    bucket: BUCKETS.COUNSELLING,
  })

  return rows.map((row) => ({
    id: row.data_key,
    ...(row.payload as CounsellingBookingData),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }))
}

export default {
  uploadApplicationDocument,
  deleteApplicationDocument,
  saveEnquiry,
  getLastEnquiry,
  saveSchool,
  getSavedSchools,
  removeSavedSchool,
  isSchoolSaved,
  saveApplicationForm,
  updateApplicationForm,
  getApplicationForm,
  getUserApplications,
  deleteApplicationForm,
  savePointsCalculation,
  getPointsCalculation,
  saveQuizAnswers,
  getQuizAnswers,
  saveContactSubmission,
  getContactSubmissions,
  saveAgeCalculation,
  getAgeCalculation,
  saveSchoolComparison,
  getSchoolComparison,
  saveDiscoverFilters,
  getDiscoverFilters,
  saveFreeCounsellingBooking,
  getFreeCounsellingBookings,
}
