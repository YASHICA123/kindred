/**
 * Bulk import schools from CSV to Strapi
 * Usage: STRAPI_URL=https://your-render-url.onrender.com STRAPI_API_TOKEN=your_token node scripts/import-schools-csv.js scripts/50_indian_schools_dataset.csv
 */

const fs = require('fs');
const path = require('path');

// Configuration from environment variables
const STRAPI_URL = process.env.STRAPI_URL;
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

if (!STRAPI_URL || !STRAPI_API_TOKEN) {
  console.error('❌ Required environment variables not set:');
  console.error('   STRAPI_URL - Your Render/Strapi URL (e.g., https://your-app.onrender.com)');
  console.error('   STRAPI_API_TOKEN - Your Strapi API token');
  console.error('\nUsage:');
  console.error('   STRAPI_URL=https://your-url.onrender.com STRAPI_API_TOKEN=your_token node scripts/import-schools-csv.js <csv-file>');
  process.exit(1);
}

// Simple CSV parser
function parseCSV(csvContent) {
  const lines = csvContent.split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Handle quoted values with commas
    const values = [];
    let currentValue = '';
    let insideQuotes = false;

    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === ',' && !insideQuotes) {
        values.push(currentValue.trim().replace(/^"|"$/g, ''));
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    values.push(currentValue.trim().replace(/^"|"$/g, ''));

    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    rows.push(row);
  }

  return rows;
}

// Transform CSV row to Strapi format - MINIMAL FIELDS ONLY
function transformSchool(row) {
  // Build school data with only basic fields that Strapi likely accepts
  const schoolData = {};
  
  if (row.Name) schoolData.Name = row.Name;
  if (row.slug) schoolData.slug = row.slug;
  else if (row.Name) schoolData.slug = row.Name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
  
  if (row.location) schoolData.location = row.location;
  if (row.city) schoolData.city = row.city;
  if (row.type) schoolData.type = row.type;
  if (row.curriculum) schoolData.curriculum = row.curriculum;
  
  // Only add numeric values if they're present and valid
  if (row.Ratings && row.Ratings.trim()) {
    const ratings = parseFloat(row.Ratings);
    if (!isNaN(ratings)) schoolData.Ratings = ratings;
  }
  if (row.reviews && row.reviews.trim()) {
    const reviews = parseInt(row.reviews);
    if (!isNaN(reviews)) schoolData.reviews = reviews;
  }
  if (row.students && row.students.trim()) {
    const students = parseInt(row.students);
    if (!isNaN(students)) schoolData.students = students;
  }
  
  if (row.fee_range) schoolData.fee_range = row.fee_range;
  if (row.established) schoolData.established = row.established;
  
  // Note: highlights, facilities, description, and contact fields are excluded
  // as they're not in the Strapi schema

  return schoolData;
}

// Create school via Strapi API
async function createSchool(schoolData) {
  try {
    const payload = { data: schoolData };

    const response = await fetch(`${STRAPI_URL}/api/schools`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMsg = errorData?.error?.message || errorData?.message || `HTTP ${response.status}`;
      throw new Error(errorMsg);
    }

    return response.json();
  } catch (error) {
    throw error;
  }
}

// Bulk import with rate limiting
async function bulkImport(schools, batchDelay = 500) {
  const total = schools.length;
  let successful = 0;
  let failed = 0;
  const errors = [];

  console.log(`\n📚 Starting bulk import of ${total} schools...`);
  console.log(`🔗 Strapi URL: ${STRAPI_URL}`);
  console.log(`─────────────────────────────────\n`);

  for (let i = 0; i < schools.length; i++) {
    try {
      const schoolData = transformSchool(schools[i]);

      // Validate required fields
      if (!schoolData.Name || !schoolData.slug) {
        throw new Error('Missing required fields: Name or slug');
      }

      await createSchool(schoolData);
      successful++;

      const progress = ((i + 1) / total * 100).toFixed(1);
      console.log(`✅ [${i + 1}/${total}] ${schoolData.Name} (${progress}%)`);

      // Rate limiting to avoid overwhelming the server
      if (i < schools.length - 1) {
        await new Promise(resolve => setTimeout(resolve, batchDelay));
      }
    } catch (error) {
      failed++;
      const schoolName = schools[i].Name || `Row ${i + 1}`;
      const errorMsg = `❌ [${i + 1}/${total}] ${schoolName}: ${error.message}`;
      console.log(errorMsg);
      errors.push({ index: i, school: schoolName, error: error.message });
    }
  }

  console.log(`\n─────────────────────────────────`);
  console.log(`📊 Import Summary:`);
  console.log(`   ✅ Successful: ${successful}/${total}`);
  console.log(`   ❌ Failed: ${failed}/${total}`);

  if (errors.length > 0 && errors.length <= 10) {
    console.log(`\n⚠️  Failed Schools:`);
    errors.forEach(e => {
      console.log(`   - ${e.school}: ${e.error}`);
    });
  } else if (errors.length > 10) {
    console.log(`\n⚠️  First 10 Failed Schools:`);
    errors.slice(0, 10).forEach(e => {
      console.log(`   - ${e.school}: ${e.error}`);
    });
    console.log(`   ... and ${errors.length - 10} more`);
  }

  return { successful, failed, total };
}

// Main
async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error('Usage: node scripts/import-schools-csv.js <path-to-csv-file>');
    console.error('Example: node scripts/import-schools-csv.js 50_indian_schools_dataset.csv');
    process.exit(1);
  }

  const filePath = args[0];
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
  }

  try {
    const csvContent = fs.readFileSync(filePath, 'utf8');
    const schools = parseCSV(csvContent);

    if (schools.length === 0) {
      console.error('No schools found in CSV file');
      process.exit(1);
    }

    console.log(`\n📄 CSV file loaded: ${schools.length} schools found`);
    await bulkImport(schools);
  } catch (error) {
    console.error('Fatal error:', error.message);
    process.exit(1);
  }
}

main();
