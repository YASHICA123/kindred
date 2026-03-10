-- ============================================================================
-- DATABASE SCHEMA MIGRATION FOR HIERARCHICAL SCHOOL SEARCH
-- ============================================================================
-- This migration normalizes the schools structure to support:
-- STATE → CITY → SCHOOL hierarchy
-- Optimized search filtering by state, city, board, type, fees range, rating
--
-- Run this in Supabase SQL editor. Review comments before executing on production.
-- ============================================================================

-- ============================================================================
-- 1. CREATE STATES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS states (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  code VARCHAR(2),
  country VARCHAR(50) DEFAULT 'India',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes on states
CREATE INDEX IF NOT EXISTS idx_states_slug ON states(slug);
CREATE INDEX IF NOT EXISTS idx_states_name ON states(name);

-- Enable RLS
ALTER TABLE states ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to states" ON states FOR SELECT USING (true);

-- ============================================================================
-- 2. CREATE CITIES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS cities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL,
  state_id UUID NOT NULL REFERENCES states(id) ON DELETE CASCADE,
  latitude NUMERIC(10, 8),
  longitude NUMERIC(11, 8),
  postal_code VARCHAR(10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Composite unique constraint (name + state)
ALTER TABLE cities ADD CONSTRAINT unique_city_per_state UNIQUE(name, state_id);

-- Indexes on cities
CREATE INDEX IF NOT EXISTS idx_cities_state_id ON cities(state_id);
CREATE INDEX IF NOT EXISTS idx_cities_slug ON cities(slug);
CREATE INDEX IF NOT EXISTS idx_cities_state_slug ON cities(state_id, slug);

-- Enable RLS
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to cities" ON cities FOR SELECT USING (true);

-- ============================================================================
-- 3. EXTEND SCHOOLS TABLE (IF NOT ALREADY PRESENT)
-- ============================================================================
-- This assumes you have a schools table. Add new columns/constraints as needed:

-- Add state_id and city_id if not present
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='schools' AND column_name='state_id') THEN
    ALTER TABLE schools ADD COLUMN state_id UUID REFERENCES states(id) ON DELETE SET NULL;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='schools' AND column_name='city_id') THEN
    ALTER TABLE schools ADD COLUMN city_id UUID REFERENCES cities(id) ON DELETE SET NULL;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='schools' AND column_name='slug') THEN
    ALTER TABLE schools ADD COLUMN slug VARCHAR(255) UNIQUE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='schools' AND column_name='board') THEN
    ALTER TABLE schools ADD COLUMN board VARCHAR(50);
    COMMENT ON COLUMN schools.board IS 'CBSE, ICSE, IB, Cambridge, State Board, Montessori, etc.';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='schools' AND column_name='type') THEN
    ALTER TABLE schools ADD COLUMN type VARCHAR(50);
    COMMENT ON COLUMN schools.type IS 'Day School, Boarding, Co-educational, Boys Only, Girls Only';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='schools' AND column_name='rating') THEN
    ALTER TABLE schools ADD COLUMN rating NUMERIC(3, 1) DEFAULT NULL;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='schools' AND column_name='fees_min') THEN
    ALTER TABLE schools ADD COLUMN fees_min NUMERIC(12, 2);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='schools' AND column_name='fees_max') THEN
    ALTER TABLE schools ADD COLUMN fees_max NUMERIC(12, 2);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='schools' AND column_name='address') THEN
    ALTER TABLE schools ADD COLUMN address TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='schools' AND column_name='phone') THEN
    ALTER TABLE schools ADD COLUMN phone VARCHAR(20);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='schools' AND column_name='website_url') THEN
    ALTER TABLE schools ADD COLUMN website_url VARCHAR(500);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='schools' AND column_name='tags') THEN
    ALTER TABLE schools ADD COLUMN tags TEXT[];
  END IF;
END $$;

-- Create indexes on schools for optimized search
CREATE INDEX IF NOT EXISTS idx_schools_state_id ON schools(state_id);
CREATE INDEX IF NOT EXISTS idx_schools_city_id ON schools(city_id);
CREATE INDEX IF NOT EXISTS idx_schools_state_city ON schools(state_id, city_id);
CREATE INDEX IF NOT EXISTS idx_schools_board ON schools(board);
CREATE INDEX IF NOT EXISTS idx_schools_type ON schools(type);
CREATE INDEX IF NOT EXISTS idx_schools_rating ON schools(rating DESC);
CREATE INDEX IF NOT EXISTS idx_schools_fees_min ON schools(fees_min);
CREATE INDEX IF NOT EXISTS idx_schools_fees_range ON schools(fees_min, fees_max);
CREATE INDEX IF NOT EXISTS idx_schools_slug ON schools(slug);

