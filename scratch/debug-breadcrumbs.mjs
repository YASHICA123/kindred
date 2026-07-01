import { createClient } from '@supabase/supabase-js'

const url = 'https://enchwrptwtctikbhrpsg.supabase.co'
const roleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVuY2h3cnB0d3RjdGlrYmhycHNnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTQ3ODgyNCwiZXhwIjoyMDg3MDU0ODI0fQ.HIpb1oy-Fz79hDx3Fr3KxwFE-eJPmJ_SZcYDi1Ffl88'
const supabase = createClient(url, roleKey)

async function debugBreadcrumbs() {
  const { data: schools, error } = await supabase
    .from('schools')
    .select('*, cities(name, slug), states(name, slug)')
    .limit(3)

  if (error) {
    console.error("Error:", error)
    return
  }

  for (const school of schools) {
    console.log(`School: ${school.name}`)
    console.log(`- city: ${school.city}`)
    console.log(`- state: ${school.state}`)
    console.log(`- city_id: ${school.city_id}`)
    console.log(`- state_id: ${school.state_id}`)
    console.log(`- cities association:`, school.cities)
    console.log(`- states association:`, school.states)
    console.log('---')
  }
}

debugBreadcrumbs()
