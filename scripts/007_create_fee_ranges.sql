-- ============================================================================
-- CREATE FEE_RANGES TABLE & ONE-TO-MANY WITH SCHOOLS
-- ============================================================================
-- Establishes a one-to-many relationship: Fee Range → Schools
-- One fee range (e.g., "Under ₹50,000") can have many schools.
-- Each school belongs to exactly one fee range.
--
-- Run this in Supabase SQL Editor AFTER scripts 001-006.
-- ============================================================================

-- ============================================================================
-- 1. CREATE FEE_RANGES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS fee_ranges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  min_fee NUMERIC(12, 2),
  max_fee NUMERIC(12, 2),
  display_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_fee_ranges_slug ON fee_ranges(slug);

-- Enable RLS
ALTER TABLE fee_ranges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to fee_ranges" ON fee_ranges FOR SELECT USING (true);

-- ============================================================================
-- 2. SEED FEE RANGES
-- ============================================================================
INSERT INTO fee_ranges (name, slug, min_fee, max_fee, display_order) VALUES
  ('Under ₹50,000',       'under-50k',    0,      50000,    1),
  ('₹50,000 - ₹1 Lakh',  '50k-1lakh',    50000,  100000,   2),
  ('₹1 - 2 Lakh',         '1-2lakh',      100000, 200000,   3),
  ('₹2 - 5 Lakh',         '2-5lakh',      200000, 500000,   4),
  ('Above ₹5 Lakh',       'above-5lakh',  500000, NULL,     5)
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- 3. ADD fee_range_id FK TO SCHOOLS TABLE
-- ============================================================================
ALTER TABLE schools ADD COLUMN IF NOT EXISTS fee_range_id UUID REFERENCES fee_ranges(id);
CREATE INDEX IF NOT EXISTS idx_schools_fee_range_id ON schools(fee_range_id);

-- ============================================================================
-- 4. AUTO-ASSIGN SCHOOLS TO FEE RANGES BASED ON EXISTING fees_min
-- ============================================================================
-- Schools with fees_min < 50000 → Under ₹50,000
UPDATE schools SET fee_range_id = (SELECT id FROM fee_ranges WHERE slug = 'under-50k')
WHERE fees_min IS NOT NULL AND fees_min < 50000;

-- Schools with fees_min >= 50000 AND fees_min < 100000 → ₹50,000 - ₹1 Lakh
UPDATE schools SET fee_range_id = (SELECT id FROM fee_ranges WHERE slug = '50k-1lakh')
WHERE fees_min IS NOT NULL AND fees_min >= 50000 AND fees_min < 100000;

-- Schools with fees_min >= 100000 AND fees_min < 200000 → ₹1 - 2 Lakh
UPDATE schools SET fee_range_id = (SELECT id FROM fee_ranges WHERE slug = '1-2lakh')
WHERE fees_min IS NOT NULL AND fees_min >= 100000 AND fees_min < 200000;

-- Schools with fees_min >= 200000 AND fees_min < 500000 → ₹2 - 5 Lakh
UPDATE schools SET fee_range_id = (SELECT id FROM fee_ranges WHERE slug = '2-5lakh')
WHERE fees_min IS NOT NULL AND fees_min >= 200000 AND fees_min < 500000;

-- Schools with fees_min >= 500000 → Above ₹5 Lakh
UPDATE schools SET fee_range_id = (SELECT id FROM fee_ranges WHERE slug = 'above-5lakh')
WHERE fees_min IS NOT NULL AND fees_min >= 500000;

-- Schools with NULL fees_min but have fee_range text → try to match
UPDATE schools SET fee_range_id = (SELECT id FROM fee_ranges WHERE slug = 'under-50k')
WHERE fee_range_id IS NULL AND fee_range ILIKE '%under%50%';

UPDATE schools SET fee_range_id = (SELECT id FROM fee_ranges WHERE slug = '50k-1lakh')
WHERE fee_range_id IS NULL AND (fee_range ILIKE '%50%1 lakh%' OR fee_range ILIKE '%50%1lakh%');

UPDATE schools SET fee_range_id = (SELECT id FROM fee_ranges WHERE slug = '1-2lakh')
WHERE fee_range_id IS NULL AND (fee_range ILIKE '%1%2 lakh%' OR fee_range ILIKE '%1%2lakh%');

UPDATE schools SET fee_range_id = (SELECT id FROM fee_ranges WHERE slug = '2-5lakh')
WHERE fee_range_id IS NULL AND (fee_range ILIKE '%2%5 lakh%' OR fee_range ILIKE '%2%5lakh%');

UPDATE schools SET fee_range_id = (SELECT id FROM fee_ranges WHERE slug = 'above-5lakh')
WHERE fee_range_id IS NULL AND fee_range ILIKE '%above%5%';

-- Remaining schools without fees → assign to the most common range (₹1 - 2 Lakh)
UPDATE schools SET fee_range_id = (SELECT id FROM fee_ranges WHERE slug = '1-2lakh')
WHERE fee_range_id IS NULL;

-- ============================================================================
-- 5. UPDATE school_search_view TO INCLUDE FEE RANGE
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
-- 6. VERIFY
-- ============================================================================
-- Run these after to confirm:
-- SELECT * FROM fee_ranges ORDER BY display_order;
-- SELECT fr.name, COUNT(s.id) AS school_count FROM fee_ranges fr LEFT JOIN schools s ON s.fee_range_id = fr.id GROUP BY fr.name, fr.display_order ORDER BY fr.display_order;
