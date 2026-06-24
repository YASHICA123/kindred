import { createClient } from '@supabase/supabase-js'

const url = 'https://enchwrptwtctikbhrpsg.supabase.co'
const roleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVuY2h3cnB0d3RjdGlrYmhycHNnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTQ3ODgyNCwiZXhwIjoyMDg3MDU0ODI0fQ.HIpb1oy-Fz79hDx3Fr3KxwFE-eJPmJ_SZcYDi1Ffl88'
const supabase = createClient(url, roleKey)

async function check() {
  const tables = ['schools', 'school_fees', 'school_gallery', 'school_reviews', 'school_faqs', 'school_admissions', 'school_school_types', 'school_types']
  
  console.log("Total rows per table:")
  for (const table of tables) {
    const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true })
    if (error) {
      console.log(`- ${table}: Error - ${error.message}`)
    } else {
      console.log(`- ${table}: ${count} rows`)
    }
  }

  // Find schools that have gallery images
  const { data: galleryItems } = await supabase.from('school_gallery').select('school_id').limit(10)
  if (galleryItems && galleryItems.length > 0) {
    console.log("\nSome school IDs with gallery images:", Array.from(new Set(galleryItems.map(g => g.school_id))))
  }

  // Find schools that have FAQs
  const { data: faqItems } = await supabase.from('school_faqs').select('school_id').limit(10)
  if (faqItems && faqItems.length > 0) {
    console.log("Some school IDs with FAQs:", Array.from(new Set(faqItems.map(f => f.school_id))))
  }

  // Find schools that have admissions
  const { data: admissionItems } = await supabase.from('school_admissions').select('school_id').limit(10)
  if (admissionItems && admissionItems.length > 0) {
    console.log("Some school IDs with admissions:", Array.from(new Set(admissionItems.map(a => a.school_id))))
  }

  // Find schools that have fees
  const { data: feeItems } = await supabase.from('school_fees').select('school_id').limit(10)
  if (feeItems && feeItems.length > 0) {
    console.log("Some school IDs with fees:", Array.from(new Set(feeItems.map(f => f.school_id))))
  }
}

check()
