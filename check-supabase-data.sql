-- Run this in your Supabase SQL Editor to check if you have school data

-- Check if schools table exists and has data
SELECT COUNT(*) as total_schools FROM schools;

-- See first 5 schools
SELECT id, name, slug, city, ratings FROM schools LIMIT 5;

-- If you get an error or 0 schools, you need to import the CSV data
