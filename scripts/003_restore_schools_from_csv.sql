-- ============================================================================
-- RESTORE SCHOOLS DATA FROM CSV
-- ============================================================================
-- Run this in Supabase SQL Editor to re-insert all 47 schools.
-- Uses ON CONFLICT (slug) DO NOTHING to avoid duplicates if partially populated.
-- ============================================================================

-- First, ensure the schools table exists (skip if already there)
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
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;

-- Allow public read
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'schools' AND policyname = 'Enable read access for all users'
  ) THEN
    CREATE POLICY "Enable read access for all users" ON schools FOR SELECT USING (true);
  END IF;
END $$;

-- ============================================================================
-- INSERT ALL 47 SCHOOLS
-- ============================================================================

INSERT INTO schools (name, slug, location, city, type, curriculum, established, description, highlights, facilities, contact_website) VALUES
  ('The Doon School', 'the-doon-school', 'Dehradun', 'Dehradun', 'Boarding', 'ICSE, ISC', '1935', 'All-boys premier boarding school', ARRAY['Leadership','Heritage Campus'], ARRAY['Boarding','Sports Complex'], 'www.doonschool.com'),
  ('Woodstock School', 'woodstock-school', 'Mussoorie', 'Mussoorie', 'Boarding', 'IB', '1854', 'International boarding school', ARRAY['Global Curriculum','Mountain Campus'], ARRAY['Boarding','Arts Center'], 'www.woodstockschool.in'),
  ('Mayo College', 'mayo-college', 'Ajmer', 'Ajmer', 'Boarding', 'CBSE', '1875', 'Historic boys boarding school', ARRAY['Royal Legacy','Large Campus'], ARRAY['Boarding','Sports Fields'], 'www.mayocollege.com'),
  ('Scindia School', 'scindia-school', 'Gwalior', 'Gwalior', 'Boarding', 'CBSE', '1897', 'All-boys residential school', ARRAY['Fort Campus','Leadership'], ARRAY['Boarding','Labs'], 'www.scindia.edu'),
  ('Bishop Cotton School', 'bishop-cotton-school-shimla', 'Shimla', 'Shimla', 'Boarding', 'ICSE, ISC', '1859', 'One of Asia''s oldest boarding schools', ARRAY['Heritage','Character Building'], ARRAY['Boarding','Library'], 'www.bishopcotton.com'),
  ('Lawrence School Sanawar', 'lawrence-school-sanawar', 'Sanawar', 'Solan', 'Boarding', 'CBSE', '1847', 'Co-ed boarding school', ARRAY['Hill Campus','Sports'], ARRAY['Boarding','Labs'], 'www.sanawar.edu.in'),
  ('Sherwood College', 'sherwood-college', 'Nainital', 'Nainital', 'Boarding', 'ICSE, ISC', '1869', 'Historic residential school', ARRAY['Value Education','Hill Campus'], ARRAY['Boarding','Sports'], 'www.sherwood.edu.in'),
  ('Rishi Valley School', 'rishi-valley-school', 'Chittoor', 'Chittoor', 'Boarding', 'ICSE', '1926', 'Krishnamurti foundation school', ARRAY['Nature Campus','Holistic Learning'], ARRAY['Boarding','Library'], 'www.rishivalley.org'),
  ('Dhirubhai Ambani International School', 'dhirubhai-ambani-international-school', 'Mumbai', 'Mumbai', 'Day', 'ICSE, IGCSE, IB', '2003', 'Premium international day school', ARRAY['Global Curriculum','Modern Campus'], ARRAY['Labs','Sports'], 'www.dais.edu.in'),
  ('Oberoi International School', 'oberoi-international-school', 'Mumbai', 'Mumbai', 'Day', 'IB', '2008', 'IB world school', ARRAY['Global Standards','Innovation'], ARRAY['Labs','Sports'], 'www.oberoi-is.org'),
  ('Cathedral and John Connon School', 'cathedral-and-john-connon-school', 'Mumbai', 'Mumbai', 'Day', 'ICSE, ISC, IB', '1860', 'Prestigious Mumbai school', ARRAY['Academic Excellence','Legacy'], ARRAY['Labs','Library'], 'www.cathedral-school.com'),
  ('Bombay Scottish School', 'bombay-scottish-school', 'Mumbai', 'Mumbai', 'Day', 'ICSE, ISC', '1847', 'Historic ICSE school', ARRAY['Strong Alumni','Urban Campus'], ARRAY['Labs','Sports'], 'www.bombayscottish.in'),
  ('St. Xavier''s Collegiate School', 'st-xaviers-collegiate-school', 'Kolkata', 'Kolkata', 'Day', 'ICSE, ISC', '1860', 'Jesuit heritage school', ARRAY['Academic Rigor','Legacy'], ARRAY['Labs','Library'], 'www.sxcs.edu.in'),
  ('Modern School Barakhamba', 'modern-school-barakhamba', 'New Delhi', 'New Delhi', 'Day', 'CBSE', '1920', 'Leading Delhi CBSE school', ARRAY['Holistic Education','Sports'], ARRAY['Labs','Auditorium'], 'www.modernschool.net'),
  ('Vasant Valley School', 'vasant-valley-school', 'New Delhi', 'New Delhi', 'Day', 'CBSE', '1990', 'Progressive Delhi school', ARRAY['Arts','Sports'], ARRAY['Labs','Library'], 'www.vasantvalley.org'),
  ('The Shri Ram School', 'the-shri-ram-school', 'Gurugram', 'Gurugram', 'Day', 'CBSE', '1988', 'Top CBSE school in NCR', ARRAY['Value-based Education'], ARRAY['Labs','Sports'], 'www.tsrs.org'),
  ('Sanskriti School', 'sanskriti-school', 'New Delhi', 'New Delhi', 'Day', 'CBSE', '1996', 'Delhi public school', ARRAY['Cultural Focus','Academics'], ARRAY['Labs','Sports'], 'www.sanskritischool.edu.in'),
  ('Step by Step School', 'step-by-step-school', 'Noida', 'Noida', 'Day', 'CBSE, IB', '1992', 'Progressive co-ed school', ARRAY['Global Exposure','Innovation'], ARRAY['Labs','Sports'], 'www.stepbystep.school'),
  ('Pathways School Noida', 'pathways-school-noida', 'Noida', 'Noida', 'Day, Boarding', 'IB', '2010', 'IB continuum school', ARRAY['Global Curriculum','Residential Option'], ARRAY['Boarding','Labs'], 'www.pathways.in'),
  ('Indus International School', 'indus-international-school-bangalore', 'Bengaluru', 'Bengaluru', 'Day, Boarding', 'IB', '2003', 'International residential school', ARRAY['Global Exposure','Leadership'], ARRAY['Boarding','Sports'], 'www.indusschool.com'),
  ('Mallya Aditi International School', 'mallya-aditi-international-school', 'Bengaluru', 'Bengaluru', 'Day', 'ICSE, ISC', '1984', 'Progressive ICSE school', ARRAY['Creativity','Arts'], ARRAY['Labs','Sports'], 'www.aditi.edu.in'),
  ('Inventure Academy', 'inventure-academy', 'Bengaluru', 'Bengaluru', 'Day', 'ICSE, ISC', '2005', 'Innovative learning school', ARRAY['Student Leadership','Arts'], ARRAY['Labs','Sports'], 'www.inventureacademy.com'),
  ('Hyderabad Public School', 'hyderabad-public-school-begumpet', 'Hyderabad', 'Hyderabad', 'Day', 'ICSE, ISC', '1923', 'Heritage campus school', ARRAY['Strong Alumni Network'], ARRAY['Labs','Sports'], 'www.hpsbegumpet.org.in'),
  ('Oakridge International School', 'oakridge-international-school-hyderabad', 'Hyderabad', 'Hyderabad', 'Day, Boarding', 'IB, CBSE', '2001', 'Global curriculum school', ARRAY['International Exposure'], ARRAY['Boarding','Labs'], 'www.oakridge.in'),
  ('Good Shepherd International School', 'good-shepherd-international-school', 'Ooty', 'Ooty', 'Boarding', 'IB, IGCSE', '1977', 'Residential international school', ARRAY['Global Curriculum','Large Campus'], ARRAY['Boarding','Sports'], 'www.gsis.ac.in'),
  ('Kodaikanal International School', 'kodaikanal-international-school', 'Kodaikanal', 'Kodaikanal', 'Boarding', 'IB', '1901', 'American-style boarding school', ARRAY['Global Alumni','Residential'], ARRAY['Boarding','Arts'], 'www.kis.in'),
  ('Jamnabai Narsee School', 'jamnabai-narsee-school', 'Mumbai', 'Mumbai', 'Day', 'ICSE, ISC, IB', '1971', 'Leading Mumbai school', ARRAY['Academic Excellence'], ARRAY['Labs','Sports'], 'www.jns.ac.in'),
  ('Aditya Birla World Academy', 'aditya-birla-world-academy', 'Mumbai', 'Mumbai', 'Day', 'IB, IGCSE', '2008', 'International curriculum school', ARRAY['Global Education'], ARRAY['Labs','Sports'], 'www.adityabirlaworldacademy.com'),
  ('The Riverside School', 'the-riverside-school', 'Ahmedabad', 'Ahmedabad', 'Day', 'ICSE', '2001', 'Design thinking focused school', ARRAY['Innovation','Community Projects'], ARRAY['Labs','Library'], 'www.theriversideschool.in'),
  ('Emerald Heights International School', 'emerald-heights-international-school', 'Indore', 'Indore', 'Day, Boarding', 'CBSE', '1982', 'Top CBSE residential school', ARRAY['Sports Excellence'], ARRAY['Boarding','Labs'], 'www.emeraldheights.edu.in'),
  ('SAI International School', 'sai-international-school', 'Bhubaneswar', 'Bhubaneswar', 'Day', 'CBSE, IB', '2008', 'Premier Odisha school', ARRAY['Global Exposure'], ARRAY['Labs','Sports'], 'www.saiinternational.edu.in'),
  ('Delhi Public School RK Puram', 'dps-rk-puram', 'New Delhi', 'New Delhi', 'Day', 'CBSE', '1972', 'Flagship DPS school', ARRAY['Academic Excellence'], ARRAY['Labs','Sports'], 'www.dpsrkp.net'),
  ('La Martiniere College', 'la-martiniere-college-lucknow', 'Lucknow', 'Lucknow', 'Day', 'ICSE, ISC', '1845', 'Historic boys school', ARRAY['Heritage','Academics'], ARRAY['Labs','Sports'], 'www.lamartinierelucknow.org'),
  ('La Martiniere Girls College', 'la-martiniere-girls-college-lucknow', 'Lucknow', 'Lucknow', 'Day', 'ICSE, ISC', '1869', 'Historic girls school', ARRAY['Heritage','Leadership'], ARRAY['Labs','Library'], 'www.lamartinieregirlscollege.org'),
  ('St. Mary''s School', 'st-marys-school-pune', 'Pune', 'Pune', 'Day', 'ICSE', '1866', 'Historic missionary school', ARRAY['Academic Excellence'], ARRAY['Labs','Sports'], 'www.stmaryspune.org'),
  ('National Public School', 'national-public-school-bangalore', 'Bengaluru', 'Bengaluru', 'Day', 'CBSE', '1959', 'Top CBSE school', ARRAY['Academic Excellence'], ARRAY['Labs','Sports'], 'www.npsbangalore.com'),
  ('Vidya Niketan School', 'vidya-niketan-school-bangalore', 'Bengaluru', 'Bengaluru', 'Day', 'CBSE', '1986', 'Leading CBSE school', ARRAY['Value Education'], ARRAY['Labs','Sports'], 'www.vnpschool.in'),
  ('Chinmaya International Residential School', 'chinmaya-international-residential-school', 'Coimbatore', 'Coimbatore', 'Boarding', 'CBSE', '1996', 'Residential CBSE school', ARRAY['Value-based Education'], ARRAY['Boarding','Labs'], 'www.cirschool.org'),
  ('GD Goenka World School', 'gd-goenka-world-school', 'Gurugram', 'Gurugram', 'Day, Boarding', 'IB, IGCSE', '1997', 'International residential school', ARRAY['Global Exposure'], ARRAY['Boarding','Labs'], 'www.gdgoenkaworldschool.com'),
  ('Army Public School Dhaula Kuan', 'army-public-school-dhaula-kuan', 'New Delhi', 'New Delhi', 'Day', 'CBSE', '1953', 'Army-run CBSE school', ARRAY['Discipline','Academics'], ARRAY['Labs','Sports'], 'www.apsdk.com'),
  ('Bharatiya Vidya Bhavan School', 'bharatiya-vidya-bhavan-school', 'Mumbai', 'Mumbai', 'Day', 'CBSE', '1938', 'Value-based CBSE school', ARRAY['Indian Culture','Academics'], ARRAY['Labs','Library'], 'www.bhavans.ac.in'),
  ('Amity International School', 'amity-international-school-noida', 'Noida', 'Noida', 'Day', 'CBSE', '1994', 'Leading CBSE institution', ARRAY['Global Outlook'], ARRAY['Labs','Sports'], 'www.amity.edu/ais'),
  ('Ryan International School', 'ryan-international-school-mumbai', 'Mumbai', 'Mumbai', 'Day', 'CBSE, ICSE', '1976', 'Private K-12 chain school', ARRAY['Global Exposure'], ARRAY['Labs','Sports'], 'www.ryaninternational.org'),
  ('Heritage Xperiential Learning School', 'heritage-xperiential-learning-school', 'Gurugram', 'Gurugram', 'Day', 'IB, IGCSE', '2003', 'Experiential learning school', ARRAY['Project-based Learning'], ARRAY['Labs','Sports'], 'www.heritagexperiential.org'),
  ('Jayshree Periwal International School', 'jayshree-periwal-international-school', 'Jaipur', 'Jaipur', 'Day', 'IB, IGCSE', '2002', 'International curriculum school', ARRAY['Global Focus'], ARRAY['Labs','Sports'], 'www.jphschool.com'),
  ('Neerja Modi School', 'neerja-modi-school', 'Jaipur', 'Jaipur', 'Day', 'CBSE, IGCSE', '2001', 'Leading Jaipur school', ARRAY['Academic Excellence'], ARRAY['Labs','Sports'], 'www.nmsindia.org'),
  ('Sishya School', 'sishya-school-chennai', 'Chennai', 'Chennai', 'Day', 'ICSE, ISC', '1972', 'Chennai ICSE school', ARRAY['Community Culture'], ARRAY['Labs','Sports'], 'www.sishya.com')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- MAP STATE NAMES TO SCHOOLS (based on city locations)
