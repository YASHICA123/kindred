# 🏗️ System Architecture - School Search v2.0

## High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         KINDRED SCHOOL DISCOVERY v2.0                       │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│                            FRONTEND (Next.js 16)                             │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ app/page.tsx (Homepage)                                             │   │
│  │  ↓                                                                   │   │
│  │  <SchoolSearchModule />  ← Premium search bar with dropdowns        │   │
│  │     ├─ State dropdown (loads all 35 states)                         │   │
│  │     ├─ City dropdown (loads cities when state selected)             │   │
│  │     ├─ Board dropdown (CBSE, ICSE, IB, Cambridge, etc.)            │   │
│  │     ├─ Fee range dropdown (₹50K to ₹5L+)                           │   │
│  │     └─ Text query input with parsing                               │   │
│  │        ↓                                                            │   │
│  │        parseSchoolQuery() ← Extract filters from "best IB schools" │   │
│  │        ↓                                                            │   │
│  │        Sync dropdowns with parsed query                            │   │
│  │        ↓                                                            │   │
│  │        Redirect to /schools/[state]/[city]?board=IB&fees=...       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ app/schools/page.tsx → /schools (All schools)                      │   │
│  │ app/schools/[state]/page.tsx → /schools/haryana (By state)         │   │
│  │ app/schools/[state]/[city]/page.tsx → /schools/haryana/gurgaon    │   │
│  │                                                                     │   │
│  │ All routes render:                                                 │   │
│  │  <SearchSchoolsResults />  ← Displays school cards                 │   │
│  │     ├─ School name with link                                      │   │
│  │     ├─ Rating (⭐️ format)                                          │   │
│  │     ├─ Board & Type badges                                        │   │
│  │     ├─ Location (city & address)                                  │   │
│  │     ├─ Fee range (₹1L - ₹5L)                                      │   │
│  │     ├─ Website link                                               │   │
│  │     ├─ Phone (click to call)                                      │   │
│  │     └─ "View Details" button                                      │   │
│  │     ↓                                                              │   │
│  │  <SchoolsFilterBar />  ← Shows active filters as chips             │   │
│  │     ├─ Remove individual filters                                  │   │
│  │     └─ "Clear All" button                                         │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Utilities (lib/)                                                    │   │
│  │  • parse-school-query.ts                                           │   │
│  │    - parseSchoolQuery("best IB schools in Gurgaon under 2L")       │   │
│  │    - getRotatingPlaceholder() [rotates every 5s]                  │   │
│  │    - formatFeesRange(min, max)                                    │   │
│  │                                                                     │   │
│  │  • supabase-queries.ts (UPDATED with 8 new functions)             │   │
│  │    - fetchAllStates()                                             │   │
│  │    - fetchCitiesByState(stateSlug)                                │   │
│  │    - searchSchoolsAdvanced(filters) [uses RPC]                    │   │
│  │    - searchSchoolsFromView(filters) [fallback]                    │   │
│  │    - getSchoolsStatistics()                                       │   │
│  │    - And more...                                                  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
                                    ↓↓↓ API CALLS ↓↓↓
