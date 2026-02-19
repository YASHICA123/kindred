#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const CSV_PATH = path.resolve(__dirname, '..', '50_indian_schools_dataset.csv')
const OUTPUT_PATH = path.resolve(__dirname, 'school_updates.sql')

function parseCsvLine(line) {
  const result = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i]
    const next = line[i + 1]

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"'
        i += 1
      } else {
        inQuotes = !inQuotes
      }
      continue
    }

    if (char === ',' && !inQuotes) {
      result.push(current)
      current = ''
      continue
    }

    current += char
  }

  result.push(current)
  return result
}

function parseCsv(text) {
  const lines = text.split(/\r?\n/).filter(Boolean)
  if (lines.length === 0) return []

  const headers = parseCsvLine(lines[0]).map((h) => h.trim())
  const rows = []

  for (let i = 1; i < lines.length; i += 1) {
    const fields = parseCsvLine(lines[i])
    if (fields.length === 1 && fields[0].trim() === '') continue

    const row = {}
    headers.forEach((key, idx) => {
      row[key] = (fields[idx] || '').trim()
    })
    rows.push(row)
  }

  return rows
}

function normalizeUrl(raw) {
  if (!raw) return ''
  const trimmed = raw.trim()
  if (!trimmed) return ''
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed
  return `https://${trimmed}`
}

function escapeSql(value) {
  return value.replace(/'/g, "''")
}

function uniqueStrings(values) {
  const seen = new Set()
  const result = []
  values.forEach((value) => {
    if (!value) return
    const normalized = value.trim()
    if (!normalized || seen.has(normalized)) return
    seen.add(normalized)
    result.push(normalized)
  })
  return result
}

function extractEmails(html) {
  const regex = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi
  return uniqueStrings(html.match(regex) || [])
}

function extractPhones(html) {
  const regex = /(\+?\d[\d\s().-]{7,}\d)/g
  const matches = html.match(regex) || []
  const cleaned = matches
    .map((m) => m.replace(/\s+/g, ' ').trim())
    .filter((m) => m.replace(/\D/g, '').length >= 9)
  return uniqueStrings(cleaned)
}

function extractAdmissionsUrl(html, baseUrl) {
  const linkRegex = /href=["']([^"']+)["']/gi
  let match
  while ((match = linkRegex.exec(html)) !== null) {
    const href = match[1]
    const lower = href.toLowerCase()
    if (lower.includes('admission') || lower.includes('apply')) {
      if (href.startsWith('http://') || href.startsWith('https://')) return href
      if (href.startsWith('//')) return `https:${href}`
      if (href.startsWith('/')) return baseUrl.replace(/\/$/, '') + href
      return baseUrl.replace(/\/$/, '') + '/' + href
    }
  }
  return ''
}

async function fetchWithTimeout(url, timeoutMs = 12000) {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; KindredSchoolBot/1.0)'
      }
    })
    if (!response.ok) return ''
    return await response.text()
  } catch (error) {
    return ''
  } finally {
    clearTimeout(id)
  }
}

async function collectSiteData(baseUrl) {
  const pages = [
    baseUrl,
    `${baseUrl.replace(/\/$/, '')}/contact-us`,
    `${baseUrl.replace(/\/$/, '')}/contact`,
    `${baseUrl.replace(/\/$/, '')}/admissions`,
    `${baseUrl.replace(/\/$/, '')}/admissions/`,
    `${baseUrl.replace(/\/$/, '')}/apply-now`,
    `${baseUrl.replace(/\/$/, '')}/apply`,
  ]

  const htmlChunks = []
  for (const page of pages) {
    const html = await fetchWithTimeout(page)
    if (html) htmlChunks.push(html)
  }

  const combined = htmlChunks.join('\n')
  if (!combined) return {
    email: '',
    phone: '',
    admissionsUrl: ''
  }

  const emails = extractEmails(combined)
  const phones = extractPhones(combined)
  const admissionsUrl = extractAdmissionsUrl(combined, baseUrl)

  return {
    email: emails[0] || '',
    phone: phones[0] || '',
    admissionsUrl
  }
}

async function main() {
  const csvText = fs.readFileSync(CSV_PATH, 'utf8')
  const rows = parseCsv(csvText)

  const sql = []
  sql.push('-- Auto-generated school updates. Review before running.\n')

  for (const row of rows) {
    const slug = row.slug
    const websiteRaw = row.contact_website
    const website = normalizeUrl(websiteRaw)

    if (!website) {
      continue
    }

    const data = await collectSiteData(website)

    const updates = []
    updates.push(`contact_website = '${escapeSql(website)}'`)

    if (data.phone) {
      updates.push(`contact_phone = COALESCE(NULLIF('${escapeSql(data.phone)}',''), contact_phone)`)
    }
    if (data.email) {
      updates.push(`contact_email = COALESCE(NULLIF('${escapeSql(data.email)}',''), contact_email)`)
    }

    if (updates.length > 0) {
      sql.push(`UPDATE schools SET ${updates.join(', ')} WHERE slug = '${escapeSql(slug)}';`)
    }

    sql.push(`DELETE FROM school_admissions WHERE school_id = (SELECT id FROM schools WHERE slug = '${escapeSql(slug)}' LIMIT 1);`)

    if (data.admissionsUrl) {
      sql.push(
        `INSERT INTO school_admissions (school_id, title, description, deadline, url) VALUES ((SELECT id FROM schools WHERE slug = '${escapeSql(slug)}' LIMIT 1), 'Admissions', 'Visit the admissions page for requirements and dates.', NULL, '${escapeSql(data.admissionsUrl)}');`
      )
    }

    sql.push(`DELETE FROM school_faqs WHERE school_id = (SELECT id FROM schools WHERE slug = '${escapeSql(slug)}' LIMIT 1);`)

    sql.push(
      `INSERT INTO school_faqs (school_id, question, answer, sort_order) VALUES\n` +
      `((SELECT id FROM schools WHERE slug = '${escapeSql(slug)}' LIMIT 1), 'How do I apply?', 'Start with the admissions page and follow the steps listed for registration and submission.', 1),\n` +
      `((SELECT id FROM schools WHERE slug = '${escapeSql(slug)}' LIMIT 1), 'What documents are required?', 'Typically a birth certificate and recent academic records are required. Please verify on the admissions page.', 2),\n` +
      `((SELECT id FROM schools WHERE slug = '${escapeSql(slug)}' LIMIT 1), 'Do you offer scholarships or financial aid?', 'Some schools offer scholarships or need-based aid. Contact the admissions office for details.', 3),\n` +
      `((SELECT id FROM schools WHERE slug = '${escapeSql(slug)}' LIMIT 1), 'Can we visit the campus before applying?', 'Most schools allow campus visits or open days. Contact admissions to schedule.', 4),\n` +
      `((SELECT id FROM schools WHERE slug = '${escapeSql(slug)}' LIMIT 1), 'Which grades have entry?', 'Entry classes vary by school and year. Confirm on the admissions page.', 5);`
    )

    sql.push('')
  }

  fs.writeFileSync(OUTPUT_PATH, sql.join('\n'), 'utf8')
  console.log(`SQL written to ${OUTPUT_PATH}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
