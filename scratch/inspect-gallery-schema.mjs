import { createClient } from '@supabase/supabase-js'

const url = 'https://enchwrptwtctikbhrpsg.supabase.co'
const roleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVuY2h3cnB0d3RjdGlrYmhycHNnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTQ3ODgyNCwiZXhwIjoyMDg3MDU0ODI0fQ.HIpb1oy-Fz79hDx3Fr3KxwFE-eJPmJ_SZcYDi1Ffl88'
const supabase = createClient(url, roleKey)

async function inspect() {
  const { data, error } = await supabase
    .from('school_gallery')
    .select('*')
    .limit(1)

  if (error) {
    console.error("Error selecting from school_gallery:", error)
  } else {
    console.log("school_gallery record sample:", data)
    if (data.length > 0) {
      console.log("Columns:", Object.keys(data[0]))
    } else {
      console.log("Table is empty, cannot inspect keys from record")
    }
  }
}

inspect()
