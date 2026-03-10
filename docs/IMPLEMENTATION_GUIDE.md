# Implementation Guide - School Search Upgrade

## Quick Start (15 minutes)

### 1. Database Setup (5 min)
- [ ] Open Supabase Dashboard → SQL Editor
- [ ] Copy `scripts/001_create_normalized_schema.sql` → Run
- [ ] Copy `scripts/002_seed_states_cities.sql` → Run
- [ ] Verify: `SELECT COUNT(*) FROM states;` returns 35

### 2. Add Environment Variables (2 min)
Update `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyj...
SUPABASE_SERVICE_ROLE_KEY=eyj...
```

### 3. Copy New Files (5 min)
```bash
# Query parser
lib/parse-school-query.ts

# Supabase queries - UPDATE existing file (add new functions)
lib/supabase-queries.ts

# Components
components/school-search-module.tsx
components/search-schools-results.tsx
components/schools-filter-bar.tsx

# Routes
app/schools/page.tsx
app/schools/[state]/page.tsx
app/schools/[state]/[city]/page.tsx

# API
app/api/schools/search/route.ts
```

### 4. Migrate Schools Data (3 min)
If you have existing schools with city/state as text:

In Supabase SQL Editor, run:
```sql
-- Backfill state_id and city_id
UPDATE schools s SET city_id = c.id
FROM cities c WHERE LOWER(s.city) = LOWER(c.name);

UPDATE schools s SET state_id = st.id
FROM states st WHERE LOWER(s.state) = LOWER(st.name);
```

---

## Integration Steps

### Step 1: Update Homepage to Use New Search Module

**File:** `app/page.tsx`

Replace old search with:
```tsx
import { SchoolSearchModule } from "@/components/school-search-module"

export default function HomePage() {
  return (
    <main>
      {/* ... other sections ... */}
      
      {/* Replace old DiscoverySection with new search */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <h1 className="font-serif text-4xl lg:text-5xl font-bold mb-3">
              Find Your Perfect School
            </h1>
          </div>
          <SchoolSearchModule />
        </div>
      </section>

      {/* ... rest of sections ... */}
    </main>
  )
}
```

### Step 2: Update Next.js Config (if needed)

Ensure ISR is working. In `next.config.mjs`:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... existing config ...
  
  // Enable ISR for dynamic routes
  staticPageGenerationTimeout: 60,
  
  // Revalidate strategy
  revalidate: 3600, // 1 hour
}

export default nextConfig
```

### Step 3: Add Navigation Link to /schools

Update header/navigation component to include link:
```tsx
<Link href="/schools" className="...">
  Discover Schools
</Link>
```

### Step 4: (Optional) Create School Detail Page

For individual school pages at `/schools/{slug}`:

**File:** `app/schools/[slug]/page.tsx`

```tsx
import { Metadata } from "next"
import { fetchSchoolDetailsWithLocation } from "@/lib/supabase-queries"

export async function generateMetadata({ params }): Promise<Metadata> {
  const school = await fetchSchoolDetailsWithLocation(params.slug)
  
  return {
    title: `${school?.name || "School"} | Kindred`,
    description: school?.address || "Discover this school on Kindred",
  }
}

