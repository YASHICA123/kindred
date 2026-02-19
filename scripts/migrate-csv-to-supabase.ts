import fs from 'fs'
import path from 'path'
import { parse } from 'csv-parse/sync'
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

interface SchoolRecord {
  [key: string]: string | number | undefined
}

/**
 * Migrate schools from CSV to Supabase
 * Usage: npx ts-node scripts/migrate-csv-to-supabase.ts <path-to-csv>
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

const csvPath = process.argv[2]

if (!csvPath) {
  console.error('❌ Please provide CSV file path')
  console.log('Usage: npx ts-node scripts/migrate-csv-to-supabase.ts <path-to-csv>')
  process.exit(1)
}

const fullPath = path.resolve(csvPath)

if (!fs.existsSync(fullPath)) {
  console.error(`❌ File not found: ${fullPath}`)
  process.exit(1)
}

async function migrateCSV() {
  try {
    console.log('📖 Reading CSV file...')
    const fileContent = fs.readFileSync(fullPath, 'utf-8')

    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }) as SchoolRecord[]

    console.log(`📊 Found ${records.length} schools in CSV`)

    // Transform CSV records to database format
    const schools = records.map((record, index) => {
      // Create slug from name if not provided
      const name = (record.name || `School ${index + 1}`).toString()
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')

      return {
        name: name,
        slug: slug,
        ratings: record.ratings ? parseFloat(record.ratings.toString()) : null,
        reviews: record.reviews ? parseInt(record.reviews.toString()) : 0,
        students: record.students ? parseInt(record.students.toString()) : null,
        fee_range: record.fee_range?.toString() || null,
        established: record.established ? parseInt(record.established.toString()) : null,
        highlights: record.highlights?.toString() || null,
        facilities: record.facilities?.toString() || null,
        contact_website: record.contact_website?.toString() || null,
        curriculum: record.curriculum?.toString() || null,
        description: record.description?.toString() || null,
        cover_image: record.cover_image?.toString() || null,
        city: record.city?.toString() || null,
        state: record.state?.toString() || null,
        location: record.location?.toString() || null,
        type: record.type?.toString() || null,
        board: record.board?.toString() || null,
        contact_email: record.contact_email?.toString() || null,
        contact_phone: record.contact_phone?.toString() || null,
      }
    })

    console.log('🚀 Uploading to Supabase...')

    // Upload in batches of 100
    const batchSize = 100
    let uploadedCount = 0

    for (let i = 0; i < schools.length; i += batchSize) {
      const batch = schools.slice(i, i + batchSize)
      const { data, error } = await supabaseAdmin.from('schools').insert(batch).select()

      if (error) {
        console.error(`❌ Error uploading batch ${Math.floor(i / batchSize) + 1}:`, error.message)
        console.error('Details:', error)
      } else {
        uploadedCount += data?.length || 0
        console.log(`✅ Batch ${Math.floor(i / batchSize) + 1}: ${data?.length || 0} schools uploaded`)
      }
    }

    console.log(`\n✨ Migration complete! ${uploadedCount} schools uploaded to Supabase`)
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

// Run the migration
migrateCSV()

migrateCSV()
