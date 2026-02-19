/**
 * School data utilities - Now using Supabase instead of Strapi
 * All functions maintain the same signatures for backward compatibility
 */

import { 
  fetchSchools as fetchSchoolsFromDB,
  fetchSchoolBySlug as fetchSchoolBySlugFromDB,
  fetchSchoolDetailBySlug as fetchSchoolDetailBySlugFromDB,
  filterSchools as filterSchoolsFromDB,
  searchSchools as searchSchoolsFromDB,
  getFeaturedSchools as getFeaturedSchoolsFromDB,
  getUniqueCities,
  getUniqueBoards
} from './supabase-queries'

import type { School as SupabaseSchool } from './supabase'
import { loadSchoolsFromCSV } from './load-csv-schools'

// Normalized school format for components
export interface School {
  id: string | number
  slug: string
  name: string
  location: string
  city: string
  state: string
  type: string
  curriculum?: string
  rating: number
  reviews: number
  students: number
  feeRange: string
  established: string
  description?: string
  highlights?: string[]
  facilities?: string[]
  contact?: {
    phone?: string
    email?: string
    website?: string
  }
  image: string
}

export interface SchoolFeeItem {
  id: number
  level?: string
  tuitionFee?: string
  registrationFee?: string
  developmentFee?: string
  transportFee?: string
  mealFee?: string
  totalFee?: string
  notes?: string
}

export interface SchoolGalleryItem {
  id: number
  imageUrl: string
  caption?: string
}

export interface SchoolReviewItem {
  id: number
  author?: string
  rating?: number
  title?: string
  body?: string
  createdAt?: string
}

export interface SchoolFaqItem {
  id: number
  question: string
  answer: string
}

export interface SchoolAdmissionItem {
  id: number
  title?: string
  description?: string
  deadline?: string
  url?: string
}

export interface SchoolDetail extends School {
  fees?: SchoolFeeItem[]
  gallery?: SchoolGalleryItem[]
  reviewsList?: SchoolReviewItem[]
  faqs?: SchoolFaqItem[]
  admissions?: SchoolAdmissionItem[]
}

// Temporary mock data for when Supabase is not accessible
const MOCK_SCHOOLS: School[] = [
  {
    id: 1,
    slug: "heritage-school",
    name: "Heritage School",
    location: "Mumbai",
    city: "Mumbai",
    state: "Maharashtra",
    type: "CBSE",
    curriculum: "CBSE",
    rating: 4.8,
    reviews: 125,
    students: 450,
    feeRange: "₹2,50,000 - ₹4,00,000",
    established: "2005",
    description: "Heritage School is a premier CBSE institution dedicated to holistic education and character building.",
    highlights: ["ISO Certified", "STEM Lab", "Sports Excellence", "Multilingual Education"],
    facilities: ["Sports Complex", "Basketball Court", "Science Labs", "Computer Lab", "Library"],
    contact: {
      phone: "+91 22 1234 5678",
      email: "info@heritageschool.com",
      website: "www.heritageschool.com"
    },
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800"
  },
  {
    id: 2,
    slug: "st-johns-academy",
    name: "St. John's Academy",
    location: "Bengaluru",
    city: "Bengaluru",
    state: "Karnataka",
    type: "ICSE",
    curriculum: "ICSE",
    rating: 4.7,
    reviews: 98,
    students: 380,
    feeRange: "₹2,00,000 - ₹3,50,000",
    established: "1998",
    description: "St. John's Academy is committed to providing quality education with emphasis on values and discipline.",
    highlights: ["Scholarship Programs", "Cultural Activities", "Debate Club", "Music Program"],
    facilities: ["Swimming Pool", "Auditorium", "Cafeteria", "Art Studio"],
    contact: {
      phone: "+91 80 9876 5432",
      email: "contact@stjohns.edu",
      website: "www.stjohns.edu"
    },
    image: "https://images.unsplash.com/photo-1427504494785-cdcd02d457a0?q=80&w=800"
  },
  {
    id: 3,
    slug: "modern-vidhyapith",
    name: "Modern Vidhyapith",
    location: "Delhi",
    city: "Delhi",
    state: "Delhi",
    type: "State Board",
    curriculum: "State Board",
    rating: 4.6,
    reviews: 87,
    students: 520,
    feeRange: "₹1,50,000 - ₹2,50,000",
    established: "2002",
    description: "Modern Vidhyapith offers comprehensive education with focus on innovation and modern teaching methods.",
    highlights: ["Tech Integration", "Student Exchange", "Green Campus", "Mentorship"],
    facilities: ["Technology Center", "Garden", "Gym", "Medical Room"],
    contact: {
      phone: "+91 11 5678 9012",
      email: "admissions@modernvidhya.org",
      website: "www.modernvidhya.org"
    },
    image: "https://images.unsplash.com/photo-1524178176635-4a91bff34d16?q=80&w=800"
  },
]

