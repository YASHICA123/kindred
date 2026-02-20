import { supabase } from './supabase'
import type { School } from './supabase'

/**
 * Fetch all schools
 */
export async function fetchSchools() {
  try {
    const { data, error } = await supabase
      .from('schools')
      .select('*')
      .order('ratings', { ascending: false })

    if (error) {
      console.error('Supabase error:', error.message || error)
      throw error
    }
    return data as School[]
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : JSON.stringify(error)
    console.error('Error fetching schools:', errorMsg)
    throw error
  }
}

/**
 * Fetch schools by city
 */
export async function fetchSchoolsByCity(city: string) {
  try {
    const { data, error } = await supabase
      .from('schools')
      .select('*')
      .ilike('city', `%${city}%`)
      .order('ratings', { ascending: false })

    if (error) throw error
    return data as School[]
  } catch (error) {
    console.error(`Error fetching schools in ${city}:`, error)
    throw error
  }
}

/**
 * Fetch single school by slug
 */
export async function fetchSchoolBySlug(slug: string) {
  try {
    const { data, error } = await supabase
      .from('schools')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error) throw error
    return data as School
  } catch (error) {
    console.error(`Error fetching school with slug ${slug}:`, error)
    throw error
  }
}

/**
 * Fetch single school with related detail tables
 */
export async function fetchSchoolDetailBySlug(slug: string) {
  try {
    const { data, error } = await supabase
      .from('schools')
      .select(`
        *,
        fees:school_fees(*),
        gallery:school_gallery(*),
        reviews:school_reviews(*),
        faqs:school_faqs(*),
        admissions:school_admissions(*)
      `)
      .eq('slug', slug)
      .single()

    if (error) throw error
    return data as any
  } catch (error) {
    console.error(`Error fetching school detail with slug ${slug}:`, error)
    throw error
  }
}

/**
 * Search schools by name or keywords
 */
export async function searchSchools(query: string) {
  try {
    const { data, error } = await supabase
      .from('schools')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%,highlights.ilike.%${query}%`)
      .order('ratings', { ascending: false })

    if (error) throw error
    return data as School[]
  } catch (error) {
    console.error('Error searching schools:', error)
    throw error
  }
}

/**
 * Filter schools by multiple criteria
 */
export async function filterSchools(filters: {
  city?: string
  board?: string
  type?: string
  minRating?: number
  maxFeeRange?: string
  curriculum?: string
  search?: string
}) {
  try {
    let query = supabase.from('schools').select('*')

    if (filters.city) {
      query = query.ilike('city', `%${filters.city}%`)
    }
    if (filters.board) {
      query = query.eq('board', filters.board)
    }
    if (filters.type) {
      query = query.eq('type', filters.type)
    }
    if (filters.minRating) {
      query = query.gte('ratings', filters.minRating)
    }
    if (filters.curriculum) {
      query = query.eq('curriculum', filters.curriculum)
    }
    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
    }

    const { data, error } = await query.order('ratings', { ascending: false })

    if (error) throw error
    return data as School[]
  } catch (error) {
    console.error('Error filtering schools:', error)
    throw error
  }
}

/**
 * Get featured schools (top rated)
 */
export async function getFeaturedSchools(limit: number = 6) {
  try {
    const { data, error } = await supabase
      .from('schools')
      .select('*')
      .order('ratings', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data as School[]
  } catch (error) {
    console.error('Error fetching featured schools:', error)
    throw error
  }
}

/**
 * Get schools by board
 */
export async function fetchSchoolsByBoard(board: string) {
  try {
    const { data, error } = await supabase
      .from('schools')
      .select('*')
      .eq('board', board)
      .order('ratings', { ascending: false })

    if (error) throw error
    return data as School[]
  } catch (error) {
    console.error(`Error fetching schools for board ${board}:`, error)
    throw error
  }
}

/**
 * Get unique cities
 */
export async function getUniqueCities() {
  try {
    const { data, error } = await supabase
      .from('schools')
      .select('city')
      .order('city')

    if (error) throw error

    const uniqueCities = Array.from(new Set(data?.map((d) => d.city).filter(Boolean)))
    return uniqueCities as string[]
  } catch (error) {
    console.error('Error fetching cities:', error)
    throw error
  }
}

/**
 * Get unique boards
 */
export async function getUniqueBoards() {
  try {
    const { data, error } = await supabase
      .from('schools')
      .select('board')
      .order('board')

    if (error) throw error

    const uniqueBoards = Array.from(new Set(data?.map((d) => d.board).filter(Boolean)))
    return uniqueBoards as string[]
  } catch (error) {
    console.error('Error fetching boards:', error)
    throw error
  }
}

/**
 * Get schools count
 */
export async function getSchoolsCount() {
  try {
    const { count, error } = await supabase
      .from('schools')
      .select('*', { count: 'exact', head: true })

    if (error) throw error
    return count || 0
  } catch (error) {
    console.error('Error fetching schools count:', error)
    throw error
  }
}
