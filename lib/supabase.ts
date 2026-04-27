import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const hasPublicSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey)

// Validate environment variables
if (!hasPublicSupabaseConfig && process.env.NODE_ENV !== 'test') {
  const warningFlag = '__supabase_missing_env_warned__'
  const shouldWarn = !(globalThis as any)[warningFlag]

  if (shouldWarn) {
    ;(globalThis as any)[warningFlag] = true
    console.warn('Supabase credentials are missing for client access.')
    console.warn('Required environment variables:')
    console.warn('  - NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'present' : 'MISSING')
    console.warn('  - NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'present' : 'MISSING')
    console.warn('Create .env.local from .env.example and restart the dev server.')
  }
}

// Create a mock client that throws helpful errors instead of "is not a function"
const createMockClient = () => ({
  from: () => {
    throw new Error('Supabase is not configured. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your environment variables.')
  },
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    signInWithPassword: () => Promise.reject(new Error('Supabase not configured')),
    signUp: () => Promise.reject(new Error('Supabase not configured')),
    signInWithOAuth: () => Promise.reject(new Error('Supabase not configured')),
    signOut: () => Promise.reject(new Error('Supabase not configured')),
    onAuthStateChange: () => ({
      data: {
        subscription: {
          unsubscribe: () => undefined,
        },
      },
    }),
  },
})

// Client-side Supabase instance (use for frontend/components)
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createMockClient() as any

// Server-side Supabase instance (use for API routes)
export const supabaseAdmin = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : createMockClient() as any

export type Board = {
  id: string
  name: string
  slug: string
  full_name?: string
  description?: string
  created_at?: string
  updated_at?: string
}

export type AgeGroup = {
  id: string
  name: string
  slug: string
  age_range: string
  min_age?: number
  max_age?: number
  display_order?: number
  created_at?: string
  updated_at?: string
}

export type FeeRange = {
  id: string
  name: string
  slug: string
  min_fee?: number
  max_fee?: number
  display_order?: number
  created_at?: string
  updated_at?: string
}

export type SchoolType = {
  id: string
  name: string
  slug: string
  description?: string
  display_order?: number
  created_at?: string
  updated_at?: string
}

export type School = {
  id: number
  name: string
  slug?: string
  ratings?: number
  reviews?: number
  students?: number
  fee_range?: string
  established?: number
  highlights?: string
  facilities?: string
  contact_website?: string
  curriculum?: string
  description?: string
  cover_image?: string
  city?: string
  state?: string
  location?: string
  type?: string
  board?: string
  board_id?: string
  fee_range_id?: string
  contact_email?: string
  contact_phone?: string
  created_at?: string
  updated_at?: string
}
