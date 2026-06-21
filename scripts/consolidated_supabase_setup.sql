-- ============================================================================
-- CONSOLIDATED SUPABASE DATABASE SETUP MIGRATION
-- ============================================================================
-- Run this in the Supabase SQL Editor (or via psql) as an admin.
--
-- This script sets up the entire database structure, RLS security policies,
-- reference tables, storage buckets, views, and RPC search functions.
--
-- BEFORE RUNNING: Ensure your database is clean, or run this to safely create/patch.
-- ============================================================================

-- Enable pgcrypto for generating random UUIDs
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ----------------------------------------------------------------------------
-- 1. HIERARCHICAL TABLES: STATES & CITIES
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS states (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  code VARCHAR(2),
  country VARCHAR(50) DEFAULT 'India',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_states_slug ON states(slug);
CREATE INDEX IF NOT EXISTS idx_states_name ON states(name);

ALTER TABLE states ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'states' AND policyname = 'Allow public read access to states') THEN
    CREATE POLICY "Allow public read access to states" ON states FOR SELECT USING (true);
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS cities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL,
  state_id UUID NOT NULL REFERENCES states(id) ON DELETE CASCADE,
  latitude NUMERIC(10, 8),
  longitude NUMERIC(11, 8),
  postal_code VARCHAR(10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_city_per_state UNIQUE(name, state_id)
);

CREATE INDEX IF NOT EXISTS idx_cities_state_id ON cities(state_id);
CREATE INDEX IF NOT EXISTS idx_cities_slug ON cities(slug);
CREATE INDEX IF NOT EXISTS idx_cities_state_slug ON cities(state_id, slug);

ALTER TABLE cities ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'cities' AND policyname = 'Allow public read access to cities') THEN
    CREATE POLICY "Allow public read access to cities" ON cities FOR SELECT USING (true);
  END IF;
END $$;

-- ----------------------------------------------------------------------------
-- 2. MAIN SCHOOLS TABLE
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS schools (
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
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  state_id UUID REFERENCES states(id) ON DELETE SET NULL,
  city_id UUID REFERENCES cities(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_schools_state_id ON schools(state_id);
CREATE INDEX IF NOT EXISTS idx_schools_city_id ON schools(city_id);
CREATE INDEX IF NOT EXISTS idx_schools_state_city ON schools(state_id, city_id);
CREATE INDEX IF NOT EXISTS idx_schools_slug ON schools(slug);

ALTER TABLE schools ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'schools' AND policyname = 'Enable read access for all users') THEN
    CREATE POLICY "Enable read access for all users" ON schools FOR SELECT USING (true);
  END IF;
END $$;

-- ----------------------------------------------------------------------------
-- 3. REFERENCE TABLE: BOARDS
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS boards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  full_name VARCHAR(255),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_boards_slug ON boards(slug);

ALTER TABLE boards ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'boards' AND policyname = 'Allow public read access to boards') THEN
    CREATE POLICY "Allow public read access to boards" ON boards FOR SELECT USING (true);
  END IF;
END $$;

-- Seed Boards if empty
INSERT INTO boards (name, slug, full_name, description) VALUES
  ('CBSE', 'cbse', 'Central Board of Secondary Education', 'National level board of education in India for public and private schools, controlled and managed by the Government of India.'),
  ('ICSE', 'icse', 'Indian Certificate of Secondary Education', 'Examination conducted by the Council for the Indian School Certificate Examinations, known for strong English and science foundations.'),
  ('IB', 'ib', 'International Baccalaureate', 'Switzerland-based international education foundation offering high-quality, challenging programs for kids of all ages.'),
  ('Cambridge', 'cambridge', 'Cambridge Assessment International Education', 'Provider of international education programmes and qualifications, offering flexible pathways.'),
  ('State Board', 'state-board', 'State Board of Education', 'Educational board run by individual state governments in India, customized to regional language and curriculum.'),
  ('Montessori', 'montessori', 'Montessori Method', 'Child-centered educational approach focusing on self-directed activity and hands-on learning.')
ON CONFLICT (name) DO NOTHING;

-- Link schools to boards if column not present
ALTER TABLE schools ADD COLUMN IF NOT EXISTS board VARCHAR(50);
ALTER TABLE schools ADD COLUMN IF NOT EXISTS board_id UUID REFERENCES boards(id);
CREATE INDEX IF NOT EXISTS idx_schools_board_id ON schools(board_id);

