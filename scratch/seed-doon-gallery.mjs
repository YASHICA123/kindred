import { createClient } from '@supabase/supabase-js'

const url = 'https://enchwrptwtctikbhrpsg.supabase.co'
const roleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVuY2h3cnB0d3RjdGlrYmhycHNnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTQ3ODgyNCwiZXhwIjoyMDg3MDU0ODI0fQ.HIpb1oy-Fz79hDx3Fr3KxwFE-eJPmJ_SZcYDi1Ffl88'
const supabase = createClient(url, roleKey)

const SCHOOL_ID = 1 // The Doon School

async function seed() {
  try {
    console.log('🗑️  Clearing existing gallery for The Doon School...')
    const { error: deleteError } = await supabase
      .from('school_gallery')
      .delete()
      .eq('school_id', SCHOOL_ID)

    if (deleteError) {
      console.error('❌ Failed to clear gallery:', deleteError.message)
      return
    }

    console.log('🔄 Seeding high-quality gallery images for The Doon School...')
    const galleryRows = [
      {
        school_id: SCHOOL_ID,
        image_url: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=800",
        caption: "Beautiful historical main building and lush green lawn",
        category: "Campus"
      },
      {
        school_id: SCHOOL_ID,
        image_url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800",
        caption: "Traditional brick corridors and courtyard archways",
        category: "Campus"
      },
      {
        school_id: SCHOOL_ID,
        image_url: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=800",
        caption: "Collaborative study session in the senior library",
        category: "Classroom"
      },
      {
        school_id: SCHOOL_ID,
        image_url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800",
        caption: "Advanced physics laboratory with modern research equipment",
        category: "Labs"
      },
      {
        school_id: SCHOOL_ID,
        image_url: "https://images.unsplash.com/photo-1544698310-74ea9d1c8258?auto=format&fit=crop&q=80&w=800",
        caption: "Football practice at the main school sports pavilion",
        category: "Sports"
      }
    ]

    // Attempt insert with category column first
    const { error: insertError } = await supabase
      .from('school_gallery')
      .insert(galleryRows)

    if (insertError) {
      if (insertError.message.includes('category') || (insertError.details && insertError.details.includes('category'))) {
        console.log('⚠️  Category column not found in database. Retrying without category column...')
        const cleanRows = galleryRows.map(({ category, ...rest }) => rest)
        const { error: retryError } = await supabase
          .from('school_gallery')
          .insert(cleanRows)

        if (retryError) {
          console.error('❌ Error seeding gallery (retry):', retryError.message)
        } else {
          console.log('✅ Seeding completed successfully (without category)!')
        }
      } else {
        console.error('❌ Error seeding gallery:', insertError.message)
      }
    } else {
      console.log('✅ Seeding completed successfully with categories!')
    }

  } catch (error) {
    console.error('❌ Seeding execution failed:', error.message)
  }
}

seed()
