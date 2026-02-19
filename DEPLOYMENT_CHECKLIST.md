# Quick Deployment Checklist

## Pre-Deployment ✓

- [ ] Code is committed and pushed to Git
- [ ] `.env.local` is NOT committed (check `.gitignore`)
- [ ] All dependencies are in `package.json`
- [ ] Build succeeds locally: `npm run build`

## Supabase Setup ✓

- [ ] Supabase project created
- [ ] Schools table created with SQL script
- [ ] RLS policies configured
- [ ] Test data imported (optional)
- [ ] Supabase credentials saved:
  - [ ] Project URL
  - [ ] Anon key
  - [ ] Service role key

## Vercel Deployment ✓

- [ ] Vercel account created/logged in
- [ ] Repository connected to Vercel
- [ ] Environment variables added:
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Build settings verified (should auto-detect Next.js)
- [ ] Deployed successfully

## Post-Deployment ✓

- [ ] Firebase authorized domains updated
- [ ] Homepage loads correctly
- [ ] Schools discovery works (`/discover`)
- [ ] Search functionality working
- [ ] School detail pages load
- [ ] API routes responding
- [ ] Common application form loads
- [ ] Dashboard accessible

## Optional Enhancements ✓

- [ ] Custom domain configured
- [ ] Analytics enabled
- [ ] Error monitoring set up
- [ ] Performance optimization

---

## Quick Commands

```bash
# Verify build locally
npm run build && npm run start

# Deploy to Vercel (one-time)
npx vercel --prod

# Check environment variables
vercel env ls

# View logs
vercel logs
```

## Common Issues

**Build fails**: Check Vercel build logs, verify all env vars are set

**404 errors**: Ensure dynamic routes are in `app/` directory structure

**Database errors**: Verify Supabase credentials and RLS policies

**API not working**: Check environment variables are available in Vercel

---

✅ **All set?** Push your code and let Vercel auto-deploy!
