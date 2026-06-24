import { createClient } from '@supabase/supabase-js'

const url = 'https://enchwrptwtctikbhrpsg.supabase.co'
const roleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVuY2h3cnB0d3RjdGlrYmhycHNnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTQ3ODgyNCwiZXhwIjoyMDg3MDU0ODI0fQ.HIpb1oy-Fz79hDx3Fr3KxwFE-eJPmJ_SZcYDi1Ffl88'
const supabase = createClient(url, roleKey)

const replacementUrls = {
  // Let's use known working Unsplash school-related images
  "courtyard": "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=800",
  "classroom": "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=800",
  "lab": "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=800",
  "sports": "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=800",
  "library": "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=800"
}

async function fixGallery() {
  const { data: gallery, error: galleryError } = await supabase
    .from('school_gallery')
    .select('*')

  if (galleryError) {
    console.error("Error fetching school_gallery:", galleryError)
    return
  }

  for (const item of gallery) {
    try {
      const res = await fetch(item.image_url, { method: 'HEAD' })
      if (!res.ok) {
        console.log(`URL broken for item ID ${item.id}: ${item.image_url} (Status ${res.status})`)
        // Let's replace with a working one based on caption keywords
        let newUrl = replacementUrls.classroom
        if (item.caption.toLowerCase().includes("library")) {
          newUrl = replacementUrls.library
        } else if (item.caption.toLowerCase().includes("lab") || item.caption.toLowerCase().includes("physics")) {
          newUrl = replacementUrls.lab
        } else if (item.caption.toLowerCase().includes("sports") || item.caption.toLowerCase().includes("football") || item.caption.toLowerCase().includes("basketball")) {
          newUrl = replacementUrls.sports
        } else if (item.caption.toLowerCase().includes("courtyard") || item.caption.toLowerCase().includes("corridors") || item.caption.toLowerCase().includes("building")) {
          // A nice campus corridor / courtyard image
          newUrl = "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800"
        }

        // Test the new url first
        const testRes = await fetch(newUrl, { method: 'HEAD' })
        if (testRes.ok) {
          const { error: updateError } = await supabase
            .from('school_gallery')
            .update({ image_url: newUrl })
            .eq('id', item.id)

          if (updateError) {
            console.error(`Failed to update item ID ${item.id}:`, updateError)
          } else {
            console.log(`Updated item ID ${item.id} to new working URL: ${newUrl}`)
          }
        } else {
          console.error(`Replacement URL is also broken! ${newUrl}`)
        }
      } else {
        console.log(`URL OK for item ID ${item.id}: ${item.image_url}`)
      }
    } catch (err) {
      console.error(`Error checking URL for item ID ${item.id}:`, err.message)
    }
  }
}

fixGallery()
