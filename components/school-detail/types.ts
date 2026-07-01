export interface SchoolDetailData {
  id: number
  slug: string
  name: string
  location: string
  city: string
  state: string
  type: string
  curriculum: string
  rating: number
  reviews: number
  students: number
  feeRange: string
  established: string
  image: string
  description?: string
  highlights?: string[]
  facilities?: string[]
  contact?: {
    phone?: string
    email?: string
    website?: string
  }
  fees?: {
    id: number
    level?: string
    tuitionFee?: string
    registrationFee?: string
    developmentFee?: string
    transportFee?: string
    mealFee?: string
    totalFee?: string
    notes?: string
  }[]
  gallery?: {
    id: number
    imageUrl?: string
    image_url?: string
    caption?: string
    category?: string
  }[]
  reviewsList?: {
    id: number
    author?: string
    rating?: number
    title?: string
    body?: string
    createdAt?: string
  }[]
  faqs?: {
    id: number
    question: string
    answer: string
  }[]
  admissions?: {
    id: number
    title?: string
    description?: string
    deadline?: string
    url?: string
  }[]
  seat_availability?: Record<string, string>
  admission_process?: { step: number; title: string; description: string }[]
  documents_required?: string[]
  highlights_structured?: { title: string; description: string; icon: string }[]
  scholarships?: { title: string; description: string }[]
  withdrawal_policy?: string
  awards?: { title: string; year: string; details: string }[]
  school_types?: { name: string; slug: string }[]
  board?: string
  fees_min?: number
  fees_max?: number
  class_range?: string
  classRange?: string
  logoUrl?: string
  logo_url?: string
}

export type SectionId = "overview" | "about" | "why-us" | "fees" | "facilities" | "admissions" | "visit" | "gallery" | "reviews" | "faqs"

export interface ApplyFormState {
  parentName: string
  mobile: string
  childClass: string
  email: string
}

export interface CallbackFormState {
  name: string
  phone: string
  childClass: string
  email: string
}

export interface VisitFormState {
  parentName: string
  mobile: string
  childClass: string
  visitDate: string
  email: string
}

export interface ReviewFormState {
  author: string
  rating: number
  title: string
  body: string
}
