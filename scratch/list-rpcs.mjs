import { createClient } from '@supabase/supabase-js'

const url = 'https://enchwrptwtctikbhrpsg.supabase.co'
const roleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVuY2h3cnB0d3RjdGlrYmhycHNnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTQ3ODgyNCwiZXhwIjoyMDg3MDU0ODI0fQ.HIpb1oy-Fz79hDx3Fr3KxwFE-eJPmJ_SZcYDi1Ffl88'
const supabase = createClient(url, roleKey)

async function listRpcs() {
  const { data, error } = await supabase
    .from('information_schema.routines')
    .select('routine_name')
    .eq('routine_schema', 'public')

  if (error) {
    console.error("Error fetching RPCs from routines:", error)
  } else {
    console.log("Routines in public schema:", data.map(r => r.routine_name))
  }
}

listRpcs()
