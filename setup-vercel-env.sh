#!/usr/bin/env bash

# Vercel Environment Variables Setup Script
# Run this after deployment to add environment variables

echo "🚀 Setting up Vercel Environment Variables..."
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm i -g vercel
fi

echo "📝 Adding environment variables to your Vercel project..."
echo ""

# NEXT_PUBLIC_SUPABASE_URL
echo "Adding NEXT_PUBLIC_SUPABASE_URL..."
echo "https://enchwrptwtctikbhrpsg.supabase.co" | vercel env add NEXT_PUBLIC_SUPABASE_URL production

# NEXT_PUBLIC_SUPABASE_ANON_KEY
echo "Adding NEXT_PUBLIC_SUPABASE_ANON_KEY..."
echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVuY2h3cnB0d3RjdGlrYmhycHNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0Nzg4MjQsImV4cCI6MjA4NzA1NDgyNH0.5muOyMFOjnTT1FG_sSjd9OdzornfeYK2CuxmbnoDoCs" | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production

# SUPABASE_SERVICE_ROLE_KEY
echo "Adding SUPABASE_SERVICE_ROLE_KEY..."
echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVuY2h3cnB0d3RjdGlrYmhycHNnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTQ3ODgyNCwiZXhwIjoyMDg3MDU0ODI0fQ.HIpb1oy-Fz79hDx3Fr3KxwFE-eJPmJ_SZcYDi1Ffl88" | vercel env add SUPABASE_SERVICE_ROLE_KEY production

echo ""
echo "✅ Environment variables added successfully!"
echo ""
echo "🔄 Now redeploy your project:"
echo "   vercel --prod"
echo ""
echo "Or push a new commit to trigger automatic deployment."
