-- ============================================================================
-- CREATE SCHOOL_TYPES TABLE & MANY-TO-MANY WITH SCHOOLS
-- ============================================================================
-- Establishes a many-to-many relationship: School Types ↔ Schools
-- One school type (e.g., Co-educational) can have many schools.
-- One school can have multiple types (e.g., Co-educational + Day School).
--
-- Run this in Supabase SQL Editor AFTER scripts 001-007.
-- ============================================================================

-- ============================================================================
-- 1. CREATE SCHOOL_TYPES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS school_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_school_types_slug ON school_types(slug);

-- Enable RLS
ALTER TABLE school_types ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to school_types" ON school_types FOR SELECT USING (true);

-- ============================================================================
-- 2. SEED SCHOOL TYPES
-- ============================================================================
INSERT INTO school_types (name, slug, description, display_order) VALUES
  ('Co-educational', 'co-educational', 'Schools that admit both boys and girls',                    1),
  ('Boys Only',      'boys-only',      'Schools exclusively for boys',                              2),
  ('Girls Only',     'girls-only',     'Schools exclusively for girls',                             3),
  ('Day School',     'day-school',     'Schools where students attend during the day and return home', 4),
  ('Boarding',       'boarding',       'Residential schools where students live on campus',          5)
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- 3. CREATE JUNCTION TABLE: school_school_types (many-to-many)
-- ============================================================================
CREATE TABLE IF NOT EXISTS school_school_types (
  school_id BIGINT NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  school_type_id UUID NOT NULL REFERENCES school_types(id) ON DELETE CASCADE,
  PRIMARY KEY (school_id, school_type_id)
);

-- Indexes for efficient lookups in both directions
CREATE INDEX IF NOT EXISTS idx_school_school_types_school ON school_school_types(school_id);
CREATE INDEX IF NOT EXISTS idx_school_school_types_type ON school_school_types(school_type_id);

-- Enable RLS
ALTER TABLE school_school_types ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to school_school_types" ON school_school_types FOR SELECT USING (true);

-- ============================================================================
-- 4. AUTO-POPULATE JUNCTION TABLE FROM EXISTING SCHOOL DATA
-- ============================================================================

-- Step 1: Schools with type = 'Day' or 'Day, Boarding' → Day School
INSERT INTO school_school_types (school_id, school_type_id)
SELECT s.id, st.id
FROM schools s
CROSS JOIN school_types st
WHERE st.slug = 'day-school'
  AND (s.type ILIKE '%day%')
ON CONFLICT DO NOTHING;

-- Step 2: Schools with type = 'Boarding' or 'Day, Boarding' → Boarding
INSERT INTO school_school_types (school_id, school_type_id)
SELECT s.id, st.id
FROM schools s
CROSS JOIN school_types st
WHERE st.slug = 'boarding'
  AND (s.type ILIKE '%boarding%')
ON CONFLICT DO NOTHING;

-- Step 3: Schools with name containing 'Boys' → Boys Only
INSERT INTO school_school_types (school_id, school_type_id)
SELECT s.id, st.id
FROM schools s
CROSS JOIN school_types st
WHERE st.slug = 'boys-only'
  AND (s.name ILIKE '%boys%' OR s.type ILIKE '%boys%')
ON CONFLICT DO NOTHING;

-- Step 4: Schools with name containing 'Girls' → Girls Only
INSERT INTO school_school_types (school_id, school_type_id)
SELECT s.id, st.id
FROM schools s
CROSS JOIN school_types st
WHERE st.slug = 'girls-only'
  AND (s.name ILIKE '%girls%' OR s.type ILIKE '%girls%')
ON CONFLICT DO NOTHING;

-- Step 5: All remaining schools (not boys-only or girls-only) → Co-educational
INSERT INTO school_school_types (school_id, school_type_id)
SELECT s.id, st.id
FROM schools s
CROSS JOIN school_types st
WHERE st.slug = 'co-educational'
  AND s.id NOT IN (
    SELECT sst.school_id FROM school_school_types sst
    JOIN school_types st2 ON sst.school_type_id = st2.id
    WHERE st2.slug IN ('boys-only', 'girls-only')
  )