┌──────────────────────────────────────────────────────────────────────────────┐
│                     BACKEND (Supabase + Next.js API)                         │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ app/api/schools/search/route.ts                                    │   │
│  │ GET /api/schools/search?state=haryana&city=gurgaon&board=IB        │   │
│  │  ↓                                                                  │   │
│  │  Call: searchSchoolsAdvanced() or searchSchoolsFromView()          │   │
│  │  ↓                                                                  │   │
│  │  Return: { schools: [...], total: 42 }                            │   │
│  │  - Cached: 5 min + 10 min stale-while-revalidate                 │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    ↓↓↓ QUERIES ↓↓↓                          │
├──────────────────────────────────────────────────────────────────────────────┤
│                         SUPABASE DATABASE (PostgreSQL)                       │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │ RPC FUNCTION APPROACH (Optimal Performance)                          │  │
│  │                                                                      │  │
│  │ search_schools(                                                     │  │
│  │   p_state_slug = 'haryana',                                         │  │
│  │   p_city_slug = 'gurgaon',                                          │  │
│  │   p_board = 'IB',                                                   │  │
│  │   p_type = null,                                                    │  │
│  │   p_fees_min = null,                                                │  │
│  │   p_fees_max = 200000,                                              │  │
│  │   p_sort_by = 'rating_desc',                                        │  │
│  │   p_limit = 20,                                                     │  │
│  │   p_offset = 0                                                      │  │
│  │ )                                                                    │  │
│  │  ↓                                                                  │  │
│  │  SQL with INDEXES:                                                 │  │
│  │  ├─ idx_schools_state_city (state_id, city_id)                     │  │
│  │  ├─ idx_schools_board (board)                                      │  │
│  │  ├─ idx_schools_rating (rating DESC)                               │  │
│  │  └─ idx_schools_fees_range (fees_min, fees_max)                    │  │
│  │  ↓                                                                  │  │
│  │  Results: ~50ms query time (with indexes)                          │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │ FALLBACK: VIEW APPROACH (If RPC fails)                              │  │
│  │                                                                      │  │
│  │ school_search_view                                                  │  │
│  │  = JOIN schools + cities + states                                  │  │
│  │  ↓                                                                  │  │
│  │ SELECT * FROM school_search_view                                    │  │
│  │ WHERE state_slug = 'haryana'                                        │  │
│  │   AND city_slug = 'gurgaon'                                        │  │
│  │   AND board = 'IB'                                                  │  │
│  │   AND fees_max <= 200000                                            │  │
│  │ ORDER BY rating DESC                                                │  │
│  │ LIMIT 20                                                            │  │
│  │  ↓                                                                  │  │
│  │ Results: ~200ms query time (join-based)                            │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │ TABLES                                                               │  │
│  │                                                                      │  │
│  │ states (35 rows)                                                    │  │
│  │ ├─ id (uuid)                                                        │  │
│  │ ├─ name (Haryana, Delhi, etc.)                                      │  │
│  │ ├─ slug (haryana, delhi, etc.)                                      │  │
│  │ └─ code (HR, DL, etc.)                                              │  │
│  │                                                                      │  │
│  │ cities (40+ rows)                                                   │  │
│  │ ├─ id (uuid)                                                        │  │
│  │ ├─ name (Gurgaon, Mumbai, etc.)                                     │  │
│  │ ├─ slug (gurgaon, mumbai, etc.)                                     │  │
│  │ ├─ state_id (FK → states.id)                                        │  │
│  │ └─ postal_code                                                      │  │
│  │                                                                      │  │
│  │ schools (your existing data)                                        │  │
│  │ ├─ id                                                               │  │
│  │ ├─ name                                                             │  │
│  │ ├─ slug                                                             │  │
│  │ ├─ state_id (NEW - FK → states.id)                                  │  │
│  │ ├─ city_id (NEW - FK → cities.id)                                   │  │
│  │ ├─ board (NEW - CBSE, ICSE, IB, etc.)                               │  │
│  │ ├─ type (NEW - Day School, Boarding, etc.)                          │  │
│  │ ├─ rating (NEW/UPDATED - numeric)                                   │  │
│  │ ├─ fees_min (NEW - numeric)                                         │  │
│  │ ├─ fees_max (NEW - numeric)                                         │  │
│  │ ├─ address (NEW - text)                                             │  │
│  │ ├─ phone (NEW - varchar)                                            │  │
│  │ ├─ website_url (NEW - varchar)                                      │  │
│  │ ├─ tags (NEW - text array)                                          │  │
│  │ └─ ... existing fields ...                                          │  │
│  │                                                                      │  │
│  │ school_search_view (optimized for search)                           │  │
│  │ ├─ All school fields +                                              │  │
│  │ ├─ city_name, city_slug +                                           │  │
│  │ └─ state_name, state_slug                                           │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## User Journey Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        USER JOURNEY FLOWCHART                                │
└─────────────────────────────────────────────────────────────────────────────┘

