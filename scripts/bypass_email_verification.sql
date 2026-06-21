-- ============================================================================
-- SQL HELPER: BYPASS EMAIL VERIFICATION FOR LOCAL DEVELOPERS
-- ============================================================================
-- Run this in the Supabase SQL Editor.
-- 
-- This script does two things:
-- 1. Sets up a database trigger that auto-confirms all FUTURE signups.
-- 2. Provides a query to manually confirm any EXISTING unconfirmed accounts.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. AUTO-CONFIRM ALL FUTURE SIGNUPS
-- ----------------------------------------------------------------------------

-- Create the trigger function
CREATE OR REPLACE FUNCTION public.auto_confirm_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Set confirmation timestamps to now
  NEW.email_confirmed_at = COALESCE(NEW.email_confirmed_at, NOW());
  NEW.confirmed_at = COALESCE(NEW.confirmed_at, NOW());
  NEW.phone_confirmed_at = COALESCE(NEW.phone_confirmed_at, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach trigger to auth.users table (executed before insert)
DROP TRIGGER IF EXISTS tr_auto_confirm_user ON auth.users;
CREATE TRIGGER tr_auto_confirm_user
  BEFORE INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_confirm_user();

-- ----------------------------------------------------------------------------
-- 2. FORCE-CONFIRM EXISTING REGISTERED USERS
-- ----------------------------------------------------------------------------
-- Run the following block (substituting your registered email address)
-- to manually confirm any account that is stuck in unconfirmed state:
--
-- UPDATE auth.users 
-- SET email_confirmed_at = NOW(), 
--     confirmed_at = NOW(), 
--     last_sign_in_at = NOW() 
-- WHERE email = 'your-registered-email@example.com';
