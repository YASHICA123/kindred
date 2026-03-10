import { supabase } from '@/lib/supabase'
import { loadSchoolsFromCSV } from '@/lib/load-csv-schools'

export async function GET() {
  try {
    // Try fetching from Supabase first (has images and latest data)
    let supabaseSchools: any[] | null = null
    let supabaseError: unknown = null

    try {
      const result = await supabase
        .from('schools')
        .select('*')
        .order('rating', { ascending: false })

      supabaseSchools = result.data
      supabaseError = result.error
    } catch (error) {
      supabaseError = error
    }

    let schools = []
    let source = 'supabase'

    // Try to fetch school types from the junction table
    let schoolTypeMap: Record<string, string[]> = {}
    try {
      const { data: junctionData } = await supabase
        .from('school_school_types')
        .select('school_id, school_types(name)')
      if (junctionData) {
        for (const row of junctionData as any[]) {
          const sid = String(row.school_id)
          const typeName = row.school_types?.name
          if (typeName) {
            if (!schoolTypeMap[sid]) schoolTypeMap[sid] = []
            schoolTypeMap[sid].push(typeName)
          }
        }
      }
    } catch {
      // Junction table may not exist yet - ignore
    }

    if (supabaseError || !supabaseSchools || supabaseSchools.length === 0) {
      console.warn('⚠️ Supabase query failed or empty, falling back to CSV...')
      if (supabaseError) {
        console.warn('Supabase error:', supabaseError)
      }
      
      // Fallback to CSV
      const csvSchools = await loadSchoolsFromCSV()
      schools = csvSchools.map((school: any) => ({
        id: school.id,
        slug: school.slug,
        name: school.name,
        location: school.location,
        city: school.city,
        state: school.state,
        type: school.type,
        curriculum: school.curriculum,
        rating: school.rating,
        reviews: school.reviews,
        students: school.students,
        fee_range: school.feeRange,
        established: school.established,
        description: school.description,
        highlights: school.highlights,
        facilities: school.facilities,
        contact_phone: school.contact?.phone,
        contact_email: school.contact?.email,
        contact_website: school.contact?.website,
        cover_image: school.image || '',
      }))
      source = 'csv'
    } else {
      // Normalize Supabase data
      schools = supabaseSchools.map((school: any) => ({
        id: school.id,
        slug: school.slug,
        name: school.name,
        location: school.location,
        city: school.city,
        state: school.state,
        type: school.type,
        school_type_names: schoolTypeMap[String(school.id)] || [],
        curriculum: school.curriculum,
        rating: school.rating,
        reviews: school.reviews,
        students: school.students,
        fee_range: school.fee_range,
        established: school.established,
        description: school.description,
        highlights: school.highlights,
        facilities: school.facilities,
        contact_phone: school.contact_phone,
        contact_email: school.contact_email,
        contact_website: school.contact_website,
        cover_image: school.cover_image || '',
        image: school.cover_image || '', // For backward compatibility
      }))
      source = 'supabase'
      console.log(`✅ Loaded ${schools.length} schools from Supabase`)
    }

    return Response.json({
      success: true,
      count: schools.length,
      data: schools,
      source: source
    })
  } catch (error) {
    console.error('Error fetching schools:', error)
    return Response.json(
      {
        success: false,
        error: 'Failed to fetch schools',
      },
      { status: 500 }
    )
  }
}
