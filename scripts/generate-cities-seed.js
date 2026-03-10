#!/usr/bin/env node

/**
 * Generate SQL seed file from "Indian Cities Geo Data.csv"
 * 
 * Usage: node scripts/generate-cities-seed.js
 * Output: scripts/002_seed_states_cities.sql (overwrites)
 */

const fs = require('fs');
const path = require('path');

const CSV_PATH = path.join(__dirname, '..', 'Indian Cities Geo Data.csv');
const OUTPUT_PATH = path.join(__dirname, '002_seed_states_cities.sql');

// Map CSV state names to our slug format
const STATE_SLUG_MAP = {
  'Andaman and Nicobar Islands': 'andaman-nicobar',
  'Andhra Pradesh': 'andhra-pradesh',
  'Arunachal Pradesh': 'arunachal-pradesh',
  'Assam': 'assam',
  'Bihar': 'bihar',
  'Chhattisgarh': 'chhattisgarh',
  'Delhi': 'delhi',
  'Goa': 'goa',
  'Gujarat': 'gujarat',
  'Haryana': 'haryana',
  'Himachal Pradesh': 'himachal-pradesh',
  'Jammu and Kashmir': 'jammu-kashmir',
  'Jharkhand': 'jharkhand',
  'Karnataka': 'karnataka',
  'Kerala': 'kerala',
  'Ladakh': 'ladakh',
  'Lakshadweep': 'lakshadweep',
  'Madhya Pradesh': 'madhya-pradesh',
  'Maharashtra': 'maharashtra',
  'Manipur': 'manipur',
  'Meghalaya': 'meghalaya',
  'Mizoram': 'mizoram',
  'Nagaland': 'nagaland',
  'Odisha': 'odisha',
  'Puducherry': 'puducherry',
  'Punjab': 'punjab',
  'Rajasthan': 'rajasthan',
  'Sikkim': 'sikkim',
  'Tamil Nadu': 'tamil-nadu',
  'Telangana': 'telangana',
  'Tripura': 'tripura',
  'Uttar Pradesh': 'uttar-pradesh',
  'Uttarakhand': 'uttarakhand',
  'West Bengal': 'west-bengal',
};

const STATE_CODE_MAP = {
  'Andaman and Nicobar Islands': 'AN',
  'Andhra Pradesh': 'AP',
  'Arunachal Pradesh': 'AR',
  'Assam': 'AS',
  'Bihar': 'BR',
  'Chhattisgarh': 'CG',
  'Delhi': 'DL',
  'Goa': 'GA',
  'Gujarat': 'GJ',
  'Haryana': 'HR',
  'Himachal Pradesh': 'HP',
  'Jammu and Kashmir': 'JK',
  'Jharkhand': 'JH',
  'Karnataka': 'KA',
  'Kerala': 'KL',
  'Ladakh': 'LA',
  'Lakshadweep': 'LD',
  'Madhya Pradesh': 'MP',
  'Maharashtra': 'MH',
  'Manipur': 'MN',
  'Meghalaya': 'ML',
  'Mizoram': 'MZ',
  'Nagaland': 'NL',
  'Odisha': 'OR',
  'Puducherry': 'PY',
  'Punjab': 'PB',
  'Rajasthan': 'RJ',
  'Sikkim': 'SK',
  'Tamil Nadu': 'TN',
  'Telangana': 'TG',
  'Tripura': 'TR',
  'Uttar Pradesh': 'UP',
  'Uttarakhand': 'UT',
  'West Bengal': 'WB',
};

function parseCSV(content) {
  const lines = content.split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values = [];
    let current = '';
    let inQuotes = false;

    for (const ch of line) {
      if (ch === '"') { inQuotes = !inQuotes; }
      else if (ch === ',' && !inQuotes) { values.push(current.trim()); current = ''; }
      else { current += ch; }
    }
    values.push(current.trim());

    const row = {};
    headers.forEach((h, idx) => { row[h] = values[idx] || ''; });
    rows.push(row);
  }

  return rows;
}

