import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Fetch from Supabase
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

    if (supabaseError) {
      console.error('Supabase error fetching schools:', supabaseError)
      return Response.json({ success: false, error: 'Failed to fetch schools from database', data: [], count: 0 }, { status: 500 })
    }

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
      // Junction table may not have data yet
    }

    const schools = (supabaseSchools || []).map((school: any) => ({
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
      tags: school.tags,
      contact_phone: school.contact_phone,
      contact_email: school.contact_email,
      contact_website: school.contact_website,
      cover_image: school.cover_image || '',
      image: school.cover_image || '', // For backward compatibility
    }))

    console.log(`✅ Loaded ${schools.length} schools from Supabase`)

    return Response.json({
      success: true,
      count: schools.length,
      data: schools,
      source: 'supabase'
    })
  } catch (error) {
    console.error('Error fetching schools:', error)
    return Response.json(
      {
        success: false,
        error: 'Failed to fetch schools',
        data: [],
        count: 0,
      },
      { status: 500 }
    )
  }
}
