# IMMEDIATE FIX - Copy & Paste into Vercel

## Step 1: Go to Vercel Dashboard
https://vercel.com/dashboard

## Step 2: Click Your Project  
Find "kindred" or similar project name

## Step 3: Settings → Environment Variables → Add New

Copy and paste these EXACTLY (one at a time):

### Variable 1:
```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://enchwrptwtctikbhrpsg.supabase.co
Environment: Production ✓ Preview ✓ Development ✓
```

### Variable 2:
```
Name: NEXT_PUBLIC_SUPABASE_ANON_KEY  
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVuY2h3cnB0d3RjdGlrYmhycHNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0Nzg4MjQsImV4cCI6MjA4NzA1NDgyNH0.5muOyMFOjnTT1FG_sSjd9OdzornfeYK2CuxmbnoDoCs
Environment: Production ✓ Preview ✓ Development ✓
```

### Variable 3:
```
Name: SUPABASE_SERVICE_ROLE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVuY2h3cnB0d3RjdGlrYmhycHNnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTQ3ODgyNCwiZXhwIjoyMDg3MDU0ODI0fQ.HIpb1oy-Fz79hDx3Fr3KxwFE-eJPmJ_SZcYDi1Ffl88
Environment: Production ✓ Preview ✓ Development ✓
```

## Step 4: Redeploy
After adding variables:
- Go to Deployments tab
- Click latest deployment's "..." menu
- Click "Redeploy"

---

## 🔴 Problem 2: Import School Data to Supabase

### Check if you have data:
1. Go to https://app.supabase.com
2. Select your project
3. Click "Table Editor" 
4. Look for "schools" table
5. Check if it has 47-50 rows

### If NO DATA or table doesn't exist:

#### A. Create the table:
Go to SQL Editor and run:
```sql
CREATE TABLE schools (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  ratings DECIMAL(3,2),
  reviews INTEGER,
  students INTEGER,
  fee_range TEXT,
  established INTEGER,
  highlights TEXT,
  facilities TEXT,
  contact_website TEXT,
  curriculum TEXT,
  description TEXT,
  cover_image TEXT,
  city TEXT,
  state TEXT,
  location TEXT,
  type TEXT,
  board TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access" ON schools
  FOR SELECT USING (true);
```

#### B. Import CSV data:
Run this in your local project:

```powershell
# Make sure .env.local has your Supabase credentials
npx ts-node scripts/migrate-csv-to-supabase.ts 50_indian_schools_dataset.csv
```

---

## ✅ Quick Checklist

- [ ] Added 3 environment variables to Vercel
- [ ] Redeployed from Vercel dashboard  
- [ ] Created schools table in Supabase
- [ ] Imported CSV data to Supabase
- [ ] Verified data exists: SELECT COUNT(*) FROM schools;
- [ ] Visit https://kindred-dxsk.vercel.app/discover (should work now!)

---

## 🆘 Still Not Working?

Check Vercel function logs:
1. Vercel Dashboard → Deployments → Latest
2. Click "View Function Logs"
3. Look for errors mentioning "Supabase" or "MISSING"

If you see "✗ MISSING" for env variables, they weren't added correctly. Try again.

If you see "No schools found", your Supabase table is empty. Run the import script.