export default async function SchoolDetailPage({ params }) {
  const school = await fetchSchoolDetailsWithLocation(params.slug)
  
  if (!school) {
    return <div>School not found</div>
  }

  return (
    <main>
      {/* School detail content */}
      <h1>{school.name}</h1>
      <p>Board: {school.board}</p>
      <p>Address: {school.address}</p>
      {/* ... more details ... */}
    </main>
  )
}
```

---

## File-by-File Breakdown

### New Files to Create

#### 1. `lib/parse-school-query.ts`
- **Purpose:** Parse natural language school queries
- **Exports:**
  - `parseSchoolQuery()` - Main parsing function
  - `SEARCH_QUERY_EXAMPLES` - Example queries for placeholders
  - `getRotatingPlaceholder()` - Get rotating example
  - `formatFeesRange()` - Display fees nicely
- **Usage:** Automatically used in SchoolSearchModule

#### 2. `components/school-search-module.tsx`
- **Purpose:** Homepage search bar with State → City → Board → Fees dropdowns
- **Client Component:** Yes
- **Props:** None (uses Router internally)
- **Features:**
  - Rotating placeholder examples
  - State dropdown (loads all states)
  - City dropdown (loads cities when state selected)
  - Board/Fees dropdowns
  - Query parsing integration
  - Keyboard support (Enter to search)

#### 3. `components/search-schools-results.tsx`
- **Purpose:** Display filtered school results
- **Client Component:** Yes
- **Props:** `searchParams` from page
- **Features:**
  - Fetches schools based on filters
  - Shows school cards with rating, fees, location
  - Loading states
  - Empty state UI
  - Links to individual school pages

#### 4. `components/schools-filter-bar.tsx`
- **Purpose:** Show active filters as removable chips
- **Client Component:** Yes
- **Props:** None (uses searchParams)
- **Features:**
  - Display active filters
  - Remove individual filters
  - Clear all filters

#### 5. `app/schools/page.tsx`
- **Purpose:** Main schools discovery page
- **Route:** `/schools`
- **Features:**
  - Shows all schools
  - SEO metadata
  - Supports `?q=`, `?board=`, `?fees=` query params

#### 6. `app/schools/[state]/page.tsx`
- **Purpose:** Schools filtered by state
- **Route:** `/schools/haryana`
- **Features:**
  - Static generation for popular states
  - Dynamic metadata with state name
  - Pre-fetched cities list

#### 7. `app/schools/[state]/[city]/page.tsx`
- **Purpose:** Schools filtered by state and city
- **Route:** `/schools/haryana/gurgaon`
- **Features:**
  - Breadcrumb navigation
  - Most specific search results
  - Static generation for popular combos

#### 8. `app/api/schools/search/route.ts`
- **Purpose:** API endpoint for school search
- **Method:** GET
- **Query Params:** state, city, board, type, feesMin, feesMax, sort, limit, offset
- **Returns:** `{ schools: [...], total: number }`
- **Caching:** 5 min + 10 min stale-while-revalidate

### Updated Files

#### `lib/supabase-queries.ts`
**Add these new exports:**
```typescript
// New functions
export async function fetchAllStates()
export async function fetchCitiesByState(stateSlug: string)
export async function fetchCitiesByStateId(stateId: string)
export async function searchSchoolsAdvanced(filters)
export async function searchSchoolsFromView(filters)
export async function fetchSchoolDetailsWithLocation(slug: string)
export async function fetchStatesWithCities()
export async function getSchoolsStatistics()
```

Keep all existing functions unchanged.

---

## Testing Checklist

### Database
- [ ] States table has 35 rows: `SELECT COUNT(*) FROM states;`
- [ ] Cities table has 40+ rows: `SELECT COUNT(*) FROM cities;`
- [ ] schools table has state_id column: `SELECT state_id FROM schools LIMIT 1;`
- [ ] schools table has city_id column: `SELECT city_id FROM schools LIMIT 1;`
- [ ] View exists: `SELECT * FROM school_search_view LIMIT 1;`
- [ ] RPC works: `SELECT * FROM search_schools('delhi'::text, null::text, null::text, null::text, null::numeric, null::numeric, 'rating_desc', 20, 0);`

### Frontend - Local Testing

```bash
npm run dev
```

- [ ] Navigate to `http://localhost:3000/schools`
  - Should show "Discover Schools" heading
  - Should have SearchSchoolsResults component with schools
  
- [ ] Test `/schools/delhi`
  - Should show "Schools in Delhi"
  - Should only show Delhi schools

- [ ] Test `/schools/haryana/gurgaon`
  - Should show "Schools in Gurgaon"
  - Should only show Gurgaon schools
  - Should have breadcrumb navigation

- [ ] Test query params:
  - `/schools?board=IB` - Filter by IB board
  - `/schools?fees=100000-200000` - Filter by fee range
  - `/schools?q=best+schools` - Search query

- [ ] Test homepage search:
  - Type "best IB schools in Gurgaon under 2 lakh"
  - Press Enter
  - Should redirect to `/schools/haryana/gurgaon?board=IB&fees=100000-200000`