-- Auto-map school board_id from board text field
UPDATE schools s SET board_id = b.id FROM boards b
WHERE s.board_id IS NULL AND (s.board = b.name OR s.curriculum ILIKE '%' || b.name || '%');

-- Default remaining to State Board
UPDATE schools s SET board_id = (SELECT id FROM boards WHERE slug = 'state-board')
WHERE s.board_id IS NULL;

-- ----------------------------------------------------------------------------
-- 4. REFERENCE TABLE: AGE GROUPS
-- ----------------------------------------------------------------------------

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

CREATE INDEX IF NOT EXISTS idx_age_groups_slug ON age_groups(slug);

ALTER TABLE age_groups ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'age_groups' AND policyname = 'Allow public read access to age_groups') THEN
    CREATE POLICY "Allow public read access to age_groups" ON age_groups FOR SELECT USING (true);
  END IF;
END $$;

-- Seed Age Groups
INSERT INTO age_groups (name, slug, age_range, min_age, max_age, display_order) VALUES
  ('Preschool',        'preschool',        '2-5 years',  2,   5,  1),
  ('Primary',          'primary',          '6-10 years', 6,   10, 2),
  ('Secondary',        'secondary',        '11-16 years',11,  16, 3),
  ('Senior Secondary', 'senior-secondary', '17-18 years',17,  18, 4),
  ('Post Secondary',   'post-secondary',   '18+ years',  18,  99, 5)
ON CONFLICT (name) DO NOTHING;

-- Junction Table for Age Groups (Many-to-Many)
CREATE TABLE IF NOT EXISTS school_age_groups (
  school_id BIGINT NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  age_group_id UUID NOT NULL REFERENCES age_groups(id) ON DELETE CASCADE,
  PRIMARY KEY (school_id, age_group_id)
);

CREATE INDEX IF NOT EXISTS idx_school_age_groups_school ON school_age_groups(school_id);
CREATE INDEX IF NOT EXISTS idx_school_age_groups_age_group ON school_age_groups(age_group_id);

ALTER TABLE school_age_groups ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'school_age_groups' AND policyname = 'Allow public read access to school_age_groups') THEN
    CREATE POLICY "Allow public read access to school_age_groups" ON school_age_groups FOR SELECT USING (true);
  END IF;
END $$;

-- Populate school_age_groups relationship
INSERT INTO school_age_groups (school_id, age_group_id)
SELECT s.id, ag.id
FROM schools s
CROSS JOIN age_groups ag
WHERE ag.slug IN ('primary', 'secondary', 'senior-secondary')
ON CONFLICT DO NOTHING;

-- ----------------------------------------------------------------------------
-- 5. REFERENCE TABLE: FEE RANGES
-- ----------------------------------------------------------------------------

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

CREATE INDEX IF NOT EXISTS idx_fee_ranges_slug ON fee_ranges(slug);

ALTER TABLE fee_ranges ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'fee_ranges' AND policyname = 'Allow public read access to fee_ranges') THEN
    CREATE POLICY "Allow public read access to fee_ranges" ON fee_ranges FOR SELECT USING (true);
  END IF;
END $$;

-- Seed Fee Ranges
INSERT INTO fee_ranges (name, slug, min_fee, max_fee, display_order) VALUES
  ('Under ₹50,000',       'under-50k',    0,      50000,    1),
  ('₹50,000 - ₹1 Lakh',  '50k-1lakh',    50000,  100000,   2),
  ('₹1 - 2 Lakh',         '1-2lakh',      100000, 200000,   3),
  ('₹2 - 5 Lakh',         '2-5lakh',      200000, 500000,   4),
  ('Above ₹5 Lakh',       'above-5lakh',  500000, NULL,     5)
ON CONFLICT (name) DO NOTHING;

-- Add column to schools
ALTER TABLE schools ADD COLUMN IF NOT EXISTS fee_range_id UUID REFERENCES fee_ranges(id);
CREATE INDEX IF NOT EXISTS idx_schools_fee_range_id ON schools(fee_range_id);