START: User visits homepage
  │
  ├─ [Option 1: Use dropdowns]
  │   │
  │   ├─ Sees SchoolSearchModule
  │   │  │
  │   │  ├─ Clicks "Select State" → Sees list of 35 states
  │   │  │  │
  │   │  │  └─ Selects "Haryana" → Cities dropdown now enabled
  │   │  │
  │   │  ├─ Clicks "Select City" → Sees Haryana cities (Gurgaon, Noida, etc)
  │   │  │  │
  │   │  │  └─ Selects "Gurgaon"
  │   │  │
  │   │  ├─ (Optional) Selects "IB" board
  │   │  ├─ (Optional) Selects "₹1-2L" fee range
  │   │  │
  │   │  └─ Clicks "Search Schools"
  │   │     │
  │   │     └─ Navigation: /schools/haryana/gurgaon?board=IB&fees=100000-200000
  │
  └─ [Option 2: Use text query]
      │
      ├─ Sees rotating placeholder: "Best IB schools in Gurgaon"
      │
      ├─ Types: "best IB schools in Gurgaon under 2 lakh"
      │
      ├─ Presses Enter OR Clicks "Search Schools"
      │  │
      │  ├─ Query parsed by parseSchoolQuery():
      │  │  │
      │  │  └─ Extracts:
      │  │     ├─ stateSlug: "haryana"
      │  │     ├─ citySlug: "gurgaon"
      │  │     ├─ board: "IB"
      │  │     ├─ feesMax: 200000
      │  │     └─ sort: "rating_desc"
      │  │
      │  ├─ Dropdowns synced with parsed values
      │  │
      │  └─ Navigation: /schools/haryana/gurgaon?board=IB&fees=100000-200000

RESULTS PAGE
  │
  ├─ URL: /schools/haryana/gurgaon?board=IB&fees=100000-200000
  │
  ├─ Route handler (app/schools/[state]/[city]/page.tsx):
  │  │
  │  ├─ Receives: { state: "haryana", city: "gurgaon" }
  │  ├─ Receives: { board: "IB", fees: "100000-200000", ... }
  │  │
  │  └─ Renders SearchSchoolsResults component
  │
  ├─ Component fetches via searchSchoolsAdvanced():
  │  │
  │  ├─ Calls: rpc('search_schools', { ... })
  │  ├─ Params: { p_state_slug: 'haryana', p_city_slug: 'gurgaon', p_board: 'IB', p_fees_max: 200000, ... }
  │  │
  │  └─ Returns: { schools: [...], total: 42 }
  │
  ├─ Display Results:
  │  │
  │  ├─ Shows: "Found 42 schools"
  │  ├─ Shows: Filter chips (Board: IB, Fees: ₹1-2L)
  │  │
  │  └─ For each school:
  │     ├─ School name (linked to detail page)
  │     ├─ ⭐️ Rating (e.g., 4.5)
  │     ├─ Board badge (IB)
  │     ├─ Type badge (Day School)
  │     ├─ Location (Gurgaon, Address)
  │     ├─ Fees (₹1.5L - ₹1.8L/year)
  │     ├─ Website link
  │     ├─ Phone (click to call)
  │     └─ "View Details" button

FURTHER ACTIONS
  │
  ├─ [A] Click school name/details → /schools/{slug} (detail page)
  ├─ [B] Click filter chip X → Remove filter, results update
  ├─ [C] Click "Clear All" → Back to /schools with no filters
  ├─ [D] Click back button → Returns to /schools/haryana
  └─ [E] Change city → Results update automatically

