import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ CRITICAL: Supabase credentials missing!')
  console.error('Required environment variables:')
  console.error('  - NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓' : '✗ MISSING')
  console.error('  - NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✓' : '✗ MISSING')
  console.error('Please set these in your Vercel project settings or .env.local file')
}

// Create a mock client that throws helpful errors instead of "is not a function"
const createMockClient = () => ({
  from: () => {
    throw new Error('Supabase is not configured. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your environment variables.')
  },
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    signIn: () => Promise.reject(new Error('Supabase not configured')),
    signOut: () => Promise.reject(new Error('Supabase not configured')),
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