-- Auto-map school fee_range_id from fees_min column
UPDATE schools SET fee_range_id = (SELECT id FROM fee_ranges WHERE slug = 'under-50k') WHERE fees_min < 50000 AND fee_range_id IS NULL;
UPDATE schools SET fee_range_id = (SELECT id FROM fee_ranges WHERE slug = '50k-1lakh') WHERE fees_min >= 50000 AND fees_min < 100000 AND fee_range_id IS NULL;
UPDATE schools SET fee_range_id = (SELECT id FROM fee_ranges WHERE slug = '1-2lakh') WHERE fees_min >= 100000 AND fees_min < 200000 AND fee_range_id IS NULL;
UPDATE schools SET fee_range_id = (SELECT id FROM fee_ranges WHERE slug = '2-5lakh') WHERE fees_min >= 200000 AND fees_min < 500000 AND fee_range_id IS NULL;
UPDATE schools SET fee_range_id = (SELECT id FROM fee_ranges WHERE slug = 'above-5lakh') WHERE fees_min >= 500000 AND fee_range_id IS NULL;
UPDATE schools SET fee_range_id = (SELECT id FROM fee_ranges WHERE slug = '1-2lakh') WHERE fee_range_id IS NULL;

-- ----------------------------------------------------------------------------
-- 6. REFERENCE TABLE: SCHOOL TYPES
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS school_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_school_types_slug ON school_types(slug);

ALTER TABLE school_types ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'school_types' AND policyname = 'Allow public read access to school_types') THEN
    CREATE POLICY "Allow public read access to school_types" ON school_types FOR SELECT USING (true);
  END IF;
END $$;

-- Seed School Types
INSERT INTO school_types (name, slug, description, display_order) VALUES
  ('Co-educational', 'co-educational', 'Schools that admit both boys and girls',                    1),
  ('Boys Only',      'boys-only',      'Schools exclusively for boys',                              2),
  ('Girls Only',     'girls-only',     'Schools exclusively for girls',                             3),
  ('Day School',     'day-school',     'Schools where students attend during the day and return home', 4),
  ('Boarding',       'boarding',       'Residential schools where students live on campus',          5)
ON CONFLICT (name) DO NOTHING;

-- Junction Table for School Types (Many-to-Many)
CREATE TABLE IF NOT EXISTS school_school_types (
  school_id BIGINT NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  school_type_id UUID NOT NULL REFERENCES school_types(id) ON DELETE CASCADE,
  PRIMARY KEY (school_id, school_type_id)
);

CREATE INDEX IF NOT EXISTS idx_school_school_types_school ON school_school_types(school_id);
CREATE INDEX IF NOT EXISTS idx_school_school_types_type ON school_school_types(school_type_id);

ALTER TABLE school_school_types ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'school_school_types' AND policyname = 'Allow public read access to school_school_types') THEN
    CREATE POLICY "Allow public read access to school_school_types" ON school_school_types FOR SELECT USING (true);
  END IF;
END $$;

-- Populate school_school_types
INSERT INTO school_school_types (school_id, school_type_id)
SELECT s.id, st.id
FROM schools s
CROSS JOIN school_types st
WHERE st.slug IN ('co-educational', 'day-school')
ON CONFLICT DO NOTHING;

-- ----------------------------------------------------------------------------
-- 7. ADD PREMIUM COLUMNS TO SCHOOLS
-- ----------------------------------------------------------------------------

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='schools' AND column_name='seat_availability') THEN
    ALTER TABLE schools ADD COLUMN seat_availability JSONB DEFAULT '{}'::jsonb;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='schools' AND column_name='admission_process') THEN
    ALTER TABLE schools ADD COLUMN admission_process JSONB DEFAULT '[]'::jsonb;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='schools' AND column_name='documents_required') THEN
    ALTER TABLE schools ADD COLUMN documents_required TEXT[] DEFAULT ARRAY[]::TEXT[];
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='schools' AND column_name='highlights_structured') THEN
    ALTER TABLE schools ADD COLUMN highlights_structured JSONB DEFAULT '[]'::jsonb;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='schools' AND column_name='scholarships') THEN
    ALTER TABLE schools ADD COLUMN scholarships JSONB DEFAULT '[]'::jsonb;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='schools' AND column_name='withdrawal_policy') THEN
    ALTER TABLE schools ADD COLUMN withdrawal_policy TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='schools' AND column_name='awards') THEN
    ALTER TABLE schools ADD COLUMN awards JSONB DEFAULT '[]'::jsonb;
  END IF;
  
  -- Add basic search support columns
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='schools' AND column_name='fees_min') THEN
    ALTER TABLE schools ADD COLUMN fees_min NUMERIC(12,2) DEFAULT NULL;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='schools' AND column_name='fees_max') THEN
    ALTER TABLE schools ADD COLUMN fees_max NUMERIC(12,2) DEFAULT NULL;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='schools' AND column_name='address') THEN
    ALTER TABLE schools ADD COLUMN address TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='schools' AND column_name='phone') THEN
    ALTER TABLE schools ADD COLUMN phone VARCHAR(20);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='schools' AND column_name='website_url') THEN
    ALTER TABLE schools ADD COLUMN website_url VARCHAR(500);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='schools' AND column_name='tags') THEN
    ALTER TABLE schools ADD COLUMN tags TEXT[];
  END IF;