-- ============================================================================
-- 4. CREATE SCHOOL_SEARCH_VIEW
-- ============================================================================
-- Optimized view for fast hierarchical search with all joined data
DROP VIEW IF EXISTS school_search_view CASCADE;

CREATE VIEW school_search_view AS
SELECT
  s.id,
  s.name,
  s.slug,
  s.board,
  s.type,
  s.rating,
  s.fees_min,
  s.fees_max,
  s.address,
  s.phone,
  s.website_url,
  s.tags,
  s.cover_image,
  c.id AS city_id,
  c.name AS city_name,
  c.slug AS city_slug,
  c.postal_code,
  st.id AS state_id,
  st.name AS state_name,
  st.slug AS state_slug,
  st.code AS state_code
FROM schools s
LEFT JOIN cities c ON s.city_id = c.id
LEFT JOIN states st ON s.state_id = st.id;

-- Enable RLS on view
ALTER VIEW school_search_view SET (security_barrier = on);

-- ============================================================================
-- 5. CREATE RPC FUNCTION FOR ADVANCED SEARCH
-- ============================================================================
-- Optional but recommended: Use this function for complex filtered searches from the client

DROP FUNCTION IF EXISTS search_schools(
  p_state_slug TEXT,
  p_city_slug TEXT,
  p_board TEXT,
  p_type TEXT,
  p_fees_min NUMERIC,
  p_fees_max NUMERIC,
  p_sort_by TEXT,
  p_limit INT,
  p_offset INT
) CASCADE;

CREATE FUNCTION search_schools(
  p_state_slug TEXT DEFAULT NULL,
  p_city_slug TEXT DEFAULT NULL,
  p_board TEXT DEFAULT NULL,
  p_type TEXT DEFAULT NULL,
  p_fees_min NUMERIC DEFAULT NULL,
  p_fees_max NUMERIC DEFAULT NULL,
  p_sort_by TEXT DEFAULT 'rating_desc', -- 'rating_desc', 'fees_asc', 'name_asc'
  p_limit INT DEFAULT 20,
  p_offset INT DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  name VARCHAR,
  slug VARCHAR,
  board VARCHAR,
  type VARCHAR,
  rating NUMERIC,
  fees_min NUMERIC,
  fees_max NUMERIC,
  address TEXT,
  phone VARCHAR,
  website_url VARCHAR,
  tags TEXT[],
  cover_image TEXT,
  city_id UUID,
  city_name VARCHAR,
  city_slug VARCHAR,
  state_id UUID,
  state_name VARCHAR,
  state_slug VARCHAR,
  total_count INT
) AS $$
BEGIN
  RETURN QUERY
  WITH filtered_schools AS (
    SELECT
      s.id,
      s.name,
      s.slug,
      s.board,
      s.type,
      s.rating,
      s.fees_min,
      s.fees_max,
      s.address,
      s.phone,
      s.website_url,
      s.tags,
      s.cover_image,
      c.id,
      c.name,
      c.slug,
      st.id,
      st.name,
      st.slug,
      COUNT(*) OVER() AS total_count
    FROM schools s
    LEFT JOIN cities c ON s.city_id = c.id
    LEFT JOIN states st ON s.state_id = st.id
    WHERE
      (p_state_slug IS NULL OR st.slug = p_state_slug)
      AND (p_city_slug IS NULL OR c.slug = p_city_slug)
      AND (p_board IS NULL OR s.board ILIKE p_board)
      AND (p_type IS NULL OR s.type ILIKE p_type)
      AND (p_fees_min IS NULL OR s.fees_min >= p_fees_min)
      AND (p_fees_max IS NULL OR s.fees_max <= p_fees_max)
  )
  SELECT
    filtered_schools.id,
    filtered_schools.name,
    filtered_schools.slug,
    filtered_schools.board,
    filtered_schools.type,
    filtered_schools.rating,
    filtered_schools.fees_min,
    filtered_schools.fees_max,
    filtered_schools.address,
    filtered_schools.phone,
    filtered_schools.website_url,
    filtered_schools.tags,
    filtered_schools.cover_image,
    filtered_schools.id,
    filtered_schools.name,
    filtered_schools.slug,
    filtered_schools.id,
    filtered_schools.name,
    filtered_schools.slug,
    filtered_schools.total_count
  FROM filtered_schools
  ORDER BY
    CASE
      WHEN p_sort_by = 'rating_desc' THEN COALESCE(filtered_schools.rating, 0)
      ELSE COALESCE(filtered_schools.rating, 0)
    END DESC,
    CASE
      WHEN p_sort_by = 'fees_asc' THEN COALESCE(filtered_schools.fees_min, 0)
      ELSE 0
    END ASC,
    CASE
      WHEN p_sort_by = 'name_asc' THEN filtered_schools.name
      ELSE filtered_schools.name
    END ASC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================================================
