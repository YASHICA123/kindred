// Quick script to import CSV schools to Supabase
// Run: node scripts/quick-import.js

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const { parse } = require('csv-parse/sync')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local')
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function importSchools() {
  console.log('📚 Reading CSV file...')
  
  const csvContent = fs.readFileSync('50_indian_schools_dataset.csv', 'utf-8')
  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
  })

  console.log(`Found ${records.length} schools in CSV\n`)

  // Check existing data
  const { count } = await supabase
    .from('schools')
    .select('*', { count: 'exact', head: true })

  console.log(`Current schools in database: ${count || 0}`)

  if (count > 0) {
    console.log('\n⚠️  Database already has schools. Delete them first? (y/n)')
    // For automation, we'll skip and just insert
  }

  console.log('\n🚀 Importing schools...')

  const schools = records.map((r, i) => ({
    name: r.Name,
    slug: r.slug || r.Name?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    location: r.location,
    city: r.city,
    state: r.city, // Use city as state for now
    type: r.type,
    curriculum: r.curriculum,
    ratings: r.Ratings ? parseFloat(r.Ratings) : null,
    reviews: r.reviews ? parseInt(r.reviews) : null,
    students: r.students ? parseInt(r.students) : null,
    fee_range: r.fee_range,
    established: r.established ? parseInt(r.established) : null,
    description: r.description,
    highlights: r.highlights,
    facilities: r.facilities,
    contact_phone: r.contact_phone,
    contact_email: r.contact_email,
    contact_website: r.contact_website,
  }))

  const { data, error } = await supabase
    .from('schools')
    .insert(schools)
    .select()

  if (error) {
    console.error('❌ Error importing:', error.message)
    process.exit(1)
  }

  console.log(`\n✅ Successfully imported ${data.length} schools!`)
  console.log('\n📊 Sample schools:')
  data.slice(0, 3).forEach(s => {
    console.log(`  - ${s.name} (${s.city})`)
  })
}

importSchools().catch(console.error)
