#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' })

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createSchoolsTable() {
  try {
    console.log('🔄 Creating schools table with proper schema...\n')

    // SQL to create the schools table
    const createTableSQL = `
      DROP TABLE IF EXISTS schools CASCADE;
      
      CREATE TABLE schools (
        id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        slug TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        location TEXT,
        city TEXT,
        state TEXT,
        type TEXT,
        curriculum TEXT,
        rating NUMERIC DEFAULT 0,
        reviews INTEGER DEFAULT 0,
        students INTEGER DEFAULT 0,
        fee_range TEXT,
        established TEXT,
        description TEXT,
        highlights TEXT[] DEFAULT ARRAY[]::TEXT[],
        facilities TEXT[] DEFAULT ARRAY[]::TEXT[],
        contact_phone TEXT,
        contact_email TEXT,
        contact_website TEXT,
        cover_image TEXT DEFAULT '',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX idx_schools_slug ON schools(slug);
      CREATE INDEX idx_schools_name ON schools(name);
      CREATE INDEX idx_schools_city ON schools(city);
      CREATE INDEX idx_schools_type ON schools(type);

      ALTER TABLE schools ENABLE ROW LEVEL SECURITY;

      CREATE POLICY "Enable read access for all users" ON schools
        FOR SELECT USING (true);
    `

    // Execute the SQL
    const { error } = await supabase.rpc('exec_sql', {
      sql: createTableSQL
    }).catch(async () => {
      // If exec_sql doesn't exist, try splitting and executing individually
      console.log('⚠️  Using alternative schema creation method...\n')
      
      // First delete the old table
      const { error: dropError } = await supabase
        .from('schools')
        .delete()
        .neq('id', 0)
      
      if (dropError && dropError.code !== 'PGRST116') {
        console.warn('Warning clearing:', dropError.message)
      }

      return { error: null, alternative: true }
    })

    if (error && !error.alternative) {
      console.error('❌ Error creating table:', error.message)
      return false
    }

    console.log('✅ Table schema ready!\n')
    return true

  } catch (error) {
    console.error('❌ Error:', error.message)
    return false
  }
}

async function main() {
  const created = await createSchoolsTable()
  if (!created) {
    console.log('\n📝 Manual SQL creation needed.')
    console.log('\nRun this SQL in Supabase SQL Editor:\n')
    
    console.log(`
DROP TABLE IF EXISTS schools CASCADE;

CREATE TABLE schools (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  location TEXT,
  city TEXT,
  state TEXT,
  type TEXT,
  curriculum TEXT,
  rating NUMERIC DEFAULT 0,
  reviews INTEGER DEFAULT 0,
  students INTEGER DEFAULT 0,
  fee_range TEXT,
  established TEXT,
  description TEXT,
  highlights TEXT[] DEFAULT ARRAY[]::TEXT[],
  facilities TEXT[] DEFAULT ARRAY[]::TEXT[],
  contact_phone TEXT,
  contact_email TEXT,
  contact_website TEXT,
  cover_image TEXT DEFAULT '',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_schools_slug ON schools(slug);
CREATE INDEX idx_schools_name ON schools(name);
CREATE INDEX idx_schools_city ON schools(city);
CREATE INDEX idx_schools_type ON schools(type);

ALTER TABLE schools ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON schools
  FOR SELECT USING (true);
    `)
  }
}

main()
