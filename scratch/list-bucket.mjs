import { createClient } from '@supabase/supabase-js'

const url = 'https://enchwrptwtctikbhrpsg.supabase.co'
const roleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVuY2h3cnB0d3RjdGlrYmhycHNnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTQ3ODgyNCwiZXhwIjoyMDg3MDU0ODI0fQ.HIpb1oy-Fz79hDx3Fr3KxwFE-eJPmJ_SZcYDi1Ffl88'
const supabase = createClient(url, roleKey)

async function listBucket() {
  const { data, error } = await supabase
    .storage
    .from('school-images')
    .list('', {
      limit: 100,
      offset: 0,
      sortBy: { column: 'name', order: 'asc' }
    })

  if (error) {
    console.error("Error listing bucket:", error)
    return
  }

  console.log(`Total files in 'school-images' bucket: ${data.length}`)
  console.log("Files:")
  console.log(data.map(f => f.name))
}

listBucket()
