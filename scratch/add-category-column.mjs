import { createClient } from '@supabase/supabase-js'

const url = 'https://enchwrptwtctikbhrpsg.supabase.co'
const roleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVuY2h3cnB0d3RjdGlrYmhycHNnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTQ3ODgyNCwiZXhwIjoyMDg3MDU0ODI0fQ.HIpb1oy-Fz79hDx3Fr3KxwFE-eJPmJ_SZcYDi1Ffl88'
const supabase = createClient(url, roleKey)

async function addCategoryColumn() {
  try {
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: `ALTER TABLE school_gallery ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'Campus';`
    })

    if (error) {
      console.error("Error executing SQL via exec_sql:", error)
    } else {
      console.log("SQL executed successfully, column added/verified!", data)
    }
  } catch (err) {
    console.error("Exception occurred:", err.message)
  }
}

addCategoryColumn()