END
```

---

## Data Flow - Query to Results

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    DATA FLOW: QUERY → DATABASE → RESULTS                    │
└─────────────────────────────────────────────────────────────────────────────┘

User Input
    │
    ├─ Text: "best IB schools in Gurgaon under 2 lakh"
    │
    ↓ parseSchoolQuery()
    
Parsed Query Object
    │
    ├─ {
    │    stateSlug: "haryana",
    │    citySlug: "gurgaon",
    │    board: "IB",
    │    feesMax: 200000,
    │    sort: "rating_desc"
    │  }
    │
    ├─ + Dropdowns selections (may override)
    │ merged into "finalFilters"
    │
    ↓
    
URL Construction
    │
    └─ /schools/haryana/gurgaon?board=IB&fees=100000-200000
    
    ↓ Router Navigation
    
Route Handler
    │
    ├─ Receives params: { state: "haryana", city: "gurgaon" }
    ├─ Receives searchParams: { board: "IB", fees: "100000-200000" }
    │
    ├─ Parses fees: 100000 = fees_min, 200000 = fees_max
    │
    ├─ Creates filter object:
    │  │
    │  └─ {
    │       stateSlug: "haryana",
    │       citySlug: "gurgaon",
    │       board: "IB",
    │       feesMin: 100000,
    │       feesMax: 200000,
    │       sort: "rating_desc",
    │       limit: 20,
    │       offset: 0
    │     }
    │
    ↓
    
searchSchoolsAdvanced()
    │
    ├─ Calls: supabase.rpc('search_schools', filterObject)
    │
    ↓
    
Supabase RPC Function
    │
    ├─ Receives SQL parameters
    ├─ Executes optimized SQL:
    │  │
    │  └─ SELECT * FROM schools s
    │     LEFT JOIN cities c ON s.city_id = c.id
    │     LEFT JOIN states st ON s.state_id = st.id
    │     WHERE st.slug = 'haryana'
    │       AND c.slug = 'gurgaon'
    │       AND s.board = 'IB'
    │       AND s.fees_max <= 200000
    │     ORDER BY s.rating DESC
    │     LIMIT 20
    │
    ├─ Uses indexes:
    │  ├─ idx_schools_state_city (haryana + gurgaon)
    │  ├─ idx_schools_board (IB)
    │  └─ idx_schools_fees_max
    │
    ├─ Query Time: ~50ms
    │
    ├─ Returns:
    │  │
    │  └─ [
    │       { id: "uuid1", name: "Delhi Public School Gurgaon", slug: "dps-gurgaon", 
    │         board: "IB", rating: 4.8, fees_max: 180000, ... },
    │       { id: "uuid2", name: "Pathways School Gurgaon", slug: "pathways-gurgaon",
    │         board: "IB", rating: 4.6, fees_max: 150000, ... },
    │       ...
    │     ]
    │
    ↓
    
Response Object
    │
    └─ {
         schools: [...42 school objects...],
         total: 42
       }

    ↓
    
SearchSchoolsResults Component
    │
    ├─ Sets: schools = [...]
    ├─ Sets: totalResults = 42
    ├─ Sets: isLoading = false
    │
    ↓
    
React Render
    │
    ├─ Shows: "Found 42 schools"
    ├─ Shows: SchoolsFilterBar with active filters
    │
    ├─ For each school:
    │  │
    │  └─ <SchoolResultCard>
    │     ├─ Image
    │     ├─ Name (linked)
    │     ├─ Rating (⭐️ 4.8)
    │     ├─ Board (IB)
    │     ├─ Type (Day School)
    │     ├─ Location (Gurgaon)
    │     ├─ Fees (₹1.5L - ₹1.8L)
    │     ├─ Links (Website, Phone)
    │     └─ "View Details" CTA
    │
    ↓
    
USER SEES RESULTS ✓
    │
    ├─ Can click school for details
    ├─ Can remove filters via chips
    ├─ Can modify search again
    └─ Can navigate through results
```