// Normalize Supabase response to component-friendly format
function normalizeSchool(item: SupabaseSchool): School {
  return {
    id: item.id,
    slug: item.slug || '',
    name: item.name || 'Unnamed School',
    location: item.location || item.city || '',
    city: item.city || '',
    state: item.state || '',
    type: item.type || item.board || '',
    curriculum: item.curriculum || '',
    rating: item.ratings || 0,
    reviews: item.reviews || 0,
    students: item.students || 0,
    feeRange: item.fee_range || '',
    established: String(item.established || ''),
    description: item.description || '',
    highlights: item.highlights ? (typeof item.highlights === 'string' 
      ? item.highlights.split(',').map(h => h.trim()) 
      : item.highlights) : [],
    facilities: item.facilities ? (typeof item.facilities === 'string' 
      ? item.facilities.split(',').map(f => f.trim()) 
      : item.facilities) : [],
    contact: {
      phone: item.contact_phone,
      email: item.contact_email,
      website: item.contact_website,
    },
    image: item.cover_image || '', // Empty string if no image available
  }
}

function normalizeSchoolDetail(item: any): SchoolDetail {
  const base = normalizeSchool(item as SupabaseSchool)

  return {
    ...base,
    fees: (item.fees || []).map((fee: any) => ({
      id: fee.id,
      level: fee.level || fee.class_level || undefined,
      tuitionFee: fee.tuition_fee || undefined,
      registrationFee: fee.registration_fee || undefined,
      developmentFee: fee.development_fee || undefined,
      transportFee: fee.transport_fee || undefined,
      mealFee: fee.meal_fee || undefined,
      totalFee: fee.total_fee || undefined,
      notes: fee.notes || undefined,
    })),
    gallery: (item.gallery || []).map((image: any) => ({
      id: image.id,
      imageUrl: image.image_url || image.url || '',
      caption: image.caption || undefined,
    })),
    reviewsList: (item.reviews || []).map((review: any) => ({
      id: review.id,
      author: review.author || undefined,
      rating: review.rating || undefined,
      title: review.title || undefined,
      body: review.body || review.review || undefined,
      createdAt: review.created_at || undefined,
    })),
    faqs: (item.faqs || []).map((faq: any) => ({
      id: faq.id,
      question: faq.question || '',
      answer: faq.answer || '',
    })),
    admissions: (item.admissions || []).map((admission: any) => ({
      id: admission.id,
      title: admission.title || undefined,
      description: admission.description || undefined,
      deadline: admission.deadline || undefined,
      url: admission.url || undefined,
    })),
  }
}

