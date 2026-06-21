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
  try {
    const { data } = await supabase.auth.getUser()
    return data.user?.id ?? null
  } catch {
    return null
  }
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
    ...(row.payload as SavedSchoolData),
    id: row.data_key,
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

  // Replicate to school_enquiries table for centralized tracking
  try {
    await saveSchoolEnquiry({
      schoolName: bookingData.currentSchool || 'General Counselling',
      enquiryType: 'general',
      parentName: bookingData.name,
      parentEmail: bookingData.email,
      parentPhone: bookingData.phone,
      childClass: bookingData.childAge ? `Age ${bookingData.childAge}` : undefined,
      visitDate: bookingData.preferredDate && bookingData.preferredTime 
        ? `${bookingData.preferredDate} ${bookingData.preferredTime}` 
        : undefined,
      message: `Counselling Booking. Concerns: ${bookingData.concerns || 'None'}`,
    })
  } catch (err) {
    console.error("Error replicating counselling booking to school_enquiries:", err)
  }

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

// ============================================================================
// SCHOOL VISITS (Recently Visited Schools)
// ============================================================================

export async function saveSchoolVisit(schoolData: {
  schoolId: number
  schoolSlug: string
  schoolName: string
}) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null // Guest — don't track

  const { data, error } = await supabase
    .from('school_visits')
    .upsert(
      {
        user_id: user.id,
        school_id: schoolData.schoolId,
        school_slug: schoolData.schoolSlug,
        school_name: schoolData.schoolName,
        visited_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,school_id' }
    )
    .select()
    .single()

  if (error) {
    console.warn('Error saving school visit:', error.message)
    return null
  }
  return data
}

export async function getRecentSchoolVisits(limit = 10) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('school_visits')
    .select('*')
    .eq('user_id', user.id)
    .order('visited_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.warn('Error fetching recent visits:', error.message)
    return []
  }
  return data || []
}

// ============================================================================
// SCHOOL ENQUIRIES (Apply Now / Callback / Visit from school detail page)
// ============================================================================

export interface SchoolEnquiryData {
  schoolId?: number
  schoolName: string
  schoolSlug?: string
  enquiryType: 'apply' | 'callback' | 'visit' | 'general'
  parentName: string
  parentEmail?: string
  parentPhone: string
  childClass?: string
  visitDate?: string
  message?: string
}

export async function saveSchoolEnquiry(data: SchoolEnquiryData) {
  const { data: { user } } = await supabase.auth.getUser()

  const { data: row, error } = await supabase
    .from('school_enquiries')
    .insert({
      user_id: user?.id || null,
      school_id: data.schoolId || null,
      school_name: data.schoolName,
      school_slug: data.schoolSlug || null,
      enquiry_type: data.enquiryType,
      parent_name: data.parentName,
      parent_email: data.parentEmail || null,
      parent_phone: data.parentPhone,
      child_class: data.childClass || null,
      visit_date: data.visitDate || null,
      message: data.message || null,
      status: 'new',
    })
    .select()
    .single()

  if (error) throw error
  return row
}

// ============================================================================
// APPLICATIONS (Structured table — full form data)
// ============================================================================

export async function saveApplicationToTable(params: {
  userId: string
  applicationStoreId?: string
  parentProfile: Record<string, any>
  studentDetails: Record<string, any>
  selectedSchools: Record<string, any>[]
  documents: Record<string, any>[]
}) {
  const { data, error } = await supabase
    .from('applications')
    .insert({
      user_id: params.userId,
      application_store_id: params.applicationStoreId || null,
      status: 'submitted',
      // Parent
      parent_first_name:  params.parentProfile.firstName,
      parent_last_name:   params.parentProfile.lastName,
      parent_email:       params.parentProfile.email,
      parent_phone:       params.parentProfile.phone,
      parent_address:     params.parentProfile.address,
      parent_city:        params.parentProfile.city,
      parent_state:       params.parentProfile.state,
      parent_occupation:  params.parentProfile.occupation,
      parent_income:      params.parentProfile.income,
      // Student
      student_first_name:          params.studentDetails.firstName,
      student_last_name:           params.studentDetails.lastName,
      student_dob:                 params.studentDetails.dateOfBirth,
      student_gender:              params.studentDetails.gender,
      student_current_grade:       params.studentDetails.currentGrade,
      student_current_school:      params.studentDetails.currentSchool,
      student_previous_school:     params.studentDetails.previousSchool,
      student_caste:               params.studentDetails.caste,
      student_religion:            params.studentDetails.religion,
      student_special_needs:       params.studentDetails.specialNeeds,
      student_special_needs_details: params.studentDetails.specialNeedsDetails,
      // JSON
      selected_schools: params.selectedSchools,
      documents:        params.documents,
      submitted_at:     new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    console.warn('Error saving application to table:', error.message)
    throw error
  }
  return data
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
  saveSchoolVisit,
  getRecentSchoolVisits,
  saveSchoolEnquiry,
  saveApplicationToTable,
}