function extractCityName(location) {
  // "Delhi Latitude and Longitude" -> "Delhi"
  return location.replace(/\s+Latitude and Longitude$/i, '').trim();
}

function toSlug(name) {
  return name
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function escapeSql(str) {
  return str.replace(/'/g, "''");
}

function main() {
  const csvContent = fs.readFileSync(CSV_PATH, 'utf-8');
  const rows = parseCSV(csvContent);

  console.log(`Read ${rows.length} rows from CSV`);

  // Group by state
  const stateMap = {};
  for (const row of rows) {
    const state = row.State;
    if (!state) continue;
    if (!stateMap[state]) stateMap[state] = [];

    const cityName = extractCityName(row.Location);
    if (!cityName) continue;

    // Deduplicate by city name within state
    const existing = stateMap[state].find(c => c.name.toLowerCase() === cityName.toLowerCase());
    if (!existing) {
      stateMap[state].push({
        name: cityName,
        slug: toSlug(cityName),
        latitude: row.Latitude || null,
        longitude: row.Longitude || null,
      });
    }
  }

  const stateNames = Object.keys(stateMap).sort();
  console.log(`Found ${stateNames.length} states`);

  let totalCities = 0;
  for (const s of stateNames) totalCities += stateMap[s].length;
  console.log(`Found ${totalCities} unique cities`);

  // Build SQL
  let sql = `-- ============================================================================
-- SEED DATA FOR ALL INDIAN STATES AND CITIES
-- ============================================================================
-- Auto-generated from "Indian Cities Geo Data.csv"
-- Contains ${stateNames.length} states/UTs and ${totalCities} cities with lat/lng coordinates
-- Run this AFTER running 001_create_normalized_schema.sql
-- ============================================================================

-- ============================================================================
-- 1. SEED ALL STATES
-- ============================================================================

INSERT INTO states (name, slug, code, country) VALUES\n`;

  const stateValues = stateNames.map(name => {
    const slug = STATE_SLUG_MAP[name] || toSlug(name);
    const code = STATE_CODE_MAP[name] || slug.substring(0, 2).toUpperCase();
    return `  ('${escapeSql(name)}', '${slug}', '${code}', 'India')`;
  });

  sql += stateValues.join(',\n');
  sql += `\nON CONFLICT (slug) DO NOTHING;\n`;

  // Insert cities grouped by state
  sql += `\n-- ============================================================================
-- 2. SEED ALL CITIES (${totalCities} cities across ${stateNames.length} states)
-- ============================================================================\n`;

  for (const stateName of stateNames) {
    const cities = stateMap[stateName];
    const stateSlug = STATE_SLUG_MAP[stateName] || toSlug(stateName);

    sql += `\n-- ${stateName} (${cities.length} cities)\n`;
    sql += `INSERT INTO cities (name, slug, state_id, latitude, longitude) VALUES\n`;

    const cityValues = cities.map(c => {
      const lat = c.latitude ? c.latitude : 'NULL';
      const lng = c.longitude ? c.longitude : 'NULL';
      return `  ('${escapeSql(c.name)}', '${c.slug}', (SELECT id FROM states WHERE slug = '${stateSlug}'), ${lat}, ${lng})`;
    });

    sql += cityValues.join(',\n');
    sql += `\nON CONFLICT (name, state_id) DO NOTHING;\n`;
  }

  sql += `\n-- ============================================================================
-- 3. VERIFY SEEDED DATA
-- ============================================================================
-- SELECT COUNT(*) AS state_count FROM states;
-- SELECT COUNT(*) AS city_count FROM cities;
-- SELECT st.name, COUNT(c.id) AS cities
--   FROM states st
--   LEFT JOIN cities c ON st.id = c.state_id
--   GROUP BY st.name ORDER BY cities DESC;
`;

  fs.writeFileSync(OUTPUT_PATH, sql, 'utf-8');
  console.log(`\nGenerated: ${OUTPUT_PATH}`);
  console.log(`SQL contains ${stateNames.length} states and ${totalCities} cities`);
}

main();