END $$;

-- ----------------------------------------------------------------------------
-- 8. CREATE RELATED SUB-TABLES (PREMIUM FEATURES)
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS school_fees (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  school_id BIGINT REFERENCES schools(id) ON DELETE CASCADE,
  level TEXT NOT NULL,
  tuition_fee TEXT,
  registration_fee TEXT,
  development_fee TEXT,
  transport_fee TEXT,
  meal_fee TEXT,
  total_fee TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS school_gallery (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  school_id BIGINT REFERENCES schools(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  category TEXT DEFAULT 'Campus',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS school_reviews (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  school_id BIGINT REFERENCES schools(id) ON DELETE CASCADE,
  author TEXT NOT NULL,
  rating NUMERIC(2,1) CHECK (rating >= 1.0 AND rating <= 5.0),
  title TEXT,
  body TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS school_faqs (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  school_id BIGINT REFERENCES schools(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS school_admissions (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  school_id BIGINT REFERENCES schools(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  deadline TEXT,
  url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_school_fees_school_id ON school_fees(school_id);
CREATE INDEX IF NOT EXISTS idx_school_gallery_school_id ON school_gallery(school_id);
CREATE INDEX IF NOT EXISTS idx_school_reviews_school_id ON school_reviews(school_id);
CREATE INDEX IF NOT EXISTS idx_school_faqs_school_id ON school_faqs(school_id);
CREATE INDEX IF NOT EXISTS idx_school_admissions_school_id ON school_admissions(school_id);

-- Enable RLS for sub-tables
ALTER TABLE school_fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_admissions ENABLE ROW LEVEL SECURITY;

-- Select Policies (Public read access)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='school_fees' AND policyname='Allow public read access to school_fees') THEN
    CREATE POLICY "Allow public read access to school_fees" ON school_fees FOR SELECT USING (true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='school_gallery' AND policyname='Allow public read access to school_gallery') THEN
    CREATE POLICY "Allow public read access to school_gallery" ON school_gallery FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='school_reviews' AND policyname='Allow public read access to school_reviews') THEN
    CREATE POLICY "Allow public read access to school_reviews" ON school_reviews FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='school_faqs' AND policyname='Allow public read access to school_faqs') THEN
    CREATE POLICY "Allow public read access to school_faqs" ON school_faqs FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='school_admissions' AND policyname='Allow public read access to school_admissions') THEN
    CREATE POLICY "Allow public read access to school_admissions" ON school_admissions FOR SELECT USING (true);
  END IF;
END $$;

-- ----------------------------------------------------------------------------
-- 9. WRITE PERMISSIONS (INSERT FOR REVIEWS)
-- ----------------------------------------------------------------------------
-- Allow public review submission (Guest review capability)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='school_reviews' AND policyname='Allow public reviews insert') THEN
    CREATE POLICY "Allow public reviews insert" ON school_reviews FOR INSERT WITH CHECK (true);
  END IF;
END $$;

-- ----------------------------------------------------------------------------
-- 10. CREATE USER DATA STORE TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_data_store (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  bucket text not null,
  data_key text not null,
  payload jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Unique index to handle upserts
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE tablename = 'user_data_store' AND indexname = 'user_data_store_user_bucket_key_uidx') THEN
    CREATE UNIQUE index user_data_store_user_bucket_key_uidx ON public.user_data_store (user_id, bucket, data_key);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE tablename = 'user_data_store' AND indexname = 'user_data_store_user_id_idx') THEN
    CREATE index user_data_store_user_id_idx ON public.user_data_store (user_id);
  END IF;
END $$;

-- Enable RLS and create policy for user_data_store
ALTER TABLE public.user_data_store ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='user_data_store' AND policyname='Allow public read write user_data_store') THEN
    CREATE POLICY "Allow public read write user_data_store" ON public.user_data_store FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

-- ----------------------------------------------------------------------------
-- 11. STORAGE BUCKETS FOR APPLICATION DOCUMENTS
-- ----------------------------------------------------------------------------
-- Ensure buckets table is present, then configure
insert into storage.buckets (id, name, public)
values ('application-documents', 'application-documents', true)
on conflict (id) do update
set public = excluded.public;

-- Upload Policy
DO $$
BEGIN
  IF not exists (
    select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'Allow authenticated uploads for application documents'
  ) then
    create policy "Allow authenticated uploads for application documents"
    on storage.objects
    for insert
    to authenticated
    with check (
      bucket_id = 'application-documents'
      and auth.uid()::text = (storage.foldername(name))[1]
    );
  end if;
  
  IF not exists (
    select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'Allow public select to application documents'
  ) then
    create policy "Allow public select to application documents"
    on storage.objects
    for select
    using (bucket_id = 'application-documents');
  end if;
END $$;

-- ----------------------------------------------------------------------------
-- 12. CREATE SEARCH VIEW
-- ----------------------------------------------------------------------------
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

ALTER VIEW school_search_view SET (security_barrier = on);

-- ----------------------------------------------------------------------------
-- 13. RECREATE RPC SEARCH FUNCTION (FIXING UUID -> BIGINT BUG)
-- ----------------------------------------------------------------------------
DROP FUNCTION IF EXISTS search_schools(TEXT, TEXT, TEXT, TEXT, NUMERIC, NUMERIC, TEXT, INT, INT) CASCADE;

CREATE OR REPLACE FUNCTION search_schools(
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
  id BIGINT,              -- FIXED: BIGINT type to match schools.id
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
      s.name::VARCHAR,
      s.slug::VARCHAR,
      s.board::VARCHAR,
      b.name::VARCHAR AS board_name,
      b.slug::VARCHAR AS board_slug,
      s.type::VARCHAR,
      s.rating::NUMERIC,
      s.fees_min::NUMERIC,
      s.fees_max::NUMERIC,
      s.address::TEXT,
      s.phone::VARCHAR,
      s.website_url::VARCHAR,
      s.tags::TEXT[],
      s.cover_image::TEXT,
      c.id AS city_id,
      c.name::VARCHAR AS city_name,
      c.slug::VARCHAR AS city_slug,
      st.id AS state_id,
      st.name::VARCHAR AS state_name,
      st.slug::VARCHAR AS state_slug,
      COUNT(*) OVER()::INT AS total_count
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
    fs.total_count
  FROM filtered_schools fs
  ORDER BY
    CASE WHEN p_sort_by = 'rating_desc' THEN COALESCE(fs.rating, 0) ELSE 0 END DESC,
    CASE WHEN p_sort_by = 'fees_asc' THEN COALESCE(fs.fees_min, 0) ELSE 0 END ASC,
    CASE WHEN p_sort_by = 'name_asc' THEN fs.name ELSE fs.name END ASC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql STABLE;

-- ----------------------------------------------------------------------------
-- 14. HELPER DYNAMIC RELATION RPC FUNCTIONS
-- ----------------------------------------------------------------------------

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
    s.name::VARCHAR,
    s.slug::VARCHAR,
    s.board::VARCHAR,
    b.name::VARCHAR AS board_name,
    s.type::VARCHAR,
    s.rating::NUMERIC,
    s.fees_min::NUMERIC,
    s.fees_max::NUMERIC,
    s.address::TEXT,
    s.cover_image::TEXT,
    c.name::VARCHAR AS city_name,
    c.slug::VARCHAR AS city_slug,
    st.name::VARCHAR AS state_name,
    st.slug::VARCHAR AS state_slug
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
    s.name::VARCHAR,
    s.slug::VARCHAR,
    s.board::VARCHAR,
    b.name::VARCHAR AS board_name,
    s.type::VARCHAR,
    s.rating::NUMERIC,
    s.fees_min::NUMERIC,
    s.fees_max::NUMERIC,
    s.address::TEXT,
    s.cover_image::TEXT,
    c.name::VARCHAR AS city_name,
    c.slug::VARCHAR AS city_slug,
    sta.name::VARCHAR AS state_name,
    sta.slug::VARCHAR AS state_slug
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
-- Migration 013: User Activity Tables
-- ============================================================================

-- 1. Recently visited schools (replaces shortlisted schools on dashboard)
CREATE TABLE IF NOT EXISTS public.school_visits (
  id          uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id     uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  school_id   bigint NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  school_slug text NOT NULL,
  school_name text NOT NULL,
  visited_at  timestamp with time zone DEFAULT now(),
  CONSTRAINT school_visits_pkey PRIMARY KEY (id)
);

-- Unique: one row per (user, school) — we upsert to update visited_at
ALTER TABLE public.school_visits DROP CONSTRAINT IF EXISTS school_visits_user_school_unique;
ALTER TABLE public.school_visits ADD CONSTRAINT school_visits_user_school_unique UNIQUE (user_id, school_id);

CREATE INDEX IF NOT EXISTS idx_school_visits_user_id ON public.school_visits (user_id);
CREATE INDEX IF NOT EXISTS idx_school_visits_visited_at ON public.school_visits (visited_at DESC);

-- RLS
ALTER TABLE public.school_visits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their own visits" ON public.school_visits;
CREATE POLICY "Users can manage their own visits" ON public.school_visits
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);


-- 2. School enquiries (Apply Now, Request Callback, Schedule Visit from school detail page)
CREATE TABLE IF NOT EXISTS public.school_enquiries (
  id            uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id       uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  school_id     bigint REFERENCES public.schools(id) ON DELETE SET NULL,
  school_name   text NOT NULL,
  school_slug   text,
  enquiry_type  text NOT NULL CHECK (enquiry_type IN ('apply', 'callback', 'visit', 'general')),
  parent_name   text NOT NULL,
  parent_email  text,
  parent_phone  text NOT NULL,
  child_class   text,
  visit_date    text,
  message       text,
  status        text DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'resolved')),
  created_at    timestamp with time zone DEFAULT now(),
  updated_at    timestamp with time zone DEFAULT now(),
  CONSTRAINT school_enquiries_pkey PRIMARY KEY (id)
);

