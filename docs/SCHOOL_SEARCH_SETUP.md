# School Search Architecture - Setup Guide

## Overview

This guide covers the setup for the hierarchical school search system supporting:
- **STATE → CITY → SCHOOL** filtering
- **Google-like natural language queries** (e.g., "best IB schools in Gurgaon under 2 lakh")
- **SEO-optimized routes** with metadata
- **Supabase-powered search** with RPC and view support

---

## 1. Environment Variables

### Required for Supabase Connection

Add these to your `.env.local` file:

```bash
# Supabase Public API (required for frontend)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Supabase Service Role Key (required for server-side operations)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### How to Find These Values

1. **Go to Supabase Dashboard** → Your Project
2. **For `NEXT_PUBLIC_SUPABASE_URL`:**
   - Click **Settings** (bottom left)
   - → **API** tab
   - Copy the **URL** field

3. **For `NEXT_PUBLIC_SUPABASE_ANON_KEY`:**
   - Same page as above
   - Copy **anon public** key

4. **For `SUPABASE_SERVICE_ROLE_KEY`:**
   - Same page as above
   - Copy **service_role** key (⚠️ Keep secret, never commit to Git)

### Optional Environment Variables

```bash
# For advanced features
NEXT_PUBLIC_OPENCAGE_API_KEY=optional_for_city_fetching
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=optional_for_map_integration
```

---

## 2. Database Setup Steps

### Step 1: Create Tables and Schema

1. Open **Supabase Dashboard** → Your Project
2. Go to **SQL Editor**
3. Copy-paste the contents of `scripts/001_create_normalized_schema.sql`
4. Click **Run**
5. Wait for completion (should see ✓ success)

### Step 2: Seed Initial Data

1. In **SQL Editor**, paste contents of `scripts/002_seed_states_cities.sql`
2. Click **Run**
3. This populates:
   - 35 Indian states/territories
   - 40+ major cities

### Step 3: Verify Schema

Run these queries in **SQL Editor** to confirm:

```sql
-- Check states count
SELECT COUNT(*) as state_count FROM states;

-- Check cities count
SELECT COUNT(*) as city_count FROM cities;

-- Check schools have proper columns
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'schools' 
ORDER BY ordinal_position;

-- Test view
SELECT COUNT(*) FROM school_search_view;
```

### Step 4: Migrate Existing Schools Data (if needed)

If you already have schools with city/state as text fields:

```sql
-- Backfill state_id and city_id for existing schools
UPDATE schools s
SET city_id = c.id
FROM cities c
WHERE LOWER(s.city) = LOWER(c.name);

