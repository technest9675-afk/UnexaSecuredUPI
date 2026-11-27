-- ==============================================================================
-- UNEXA DATABASE MIGRATION: ONBOARDING FLOW & GRANULAR STEP PROGRESSION
-- Migration: 20261019000002_onboarding_flow.sql
-- Covers:
--   1. Profiles: onboarding_step column with constraint check
--   2. Backfill: existing onboarded profiles set to 'onboarding_complete'
--   3. Bank Accounts: least-privilege RLS policies for authenticated users
--   4. Profiles: RLS insert/update/select policies for authenticated users
-- ==============================================================================

-- 1. ADD ONBOARDING STEP TRACKING
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS onboarding_step text DEFAULT 'phone_not_verified';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'profiles_onboarding_step_check'
  ) THEN
    ALTER TABLE public.profiles 
    ADD CONSTRAINT profiles_onboarding_step_check 
    CHECK (onboarding_step IN ('phone_not_verified', 'pin_setup_incomplete', 'bank_linking_pending', 'onboarding_complete'));
  END IF;
END $$;

-- 2. BACKFILL EXISTING PROFILES
UPDATE public.profiles
SET onboarding_step = 'onboarding_complete'
WHERE is_onboarded = true AND (onboarding_step IS NULL OR onboarding_step = 'phone_not_verified');

-- 3. ENSURE ROW LEVEL SECURITY & LEAST-PRIVILEGE POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_app_pins ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can view their own profile
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'profiles_select_own' AND tablename = 'profiles') THEN
    CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT TO authenticated
      USING (auth.uid() = id);
  END IF;
END $$;

-- Profiles: Users can insert their own profile
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'profiles_insert_own' AND tablename = 'profiles') THEN
    CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT TO authenticated
      WITH CHECK (auth.uid() = id);
  END IF;
END $$;

-- Profiles: Users can update their own profile
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'profiles_update_own' AND tablename = 'profiles') THEN
    CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated
      USING (auth.uid() = id)
      WITH CHECK (auth.uid() = id);
  END IF;
END $$;

-- Bank Accounts: Users can only manage their own bank accounts
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'bank_accounts_select_own' AND tablename = 'bank_accounts') THEN
    CREATE POLICY "bank_accounts_select_own" ON public.bank_accounts FOR SELECT TO authenticated
      USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'bank_accounts_insert_own' AND tablename = 'bank_accounts') THEN
    CREATE POLICY "bank_accounts_insert_own" ON public.bank_accounts FOR INSERT TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'bank_accounts_update_own' AND tablename = 'bank_accounts') THEN
    CREATE POLICY "bank_accounts_update_own" ON public.bank_accounts FOR UPDATE TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;