---

## Performance & Caching Strategy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      CACHING & PERFORMANCE LAYERS                           │
└─────────────────────────────────────────────────────────────────────────────┘

CLIENT (Browser)
  ├─ [Memory] States list (35 items)
  │  └─ Cached in React state, re-fetched if needed
  │
  ├─ [Memory] Cities list (per state)
  │  └─ Loaded on-demand when state selected
  │  └─ Re-fetch on state change
  │
  └─ [Browser Cache] Search results
     └─ Via HTTP cache headers (see below)

NETWORK (HTTP Transport)
  │
  └─ GET /api/schools/search?...
     │
     └─ Cache-Control: public, s-maxage=300, stale-while-revalidate=600
        ├─ Cached for 5 minutes (s-maxage)
        ├─ Serves stale for up to 10 min while revalidating (SWR)
        └─ Same query = instant response (within 5 min window)

SERVER (Next.js)
  │
  ├─ API Route Caching (5 min)
  │  └─ Same filters = re-use cached response
  │  └─ Different filters = new database query
  │
  ├─ Static Generation (SSR)
  │  └─ /schools/haryana - pre-generated at build time
  │  └─ /schools/haryana/gurgaon - pre-generated for popular combos
  │  └─ ISR (Incremental Static Regeneration) for unpopular routes
  │
  └─ Dynamic Routes (SSR on first request)
     └─ /schools/[state] - generated on first request if not pre-generated
     └─ Subsequent requests: served from cache

DATABASE (Supabase)
  │
  ├─ RPC Function Execution
  │  ├─ Query Time: ~50ms (with indexes)
  │  └─ Parameterized (prevents SQL injection)
  │
  ├─ Query Indexes (prevent full table scans)
  │  ├─ idx_schools_state_city (composite)
  │  ├─ idx_schools_board
  │  ├─ idx_schools_rating
  │  └─ idx_schools_fees_range
  │
  └─ View (schema-level optimization)
     └─ school_search_view = pre-joined tables for common queries

TIMELINE (Typical Request)
  │
  ├─ T=0ms: User clicks "Search"
  ├─ T=50ms: Browser processes query parser
  ├─ T=75ms: Route navigation (client-side)
  ├─ T=100ms: API request sent to server
  ├─ T=150ms: Server route handler processes params
  ├─ T=170ms: Supabase RPC executed (~50ms query time)
  ├─ T=250ms: API response with results
  ├─ T=300ms: React re-renders with data
  ├─ T=350ms: User sees results on screen
  │
  └─ Next identical search (within 5 min):
     ├─ T=0ms: User clicks "Search"
     ├─ T=100ms: API request sent (hits browser cache)
     ├─ T=105ms: Cached response returned immediately
     ├─ T=150ms: React re-renders (same data)
     └─ T=200ms: User sees results (instant feel)

OPTIMIZATION CHECKLIST
  ├─ ✅ Database indexes on search columns
  ├─ ✅ RPC function uses parameterized queries
  ├─ ✅ API response caching (5 + 10 min SWR)
  ├─ ✅ Popular routes pre-generated (ISR)
  ├─ ✅ Suspense/skeleton loaders for streaming
  ├─ ✅ Component lazy-loading where possible
  └─ ✅ Debounced filters (optional enhancement)