UPDATE schools s
SET state_id = st.id
FROM states st
WHERE LOWER(s.state) = LOWER(st.name);
```

---

## 3. File Placement in Next.js App Router

```
app/
├── schools/                          # NEW: Main schools discovery
│   ├── page.tsx                     # /schools - all schools
│   ├── [state]/
│   │   ├── page.tsx                 # /schools/[state] - by state
│   │   └── [city]/
│   │       └── page.tsx             # /schools/[state]/[city] - by city
│   └── [slug]/
│       └── page.tsx                 # /schools/[slug] - individual school detail
│
components/
├── school-search-module.tsx         # NEW: Homepage search bar with dropdowns
├── search-schools-results.tsx       # NEW: Results page component
├── schools-filter-bar.tsx           # NEW: Filter chips display
│
lib/
├── parse-school-query.ts            # NEW: Query parser + helper functions
├── supabase-queries.ts              # UPDATED: Added hierarchical search functions
├── supabase.ts                      # EXISTING: No changes needed
│
scripts/
├── 001_create_normalized_schema.sql # NEW: Database schema migration
├── 002_seed_states_cities.sql       # NEW: Seed states and cities
```

---

## 4. Implementation Checklist

- [ ] **Database:**
  - [ ] Run `001_create_normalized_schema.sql` in Supabase SQL Editor
  - [ ] Run `002_seed_states_cities.sql` to seed states/cities
  - [ ] Test: `SELECT COUNT(*) FROM states;` returns 35

- [ ] **Environment Variables:**
  - [ ] Add `NEXT_PUBLIC_SUPABASE_URL` to `.env.local`
  - [ ] Add `NEXT_PUBLIC_SUPABASE_ANON_KEY` to `.env.local`
  - [ ] Add `SUPABASE_SERVICE_ROLE_KEY` to `.env.local`
  - [ ] Test Supabase connection by running a simple fetch

- [ ] **Code Files:**
  - [ ] Copy `lib/parse-school-query.ts` (query parser)
  - [ ] Update `lib/supabase-queries.ts` (add new search functions)
  - [ ] Copy `components/school-search-module.tsx` (homepage search)
  - [ ] Copy `components/search-schools-results.tsx` (results display)
  - [ ] Copy `components/schools-filter-bar.tsx` (filter chips)
  - [ ] Copy `app/schools/page.tsx` (main schools page)
  - [ ] Copy `app/schools/[state]/page.tsx` (state filtering)
  - [ ] Copy `app/schools/[state]/[city]/page.tsx` (city filtering)

- [ ] **Homepage Integration:**
  - [ ] Replace discovery search bar with `<SchoolSearchModule />`
  - [ ] Update `app/page.tsx` to import new component

- [ ] **Testing:**
  - [ ] Test search by state: `/schools/delhi`
  - [ ] Test search by city: `/schools/haryana/gurgaon`
  - [ ] Test query parsing: "best IB schools in Noida under 2 lakh"
  - [ ] Test filters: board, fees range, school type

---

## 5. Key Features & APIs

### Query Parser (`lib/parse-school-query.ts`)

```typescript
import { parseSchoolQuery, SEARCH_QUERY_EXAMPLES } from '@/lib/parse-school-query'

// Parse natural language queries
const result = parseSchoolQuery(
  "best IB schools in Gurgaon under 2 lakh",
  {
    states: [...],
    cities: [...],
    boards: ['CBSE', 'ICSE', 'IB', ...],
    types: ['Day School', 'Boarding', ...]
  }
)
// Returns: { stateSlug: 'haryana', citySlug: 'gurgaon', board: 'IB', feesMax: 200000, sort: 'rating_desc' }

// Get rotating placeholder
const placeholder = getRotatingPlaceholder() // "Best schools in Delhi", etc.

// Format fees for display
const display = formatFeesRange(100000, 500000) // "₹1 L - ₹5 L"
```

### Supabase Queries (`lib/supabase-queries.ts`)

```typescript
// Fetch all states
const states = await fetchAllStates()

// Fetch cities by state
const cities = await fetchCitiesByState('haryana')

// Advanced search with filters
const { schools, total } = await searchSchoolsAdvanced({
  stateSlug: 'haryana',
  citySlug: 'gurgaon',
  board: 'IB',
  feesMax: 200000,
  sort: 'rating_desc',
  limit: 20,
  offset: 0
})

// Fallback to view-based search
const result = await searchSchoolsFromView({
  stateSlug: 'haryana',
  citySlug: 'gurgaon',
  limit: 20
})

// Get schools statistics
const stats = await getSchoolsStatistics()
// { totalSchools: 5000, byBoard: { CBSE: 2000, ... }, byType: { ... } }
```

---

## 6. Search & Filtering Flow

### Scenario: User searches "best IB schools in Gurgaon under 2 lakh"

```
1. User types query in SchoolSearchModule
   ↓
2. Query parser extracts: { stateSlug: 'haryana', citySlug: 'gurgaon', board: 'IB', feesMax: 200000 }
   ↓
3. URL built: /schools/haryana/gurgaon?board=IB&fees=0-200000
   ↓
4. [state]/[city]/page.tsx receives params
   ↓
5. SearchSchoolsResults component calls searchSchoolsAdvanced()
   ↓
6. RPC function search_schools() filters schools in database
   ↓
