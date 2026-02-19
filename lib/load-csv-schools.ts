'use server'

import fs from 'fs'
import path from 'path'
import { parse } from 'csv-parse/sync'

/**
 * Load schools from local CSV file (used as fallback when Supabase is unreachable)
 */
export async function loadSchoolsFromCSV() {
  try {
    const csvPath = path.join(process.cwd(), '50_indian_schools_dataset.csv')
    const fileContent = fs.readFileSync(csvPath, 'utf-8')
    
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      delimiter: ',',
    })
    
    return records.map((record: any) => ({
      id: records.indexOf(record) + 1,
      slug: record.slug || record.Name?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      name: record.Name,
      location: record.location,
      city: record.city,
      state: record.city, // Use city as state if state not available
      type: record.type,
      curriculum: record.curriculum,
      rating: record.Ratings ? parseFloat(record.Ratings) : 0,
      reviews: record.reviews ? parseInt(record.reviews) : 0,
      students: record.students ? parseInt(record.students) : 0,
      feeRange: record.fee_range || '',
      established: record.established || '',
      description: record.description,
      highlights: record.highlights ? record.highlights.split('|').map((h: string) => h.trim()) : [],
      facilities: record.facilities ? record.facilities.split('|').map((f: string) => f.trim()) : [],
      contact: {
        phone: record.contact_phone,
        email: record.contact_email,
        website: record.contact_website,
      },
      image: '', // No images in CSV
    }))
  } catch (error) {
    console.error('Error loading schools from CSV:', error)
    return []
  }
}
