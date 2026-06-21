-- ============================================================================
-- SQL MIGRATION: ADD PREMIUM SCHOOL DETAILS & CREATE RELATED SUB-TABLES
-- ============================================================================
-- This script:
-- 1. Adds premium metadata columns to the existing 'schools' table.
-- 2. Creates relational sub-tables (fees, gallery, reviews, FAQs, admissions) if missing.
-- 3. Enables RLS and configures public read policies for all tables.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. ADD NEW COLUMNS TO THE 'schools' TABLE
-- ----------------------------------------------------------------------------
DO $$
BEGIN
  -- Class-wise Seat Availability (JSONB)
  -- Example: {"Nursery": "Open", "KG": "Open", "Class 1": "Limited"}
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='schools' AND column_name='seat_availability') THEN
    ALTER TABLE schools ADD COLUMN seat_availability JSONB DEFAULT '{}'::jsonb;
    COMMENT ON COLUMN schools.seat_availability IS 'Class-wise seat availability status';
  END IF;

  -- Step-by-step Admission Process Timeline (JSONB)
  -- Example: [{"step": 1, "title": "Online Form", "description": "..."}]
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='schools' AND column_name='admission_process') THEN
    ALTER TABLE schools ADD COLUMN admission_process JSONB DEFAULT '[]'::jsonb;
    COMMENT ON COLUMN schools.admission_process IS 'Step-by-step admission timeline';
  END IF;

  -- Required Documents Checklist (TEXT[])
  -- Example: ARRAY['Birth Certificate', 'Aadhar Card', 'Address Proof']
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='schools' AND column_name='documents_required') THEN
    ALTER TABLE schools ADD COLUMN documents_required TEXT[] DEFAULT ARRAY[]::TEXT[];
    COMMENT ON COLUMN schools.documents_required IS 'List of documents required during admission';
  END IF;

  -- Structured Why Choose Us / Highlights with icons and descriptions (JSONB)
  -- Example: [{"title": "Safe Campus", "description": "CCTV monitored", "icon": "Shield"}]
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='schools' AND column_name='highlights_structured') THEN
    ALTER TABLE schools ADD COLUMN highlights_structured JSONB DEFAULT '[]'::jsonb;
    COMMENT ON COLUMN schools.highlights_structured IS 'Structured highlights with title, description, and icon';
  END If;

  -- Scholarship Options (JSONB)
  -- Example: [{"title": "Merit Scholarship", "description": "Up to 50% tuition waiver"}]
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='schools' AND column_name='scholarships') THEN
    ALTER TABLE schools ADD COLUMN scholarships JSONB DEFAULT '[]'::jsonb;
    COMMENT ON COLUMN schools.scholarships IS 'Scholarship details and concessions';
  END IF;

  -- Withdrawal & Refund Policy (TEXT)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='schools' AND column_name='withdrawal_policy') THEN
    ALTER TABLE schools ADD COLUMN withdrawal_policy TEXT;
    COMMENT ON COLUMN schools.withdrawal_policy IS 'Official withdrawal and fee refund policy details';
  END IF;

  -- Awards & Recognitions (JSONB)
  -- Example: [{"title": "Academic Excellence", "year": "2025", "details": "..."}]
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='schools' AND column_name='awards') THEN
    ALTER TABLE schools ADD COLUMN awards JSONB DEFAULT '[]'::jsonb;
    COMMENT ON COLUMN schools.awards IS 'Awards and recognition list';
  END IF;
END $$;


-- ----------------------------------------------------------------------------
-- 2. CREATE RELATIONAL SUB-TABLES (IF NOT EXISTING)
-- ----------------------------------------------------------------------------

-- A. School Fees (Detailed structure per class level)
CREATE TABLE IF NOT EXISTS school_fees (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  school_id BIGINT REFERENCES schools(id) ON DELETE CASCADE,
  level TEXT NOT NULL, -- e.g. "Nursery", "Class 1"
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

-- B. School Gallery (Images and captions)
CREATE TABLE IF NOT EXISTS school_gallery (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  school_id BIGINT REFERENCES schools(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  category TEXT DEFAULT 'Campus', -- e.g. 'Campus', 'Classroom', 'Sports', 'Activity'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- C. School Reviews (Parent and student reviews)
CREATE TABLE IF NOT EXISTS school_reviews (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  school_id BIGINT REFERENCES schools(id) ON DELETE CASCADE,
  author TEXT NOT NULL,
  rating NUMERIC(2,1) CHECK (rating >= 1.0 AND rating <= 5.0),
  title TEXT,
  body TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- D. School FAQs
CREATE TABLE IF NOT EXISTS school_faqs (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  school_id BIGINT REFERENCES schools(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- E. School Admissions (Updates, deadlines, and notifications)
CREATE TABLE IF NOT EXISTS school_admissions (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  school_id BIGINT REFERENCES schools(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  deadline TEXT,
  url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- ----------------------------------------------------------------------------
-- 3. INDEXES FOR PERFORMANCE
-- ----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_school_fees_school_id ON school_fees(school_id);
CREATE INDEX IF NOT EXISTS idx_school_gallery_school_id ON school_gallery(school_id);
CREATE INDEX IF NOT EXISTS idx_school_reviews_school_id ON school_reviews(school_id);
CREATE INDEX IF NOT EXISTS idx_school_faqs_school_id ON school_faqs(school_id);
CREATE INDEX IF NOT EXISTS idx_school_admissions_school_id ON school_admissions(school_id);


-- ----------------------------------------------------------------------------
-- 4. ROW LEVEL SECURITY (RLS) & PUBLIC READ ACCESS POLICIES
-- ----------------------------------------------------------------------------
ALTER TABLE school_fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_admissions ENABLE ROW LEVEL SECURITY;

-- Select policies (Allow read access for anyone)
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