-- 6. INSERT SAMPLE STATES DATA
-- ============================================================================
-- Uncomment and run to seed initial states:

/*
INSERT INTO states (name, slug, code) VALUES
  ('Andhra Pradesh', 'andhra-pradesh', 'AP'),
  ('Arunachal Pradesh', 'arunachal-pradesh', 'AR'),
  ('Assam', 'assam', 'AS'),
  ('Bihar', 'bihar', 'BR'),
  ('Chhattisgarh', 'chhattisgarh', 'CG'),
  ('Goa', 'goa', 'GA'),
  ('Gujarat', 'gujarat', 'GJ'),
  ('Haryana', 'haryana', 'HR'),
  ('Himachal Pradesh', 'himachal-pradesh', 'HP'),
  ('Jharkhand', 'jharkhand', 'JH'),
  ('Karnataka', 'karnataka', 'KA'),
  ('Kerala', 'kerala', 'KL'),
  ('Madhya Pradesh', 'madhya-pradesh', 'MP'),
  ('Maharashtra', 'maharashtra', 'MH'),
  ('Manipur', 'manipur', 'MN'),
  ('Meghalaya', 'meghalaya', 'ML'),
  ('Mizoram', 'mizoram', 'MZ'),
  ('Nagaland', 'nagaland', 'NL'),
  ('Odisha', 'odisha', 'OR'),
  ('Punjab', 'punjab', 'PB'),
  ('Rajasthan', 'rajasthan', 'RJ'),
  ('Sikkim', 'sikkim', 'SK'),
  ('Tamil Nadu', 'tamil-nadu', 'TN'),
  ('Telangana', 'telangana', 'TG'),
  ('Tripura', 'tripura', 'TR'),
  ('Uttar Pradesh', 'uttar-pradesh', 'UP'),
  ('Uttarakhand', 'uttarakhand', 'UT'),
  ('West Bengal', 'west-bengal', 'WB'),
  ('Chandigarh', 'chandigarh', 'CH'),
  ('Dadra and Nagar Haveli', 'dadra-nagar-haveli', 'DN'),
  ('Daman and Diu', 'daman-diu', 'DD'),
  ('Lakshadweep', 'lakshadweep', 'LD'),
  ('Delhi', 'delhi', 'DL'),
  ('Puducherry', 'puducherry', 'PY'),
  ('Ladakh', 'ladakh', 'LA')
ON CONFLICT DO NOTHING;
*/

-- ============================================================================
-- 7. DATA MIGRATION HELPER (If you have existing schools data)
-- ============================================================================
-- This migration script will attempt to backfill state_id and city_id
-- based on existing city/state values (if they're stored as text fields)

-- Assuming you have existing data with city names stored as strings:
/*
UPDATE schools s
SET city_id = c.id
FROM cities c
WHERE LOWER(s.city_text) = LOWER(c.name);

UPDATE schools s
SET state_id = st.id
FROM states st
WHERE LOWER(s.state_text) = LOWER(st.name);
*/

-- ============================================================================
-- COMMIT AND VERIFY
-- ============================================================================
-- To verify the schema was created correctly, run these queries:
/*
SELECT * FROM states ORDER BY name;
SELECT * FROM cities LIMIT 10;
SELECT * FROM school_search_view LIMIT 10;
*/

COMMENT ON TABLE states IS 'Indian states/territories for hierarchical school search';
COMMENT ON TABLE cities IS 'Indian cities, linked to states';
COMMENT ON VIEW school_search_view IS 'Optimized view for fast school search with state/city joins';
COMMENT ON FUNCTION search_schools IS 'RPC function for advanced school search with filtering and sorting';
