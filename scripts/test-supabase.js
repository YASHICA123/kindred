#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' })

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  try {
    console.log('🔄 Testing Supabase connection...\n')
    
    const { data, error } = await supabase
      .from('schools')
      .select('id, name, city')
      .limit(10)

    if (error) {
      console.error('❌ Error:', error.message)
      return
    }

    console.log(`✅ Successfully connected to Supabase!`)
    console.log(`✅ Found ${data.length} schools in test query\n`)
    console.log('Sample schools:')
    data.forEach((school, i) => {
      console.log(`  ${i + 1}. ${school.name} (${school.city})`)
    })

    // Count total
    const { count, error: countError } = await supabase
      .from('schools')
      .select('id', { count: 'exact' })

    if (!countError) {
      console.log(`\n📊 Total schools in Supabase: ${count}`)
    }

  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

testConnection()
