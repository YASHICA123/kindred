-- ============================================================================
-- CREATE AGE_GROUPS TABLE & MANY-TO-MANY WITH SCHOOLS
-- ============================================================================
-- Establishes a many-to-many relationship: Age Groups ↔ Schools
-- One age group (e.g., Preschool) can have many schools.
-- One school can serve multiple age groups (e.g., Preschool + Primary).
--
-- Run this in Supabase SQL Editor AFTER scripts 001-005.
-- ============================================================================

-- ============================================================================
-- 1. CREATE AGE_GROUPS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS age_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  age_range VARCHAR(50) NOT NULL,
  min_age NUMERIC(4,1),
  max_age NUMERIC(4,1),
  display_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_age_groups_slug ON age_groups(slug);

-- Enable RLS
ALTER TABLE age_groups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to age_groups" ON age_groups FOR SELECT USING (true);

-- ============================================================================
-- 2. SEED AGE GROUPS
-- ============================================================================
INSERT INTO age_groups (name, slug, age_range, min_age, max_age, display_order) VALUES
  ('Preschool',        'preschool',        '2-5 years',  2,   5,  1),
  ('Primary',          'primary',          '6-10 years', 6,   10, 2),
  ('Secondary',        'secondary',        '11-16 years',11,  16, 3),
  ('Senior Secondary', 'senior-secondary', '17-18 years',17,  18, 4),
  ('Post Secondary',   'post-secondary',   '18+ years',  18,  99, 5)
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- 3. CREATE JUNCTION TABLE: school_age_groups (many-to-many)
-- ============================================================================
CREATE TABLE IF NOT EXISTS school_age_groups (
  school_id BIGINT NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  age_group_id UUID NOT NULL REFERENCES age_groups(id) ON DELETE CASCADE,
  PRIMARY KEY (school_id, age_group_id)
);

-- Indexes for efficient lookups in both directions
CREATE INDEX IF NOT EXISTS idx_school_age_groups_school ON school_age_groups(school_id);
CREATE INDEX IF NOT EXISTS idx_school_age_groups_age_group ON school_age_groups(age_group_id);

-- Enable RLS
ALTER TABLE school_age_groups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to school_age_groups" ON school_age_groups FOR SELECT USING (true);

-- ============================================================================
-- 4. AUTO-POPULATE JUNCTION TABLE FROM EXISTING SCHOOL DATA
-- ============================================================================
-- Schools with type containing "Montessori" or "Pre" → Preschool
-- Schools with curriculum like "CBSE", "ICSE", etc. → Primary + Secondary
-- All schools with board → Primary + Secondary + Senior Secondary as default
-- Boarding schools → Secondary + Senior Secondary

-- Step 1: Assign all schools to Primary + Secondary (most schools cover these)
INSERT INTO school_age_groups (school_id, age_group_id)
SELECT s.id, ag.id
FROM schools s
CROSS JOIN age_groups ag
WHERE ag.slug IN ('primary', 'secondary')
ON CONFLICT DO NOTHING;

-- Step 2: Assign all schools to Senior Secondary as well
INSERT INTO school_age_groups (school_id, age_group_id)
SELECT s.id, ag.id
FROM schools s
CROSS JOIN age_groups ag
WHERE ag.slug = 'senior-secondary'
ON CONFLICT DO NOTHING;

-- Step 3: Schools with Montessori board → also Preschool
INSERT INTO school_age_groups (school_id, age_group_id)
SELECT s.id, ag.id
FROM schools s
JOIN boards b ON s.board_id = b.id
CROSS JOIN age_groups ag
WHERE b.slug = 'montessori'
  AND ag.slug = 'preschool'
ON CONFLICT DO NOTHING;

-- Step 4: Schools with type containing "Pre" or "Nursery" → Preschool
INSERT INTO school_age_groups (school_id, age_group_id)
SELECT s.id, ag.id
FROM schools s
CROSS JOIN age_groups ag
WHERE ag.slug = 'preschool'
  AND (s.type ILIKE '%pre%' OR s.type ILIKE '%nursery%' OR s.name ILIKE '%montessori%')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 5. UPDATE school_search_view TO INCLUDE AGE GROUPS
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
LEFT JOIN cities c ON s.city_id = c.id
LEFT JOIN states st ON s.state_id = st.id;

-- Enable RLS on view
ALTER VIEW school_search_view SET (security_barrier = on);

-- ============================================================================
-- 6. CREATE HELPER FUNCTION: Get schools by age group slug
-- ============================================================================
CREATE OR REPLACE FUNCTION get_schools_by_age_group(p_age_group_slug TEXT)
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
    st.name AS state_name,
    st.slug AS state_slug
  FROM schools s
  JOIN school_age_groups sag ON s.id = sag.school_id
  JOIN age_groups ag ON sag.age_group_id = ag.id
  LEFT JOIN boards b ON s.board_id = b.id
  LEFT JOIN cities c ON s.city_id = c.id
  LEFT JOIN states st ON s.state_id = st.id
  WHERE ag.slug = p_age_group_slug
  ORDER BY COALESCE(s.rating, 0) DESC, s.name ASC;
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================================================
-- 7. VERIFY
-- ============================================================================
-- Run these after to confirm:
-- SELECT COUNT(*) FROM age_groups;
-- SELECT ag.name, COUNT(sag.school_id) AS school_count FROM age_groups ag LEFT JOIN school_age_groups sag ON ag.id = sag.age_group_id GROUP BY ag.name ORDER BY ag.display_order;
-- SELECT s.name, ARRAY_AGG(ag.name ORDER BY ag.display_order) AS age_groups FROM schools s JOIN school_age_groups sag ON s.id = sag.school_id JOIN age_groups ag ON sag.age_group_id = ag.id GROUP BY s.name ORDER BY s.name;