ON CONFLICT DO NOTHING;

-- Step 6: Schools without any type assignment → default to Co-educational + Day School
INSERT INTO school_school_types (school_id, school_type_id)
SELECT s.id, st.id
FROM schools s
CROSS JOIN school_types st
WHERE st.slug IN ('co-educational', 'day-school')
  AND s.id NOT IN (SELECT school_id FROM school_school_types)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 5. UPDATE school_search_view (preserve existing joins)
-- ============================================================================
DROP VIEW IF EXISTS school_search_view CASCADE;

CREATE VIEW school_search_view AS
SELECT
  s.id,
  s.name,
  s.slug,
  s.board,
  s.curriculum,
  s.type,
  s.rating,
  s.fees_min,
  s.fees_max,
  s.address,
  s.phone,
  s.website_url,
  s.tags,
  s.cover_image,
  s.board_id,
  b.name AS board_name,
  b.slug AS board_slug,
  b.full_name AS board_full_name,
  s.fee_range_id,
  fr.name AS fee_range_name,
  fr.slug AS fee_range_slug,
  c.id AS city_id,
  c.name AS city_name,
  c.slug AS city_slug,
  c.postal_code,
  st.id AS state_id,
  st.name AS state_name,
  st.slug AS state_slug,
  st.code AS state_code
FROM schools s
LEFT JOIN boards b ON s.board_id = b.id
LEFT JOIN fee_ranges fr ON s.fee_range_id = fr.id
LEFT JOIN cities c ON s.city_id = c.id
LEFT JOIN states st ON s.state_id = st.id;

-- Enable RLS on view
ALTER VIEW school_search_view SET (security_barrier = on);

-- ============================================================================
-- 6. CREATE HELPER FUNCTION: Get schools by school type slug
-- ============================================================================
CREATE OR REPLACE FUNCTION get_schools_by_school_type(p_type_slug TEXT)
RETURNS TABLE (
  id BIGINT,
  name VARCHAR,
  slug VARCHAR,
  board VARCHAR,
  board_name VARCHAR,
  type VARCHAR,
  rating NUMERIC,
  fees_min NUMERIC,
  fees_max NUMERIC,
  address TEXT,
  cover_image TEXT,
  city_name VARCHAR,
  city_slug VARCHAR,
  state_name VARCHAR,
  state_slug VARCHAR
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    s.id,
    s.name,
    s.slug,
    s.board,
    b.name AS board_name,
    s.type,
    s.rating,
    s.fees_min,
    s.fees_max,
    s.address,
    s.cover_image,
    c.name AS city_name,
    c.slug AS city_slug,
    sta.name AS state_name,
    sta.slug AS state_slug
  FROM schools s
  JOIN school_school_types sst ON s.id = sst.school_id
  JOIN school_types sty ON sst.school_type_id = sty.id
  LEFT JOIN boards b ON s.board_id = b.id
  LEFT JOIN cities c ON s.city_id = c.id
  LEFT JOIN states sta ON s.state_id = sta.id
  WHERE sty.slug = p_type_slug
  ORDER BY COALESCE(s.rating, 0) DESC, s.name ASC;
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================================================
-- 7. VERIFY
-- ============================================================================
-- Run these after to confirm:
-- SELECT * FROM school_types ORDER BY display_order;
-- SELECT st.name, COUNT(sst.school_id) AS school_count FROM school_types st LEFT JOIN school_school_types sst ON st.id = sst.school_type_id GROUP BY st.name, st.display_order ORDER BY st.display_order;
-- SELECT s.name, ARRAY_AGG(st.name ORDER BY st.display_order) AS types FROM schools s JOIN school_school_types sst ON s.id = sst.school_id JOIN school_types st ON sst.school_type_id = st.id GROUP BY s.name ORDER BY s.name;
