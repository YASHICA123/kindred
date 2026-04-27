/**
 * Bulk import schools from CSV to Supabase.
 * Usage:
 *   node scripts/import-schools-csv.js <csv-file>
 *
 * Required environment variables:
 *   - NEXT_PUBLIC_SUPABASE_URL (or SUPABASE_URL)
 *   - SUPABASE_SERVICE_ROLE_KEY
 */

const fs = require('fs')
const { createClient } = require('@supabase/supabase-js')

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Required environment variables not set:')
  console.error('  - NEXT_PUBLIC_SUPABASE_URL (or SUPABASE_URL)')
  console.error('  - SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

function parseCSV(csvContent) {
  const lines = csvContent.split('\n')
  const headers = lines[0].split(',').map((h) => h.trim())
  const rows = []

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    const values = []
    let currentValue = ''
    let insideQuotes = false

    for (let j = 0; j < line.length; j++) {
      const char = line[j]
      if (char === '"') {
        insideQuotes = !insideQuotes
      } else if (char === ',' && !insideQuotes) {
        values.push(currentValue.trim().replace(/^"|"$/g, ''))
        currentValue = ''
      } else {
        currentValue += char
      }
    }

    values.push(currentValue.trim().replace(/^"|"$/g, ''))

    const row = {}
    headers.forEach((header, index) => {
      row[header] = values[index] || ''
    })

    rows.push(row)
  }

  return rows
}

function toNumberOrNull(value) {
  if (!value || !String(value).trim()) return null
  const num = Number(value)
  return Number.isFinite(num) ? num : null
}

function slugify(name) {
  return String(name || '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
}

function transformSchool(row) {
  const name = row.Name || row.name || ''
  const slug = row.slug || slugify(name)

  return {
    name,
    slug,
    location: row.location || null,
    city: row.city || null,
    state: row.state || null,
    type: row.type || null,
    curriculum: row.curriculum || null,
    ratings: toNumberOrNull(row.Ratings || row.ratings),
    reviews: toNumberOrNull(row.reviews),
    students: toNumberOrNull(row.students),
    fee_range: row.fee_range || null,
    established: toNumberOrNull(row.established),
    description: row.description || null,
    highlights: row.highlights || null,
    facilities: row.facilities || null,
    contact_phone: row.contact_phone || null,
    contact_email: row.contact_email || null,
    contact_website: row.contact_website || null,
  }
}

async function upsertSchool(schoolData) {
  const { error } = await supabase
    .from('schools')
    .upsert(schoolData, { onConflict: 'slug' })

  if (error) {
    throw error
  }
}

async function bulkImport(schools, batchDelay = 150) {
  const total = schools.length
  let successful = 0
  let failed = 0
  const errors = []

  console.log(`Starting bulk import of ${total} schools to Supabase...`)

  for (let i = 0; i < schools.length; i++) {
    const source = schools[i]

    try {
      const schoolData = transformSchool(source)
      if (!schoolData.name || !schoolData.slug) {
        throw new Error('Missing required fields: name or slug')
      }

      await upsertSchool(schoolData)
      successful++

      const progress = ((i + 1) / total * 100).toFixed(1)
      console.log(`OK [${i + 1}/${total}] ${schoolData.name} (${progress}%)`)

      if (i < schools.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, batchDelay))
      }
    } catch (error) {
      failed++
      const schoolName = source.Name || source.name || `Row ${i + 1}`
      const message = error instanceof Error ? error.message : String(error)
      console.log(`FAIL [${i + 1}/${total}] ${schoolName}: ${message}`)
      errors.push({ index: i, school: schoolName, error: message })
    }
  }

  console.log('--------------------------------')
  console.log('Import Summary:')
  console.log(`  Successful: ${successful}/${total}`)
  console.log(`  Failed: ${failed}/${total}`)

  if (errors.length > 0) {
    console.log('Sample failures:')
    errors.slice(0, 10).forEach((e) => {
      console.log(`  - ${e.school}: ${e.error}`)
    })
  }
}

async function main() {
  const args = process.argv.slice(2)
  if (args.length === 0) {
    console.error('Usage: node scripts/import-schools-csv.js <path-to-csv-file>')
    process.exit(1)
  }

  const filePath = args[0]
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`)
    process.exit(1)
  }

  try {
    const csvContent = fs.readFileSync(filePath, 'utf8')
    const schools = parseCSV(csvContent)

    if (schools.length === 0) {
      console.error('No schools found in CSV file')
      process.exit(1)
    }

    await bulkImport(schools)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`Fatal error: ${message}`)
    process.exit(1)
  }
}

main()