```

---

## Deployment Topology

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      PRODUCTION DEPLOYMENT SETUP                            │
└─────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────┐
│                           VERCEL (Frontend CDN)                             │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│ ┌─────────────────────────┐      ┌─────────────────────────┐              │
│ │   Next.js Server                │   Next.js Serverless    │ (ISR)       │
│ │  (auto-scaling)                 │   Functions             │              │
│ │  ├─ /schools page               │  ├─ /api/schools/search │              │
│ │  ├─ /schools/[state]            │  └─ Other API routes    │              │
│ │  └─ /schools/[state]/[city]     │                         │              │
│ └─────────────────────────┘      └─────────────────────────┘              │
│           ↓                                   ↓                            │
│     Pre-generated                      RPC query calls                     │
│     routes (HTML)                      Cache: 5 min + SWR                  │
│                                                                            │
│ ┌────────────────────────────────────────────────────────────────────┐   │
│ │                    Static Assets & ISR Cache                       │   │
│ │  ├─ JS/CSS bundles (versioned & cached)                           │   │
│ │  ├─ Pre-generated HTML for popular routes                         │   │
│ │  └─ Fallback HTML for dynamic routes                              │   │
│ └────────────────────────────────────────────────────────────────────┘   │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
                                    ↓
                            (HTTPS Connection)
                                    ↓
┌────────────────────────────────────────────────────────────────────────────┐
│                       SUPABASE (Database & Auth)                            │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│ ┌────────────────────────────────────────────────────────────────────┐   │
│ │           PostgreSQL Database (AWS/GCP Region)                     │   │
│ │                                                                    │   │
│ │  Tables:                                                           │   │
│ │  ├─ states (35 rows)                                              │   │
│ │  ├─ cities (40+ rows)                                             │   │
│ │  ├─ schools (your data)                                           │   │
│ │  └─ Indexes (state_city, board, rating, fees)                    │   │
│ │                                                                    │   │
│ │  Views:                                                            │   │
│ │  └─ school_search_view (optimized joins)                          │   │
│ │                                                                    │   │
│ │  RPC Functions:                                                    │   │
│ │  └─ search_schools(...) [Optimized for filtering]                 │   │
│ │                                                                    │   │
│ └────────────────────────────────────────────────────────────────────┘   │
│                                                                            │
│ ┌────────────────────────────────────────────────────────────────────┐   │
│ │                   Authentication (Optional)                         │   │
│ │  ├─ JWT tokens                                                     │   │
│ │  ├─ Session management                                             │   │
│ │  └─ Row-level security (RLS) policies                              │   │
│ │                                                                    │   │
│ └────────────────────────────────────────────────────────────────────┘   │
│                                                                            │
│ ┌────────────────────────────────────────────────────────────────────┐   │
│ │                        Real-time Features                           │   │
│ │  └─ WebSockets (for future real-time updates)                     │   │
│ │                                                                    │   │
│ └────────────────────────────────────────────────────────────────────┘   │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘

SECURITY LAYER
  ├─ Environment Variables (on Vercel)
  │  ├─ NEXT_PUBLIC_SUPABASE_URL (public)
  │  ├─ NEXT_PUBLIC_SUPABASE_ANON_KEY (public, read-only)
  │  └─ SUPABASE_SERVICE_ROLE_KEY (secret, server-only)
  │
  ├─ Row-Level Security (RLS)
  │  └─ Tables: SELECT allowed for all users
  │  └─ Prevents unauthorized access
  │
  └─ API Protection
     ├─ Parameterized queries (no SQL injection)
     ├─ Rate limiting (via Supabase)
     └─ No sensitive data in responses

MONITORING & LOGGING
  ├─ Vercel Analytics
  │  └─ Performance metrics, error rates
  │
  ├─ Supabase Logs
  │  └─ Database query performance
  │
  └─ Error Tracking
     └─ Sentry (optional) for exception monitoring
```

---

## That's the complete architecture! 

All pieces work together seamlessly to provide:
- ⚡ **Fast searches** (50-100ms with indexes)
- 🔒 **Secure data** (parameterized queries, RLS)
- 🎯 **Smart parsing** (natural language understanding)
- 📱 **Mobile-friendly** (responsive UI)
- 🏗 **Scalable** (ISR, caching, indexes)
- 🎨 **Beautiful** (Tailwind CSS, premium design)

---

**Next:** Start with the Quick Start Guide in `QUICK_START.md` →  30 minutes to launch! 🚀
