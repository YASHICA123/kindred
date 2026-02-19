#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' })

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function inspectSchema() {
  try {
    // Try to get table info using information_schema
    const { data, error } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type')
      .eq('table_name', 'schools')

    if (error) {
      console.log('Could not query information_schema:', error.message)
      
      // Try alternate approach: just select all and check columns
      const { data: schools, error: selectError } = await supabase
        .from('schools')
        .select('*')
        .limit(1)
      
      if (selectError) {
        console.error('❌ Error:', selectError.message)
      } else if (schools && schools.length === 0) {
        console.log('✅ Schools table exists but is empty')
      } else if (schools) {
        console.log('✅ Schools table exists with columns:')
        console.log(Object.keys(schools[0]).join(', '))
      }
    } else {
      console.log('✅ Schools table columns:')
      data.forEach(col => {
        console.log(`  - ${col.column_name} (${col.data_type})`)
      })
    }
  } catch (error) {
    console.error('Error:', error.message)
  }
}

inspectSchema()
