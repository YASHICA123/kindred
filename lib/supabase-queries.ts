import { supabase } from './supabase'
import type { School, Board, AgeGroup, FeeRange, SchoolType } from './supabase'

/**
 * Fetch all schools
 */
export async function fetchSchools() {
  try {
    const { data, error } = await supabase
      .from('schools')
      .select('*')
      .order('rating', { ascending: false })

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
      .order('rating', { ascending: false })

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
 * Falls back to basic query if related tables don't exist yet
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
    console.warn(`Detail query failed for slug ${slug}, falling back to basic query:`, error)
    // Fallback: fetch school without related tables (they may not exist yet)
    try {
      const { data, error: basicError } = await supabase
        .from('schools')
        .select('*')
        .eq('slug', slug)
        .single()

      if (basicError) throw basicError
      return data as any
    } catch (fallbackError) {
      console.error(`Error fetching school with slug ${slug}:`, fallbackError)
      throw fallbackError
    }
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
      .order('rating', { ascending: false })

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
    let query = supabase.from('school_search_view').select('*')

    if (filters.city) {
      query = query.ilike('city_name', `%${filters.city}%`)
    }
    if (filters.board) {
      query = query.or(`board_name.ilike.${filters.board},board_slug.eq.${filters.board}`)
    }
    if (filters.type) {
      query = query.eq('type', filters.type)
    }
    if (filters.minRating) {
      query = query.gte('rating', filters.minRating)
    }
    if (filters.curriculum) {
      query = query.ilike('curriculum', `%${filters.curriculum}%`)
    }
    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%`)
    }

    const { data, error } = await query.order('rating', { ascending: false })

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
      .order('rating', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data as School[]
  } catch (error) {
    console.error('Error fetching featured schools:', error)
    throw error
  }
}

/**
 * Get schools by board (using boards table join)
 */
export async function fetchSchoolsByBoard(boardSlug: string) {
  try {
    // Look up the board by slug or name
    const { data: boardData, error: boardError } = await supabase
      .from('boards')
      .select('id')
      .or(`slug.eq.${boardSlug},name.ilike.${boardSlug}`)
      .single()

    if (boardError || !boardData) return []

    const { data, error } = await supabase
      .from('schools')
      .select('*')
      .eq('board_id', boardData.id)
      .order('rating', { ascending: false })

    if (error) throw error
    return data as School[]
  } catch (error) {
    console.error(`Error fetching schools for board ${boardSlug}:`, error)
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
 * Get all boards from boards table
 */
export async function getUniqueBoards() {
  try {
    const { data, error } = await supabase
      .from('boards')
      .select('name, slug')
      .order('name')

    if (error) throw error
    return (data || []).map((b) => b.name) as string[]
  } catch (error) {
    console.error('Error fetching boards:', error)
    throw error
  }
}

/**
 * Fetch all boards with school counts
 */
export async function fetchBoardsWithSchoolCount() {
  try {
    const { data: boards, error: boardsError } = await supabase
      .from('boards')
      .select('id, name, slug, full_name')
      .order('name')

    if (boardsError) throw boardsError

    const { data: schools, error: schoolsError } = await supabase
      .from('schools')
      .select('board_id')

    if (schoolsError) throw schoolsError

    const countMap: Record<string, number> = {}
    for (const s of schools || []) {
      if (s.board_id) {
        countMap[s.board_id] = (countMap[s.board_id] || 0) + 1
      }
    }

    return (boards || []).map((board) => ({
      ...board,
      schoolCount: countMap[board.id] || 0,
    }))
  } catch (error) {
    console.error('Error fetching boards with school count:', error)
    return []
  }
}

/**
 * Fetch all boards
 */
export async function fetchAllBoards() {
  try {
    const { data, error } = await supabase
      .from('boards')
      .select('id, name, slug, full_name, description')
      .order('name')

    if (error) throw error
    return (data || []) as Board[]
  } catch (error) {
    console.error('Error fetching boards:', error)
    return []
  }
}

/**
 * Fetch schools by board slug using the search view
 */
export async function fetchSchoolsByBoardSlug(boardSlug: string) {
  try {
    const { data, error } = await supabase
      .from('school_search_view')
      .select('*')
      .eq('board_slug', boardSlug)
      .order('rating', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error(`Error fetching schools for board ${boardSlug}:`, error)
    return []
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
// ============================================================================
// NEW: Hierarchical Search Functions (STATE → CITY → SCHOOL)
// ============================================================================

/**
 * Fetch all states (cached on client)
 */
export async function fetchAllStates() {
  try {
    const { data, error } = await supabase
      .from('states')
      .select('id, name, slug, code')
      .order('name')

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching states:', error)
    return []
  }
}

/**
 * Fetch cities by state slug
 */
export async function fetchCitiesByState(stateSlug: string) {
  try {
    // First get the state ID from the slug
    const { data: stateData, error: stateError } = await supabase
      .from('states')
      .select('id')
      .eq('slug', stateSlug)
      .single()

    if (stateError || !stateData) return []

    const { data, error } = await supabase
      .from('cities')
      .select('id, name, slug, postal_code, state_id')
      .eq('state_id', stateData.id)
      .order('name')

    if (error) throw error
    return data || []
  } catch (error) {
    console.error(`Error fetching cities for state ${stateSlug}:`, error)
    return []
  }
}

/**
 * Fetch cities by state ID (alternative to slug version)
 */
export async function fetchCitiesByStateId(stateId: string) {
  try {
    const { data, error } = await supabase
      .from('cities')
      .select('id, name, slug, postal_code, state_id')
      .eq('state_id', stateId)
      .order('name')

    if (error) throw error
    return data || []
  } catch (error) {
    console.error(`Error fetching cities for state ${stateId}:`, error)
    return []
  }
}

/**
 * Advanced school search using the school_search_view and RPC
 * Supports filtering by state, city, board, type, and fees range
 */
export async function searchSchoolsAdvanced(filters: {
  stateSlug?: string
  citySlug?: string
  board?: string
  type?: string
  feesMin?: number
  feesMax?: number
  sort?: "rating_desc" | "fees_asc" | "name_asc"
  limit?: number
  offset?: number
}) {
  try {
    const limit = filters.limit || 20
    const offset = filters.offset || 0
    const sort = filters.sort || "rating_desc"

    const { data, error } = await supabase.rpc('search_schools', {
      p_state_slug: filters.stateSlug || null,
      p_city_slug: filters.citySlug || null,
      p_board: filters.board || null,
      p_type: filters.type || null,
      p_fees_min: filters.feesMin || null,
      p_fees_max: filters.feesMax || null,
      p_sort_by: sort,
      p_limit: limit,
      p_offset: offset,
    })

    if (error) throw error
    return {
      schools: data || [],
      total: data?.[0]?.total_count || 0,
    }
  } catch (error) {
    console.error('Error searching schools with advanced filters:', error)
    return { schools: [], total: 0 }
  }
}

/**
 * Fallback: Search schools directly from view (if RPC is not working)
 * Less performant but provides basic filtering
 */
export async function searchSchoolsFromView(filters: {
  stateSlug?: string
  citySlug?: string
  board?: string
  type?: string
  feesMin?: number
  feesMax?: number
  limit?: number
  offset?: number
}) {
  try {
    const limit = filters.limit || 20
    const offset = filters.offset || 0

    let query = supabase.from('school_search_view').select('*')

    if (filters.stateSlug) {
      query = query.eq('state_slug', filters.stateSlug)
    }
    if (filters.citySlug) {
      query = query.eq('city_slug', filters.citySlug)
    }
    if (filters.board) {
      query = query.eq('board', filters.board)
    }
    if (filters.type) {
      query = query.eq('type', filters.type)
    }
    if (filters.feesMin) {
      query = query.gte('fees_min', filters.feesMin)
    }
    if (filters.feesMax) {
      query = query.lte('fees_max', filters.feesMax)
    }

    const { data, error, count } = await query
      .order('rating', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error
    return {
      schools: data || [],
      total: count || 0,
    }
  } catch (error) {
    console.error('Error searching schools from view:', error)
    return { schools: [], total: 0 }
  }
}

/**
 * Fetch single school with full details including state/city
 */
export async function fetchSchoolDetailsWithLocation(slug: string) {
  try {
    const { data, error } = await supabase
      .from('school_search_view')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error(`Error fetching school detail for slug ${slug}:`, error)
    return null
  }
}

/**
 * Get all states and cities for dropdown/filter building
 * Returns cached-friendly structure for client-side filtering
 */
export async function fetchStatesWithCities() {
  try {
    const { data, error } = await supabase
      .from('states')
      .select(`
        id,
        name,
        slug,
        code,
        cities (
          id,
          name,
          slug,
          postal_code
        )
      `)
      .order('name')

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching states with cities:', error)
    return []
  }
}

/**
 * Get schools statistics (count by state/board/type)
 */
export async function getSchoolsStatistics() {
  try {
    const { data: schoolsData } = await supabase
      .from('school_search_view')
      .select('board_name, type')

    const boardCounts = (schoolsData || []).reduce(
      (acc, school) => {
        const board = school.board_name || 'Unknown'
        acc[board] = (acc[board] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )

    const typeCounts = (schoolsData || []).reduce(
      (acc, school) => {
        const type = school.type || 'Unknown'
        acc[type] = (acc[type] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )

    return {
      totalSchools: (schoolsData || []).length,
      byBoard: boardCounts,
      byType: typeCounts,
    }
  } catch (error) {
    console.error('Error fetching schools statistics:', error)
    return { totalSchools: 0, byBoard: {}, byType: {} }
  }
}

/**
 * Fetch schools by state slug using the search view
 */
export async function fetchSchoolsByStateSlug(stateSlug: string) {
  try {
    const { data, error } = await supabase
      .from('school_search_view')
      .select('*')
      .eq('state_slug', stateSlug)
      .order('rating', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error(`Error fetching schools for state ${stateSlug}:`, error)
    return []
  }
}

/**
 * Fetch schools by city slug using the search view
 */
export async function fetchSchoolsByCitySlug(citySlug: string) {
  try {
    const { data, error } = await supabase
      .from('school_search_view')
      .select('*')
      .eq('city_slug', citySlug)
      .order('rating', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error(`Error fetching schools for city ${citySlug}:`, error)
    return []
  }
}

/**
 * Fetch all states with school counts
 */
export async function fetchStatesWithSchoolCount() {
  try {
    const { data: states, error: statesError } = await supabase
      .from('states')
      .select('id, name, slug, code')
      .order('name')

    if (statesError) throw statesError

    const { data: schools, error: schoolsError } = await supabase
      .from('schools')
      .select('state_id')

    if (schoolsError) throw schoolsError

    const countMap: Record<string, number> = {}
    for (const s of schools || []) {
      if (s.state_id) {
        countMap[s.state_id] = (countMap[s.state_id] || 0) + 1
      }
    }

    return (states || []).map((state) => ({
      ...state,
      schoolCount: countMap[state.id] || 0,
    }))
  } catch (error) {
    console.error('Error fetching states with school count:', error)
    return []
  }
}

/**
 * Fetch cities with school counts for a given state
 */
export async function fetchCitiesWithSchoolCount(stateSlug: string) {
  try {
    const { data: stateData, error: stateError } = await supabase
      .from('states')
      .select('id, name, slug, code')
      .eq('slug', stateSlug)
      .single()

    if (stateError || !stateData) return { state: null, cities: [] }

    const { data: cities, error: citiesError } = await supabase
      .from('cities')
      .select('id, name, slug')
      .eq('state_id', stateData.id)
      .order('name')

    if (citiesError) throw citiesError

    const { data: schools, error: schoolsError } = await supabase
      .from('schools')
      .select('city_id')
      .eq('state_id', stateData.id)

    if (schoolsError) throw schoolsError

    const countMap: Record<string, number> = {}
    for (const s of schools || []) {
      if (s.city_id) {
        countMap[s.city_id] = (countMap[s.city_id] || 0) + 1
      }
    }

    return {
      state: stateData,
      cities: (cities || []).map((city) => ({
        ...city,
        schoolCount: countMap[city.id] || 0,
      })),
    }
  } catch (error) {
    console.error(`Error fetching cities with school count for ${stateSlug}:`, error)
    return { state: null, cities: [] }
  }
}

/**
 * Fetch available filter options (distinct boards, types)
 */
export async function fetchFilterOptions() {
  try {
    const [boardsRes, typesRes, statesRes] = await Promise.all([
      supabase.from('boards').select('name, slug').order('name'),
      supabase.from('schools').select('type').not('type', 'is', null),
      supabase.from('states').select('id, name, slug').order('name'),
    ])

    const boards = (boardsRes.data || []).map((b) => b.name)
    const types = Array.from(new Set((typesRes.data || []).map((d) => d.type).filter(Boolean)))
    const states = statesRes.data || []

    return { boards, types, states }
  } catch (error) {
    console.error('Error fetching filter options:', error)
    return { boards: [], types: [], states: [] }
  }
}

// ============================================================================
// AGE GROUP QUERIES
// ============================================================================

/**
 * Fetch all age groups ordered by display_order
 */
export async function fetchAllAgeGroups(): Promise<AgeGroup[]> {
  try {
    const { data, error } = await supabase
      .from('age_groups')
      .select('*')
      .order('display_order')

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching age groups:', error)
    return []
  }
}

/**
 * Fetch all age groups with school counts
 */
export async function fetchAgeGroupsWithSchoolCount() {
  try {
    const { data: ageGroups, error: agError } = await supabase
      .from('age_groups')
      .select('*')
      .order('display_order')

    if (agError) throw agError

    const { data: junctionData, error: jError } = await supabase
      .from('school_age_groups')
      .select('age_group_id')

    if (jError) throw jError

    const countMap: Record<string, number> = {}
    for (const row of junctionData || []) {
      countMap[row.age_group_id] = (countMap[row.age_group_id] || 0) + 1
    }

    return (ageGroups || []).map((ag) => ({
      ...ag,
      schoolCount: countMap[ag.id] || 0,
    }))
  } catch (error) {
    console.error('Error fetching age groups with counts:', error)
    return []
  }
}

/**
 * Fetch schools by age group slug
 */
export async function fetchSchoolsByAgeGroupSlug(ageGroupSlug: string) {
  try {
    // Get age group
    const { data: ageGroup, error: agError } = await supabase
      .from('age_groups')
      .select('*')
      .eq('slug', ageGroupSlug)
      .single()

    if (agError || !ageGroup) return { ageGroup: null, schools: [] }

    // Get school IDs in this age group
    const { data: junctionData, error: jError } = await supabase
      .from('school_age_groups')
      .select('school_id')
      .eq('age_group_id', ageGroup.id)

    if (jError) throw jError

    const schoolIds = (junctionData || []).map((row) => row.school_id)
    if (schoolIds.length === 0) return { ageGroup, schools: [] }

    // Get school details from the search view
    const { data: schools, error: sError } = await supabase
      .from('school_search_view')
      .select('*')
      .in('id', schoolIds)
      .order('rating', { ascending: false })

    if (sError) throw sError

    return { ageGroup, schools: schools || [] }
  } catch (error) {
    console.error(`Error fetching schools for age group ${ageGroupSlug}:`, error)
    return { ageGroup: null, schools: [] }
  }
}

/**
 * Fetch age groups for a specific school
 */
export async function fetchAgeGroupsForSchool(schoolId: string): Promise<AgeGroup[]> {
  try {
    const { data: junctionData, error: jError } = await supabase
      .from('school_age_groups')
      .select('age_group_id')
      .eq('school_id', schoolId)

    if (jError) throw jError

    const ageGroupIds = (junctionData || []).map((row) => row.age_group_id)
    if (ageGroupIds.length === 0) return []

    const { data, error } = await supabase
      .from('age_groups')
      .select('*')
      .in('id', ageGroupIds)
      .order('display_order')

    if (error) throw error
    return data || []
  } catch (error) {
    console.error(`Error fetching age groups for school ${schoolId}:`, error)
    return []
  }
}

// ============================================================================
// FEE RANGE FUNCTIONS (One-to-Many: fee_ranges → schools)
// ============================================================================

/**
 * Fetch all fee ranges
 */
export async function fetchAllFeeRanges(): Promise<FeeRange[]> {
  try {
    const { data, error } = await supabase
      .from('fee_ranges')
      .select('*')
      .order('display_order')

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching fee ranges:', error)
    return []
  }
}

/**
 * Fetch all fee ranges with school counts
 */
export async function fetchFeeRangesWithSchoolCount() {
  try {
    const { data: feeRanges, error: frError } = await supabase
      .from('fee_ranges')
      .select('id, name, slug, min_fee, max_fee, display_order')
      .order('display_order')

    if (frError) throw frError

    const { data: schools, error: sError } = await supabase
      .from('schools')
      .select('fee_range_id')

    if (sError) throw sError

    const countMap: Record<string, number> = {}
    for (const s of schools || []) {
      if (s.fee_range_id) {
        countMap[s.fee_range_id] = (countMap[s.fee_range_id] || 0) + 1
      }
    }

    return (feeRanges || []).map((fr) => ({
      ...fr,
      schoolCount: countMap[fr.id] || 0,
    }))
  } catch (error) {
    console.error('Error fetching fee ranges with school count:', error)
    return []
  }
}

/**
 * Fetch schools by fee range slug using the search view
 */
export async function fetchSchoolsByFeeRangeSlug(feeRangeSlug: string) {
  try {
    const { data, error } = await supabase
      .from('school_search_view')
      .select('*')
      .eq('fee_range_slug', feeRangeSlug)
      .order('rating', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error(`Error fetching schools for fee range ${feeRangeSlug}:`, error)
    return []
  }
}

// ============================================================================
// SCHOOL TYPE FUNCTIONS (Many-to-Many: school_types ↔ schools)
// ============================================================================

/**
 * Fetch all school types
 */
export async function fetchAllSchoolTypes(): Promise<SchoolType[]> {
  try {
    const { data, error } = await supabase
      .from('school_types')
      .select('*')
      .order('display_order')

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching school types:', error)
    return []
  }
}

/**
 * Fetch all school types with school counts
 */
export async function fetchSchoolTypesWithSchoolCount() {
  try {
    const { data: types, error: tError } = await supabase
      .from('school_types')
      .select('*')
      .order('display_order')

    if (tError) throw tError

    const { data: junctionData, error: jError } = await supabase
      .from('school_school_types')
      .select('school_type_id')

    if (jError) throw jError

    const countMap: Record<string, number> = {}
    for (const row of junctionData || []) {
      countMap[row.school_type_id] = (countMap[row.school_type_id] || 0) + 1
    }

    return (types || []).map((t) => ({
      ...t,
      schoolCount: countMap[t.id] || 0,
    }))
  } catch (error) {
    console.error('Error fetching school types with counts:', error)
    return []
  }
}

/**
 * Fetch schools by school type slug
 */
export async function fetchSchoolsBySchoolTypeSlug(typeSlug: string) {
  try {
    const { data: schoolType, error: tError } = await supabase
      .from('school_types')
      .select('*')
      .eq('slug', typeSlug)
      .single()

    if (tError || !schoolType) return { schoolType: null, schools: [] }

    const { data: junctionData, error: jError } = await supabase
      .from('school_school_types')
      .select('school_id')
      .eq('school_type_id', schoolType.id)

    if (jError) throw jError

    const schoolIds = (junctionData || []).map((row) => row.school_id)
    if (schoolIds.length === 0) return { schoolType, schools: [] }

    const { data: schools, error: sError } = await supabase
      .from('school_search_view')
      .select('*')
      .in('id', schoolIds)
      .order('rating', { ascending: false })

    if (sError) throw sError

    return { schoolType, schools: schools || [] }
  } catch (error) {
    console.error(`Error fetching schools for type ${typeSlug}:`, error)
    return { schoolType: null, schools: [] }
  }
}

/**
 * Fetch school types for a specific school
 */
export async function fetchSchoolTypesForSchool(schoolId: number): Promise<SchoolType[]> {
  try {
    const { data: junctionData, error: jError } = await supabase
      .from('school_school_types')
      .select('school_type_id')
      .eq('school_id', schoolId)

    if (jError) throw jError

    const typeIds = (junctionData || []).map((row) => row.school_type_id)
    if (typeIds.length === 0) return []

    const { data, error } = await supabase
      .from('school_types')
      .select('*')
      .in('id', typeIds)
      .order('display_order')

    if (error) throw error
    return data || []
  } catch (error) {
    console.error(`Error fetching school types for school ${schoolId}:`, error)
    return []
  }
}