### Performance
- [ ] Schools page loads in < 2 seconds
- [ ] City dropdown populates in < 500ms
- [ ] Filter changes update results quickly
- [ ] No console errors

---

## Deployment Checklist

### Before Deploying to Production

1. **Database Backup**
   - [ ] Manually backup schools data
   - [ ] Test backup restore process

2. **Environment Variables**
   - [ ] Add to Vercel project settings
   - [ ] Verify all three Supabase keys present

3. **Database Migration**
   - [ ] Run migration on production database
   - [ ] Verify all tables/indexes created
   - [ ] Seed states/cities data
   - [ ] Backfill state_id/city_id for existing schools

4. **Code Verification**
   - [ ] All files copied correctly
   - [ ] No console errors in build
   - [ ] No TypeScript errors: `npm run build`

5. **Preview Deployment**
   - [ ] Deploy to Vercel preview
   - [ ] Test search functionality
   - [ ] Verify SEO metadata
   - [ ] Check performance metrics

6. **Production Deployment**
   - [ ] Monitor error logs post-deployment
   - [ ] Check search functionality
   - [ ] Monitor database query performance

---

## Rollback Plan

If issues occur after deployment:

### Option 1: Revert to Previous Version
```bash
git revert <commit-hash>
git push
# Vercel will auto-redeploy
```

### Option 2: Disable New Search Routes
Add to `next.config.mjs`:
```javascript
const nextConfig = {
  redirects: async () => [
    {
      source: '/schools/:path*',
      destination: '/',
      permanent: false,
    },
  ],
}
```

### Option 3: Database Rollback
Restore from backup:
```sql
-- Restore schools table from backup
-- Remove state_id, city_id, board columns if needed
```

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| 404 on `/schools` | Ensure `app/schools/page.tsx` exists |
| Empty cities dropdown | Check if `state_id` is set in cities table |
| No schools showing | Check if `state_id`/`city_id` are populated in schools |
| RPC function not found | Run `001_create_normalized_schema.sql` |
| Slow search results | Add missing indexes (run migration again) |
| Query parser not extracting city | Ensure city slug matches exactly in dictionary |

---

## Performance Tuning

### Database Indexes (Already Included)
```sql
CREATE INDEX idx_schools_state_city ON schools(state_id, city_id);
CREATE INDEX idx_schools_board ON schools(board);
CREATE INDEX idx_schools_rating ON schools(rating DESC);
CREATE INDEX idx_schools_fees_range ON schools(fees_min, fees_max);
```

### Next.js Caching
```typescript
// In component or API
import { revalidatePath, revalidateTag } from 'next/cache'

// Revalidate when schools change (from admin panel)
export async function updateSchoolData() {
  // ... update logic ...
  revalidatePath('/schools', 'layout')
  revalidateTag('schools')
}
```

### Query Optimization
- RPC function uses parameterized queries (safe from injection)
- Indexes prevent full table scans
- Composite indexes for multi-field filters
- Pagination loaded with `limit/offset`

---

## Next Steps (Post-Launch)

1. **Add School Comparison** (CompareSchoolsView)
   - Multi-select schools
   - Side-by-side comparison table
   - Export to PDF

2. **Add Saved Schools** (requires auth)
   - Bookmark schools
   - View saved list
   - Share saved list with others

3. **Add Reviews & Ratings**
   - User-submitted reviews
   - Parent ratings
   - Photo gallery

4. **Add Map View**
   - Show schools geographically
   - Filter by radius/area
   - Directions integration

5. **Analytics Dashboard**
   - Track popular searches
   - Popular filters
   - User behavior insights

---

## Support References

- **Query Parser Examples:** See `lib/parse-school-query.ts` JSDoc
- **API Documentation:** See `/api/schools/search/route.ts` comments
- **Database Setup:** See `scripts/001_create_normalized_schema.sql` comments
- **Full Environment Guide:** See `docs/SCHOOL_SEARCH_SETUP.md`

---

**Document Version:** 2.0
**Last Updated:** March 2026
**Kindred School Discovery System**