7. Results displayed with school cards
   ↓
8. User can refine with filter chips (board, fees range, type)
```

---

## 7. Database RPC Function

The system uses a Supabase RPC function `search_schools()` with parameters:

```sql
search_schools(
  p_state_slug TEXT,
  p_city_slug TEXT,
  p_board TEXT,
  p_type TEXT,
  p_fees_min NUMERIC,
  p_fees_max NUMERIC,
  p_sort_by TEXT,
  p_limit INT,
  p_offset INT
)
```

**Performance Notes:**
- Indexes on `state_id`, `city_id`, `board`, `rating`, `fees_min/max` enable fast queries
- Composite index on `(state_id, city_id)` for state+city filtering
- Sorting by rating (descending) is default and optimized

---

## 8. SEO & Metadata

Dynamic metadata generated for all school search pages:

- **`/schools`** → "Search Schools | Kindred"
- **`/schools/haryana`** → "Best Schools in Haryana | Kindred"
- **`/schools/haryana/gurgaon`** → "Best Schools in Gurgaon, Haryana | Kindred"
- **`/schools?q=best+IB+schools`** → Title includes query for SEO

### Static Path Generation

Most-popular state/city combinations are pre-generated at build time:
- `generateStaticParams()` in `[state]/page.tsx`
- `generateStaticParams()` in `[state]/[city]/page.tsx`

Unpopular routes are generated on-demand (ISR with fallback).

---

## 9. Caching Strategy

### Client-Side
- States list cached in React state (rarely changes)
- Cities list loaded on-demand per state
- Search results cached via Next.js API caching

### Server-Side
- Supabase queries use request-level caching
- RPC function results not cached (always fresh)
- Static generation for popular routes

### For Production
Consider adding:
```typescript
// In SearchSchoolsResults or API routes
const { schools } = await searchSchoolsAdvanced({...})
// Cache for 1 hour
revalidateTag('schools')
// ... in revalidatePath
revalidatePath('/schools', 'layout')
```

---

## 10. Future Enhancements

### Planned Features
- [ ] **Compare Schools**: Multi-select + side-by-side comparison
- [ ] **Reviews & Ratings**: User-submitted reviews for schools
- [ ] **Advanced Filters**: Facilities, sports, co-curricular activities
- [ ] **Map View**: Show schools geographically
- [ ] **School Admin Portal**: Schools can update their own data
- [ ] **Saved Schools**: User wishlists (requires auth)
- [ ] **Expert Counselor Booking**: Integration with counselor network
- [ ] **Analytics Dashboard**: Search trends, popular filters

### Performance Todos
- [ ] Implement pagination with "Load More" or cursor-based
- [ ] Add fuzzy search for typo tolerance
- [ ] Implement search debouncing (already in SearchSchoolsResults)
- [ ] Cache school detail pages

---

## 11. Troubleshooting

### Issue: "Supabase is not configured"
**Solution:** Ensure all three env vars are set in `.env.local` and browser has access to `NEXT_PUBLIC_*` vars

### Issue: RPC function returns empty
**Solution:** Either:
1. Run `001_create_normalized_schema.sql` to create the function
2. Or fallback to `searchSchoolsFromView()` works automatically

### Issue: Cities dropdown empty but state selected
**Solution:** Check if state_id is populated in cities table:
```sql
SELECT * FROM cities WHERE state_id IS NULL LIMIT 5;
```

### Issue: Schools not appearing in results
**Solution:** Check if schools table has state_id/city_id populated:
```sql
SELECT COUNT(*) as total, COUNT(state_id) as with_state_id FROM schools;
```

---

## 12. Support & Documentation

- **Supabase Docs**: https://supabase.com/docs
- **Next.js App Router**: https://nextjs.org/docs/app
- **Database Schema**: See `001_create_normalized_schema.sql` comments
- **Query Parser Tests**: See `parse-school-query.ts` examples

---

**Last Updated:** March 2026
**Kindred School Discovery v2.0**
