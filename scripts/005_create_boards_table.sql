-- ============================================================================
-- CREATE BOARDS TABLE & NORMALIZE BOARD → SCHOOL RELATIONSHIP
-- ============================================================================
-- Establishes a one-to-many relationship: Board → Schools
-- One board can have many schools; each school belongs to one board.
--
-- NOTE: Schools with multiple curricula (e.g., "CBSE, IB") will be assigned
-- to the FIRST listed board as the primary board. The full curriculum string
-- is preserved in the schools.curriculum column for display.
--
-- Run this in Supabase SQL Editor AFTER scripts 001-004.
-- ============================================================================

-- ============================================================================
-- 1. CREATE BOARDS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS boards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  full_name VARCHAR(255),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_boards_slug ON boards(slug);
CREATE INDEX IF NOT EXISTS idx_boards_name ON boards(name);

-- Enable RLS
ALTER TABLE boards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to boards" ON boards FOR SELECT USING (true);

-- ============================================================================
-- 2. SEED BOARDS DATA
-- ============================================================================
INSERT INTO boards (name, slug, full_name, description) VALUES
  ('CBSE', 'cbse', 'Central Board of Secondary Education', 'National board under the Government of India, one of the most popular boards in India.'),
  ('ICSE', 'icse', 'Indian Certificate of Secondary Education', 'Board managed by CISCE, known for its comprehensive curriculum.'),
  ('ISC', 'isc', 'Indian School Certificate', 'Higher secondary certification by CISCE for classes 11-12.'),
  ('IB', 'ib', 'International Baccalaureate', 'Global education framework recognized worldwide for holistic learning.'),
  ('IGCSE', 'igcse', 'International General Certificate of Secondary Education', 'Cambridge international curriculum for students aged 14-16.'),
  ('State Board', 'state-board', 'State Board of Education', 'Curriculum managed by individual state governments.'),
  ('Cambridge', 'cambridge', 'Cambridge Assessment International Education', 'International curriculum by Cambridge University.'),
  ('Montessori', 'montessori', 'Montessori Method', 'Child-centered educational approach based on Maria Montessori''s philosophy.')
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- 3. ADD board_id FOREIGN KEY TO SCHOOLS TABLE
-- ============================================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='schools' AND column_name='board_id') THEN
    ALTER TABLE schools ADD COLUMN board_id UUID REFERENCES boards(id) ON DELETE SET NULL;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_schools_board_id ON schools(board_id);

-- ============================================================================
-- 4. POPULATE board_id FROM EXISTING curriculum/board DATA
-- ============================================================================
-- Maps each school to a board based on the FIRST board found in curriculum.
-- Priority: exact board column match first, then first token in curriculum.

-- Step 1: Map from the board column if it exists and is populated
UPDATE schools s
SET board_id = b.id
FROM boards b
WHERE s.board IS NOT NULL
  AND s.board_id IS NULL
  AND UPPER(TRIM(s.board)) = UPPER(b.name);

-- Step 2: Map from curriculum field using the first listed board
-- e.g., "ICSE, ISC" → maps to ICSE; "CBSE, IB" → maps to CBSE
UPDATE schools s
SET board_id = b.id
FROM boards b
WHERE s.board_id IS NULL
  AND s.curriculum IS NOT NULL
  AND UPPER(TRIM(SPLIT_PART(s.curriculum, ',', 1))) = UPPER(b.name);

-- ============================================================================
-- 5. UPDATE school_search_view TO INCLUDE BOARD JOIN
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
-- 6. UPDATE search_schools RPC TO USE board_id JOIN
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
  board_name VARCHAR,
  board_slug VARCHAR,
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
      b.name AS board_name,
      b.slug AS board_slug,
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
      st.id AS state_id,
      st.name AS state_name,
      st.slug AS state_slug,
      COUNT(*) OVER() AS total_count
    FROM schools s
    LEFT JOIN boards b ON s.board_id = b.id
    LEFT JOIN cities c ON s.city_id = c.id
    LEFT JOIN states st ON s.state_id = st.id
    WHERE
      (p_state_slug IS NULL OR st.slug = p_state_slug)
      AND (p_city_slug IS NULL OR c.slug = p_city_slug)
      AND (p_board IS NULL OR b.slug = p_board OR b.name ILIKE p_board)
      AND (p_type IS NULL OR s.type ILIKE p_type)
      AND (p_fees_min IS NULL OR s.fees_min >= p_fees_min)
      AND (p_fees_max IS NULL OR s.fees_max <= p_fees_max)
  )
  SELECT
    fs.id,
    fs.name,
    fs.slug,
    fs.board,
    fs.board_name,
    fs.board_slug,
    fs.type,
    fs.rating,
    fs.fees_min,
    fs.fees_max,
    fs.address,
    fs.phone,
    fs.website_url,
    fs.tags,
    fs.cover_image,
    fs.city_id,
    fs.city_name,
    fs.city_slug,
    fs.state_id,
    fs.state_name,
    fs.state_slug,
    fs.total_count::INT
  FROM filtered_schools fs
  ORDER BY
    CASE WHEN p_sort_by = 'rating_desc' THEN COALESCE(fs.rating, 0) ELSE 0 END DESC,
    CASE WHEN p_sort_by = 'fees_asc' THEN COALESCE(fs.fees_min, 0) ELSE 0 END ASC,
    CASE WHEN p_sort_by = 'name_asc' THEN fs.name ELSE fs.name END ASC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================================================
-- 7. VERIFY
-- ============================================================================
-- Run these after to confirm:
-- SELECT COUNT(*) FROM boards;
-- SELECT b.name, COUNT(s.id) AS school_count FROM boards b LEFT JOIN schools s ON s.board_id = b.id GROUP BY b.name ORDER BY school_count DESC;
-- SELECT s.name, b.name AS board FROM schools s LEFT JOIN boards b ON s.board_id = b.id ORDER BY s.name;
