import { createClient } from '@supabase/supabase-js'

const url = 'https://enchwrptwtctikbhrpsg.supabase.co'
const roleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVuY2h3cnB0d3RjdGlrYmhycHNnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTQ3ODgyNCwiZXhwIjoyMDg3MDU0ODI0fQ.HIpb1oy-Fz79hDx3Fr3KxwFE-eJPmJ_SZcYDi1Ffl88'
const supabase = createClient(url, roleKey)

async function checkAllGallery() {
  const { data: gallery, error: galleryError } = await supabase
    .from('school_gallery')
    .select('*')

  if (galleryError) {
    console.error("Error fetching school_gallery:", galleryError)
    return
  }

  console.log(`Total gallery items: ${gallery.length}`)
  console.log("All gallery items:")
  console.log(JSON.stringify(gallery, null, 2))
}

checkAllGallery()
