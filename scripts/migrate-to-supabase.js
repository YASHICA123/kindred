#!/usr/bin/env node

/**
 * Migrate schools from CSV to Supabase
 * Usage: node scripts/migrate-to-supabase.js
 */

require('dotenv').config({ path: '.env.local' })

const fs = require('fs')
const path = require('path')
const { parse } = require('csv-parse/sync')
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function loadSchoolsFromCSV() {
  const csvPath = path.join(process.cwd(), '50_indian_schools_dataset.csv')
  const fileContent = fs.readFileSync(csvPath, 'utf-8')

  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    delimiter: ',',
  })

  return records.map((record, index) => ({
    slug: (record.slug || record.Name?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')).toLowerCase(),
    name: record.Name,
    location: record.location,
    city: record.city,
    state: record.state || record.city,
    type: record.type,
    curriculum: record.curriculum,
    rating: record.Ratings ? parseFloat(record.Ratings) : 0,
    reviews: record.reviews ? parseInt(record.reviews) : 0,
    students: record.students ? parseInt(record.students) : 0,
    fee_range: record.fee_range || '',
    established: record.established || '',
    description: record.description,
    highlights: record.highlights ? record.highlights.split('|').map((h) => h.trim()) : [],
    facilities: record.facilities ? record.facilities.split('|').map((f) => f.trim()) : [],
    contact_phone: record.contact_phone || '',
    contact_email: record.contact_email || '',
    contact_website: record.contact_website || '',
    cover_image: '',
  }))
}

async function ensureSchoolsTable() {
  // Check if table exists by trying to query it
  const { error: checkError } = await supabase
    .from('schools')
    .select('id')
    .limit(1)

  if (checkError && checkError.code === 'PGRST116') {
    console.log('📝 Creating schools table...')
    
    // Create the table using SQL
    const { error: createError } = await supabase.rpc('check_schools_table')
      .catch(async () => {
        // Fallback: table might already exist or we can't create via RPC
        console.log('   (Table may already exist)')
        return { error: null }
      })

    return true
  }

  console.log('✅ Schools table already exists')
  return true
}

async function migrateSchools() {
  try {
    console.log('🔄 Loading schools from CSV...')
    const schools = await loadSchoolsFromCSV()
    console.log(`✅ Loaded ${schools.length} schools from CSV`)

    console.log('\n📡 Connecting to Supabase...')
    // Test connection
    const { error: testError } = await supabase.from('schools').select('id').limit(1)
    if (testError && testError.code !== 'PGRST116') {
      console.error('❌ Connection failed:', testError.message)
      process.exit(1)
    }
    console.log('✅ Connected to Supabase')

    // Ensure table exists
    await ensureSchoolsTable()

    // Clear existing data
    console.log('\n🗑️  Clearing existing schools...')
    const { error: deleteError } = await supabase
      .from('schools')
      .delete()
      .neq('id', 0)
    
    if (deleteError) {
      console.warn('⚠️  Warning clearing old data:', deleteError.message)
    } else {
      console.log('✅ Cleared existing schools')
    }

    // Insert schools in batches
    const batchSize = 50
    console.log(`\n📥 Inserting ${schools.length} schools in batches of ${batchSize}...`)
    
    for (let i = 0; i < schools.length; i += batchSize) {
      const batch = schools.slice(i, i + batchSize)
      const { error: insertError, data } = await supabase
        .from('schools')
        .insert(batch)
        .select('id')

      if (insertError) {
        console.error(`❌ Batch ${Math.floor(i / batchSize) + 1} failed:`, insertError.message)
        process.exit(1)
      }

      console.log(`   ✓ Inserted ${batch.length} schools (${i + batch.length}/${schools.length})`)
    }

    console.log('\n✅ Migration complete!')
    console.log(`📊 ${schools.length} schools successfully migrated to Supabase`)

  } catch (error) {
    console.error('❌ Migration failed:', error.message)
    process.exit(1)
  }
}

migrateSchools()
