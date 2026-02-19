#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' })

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function testDiscoverFetch() {
  try {
    console.log('Testing direct Supabase fetch (like discover does)...\n')
    
    const { data, error } = await supabase
      .from('schools')
      .select('*')
      .order('rating', { ascending: false })
      .limit(5)

    if (error) {
      console.error('❌ Error:', error.message)
      return
    }

    console.log('✅ Raw Supabase response (first school):')
    console.log(JSON.stringify(data[0], null, 2))
    
    console.log('\n🔍 Field check for Doon School:')
    const doon = data.find(s => s.slug === 'the-doon-school')
    if (doon) {
      console.log(`cover_image: ${doon.cover_image ? '✅ HAS VALUE' : '❌ MISSING'}`)
      console.log(`image: ${doon.image ? '✅ HAS VALUE' : '❌ MISSING'}`)
      console.log(`_image field exists: ${doon.hasOwnProperty('image')}`)
      console.log(`_cover_image field exists: ${doon.hasOwnProperty('cover_image')}`)
    }

  } catch (error) {
    console.error('Error:', error.message)
  }
}

testDiscoverFetch()