// Wrapper to ensure consistent response format - fetch ALL 47 schools from Supabase, fallback to CSV
export async function fetchSchools(): Promise<School[]> {
  try {
    console.log('Fetching all schools from Supabase')
    const schools = await fetchSchoolsFromDB()
    
    if (!schools || schools.length === 0) {
      console.warn('No schools found in Supabase, trying CSV fallback...')
      const csvSchools = await loadSchoolsFromCSV()
      if (csvSchools.length > 0) {
        console.log(`Loaded ${csvSchools.length} schools from CSV`)
        return csvSchools
      }
      return []
    }
    
    const normalized = schools.map(normalizeSchool)
    console.log(`Supabase returned ${normalized.length} schools`)
    return normalized
  } catch (error) {
    console.error('Error fetching schools from Supabase:', error)
    console.warn('Trying CSV fallback...')
    try {
      const csvSchools = await loadSchoolsFromCSV()
      if (csvSchools.length > 0) {
        console.log(`Loaded ${csvSchools.length} schools from CSV after Supabase error`)
        return csvSchools
      }
    } catch (csvError) {
      console.error('Error loading CSV:', csvError)
    }
    return []
  }
}

// Fetch single school by slug
export async function fetchSchoolBySlug(slug: string): Promise<School | null> {
  try {
    console.log(`Fetching school with slug: ${slug}`)
    const school = await fetchSchoolBySlugFromDB(slug)
    
    if (!school) {
      console.warn(`School with slug ${slug} not found in Supabase, trying CSV...`)
      // Try CSV fallback
      const csvSchools = await loadSchoolsFromCSV()
      const csvSchool = csvSchools.find((s: any) => s.slug === slug)
      if (csvSchool) {
        console.log(`Found school ${slug} in CSV`)
        return csvSchool
      }
      console.warn(`School with slug ${slug} not found`)
      return null
    }
    
    return normalizeSchool(school)
  } catch (error) {
    console.error(`Error fetching school by slug:`, error)
    console.warn('Trying CSV fallback...')
    try {
      const csvSchools = await loadSchoolsFromCSV()
      const csvSchool = csvSchools.find((s: any) => s.slug === slug)
      return csvSchool || null
    } catch (csvError) {
      console.error('Error loading CSV:', csvError)
      return null
    }
  }
}

// Fetch single school with related detail data
export async function fetchSchoolDetailBySlug(slug: string): Promise<SchoolDetail | null> {
  try {
    console.log(`Fetching school detail with slug: ${slug}`)
    const school = await fetchSchoolDetailBySlugFromDB(slug)

    if (!school) {
      console.warn(`School with slug ${slug} not found in Supabase, trying CSV...`)
      const csvSchools = await loadSchoolsFromCSV()
      const csvSchool = csvSchools.find((s: any) => s.slug === slug)
      return csvSchool ? (csvSchool as SchoolDetail) : null
    }

    return normalizeSchoolDetail(school)
  } catch (error) {
    console.error(`Error fetching school detail ${slug}:`, error)
    return null
  }
}

// Fetch schools without fallback (matches original fetchSchoolsFromStrapiOnly)
export async function fetchSchoolsFromStrapiOnly(): Promise<School[]> {
  try {
    console.log('Fetching schools from Supabase (no fallback)')
    const schools = await fetchSchoolsFromDB()
    
    if (!schools || schools.length === 0) {
      console.warn('No schools found in Supabase')
      return []
    }
    
    return schools.map(normalizeSchool)
  } catch (error) {
    console.error('Error fetching schools from Supabase:', error)
    return []
  }
}

