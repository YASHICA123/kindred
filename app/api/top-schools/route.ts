import { supabase } from '@/lib/supabase'
import { loadSchoolsFromCSV } from '@/lib/load-csv-schools'

export async function GET() {
  try {
    // Try fetching from Supabase first (has images and latest data)
    const { data: supabaseSchools, error: supabaseError } = await supabase
      .from('schools')
      .select('*')
      .order('rating', { ascending: false })

    let schools = []
    let source = 'supabase'

    if (supabaseError || !supabaseSchools || supabaseSchools.length === 0) {
      console.warn('⚠️ Supabase query failed or empty, falling back to CSV...')
      
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
