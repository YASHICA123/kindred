# URGENT FIX: Environment Variables Missing in Vercel

## 🔴 The Problem

Your deployment is failing because **Vercel doesn't have the Supabase environment variables**.

Error: `ci.from is not a function` means Supabase client isn't initialized.

## ✅ Quick Fix (2 minutes)

### Option 1: Vercel Dashboard (Easiest)

1. **Go to Vercel Dashboard**:
   - Visit: https://vercel.com/dashboard
   - Click on your project (kindred or similar name)
   - Go to **Settings** → **Environment Variables**

2. **Add these 3 variables** (click "Add" for each):

   **Variable 1:**
   ```
   Name: NEXT_PUBLIC_SUPABASE_URL
   Value: https://enchwrptwtctikbhrpsg.supabase.co
   Environment: Production (check this)
   ```

   **Variable 2:**
   ```
   Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
   Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVuY2h3cnB0d3RjdGlrYmhycHNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0Nzg4MjQsImV4cCI6MjA4NzA1NDgyNH0.5muOyMFOjnTT1FG_sSjd9OdzornfeYK2CuxmbnoDoCs
   Environment: Production (check this)
   ```

   **Variable 3:**
   ```
   Name: SUPABASE_SERVICE_ROLE_KEY
   Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVuY2h3cnB0d3RjdGlrYmhycHNnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTQ3ODgyNCwiZXhwIjoyMDg3MDU0ODI0fQ.HIpb1oy-Fz79hDx3Fr3KxwFE-eJPmJ_SZcYDi1Ffl88
   Environment: Production (check this)
   ```

3. **Redeploy**:
   - Go to **Deployments** tab
   - Click the **⋮** menu on the latest deployment
   - Click **Redeploy**

### Option 2: PowerShell Script

Run this in your project directory:

```powershell
.\setup-vercel-env.ps1
```

Then manually add the variables shown in Vercel Dashboard.

## 📸 Screenshot Guide

1. Vercel → Your Project → Settings → Environment Variables
2. Click "Add New"
3. Paste name and value
4. Select "Production"
5. Click "Save"
6. Repeat for all 3 variables
7. Go to Deployments → Redeploy

## 🔍 Verify It's Fixed

After redeployment, your site should:
- ✅ Load school pages without errors
- ✅ Show school discovery page
- ✅ Display school details correctly
- ✅ No "ci.from is not a function" errors

## 🆘 Still Having Issues?

Check build logs:
1. Vercel Dashboard → Deployments → Latest → View Function Logs
2. Look for: "✓ NEXT_PUBLIC_SUPABASE_URL" and "✓ NEXT_PUBLIC_SUPABASE_ANON_KEY"
3. If you see "✗ MISSING", the env vars aren't loaded

---

**The fix I made**: Updated `lib/supabase.ts` to show clearer error messages instead of cryptic "is not a function" errors.

**What you need to do**: Add the 3 environment variables to Vercel and redeploy.
