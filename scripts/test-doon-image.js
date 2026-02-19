#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' })

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkDoonSchool() {
  try {
    console.log('🔍 Checking Doon School...\n')
    
    const { data, error } = await supabase
      .from('schools')
      .select('id, name, cover_image')
      .eq('slug', 'the-doon-school')
      .single()

    if (error) {
      console.error('❌ Error:', error.message)
      return
    }

    if (!data) {
      console.log('❌ Doon School not found')
      return
    }

    console.log(`School: ${data.name}`)
    console.log(`ID: ${data.id}`)
    console.log(`\nCover Image URL:`)
    console.log(`${data.cover_image || '❌ EMPTY'}\n`)

    // Test if URL is accessible
    if (data.cover_image) {
      console.log('Testing URL accessibility...')
      try {
        const response = await fetch(data.cover_image, { method: 'HEAD' })
        if (response.ok) {
          console.log(`✅ URL is accessible (Status: ${response.status})`)
        } else {
          console.log(`⚠️ URL returned status: ${response.status}`)
          console.log(`   This means the image exists but might have access issues`)
        }
      } catch (fetchError) {
        console.log(`❌ URL is NOT accessible`)
        console.log(`   Error: ${fetchError.message}`)
        console.log(`\n   Possible issues:`)
        console.log(`   1. URL is incomplete or malformed`)
        console.log(`   2. CORS issue with Supabase Storage`)
        console.log(`   3. Image file doesn't exist`)
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

checkDoonSchool()
