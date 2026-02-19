# Vercel Environment Variables Setup Script (PowerShell)
# Run this after deployment to add environment variables

Write-Host "🚀 Setting up Vercel Environment Variables..." -ForegroundColor Green
Write-Host ""

# Check if Vercel CLI is installed
if (!(Get-Command vercel -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Vercel CLI not found. Installing..." -ForegroundColor Red
    npm i -g vercel
}

Write-Host "📝 You need to add these environment variables manually in Vercel Dashboard:" -ForegroundColor Yellow
Write-Host ""
Write-Host "Go to: https://vercel.com/dashboard -> Your Project -> Settings -> Environment Variables" -ForegroundColor Cyan
Write-Host ""

Write-Host "=" * 80 -ForegroundColor Gray
Write-Host "Variable 1: NEXT_PUBLIC_SUPABASE_URL" -ForegroundColor Cyan
Write-Host "Value: https://enchwrptwtctikbhrpsg.supabase.co"
Write-Host ""

Write-Host "Variable 2: NEXT_PUBLIC_SUPABASE_ANON_KEY" -ForegroundColor Cyan
Write-Host "Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVuY2h3cnB0d3RjdGlrYmhycHNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0Nzg4MjQsImV4cCI6MjA4NzA1NDgyNH0.5muOyMFOjnTT1FG_sSjd9OdzornfeYK2CuxmbnoDoCs"
Write-Host ""

Write-Host "Variable 3: SUPABASE_SERVICE_ROLE_KEY" -ForegroundColor Cyan
Write-Host "Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVuY2h3cnB0d3RjdGlrYmhycHNnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTQ3ODgyNCwiZXhwIjoyMDg3MDU0ODI0fQ.HIpb1oy-Fz79hDx3Fr3KxwFE-eJPmJ_SZcYDi1Ffl88"
Write-Host "=" * 80 -ForegroundColor Gray

Write-Host ""
Write-Host "📋 These values are also in your .env.local file" -ForegroundColor Yellow
Write-Host ""
Write-Host "After adding the variables, redeploy:" -ForegroundColor Green
Write-Host "   vercel --prod" -ForegroundColor White
Write-Host ""
Write-Host "Or just push a commit to trigger automatic redeployment." -ForegroundColor White