CREATE INDEX IF NOT EXISTS idx_school_enquiries_school_id ON public.school_enquiries (school_id);
CREATE INDEX IF NOT EXISTS idx_school_enquiries_user_id   ON public.school_enquiries (user_id);
CREATE INDEX IF NOT EXISTS idx_school_enquiries_type      ON public.school_enquiries (enquiry_type);
CREATE INDEX IF NOT EXISTS idx_school_enquiries_created   ON public.school_enquiries (created_at DESC);

-- RLS: anyone can insert (guest enquiries allowed), only authenticated users can see their own
ALTER TABLE public.school_enquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can insert enquiries" ON public.school_enquiries;
CREATE POLICY "Anyone can insert enquiries" ON public.school_enquiries
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can view their own enquiries" ON public.school_enquiries;
CREATE POLICY "Users can view their own enquiries" ON public.school_enquiries
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);


-- 3. Applications table (structured, proper columns — supplements user_data_store)
CREATE TABLE IF NOT EXISTS public.applications (
  id                    uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id               uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  application_store_id  text,                    -- reference key from user_data_store
  status                text DEFAULT 'submitted' CHECK (status IN ('draft', 'submitted', 'under_review', 'accepted', 'rejected')),

  -- Parent profile
  parent_first_name     text,
  parent_last_name      text,
  parent_email          text,
  parent_phone          text,
  parent_address        text,
  parent_city           text,
  parent_state          text,
  parent_occupation     text,
  parent_income         text,

  -- Student details
  student_first_name    text,
  student_last_name     text,
  student_dob           text,
  student_gender        text,
  student_current_grade text,
  student_current_school text,
  student_previous_school text,
  student_caste         text,
  student_religion      text,
  student_special_needs boolean DEFAULT false,
  student_special_needs_details text,

  -- Selected schools (JSON array)
  selected_schools      jsonb DEFAULT '[]'::jsonb,

  -- Documents (JSON array of {name, url, storagePath, type, size})
  documents             jsonb DEFAULT '[]'::jsonb,

  submitted_at          timestamp with time zone,
  created_at            timestamp with time zone DEFAULT now(),
  updated_at            timestamp with time zone DEFAULT now(),

  CONSTRAINT applications_pkey PRIMARY KEY (id)
);

CREATE INDEX IF NOT EXISTS idx_applications_user_id   ON public.applications (user_id);
CREATE INDEX IF NOT EXISTS idx_applications_status    ON public.applications (status);
CREATE INDEX IF NOT EXISTS idx_applications_created   ON public.applications (created_at DESC);

-- RLS
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their own applications" ON public.applications;
CREATE POLICY "Users can manage their own applications" ON public.applications
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_applications_updated_at ON public.applications;
CREATE TRIGGER trg_applications_updated_at
  BEFORE UPDATE ON public.applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_school_enquiries_updated_at ON public.school_enquiries;
CREATE TRIGGER trg_school_enquiries_updated_at
  BEFORE UPDATE ON public.school_enquiries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

