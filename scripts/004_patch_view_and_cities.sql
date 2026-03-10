-- ============================================================================
-- PATCH: Fix and complete what failed in previous runs
-- ============================================================================
-- Run this in Supabase SQL Editor.
-- Safe to run multiple times (uses IF NOT EXISTS / ON CONFLICT / DROP IF EXISTS).
-- ============================================================================

-- ============================================================================
-- 1. RE-CREATE THE VIEW (failed before due to s.image → should be s.cover_image)
-- ============================================================================
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

ALTER VIEW school_search_view SET (security_barrier = on);

-- ============================================================================
-- 2. RE-CREATE THE RPC FUNCTION (also failed since it was after the view)
-- ============================================================================
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
  p_sort_by TEXT DEFAULT 'rating_desc',
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
      c.id AS c_id,
      c.name AS c_name,
      c.slug AS c_slug,
      st.id AS st_id,
      st.name AS st_name,
      st.slug AS st_slug,
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
    filtered_schools.c_id,
    filtered_schools.c_name,
    filtered_schools.c_slug,
    filtered_schools.st_id,
    filtered_schools.st_name,
    filtered_schools.st_slug,
    filtered_schools.total_count::INT
  FROM filtered_schools
  ORDER BY
    CASE WHEN p_sort_by = 'rating_desc' THEN COALESCE(filtered_schools.rating, 0) ELSE 0 END DESC,
    CASE WHEN p_sort_by = 'fees_asc' THEN COALESCE(filtered_schools.fees_min, 0) ELSE 0 END ASC,
    filtered_schools.name ASC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================================================
-- 3. ADD MISSING CITIES (Gurugram, Nainital, Bhubaneswar not in CSV)
-- ============================================================================
INSERT INTO cities (name, slug, state_id, latitude, longitude) VALUES
  ('Gurugram', 'gurugram', (SELECT id FROM states WHERE slug = 'haryana'), 28.4595, 77.0266),
  ('Nainital', 'nainital', (SELECT id FROM states WHERE slug = 'uttarakhand'), 29.3919, 79.4542),
  ('Bhubaneswar', 'bhubaneswar', (SELECT id FROM states WHERE slug = 'odisha'), 20.2961, 85.8245),
  ('New Delhi', 'new-delhi', (SELECT id FROM states WHERE slug = 'delhi'), 28.6358, 77.2245)
ON CONFLICT (name, state_id) DO NOTHING;

-- ============================================================================
-- 4. VERIFY
-- ============================================================================
-- SELECT * FROM school_search_view LIMIT 5;
-- SELECT * FROM search_schools(NULL, NULL, NULL, NULL, NULL, NULL, 'rating_desc', 5, 0);
