import { createClient } from '@supabase/supabase-js'

const url = 'https://enchwrptwtctikbhrpsg.supabase.co'
const roleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVuY2h3cnB0d3RjdGlrYmhycHNnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTQ3ODgyNCwiZXhwIjoyMDg3MDU0ODI0fQ.HIpb1oy-Fz79hDx3Fr3KxwFE-eJPmJ_SZcYDi1Ffl88'

const supabase = createClient(url, roleKey)

async function test() {
  const { data, error } = await supabase.from('schools').select('*').limit(2)
  if (error) {
    console.error('Error:', error)
  } else {
    data.forEach(school => {
      console.log('School Name:', school.name)
      console.log('facilities type:', typeof school.facilities, Array.isArray(school.facilities) ? 'Array' : 'Not Array')
      console.log('facilities val:', school.facilities)
      console.log('highlights type:', typeof school.highlights, Array.isArray(school.highlights) ? 'Array' : 'Not Array')
      console.log('highlights val:', school.highlights)
      console.log('--------------------------------------------------')
    })
  }
}

test()