-- ============================================================================

-- Map each school to its state based on city
UPDATE schools SET state = 'Uttarakhand' WHERE city IN ('Dehradun', 'Mussoorie', 'Nainital');
UPDATE schools SET state = 'Rajasthan' WHERE city IN ('Ajmer', 'Jaipur');
UPDATE schools SET state = 'Madhya Pradesh' WHERE city = 'Gwalior';
UPDATE schools SET state = 'Madhya Pradesh' WHERE city = 'Indore';
UPDATE schools SET state = 'Himachal Pradesh' WHERE city IN ('Shimla', 'Solan');
UPDATE schools SET state = 'Maharashtra' WHERE city IN ('Mumbai', 'Pune');
UPDATE schools SET state = 'West Bengal' WHERE city = 'Kolkata';
UPDATE schools SET state = 'Delhi' WHERE city = 'New Delhi';
UPDATE schools SET state = 'Haryana' WHERE city = 'Gurugram';
UPDATE schools SET state = 'Uttarakhand' WHERE city = 'Mussoorie';
UPDATE schools SET state = 'Himachal Pradesh' WHERE city = 'Solan';
UPDATE schools SET state = 'Rajasthan' WHERE city = 'Ajmer';
UPDATE schools SET state = 'Madhya Pradesh' WHERE city = 'Gwalior';
UPDATE schools SET state = 'Andhra Pradesh' WHERE city = 'Chittoor';
UPDATE schools SET state = 'Uttar Pradesh' WHERE city IN ('Noida', 'Lucknow');
UPDATE schools SET state = 'Karnataka' WHERE city = 'Bengaluru';
UPDATE schools SET state = 'Andhra Pradesh' WHERE city = 'Chittoor';
UPDATE schools SET state = 'Telangana' WHERE city = 'Hyderabad';
UPDATE schools SET state = 'Tamil Nadu' WHERE city IN ('Ooty', 'Kodaikanal', 'Coimbatore', 'Chennai');
UPDATE schools SET state = 'Gujarat' WHERE city = 'Ahmedabad';
UPDATE schools SET state = 'Odisha' WHERE city = 'Bhubaneswar';

-- ============================================================================
-- LINK SCHOOLS TO states/cities FOREIGN KEYS (if tables exist)
-- ============================================================================

-- Link state_id
UPDATE schools s
SET state_id = st.id
FROM states st
WHERE LOWER(s.state) = LOWER(st.name)
  AND s.state_id IS NULL;

-- Link city_id
UPDATE schools s
SET city_id = c.id
FROM cities c
WHERE LOWER(s.city) = LOWER(c.name)
  AND s.city_id IS NULL;

-- ============================================================================
-- VERIFY
-- ============================================================================
-- Run these after to confirm:
-- SELECT COUNT(*) AS total_schools FROM schools;
-- SELECT name, city, state FROM schools ORDER BY name LIMIT 10;
-- SELECT state, COUNT(*) FROM schools GROUP BY state ORDER BY COUNT(*) DESC;
