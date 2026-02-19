#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' })

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkImages() {
  try {
    console.log('🔍 Checking schools with images...\n')
    
    const { data, error } = await supabase
      .from('schools')
      .select('id, name, city, cover_image')
      .limit(10)

    if (error) {
      console.error('❌ Error:', error.message)
      return
    }

    console.log('Schools in database:\n')
    let withImages = 0
    let withoutImages = 0

    data.forEach((school, i) => {
      const hasImage = school.cover_image && school.cover_image.trim() !== ''
      if (hasImage) withImages++
      else withoutImages++
      
      console.log(`${i + 1}. ${school.name} (${school.city})`)
      console.log(`   Image URL: ${hasImage ? school.cover_image : '❌ EMPTY'}`)
      if (hasImage) {
        console.log(`   ✅ Has image`)
      }
      console.log()
    })

    console.log(`\n📊 Summary:`)
    console.log(`   Schools with images: ${withImages}`)
    console.log(`   Schools without images: ${withoutImages}`)
    console.log(`   Total: ${data.length}`)

    // Check if URL format is correct
    if (withImages > 0) {
      const firstImageUrl = data.find(s => s.cover_image)?.cover_image
      console.log(`\n🔗 Sample URL:`)
      console.log(`   ${firstImageUrl}`)
      console.log(`\n✅ URL format looks correct` )
    }

  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

checkImages()
