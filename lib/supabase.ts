import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase credentials missing. Please check .env.local for NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

// Client-side Supabase instance (use for frontend/components)
// This will work even with empty strings during build, but will fail at runtime if credentials are missing
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : ({} as any) // Provide empty object to prevent initialization errors

// Server-side Supabase instance (use for API routes)
// Service key is optional for client-side operations
export const supabaseAdmin = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : ({} as any) // Provide empty object to prevent initialization errors

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
  contact_email?: string
  contact_phone?: string
  created_at?: string
  updated_at?: string
}
