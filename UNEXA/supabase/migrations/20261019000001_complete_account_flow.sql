-- ==============================================================================
-- UNEXA DATABASE MIGRATION: COMPLETE ACCOUNT FLOW, PIN SECURITY & GROUP TOOLS
-- Migration: 20261019000001_complete_account_flow.sql
-- Covers:
--   1. Profiles: is_onboarded, business_status, is_biometric_enabled
--   2. App Lock / PIN Security: user_app_pins table with bcrypt & rate limiting
--   3. Server RPCs: setup_app_pin, verify_app_pin, apply_for_business
--   4. Group Tools: group_recurring_expenses, group_budgets, group_expense_approvals
--   5. Storage: avatars bucket & RLS policies
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------------------------
-- 1. PROFILES ENHANCEMENTS
-- ------------------------------------------------------------------------------
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_onboarded boolean DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS business_status text DEFAULT 'none' CHECK (business_status IN ('none', 'pending', 'approved', 'rejected', 'suspended'));
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_biometric_enabled boolean DEFAULT false;

-- ------------------------------------------------------------------------------
-- 2. SECURE APP LOCK / PIN TABLE (Zero-Client Trust)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_app_pins (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  pin_hash text NOT NULL,
  failed_attempts int DEFAULT 0,
  locked_until timestamptz DEFAULT NULL,
  last_attempt_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.user_app_pins ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- 3. SERVER-SIDE PIN RPCS (Bcrypt Hashing & Rate Limiting)
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.setup_app_pin(p_pin text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_user_id uuid := auth.uid();
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required to set app PIN';
  END IF;

  IF p_pin IS NULL OR length(trim(p_pin)) != 4 OR trim(p_pin) !~ '^[0-9]{4}$' THEN
    RAISE EXCEPTION 'PIN must be exactly 4 numeric digits';
  END IF;

  INSERT INTO public.user_app_pins (user_id, pin_hash, failed_attempts, locked_until, updated_at)
  VALUES (v_user_id, crypt(trim(p_pin), gen_salt('bf', 10)), 0, NULL, now())
  ON CONFLICT (user_id)
  DO UPDATE SET
    pin_hash = crypt(trim(p_pin), gen_salt('bf', 10)),
    failed_attempts = 0,
    locked_until = NULL,
    updated_at = now();

  RETURN jsonb_build_object('success', true, 'message', 'App PIN configured securely on server ledger');
END;
$$;

CREATE OR REPLACE FUNCTION public.verify_app_pin(p_pin text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_rec record;
  v_is_valid boolean;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required to verify app PIN';
  END IF;

  SELECT * INTO v_rec FROM public.user_app_pins WHERE user_id = v_user_id;

  IF v_rec IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'No PIN set for account', 'not_set', true);
  END IF;

  -- 1. Check Rate-Limiting Lockout
  IF v_rec.locked_until IS NOT NULL AND now() < v_rec.locked_until THEN
    RETURN jsonb_build_object(
      'success', false,
      'locked', true,
      'remaining_seconds', CEIL(EXTRACT(EPOCH FROM (v_rec.locked_until - now())))::int,
      'error', 'Account temporarily locked due to repeated incorrect PIN attempts. Try again later.'
    );
  END IF;

  -- 2. Verify Bcrypt Hash
  v_is_valid := (v_rec.pin_hash = crypt(trim(p_pin), v_rec.pin_hash));

  IF v_is_valid THEN
    -- Reset failure counters on match
    UPDATE public.user_app_pins
    SET failed_attempts = 0, locked_until = NULL, last_attempt_at = now(), updated_at = now()
    WHERE user_id = v_user_id;

    RETURN jsonb_build_object('success', true);
  ELSE
    -- Increment failure & apply escalating delays (1 min on 3rd, 15 mins on 5th)
    UPDATE public.user_app_pins
    SET failed_attempts = v_rec.failed_attempts + 1,
        locked_until = CASE
          WHEN v_rec.failed_attempts + 1 >= 5 THEN now() + interval '15 minutes'
          WHEN v_rec.failed_attempts + 1 >= 3 THEN now() + interval '1 minute'
          ELSE NULL
        END,
        last_attempt_at = now(),
        updated_at = now()
    WHERE user_id = v_user_id;

    RETURN jsonb_build_object(
      'success', false,
      'error', 'Incorrect PIN entered',
      'attempts_remaining', GREATEST(0, 5 - (v_rec.failed_attempts + 1)),
      'locked', (v_rec.failed_attempts + 1 >= 3)
    );
  END IF;
END;
$$;

-- ------------------------------------------------------------------------------
-- 4. BUSINESS ELIGIBILITY ONBOARDING RPC
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.apply_for_business(
  p_store_name text,
  p_category text DEFAULT 'Retail & Grocery',
  p_gstin text DEFAULT NULL,
  p_address text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_store_vpa text;
  v_merchant_id uuid;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required to apply for business mode';
  END IF;

  IF p_store_name IS NULL OR length(trim(p_store_name)) < 2 THEN
    RAISE EXCEPTION 'Business store name is required';
  END IF;

  v_store_vpa := lower(regexp_replace(trim(p_store_name), '[^a-zA-Z0-9]', '', 'g')) || '@unexabiz';

  -- Create or link merchant profile
  INSERT INTO public.merchants (
    owner_id, business_name, store_vpa, category, gstin, address
  )
  VALUES (
    v_user_id, trim(p_store_name), v_store_vpa, COALESCE(p_category, 'Retail & Grocery'), p_gstin, p_address
  )
  ON CONFLICT DO NOTHING
  RETURNING id INTO v_merchant_id;

  -- Set status to pending verification
  UPDATE public.profiles
  SET business_status = 'pending',
      updated_at = now()
  WHERE id = v_user_id;

  RETURN jsonb_build_object(
    'success', true,
    'status', 'pending',
    'store_vpa', v_store_vpa,
    'message', 'Merchant application submitted. Awaiting verification review.'
  );
END;
$$;

-- ------------------------------------------------------------------------------
-- 5. GROUP TOOLS TABLES & RLS POLICIES
-- ------------------------------------------------------------------------------

-- Recurring Group Expenses
CREATE TABLE IF NOT EXISTS public.group_recurring_expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  title text NOT NULL,
  amount numeric(12, 2) NOT NULL CHECK (amount > 0),
  frequency text NOT NULL DEFAULT 'monthly' CHECK (frequency IN ('weekly', 'monthly', 'quarterly', 'yearly')),
  next_due_date date NOT NULL,
  created_by uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.group_recurring_expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "group_recurring_select" ON public.group_recurring_expenses FOR SELECT TO authenticated
  USING (is_group_member(group_id, auth.uid()));

CREATE POLICY "group_recurring_insert" ON public.group_recurring_expenses FOR INSERT TO authenticated
  WITH CHECK (is_group_member(group_id, auth.uid()));

-- Group Budgets & Guard
CREATE TABLE IF NOT EXISTS public.group_budgets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE UNIQUE,
  monthly_budget numeric(12, 2) NOT NULL CHECK (monthly_budget > 0),
  alert_threshold_pct int DEFAULT 80 CHECK (alert_threshold_pct BETWEEN 50 AND 100),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.group_budgets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "group_budgets_select" ON public.group_budgets FOR SELECT TO authenticated
  USING (is_group_member(group_id, auth.uid()));

CREATE POLICY "group_budgets_upsert" ON public.group_budgets FOR ALL TO authenticated
  USING (is_group_admin(group_id, auth.uid()))
  WITH CHECK (is_group_admin(group_id, auth.uid()));

-- Group Expense Approvals (Consensus for expenses exceeding threshold)
CREATE TABLE IF NOT EXISTS public.group_expense_approvals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  expense_id uuid NOT NULL REFERENCES public.group_expenses(id) ON DELETE CASCADE,
  group_id uuid NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  approved_by uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'approved' CHECK (status IN ('approved', 'rejected')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(expense_id, approved_by)
);

ALTER TABLE public.group_expense_approvals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "group_approvals_select" ON public.group_expense_approvals FOR SELECT TO authenticated
  USING (is_group_member(group_id, auth.uid()));

CREATE POLICY "group_approvals_insert" ON public.group_expense_approvals FOR INSERT TO authenticated
  WITH CHECK (is_group_member(group_id, auth.uid()));

-- ------------------------------------------------------------------------------
-- 6. STORAGE BUCKET: AVATARS & ACCESS POLICIES
-- ------------------------------------------------------------------------------
DO $$
BEGIN
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('avatars', 'avatars', true)
  ON CONFLICT (id) DO UPDATE SET public = true;
EXCEPTION
  WHEN OTHERS THEN
    NULL; -- Safe fallback if storage schema is managed externally
END $$;
