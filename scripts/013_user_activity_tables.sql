-- ============================================================================
-- Migration 013: User Activity Tables
-- Run this in your Supabase SQL Editor
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
