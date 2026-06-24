import { createClient } from '@supabase/supabase-js'

const url = 'https://enchwrptwtctikbhrpsg.supabase.co'
const roleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVuY2h3cnB0d3RjdGlrYmhycHNnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTQ3ODgyNCwiZXhwIjoyMDg3MDU0ODI0fQ.HIpb1oy-Fz79hDx3Fr3KxwFE-eJPmJ_SZcYDi1Ffl88'
const supabase = createClient(url, roleKey)

async function checkDoon() {
  // Query schools table for Doon School
  const { data: schools, error: schoolError } = await supabase
    .from('schools')
    .select('*')
    .ilike('name', '%doon%')

  if (schoolError) {
    console.error("Error fetching Doon School:", schoolError)
    return
  }

  console.log("Found schools matching 'doon':", schools)

  if (schools && schools.length > 0) {
    for (const school of schools) {
      console.log(`\nChecking school ID: ${school.id}, Slug: ${school.slug}, Name: ${school.name}`)
      
      // Query school_gallery
      const { data: gallery, error: galleryError } = await supabase
        .from('school_gallery')
        .select('*')
        .eq('school_id', school.id)

      if (galleryError) {
        console.error(`Error fetching gallery for school ${school.id}:`, galleryError)
      } else {
        console.log(`Gallery items count for school ${school.id}: ${gallery.length}`)
        console.log("Gallery items:", gallery)
      }

      // Query if there is an image field directly on schools table
      console.log(`Direct image on schools table: ${school.image}`)
    }
  }
}

checkDoon()