// Filter schools with multiple criteria - uses fetchSchools to ensure CSV fallback
export async function filterSchools(filters: {
  city?: string
  board?: string
  type?: string
  minRating?: number
  maxFeeRange?: string
  curriculum?: string
  search?: string
}): Promise<School[]> {
  try {
    console.log('Filtering schools with criteria:', filters)
    
    // First try Supabase filtering
    let schools = await filterSchoolsFromDB(filters)
    
    // If Supabase fails or returns nothing, get all schools (with CSV fallback) and filter in memory
    if (!schools || schools.length === 0) {
      console.warn('Supabase filtering returned no results, using client-side filtering...')
      const allSchools = await fetchSchools() // This includes CSV fallback
      
      if (!allSchools || allSchools.length === 0) {
        return []
      }
      
      // Apply filters client-side
      schools = allSchools.filter(school => {
        if (filters.city && !school.city.toLowerCase().includes(filters.city.toLowerCase())) {
          return false
        }
        if (filters.board && school.type !== filters.board) {
          return false
        }
        if (filters.type && school.type !== filters.type) {
          return false
        }
        if (filters.minRating && school.rating < filters.minRating) {
          return false
        }
        if (filters.curriculum && school.curriculum !== filters.curriculum) {
          return false
        }
        if (filters.search) {
          const query = filters.search.toLowerCase()
          const searchableText = `${school.name} ${school.city} ${school.description}`.toLowerCase()
          if (!searchableText.includes(query)) {
            return false
          }
        }
        return true
      })
    }
    
    const normalized = schools.map((s: any) => s.id ? s : normalizeSchool(s))
    console.log(`Filtered to ${normalized.length} schools`)
    return normalized
  } catch (error) {
    console.error('Error filtering schools:', error)
    console.warn('Falling back to fetching all schools...')
    return await fetchSchools()
  }
}

// Search schools - uses fetchSchools to ensure CSV fallback
export async function searchSchools(query: string): Promise<School[]> {
  try {
    console.log(`Searching schools with query: "${query}"`)
    let schools = await searchSchoolsFromDB(query)
    
    // If Supabase fails or returns nothing, search in all schools (with CSV fallback)
    if (!schools || schools.length === 0) {
      console.warn('Supabase search returned no results, using client-side search...')
      const allSchools = await fetchSchools() // This includes CSV fallback
      
      if (!allSchools || allSchools.length === 0) {
        return []
      }
      
      const lowerQuery = query.toLowerCase()
      schools = allSchools.filter(school => {
        const searchableText = `${school.name} ${school.city} ${school.description}`.toLowerCase()
        return searchableText.includes(lowerQuery)
      })
    }
    
    const normalized = schools.map((s: any) => s.id ? s : normalizeSchool(s))
    console.log(`Search returned ${normalized.length} schools`)
    return normalized
  } catch (error) {
    console.error('Error searching schools:', error)
    console.warn('Falling back to fetching all schools...')
    return await fetchSchools()
  }
}

// Get featured schools - fetch all schools from Supabase (no limit on retrieval), fallback to CSV
export async function getFeaturedSchools(limit: number = 50): Promise<School[]> {
  try {
    console.log(`Fetching all schools from Supabase (limit: ${limit})`)
    const schools = await fetchSchoolsFromDB()
    
    if (!schools || schools.length === 0) {
      console.warn('No schools found in Supabase, trying CSV fallback...')
      const csvSchools = await loadSchoolsFromCSV()
      if (csvSchools.length > 0) {
        console.log(`Loaded ${csvSchools.length} schools from CSV`)
        return limit > 0 ? csvSchools.slice(0, limit) : csvSchools
      }
      return []
    }
    
    const normalized = schools.map(normalizeSchool)
    return limit > 0 ? normalized.slice(0, limit) : normalized
  } catch (error) {
    console.error('Error fetching featured schools:', error)
    console.warn('Trying CSV fallback...')
    try {
      const csvSchools = await loadSchoolsFromCSV()
      if (csvSchools.length > 0) {
        console.log(`Loaded ${csvSchools.length} schools from CSV after Supabase error`)
        return limit > 0 ? csvSchools.slice(0, limit) : csvSchools
      }
    } catch (csvError) {
      console.error('Error loading CSV:', csvError)
    }
    return []
  }
}

// Re-export utility functions with aliases for backward compatibility
export const getAllCities = getUniqueCities
export const getAllBoards = getUniqueBoards
