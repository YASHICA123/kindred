# Deployment Guide - Kindred School Discovery

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Supabase Project**: Create a project at [supabase.com](https://supabase.com)
3. **Firebase Project**: Already configured (credentials in `lib/firebase.ts`)

---

## Step 1: Set Up Supabase

### 1.1 Create Supabase Project
1. Go to [app.supabase.com](https://app.supabase.com)
2. Click "New Project"
3. Choose a name, database password, and region
4. Wait for the project to be created

### 1.2 Get Your Credentials
1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key**
   - **service_role key** (keep this secret!)

### 1.3 Create the Schools Table
Run this SQL in the Supabase SQL Editor:

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

-- Create index for faster searches
CREATE INDEX idx_schools_city ON schools(city);
CREATE INDEX idx_schools_state ON schools(state);
CREATE INDEX idx_schools_type ON schools(type);
CREATE INDEX idx_schools_board ON schools(board);
CREATE INDEX idx_schools_slug ON schools(slug);

-- Enable Row Level Security (RLS)
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON schools
  FOR SELECT USING (true);

-- Create policy to allow authenticated insert (optional)
CREATE POLICY "Allow authenticated insert" ON schools
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
```

### 1.4 Import Your School Data (Optional)
If you have the CSV file with school data:

```bash
# Set environment variables in .env.local
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Run the migration script
npx ts-node scripts/migrate-csv-to-supabase.ts 50_indian_schools_dataset.csv
```

---

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Connect Your Repository**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your Git repository
   - Vercel will auto-detect it's a Next.js project

2. **Configure Environment Variables**
   Click "Environment Variables" and add:
   
   ```
   NEXT_PUBLIC_SUPABASE_URL = https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY = your_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY = your_service_role_key_here
   ```

3. **Deploy Settings**
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)
   - **Node Version**: 20.x

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (~2-3 minutes)
   - Your site will be live at `https://your-project.vercel.app`

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from your project directory
cd kindred-1
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Choose your account
# - Link to existing project? No (first time) / Yes (if already created)
# - Project name: kindred-school-discovery
# - Directory: ./
# - Override settings? No

# Add environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY

# Deploy to production
vercel --prod
```

---

## Step 3: Post-Deployment Configuration

### 3.1 Update Firebase Auth Domain (if needed)
If you're using Firebase Authentication:

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: `kindred-c52ce`
3. Go to **Authentication** → **Settings** → **Authorized Domains**
4. Add your Vercel domain: `your-project.vercel.app`

### 3.2 Configure Custom Domain (Optional)
1. In Vercel Dashboard → **Settings** → **Domains**
2. Add your custom domain
3. Update DNS records as instructed by Vercel
4. Add the custom domain to Firebase authorized domains

### 3.3 Set Up Supabase Auth (if using)
1. In Supabase Dashboard → **Authentication** → **URL Configuration**
2. Add your Vercel URL to **Site URL**
3. Add redirect URLs if needed

---

## Step 4: Verify Deployment

Test these key features:

1. **Homepage**: Visit your Vercel URL
2. **Schools Discovery**: Check `/discover` page
3. **School Details**: Click on a school to view details
4. **Search**: Test the search functionality
5. **Common Application**: Test `/common-application` form

---

## Environment Variables Reference

| Variable | Type | Description | Where to Get |
|----------|------|-------------|--------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Public | Supabase project URL | Supabase → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | Supabase anonymous key | Supabase → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Secret | Supabase admin key | Supabase → Settings → API |

---

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify environment variables are set correctly
- Check for TypeScript errors: `npm run build` locally

### Database Connection Issues
- Verify Supabase credentials are correct
- Check if RLS policies allow public access
- Test connection locally first

### 404 Errors on Dynamic Routes
- Ensure `next.config.mjs` is properly configured
- Check that dynamic routes exist in `app/` directory
- Verify deployment completed successfully

### API Routes Not Working
- Check API route files are in `app/api/` directory
- Verify environment variables in Vercel
- Check function logs in Vercel dashboard

---

## Automatic Deployments

Vercel automatically deploys when you push to your repository:

- **Production**: Deploys when you push to `main` branch
- **Preview**: Deploys for every pull request
- **Branch Previews**: Deploys for every branch push

---

## Monitoring & Analytics

1. **Vercel Analytics**
   Already included via `@vercel/analytics` package

2. **Function Logs**
   View in Vercel Dashboard → Functions → Logs

3. **Build Logs**
   View in Vercel Dashboard → Deployments → [deployment] → Build Logs

---

## Useful Commands

```bash
# Local development
npm run dev

# Build locally
npm run build

# Start production server locally
npm run start

# Deploy preview
vercel

# Deploy production
vercel --prod

# View deployment logs
vercel logs

# List projects
vercel list
```

---

## Additional Resources

- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Firebase Documentation](https://firebase.google.com/docs)

---

## Next Steps

1. ✅ Push your latest code to GitHub
2. ✅ Set up Supabase database
3. ✅ Deploy to Vercel
4. ✅ Configure environment variables
5. ✅ Test all features
6. 🎉 Share your live site!

Your project is ready to deploy! If you encounter any issues, check the troubleshooting section or Vercel's build logs for detailed error messages.
