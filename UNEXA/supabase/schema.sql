-- ==============================================================================
-- UNEXA DATABASE INITIAL SCHEMA & SECURITY POLICIES (PHASE 1)
-- File: supabase/schema.sql
-- Direct copy for execution in Supabase Dashboard SQL Editor
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE (Linked 1-to-1 with auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  phone text UNIQUE,
  full_name text NOT NULL,
  vpa text UNIQUE NOT NULL,
  avatar_url text,
  is_business_enabled boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. BANK ACCOUNTS TABLE
CREATE TABLE IF NOT EXISTS public.bank_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  bank_name text NOT NULL,
  account_masked text NOT NULL,
  ifsc text NOT NULL,
  is_primary boolean DEFAULT false,
  balance numeric(12, 2) DEFAULT 0.00 CHECK (balance >= 0),
  account_type text DEFAULT 'Savings A/C',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 3. TRANSACTIONS TABLE (Personal UPI Ledger - Immutable)
CREATE TABLE IF NOT EXISTS public.transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  utr text UNIQUE NOT NULL,
  type text NOT NULL CHECK (type IN ('debit', 'credit')),
  amount numeric(12, 2) NOT NULL CHECK (amount > 0),
  category text DEFAULT 'General',
  status text NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed')),
  payer_vpa text NOT NULL,
  payee_vpa text NOT NULL,
  payee_name text NOT NULL,
  bank_account_id uuid REFERENCES public.bank_accounts(id) ON DELETE SET NULL,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- 4. GROUPS TABLE (Group Shared Pools)
CREATE TABLE IF NOT EXISTS public.groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  emoji text DEFAULT '✈️',
  description text,
  vpa text UNIQUE NOT NULL,
  created_by uuid NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  balance numeric(12, 2) DEFAULT 0.00 CHECK (balance >= 0),
  total_spent numeric(12, 2) DEFAULT 0.00 CHECK (total_spent >= 0),
  max_members int DEFAULT 10 CHECK (max_members >= 2),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'settled', 'closed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 5. GROUP MEMBERS TABLE
CREATE TABLE IF NOT EXISTS public.group_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  total_paid numeric(12, 2) DEFAULT 0.00 CHECK (total_paid >= 0),
  total_consumed numeric(12, 2) DEFAULT 0.00 CHECK (total_consumed >= 0),
  joined_at timestamptz DEFAULT now(),
  UNIQUE (group_id, user_id)
);

-- 6. GROUP EXPENSES TABLE
CREATE TABLE IF NOT EXISTS public.group_expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  paid_by uuid NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  title text NOT NULL,
  amount numeric(12, 2) NOT NULL CHECK (amount > 0),
  split_type text NOT NULL DEFAULT 'equal' CHECK (split_type IN ('equal', 'exact', 'percentage')),
  receipt_url text,
  created_at timestamptz DEFAULT now()
);

-- 7. GROUP SPLITS TABLE
CREATE TABLE IF NOT EXISTS public.group_splits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  expense_id uuid NOT NULL REFERENCES public.group_expenses(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount numeric(12, 2) NOT NULL CHECK (amount >= 0),
  percentage numeric(5, 2),
  is_settled boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  UNIQUE (expense_id, user_id)
);

-- 8. MERCHANTS TABLE (Business Mode Store Profile)
CREATE TABLE IF NOT EXISTS public.merchants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  business_name text NOT NULL,
  store_vpa text UNIQUE NOT NULL,
  category text DEFAULT 'Retail & Grocery',
  gstin text,
  address text,
  settlement_bank_id uuid REFERENCES public.bank_accounts(id) ON DELETE SET NULL,
  available_settlement numeric(12, 2) DEFAULT 0.00 CHECK (available_settlement >= 0),
  stash_balance numeric(12, 2) DEFAULT 0.00 CHECK (stash_balance >= 0),
  is_soundbox_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 9. MERCHANT COLLECTIONS TABLE (QR Payments)
CREATE TABLE IF NOT EXISTS public.merchant_collections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid NOT NULL REFERENCES public.merchants(id) ON DELETE CASCADE,
  payer_name text NOT NULL,
  payer_vpa text,
  amount numeric(12, 2) NOT NULL CHECK (amount > 0),
  utr text UNIQUE NOT NULL,
  status text NOT NULL DEFAULT 'success' CHECK (status IN ('pending', 'success', 'failed')),
  announced boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- 10. KHATA PARTIES TABLE (Customers & Suppliers)
CREATE TABLE IF NOT EXISTS public.khata_parties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid NOT NULL REFERENCES public.merchants(id) ON DELETE CASCADE,
  name text NOT NULL,
  phone text NOT NULL,
  party_type text NOT NULL CHECK (party_type IN ('customer', 'supplier')),
  net_balance numeric(12, 2) DEFAULT 0.00,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (merchant_id, phone, party_type)
);

-- 11. KHATA ENTRIES TABLE
CREATE TABLE IF NOT EXISTS public.khata_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  party_id uuid NOT NULL REFERENCES public.khata_parties(id) ON DELETE CASCADE,
  entry_type text NOT NULL CHECK (entry_type IN ('give', 'get')),
  amount numeric(12, 2) NOT NULL CHECK (amount > 0),
  notes text,
  bill_number text,
  created_at timestamptz DEFAULT now()
);

-- 12. MERCHANT SETTLEMENTS TABLE
CREATE TABLE IF NOT EXISTS public.merchant_settlements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid NOT NULL REFERENCES public.merchants(id) ON DELETE CASCADE,
  amount numeric(12, 2) NOT NULL CHECK (amount > 0),
  bank_name text NOT NULL,
  account_masked text NOT NULL,
  utr text UNIQUE NOT NULL,
  status text NOT NULL DEFAULT 'completed' CHECK (status IN ('processing', 'completed', 'failed')),
  settled_at timestamptz DEFAULT now()
);

-- 13. MERCHANT STAFF TABLE
CREATE TABLE IF NOT EXISTS public.merchant_staff (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid NOT NULL REFERENCES public.merchants(id) ON DELETE CASCADE,
  staff_user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  staff_name text NOT NULL,
  staff_phone text NOT NULL,
  role text NOT NULL DEFAULT 'cashier' CHECK (role IN ('manager', 'cashier', 'accountant')),
  created_at timestamptz DEFAULT now(),
  UNIQUE (merchant_id, staff_phone)
);

-- 14. AUDIT LOGS TABLE (Security & Compliance Trail - Zero Secrets)
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  event_type text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  ip_address text,
  created_at timestamptz DEFAULT now()
);

-- SECURITY DEFINER HELPER FUNCTIONS
CREATE OR REPLACE FUNCTION public.is_group_member(p_group_id uuid, p_user_id uuid)
RETURNS boolean LANGUAGE sql SECURITY DEFINER SET search_path = public STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.group_members
    WHERE group_id = p_group_id AND user_id = p_user_id
  );
$$;

CREATE OR REPLACE FUNCTION public.is_group_admin(p_group_id uuid, p_user_id uuid)
RETURNS boolean LANGUAGE sql SECURITY DEFINER SET search_path = public STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.group_members
    WHERE group_id = p_group_id AND user_id = p_user_id AND role = 'admin'
  );
$$;

CREATE OR REPLACE FUNCTION public.is_merchant_authorized(p_merchant_id uuid, p_user_id uuid)
RETURNS boolean LANGUAGE sql SECURITY DEFINER SET search_path = public STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.merchants
    WHERE id = p_merchant_id AND owner_id = p_user_id
  ) OR EXISTS (
    SELECT 1 FROM public.merchant_staff
    WHERE merchant_id = p_merchant_id AND staff_user_id = p_user_id
  );
$$;

-- SERVER-SIDE ATOMIC TRANSFER RPC
CREATE OR REPLACE FUNCTION public.execute_transfer(
  p_bank_account_id uuid,
  p_payee_vpa text,
  p_payee_name text,
  p_amount numeric,
  p_category text DEFAULT 'Payment',
  p_notes text DEFAULT ''
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_current_balance numeric;
  v_new_balance numeric;
  v_utr text;
  v_tx_id uuid;
  v_payer_vpa text;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required to execute transfer';
  END IF;

  IF p_amount IS NULL OR p_amount <= 0 THEN
    RAISE EXCEPTION 'Transfer amount must be strictly greater than 0';
  END IF;

  IF p_amount > 100000 THEN
    RAISE EXCEPTION 'Transfer exceeds statutory limit of 100,000 INR';
  END IF;

  IF p_payee_vpa IS NULL OR length(trim(p_payee_vpa)) < 3 OR p_payee_vpa NOT LIKE '%@%' THEN
    RAISE EXCEPTION 'Invalid Payee UPI VPA format';
  END IF;

  SELECT balance INTO v_current_balance
  FROM public.bank_accounts
  WHERE id = p_bank_account_id AND user_id = v_user_id
  FOR UPDATE;

  IF v_current_balance IS NULL THEN
    RAISE EXCEPTION 'Bank account not found or unauthorized';
  END IF;

  IF v_current_balance < p_amount THEN
    RAISE EXCEPTION 'Insufficient balance for transfer. Available: %, Requested: %', v_current_balance, p_amount;
  END IF;

  v_new_balance := v_current_balance - p_amount;
  UPDATE public.bank_accounts
  SET balance = v_new_balance, updated_at = now()
  WHERE id = p_bank_account_id AND user_id = v_user_id;

  v_utr := '6249' || lpad(floor(random() * 100000000)::text, 8, '0');

  SELECT vpa INTO v_payer_vpa FROM public.profiles WHERE id = v_user_id;

  INSERT INTO public.transactions (
    user_id,
    utr,
    type,
    amount,
    category,
    status,
    payer_vpa,
    payee_vpa,
    payee_name,
    bank_account_id,
    notes,
    created_at
  )
  VALUES (
    v_user_id,
    v_utr,
    'debit',
    p_amount,
    COALESCE(p_category, 'General'),
    'completed',
    COALESCE(v_payer_vpa, 'user@unexa'),
    p_payee_vpa,
    p_payee_name,
    p_bank_account_id,
    p_notes,
    now()
  )
  RETURNING id INTO v_tx_id;

  INSERT INTO public.audit_logs (user_id, event_type, metadata)
  VALUES (
    v_user_id,
    'TRANSFER_COMPLETED',
    jsonb_build_object(
      'transaction_id', v_tx_id,
      'utr', v_utr,
      'amount', p_amount,
      'payee_vpa', p_payee_vpa
    )
  );

  RETURN jsonb_build_object(
    'success', true,
    'transaction_id', v_tx_id,
    'utr', v_utr,
    'new_balance', v_new_balance,
    'amount', p_amount
  );
END;
$$;

-- IMMUTABILITY TRIGGER
CREATE OR REPLACE FUNCTION public.prevent_transaction_mutation()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'Transactions are immutable and cannot be updated or deleted once recorded.';
END;
$$;

DROP TRIGGER IF EXISTS trg_immutable_transactions ON public.transactions;
CREATE TRIGGER trg_immutable_transactions
BEFORE UPDATE OR DELETE ON public.transactions
FOR EACH ROW EXECUTE FUNCTION public.prevent_transaction_mutation();

-- ROW LEVEL SECURITY
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_splits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.merchants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.merchant_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.khata_parties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.khata_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.merchant_settlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.merchant_staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_public" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

CREATE POLICY "bank_accounts_select_own" ON public.bank_accounts FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "bank_accounts_insert_own" ON public.bank_accounts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "bank_accounts_update_own" ON public.bank_accounts FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "transactions_select_own" ON public.transactions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "transactions_insert_own" ON public.transactions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "groups_select_member" ON public.groups FOR SELECT TO authenticated
  USING (created_by = auth.uid() OR is_group_member(id, auth.uid()));
CREATE POLICY "groups_insert_creator" ON public.groups FOR INSERT TO authenticated
  WITH CHECK (created_by = auth.uid());
CREATE POLICY "groups_update_admin" ON public.groups FOR UPDATE TO authenticated
  USING (is_group_admin(id, auth.uid()));

CREATE POLICY "group_members_select" ON public.group_members FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR is_group_member(group_id, auth.uid()));
CREATE POLICY "group_members_insert" ON public.group_members FOR INSERT TO authenticated
  WITH CHECK (is_group_admin(group_id, auth.uid()) OR EXISTS (SELECT 1 FROM public.groups g WHERE g.id = group_id AND g.created_by = auth.uid()));
CREATE POLICY "group_members_update" ON public.group_members FOR UPDATE TO authenticated
  USING (is_group_admin(group_id, auth.uid()));
CREATE POLICY "group_members_delete" ON public.group_members FOR DELETE TO authenticated
  USING (user_id = auth.uid() OR is_group_admin(group_id, auth.uid()));

CREATE POLICY "group_expenses_select" ON public.group_expenses FOR SELECT TO authenticated
  USING (is_group_member(group_id, auth.uid()));
CREATE POLICY "group_expenses_insert" ON public.group_expenses FOR INSERT TO authenticated
  WITH CHECK (paid_by = auth.uid() AND is_group_member(group_id, auth.uid()));

CREATE POLICY "group_splits_select" ON public.group_splits FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.group_expenses ge WHERE ge.id = expense_id AND is_group_member(ge.group_id, auth.uid())));
CREATE POLICY "group_splits_insert" ON public.group_splits FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.group_expenses ge WHERE ge.id = expense_id AND ge.paid_by = auth.uid()));

CREATE POLICY "merchants_select" ON public.merchants FOR SELECT TO authenticated
  USING (is_merchant_authorized(id, auth.uid()));
CREATE POLICY "merchants_insert" ON public.merchants FOR INSERT TO authenticated
  WITH CHECK (owner_id = auth.uid());
CREATE POLICY "merchants_update" ON public.merchants FOR UPDATE TO authenticated
  USING (owner_id = auth.uid());

CREATE POLICY "collections_select" ON public.merchant_collections FOR SELECT TO authenticated
  USING (is_merchant_authorized(merchant_id, auth.uid()));
CREATE POLICY "collections_insert" ON public.merchant_collections FOR INSERT TO authenticated
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "khata_parties_all" ON public.khata_parties FOR ALL TO authenticated
  USING (is_merchant_authorized(merchant_id, auth.uid()))
  WITH CHECK (is_merchant_authorized(merchant_id, auth.uid()));

CREATE POLICY "khata_entries_all" ON public.khata_entries FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.khata_parties kp WHERE kp.id = party_id AND is_merchant_authorized(kp.merchant_id, auth.uid())))
  WITH CHECK (EXISTS (SELECT 1 FROM public.khata_parties kp WHERE kp.id = party_id AND is_merchant_authorized(kp.merchant_id, auth.uid())));

CREATE POLICY "settlements_select_own" ON public.merchant_settlements FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.merchants m WHERE m.id = merchant_id AND m.owner_id = auth.uid()));
CREATE POLICY "settlements_insert_own" ON public.merchant_settlements FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.merchants m WHERE m.id = merchant_id AND m.owner_id = auth.uid()));

CREATE POLICY "staff_select" ON public.merchant_staff FOR SELECT TO authenticated
  USING (staff_user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.merchants m WHERE m.id = merchant_id AND m.owner_id = auth.uid()));
CREATE POLICY "staff_manage" ON public.merchant_staff FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.merchants m WHERE m.id = merchant_id AND m.owner_id = auth.uid()));

CREATE POLICY "audit_logs_select_own" ON public.audit_logs FOR SELECT TO authenticated
  USING (user_id = auth.uid());
CREATE POLICY "audit_logs_insert_authenticated" ON public.audit_logs FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());


-- ====================================================
-- MIGRATION: 20261019000001_complete_account_flow
-- ====================================================
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

-- ==============================================================================
-- 15. MERCHANT EMPLOYEES & PAYROLL SYSTEM (PHASE 11 - BUSINESS MODE)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.merchant_employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid NOT NULL REFERENCES public.merchants(id) ON DELETE CASCADE,
  emp_code text NOT NULL,
  full_name text NOT NULL,
  phone text NOT NULL,
  email text,
  designation text NOT NULL,
  department text NOT NULL,
  joining_date date NOT NULL DEFAULT CURRENT_DATE,
  monthly_salary numeric(12, 2) NOT NULL CHECK (monthly_salary > 0),
  upi_id text NOT NULL,
  bank_acc_masked text,
  bank_ifsc text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'deactivated', 'removed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (merchant_id, phone),
  UNIQUE (merchant_id, emp_code)
);

CREATE TABLE IF NOT EXISTS public.salary_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid NOT NULL REFERENCES public.merchants(id) ON DELETE CASCADE,
  employee_id uuid NOT NULL REFERENCES public.merchant_employees(id) ON DELETE RESTRICT,
  employee_name text NOT NULL,
  emp_code text NOT NULL,
  salary_month text NOT NULL,
  amount numeric(12, 2) NOT NULL CHECK (amount > 0),
  payment_method text NOT NULL DEFAULT 'UPI',
  utr text UNIQUE NOT NULL,
  status text NOT NULL DEFAULT 'Paid' CHECK (status IN ('Paid', 'Pending', 'Failed', 'Processing')),
  remarks text,
  is_demo boolean DEFAULT true,
  paid_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.payroll_batches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid NOT NULL REFERENCES public.merchants(id) ON DELETE CASCADE,
  batch_id text UNIQUE NOT NULL,
  salary_month text NOT NULL,
  total_employees int NOT NULL,
  total_amount numeric(12, 2) NOT NULL,
  status text NOT NULL DEFAULT 'Completed',
  created_at timestamptz DEFAULT now()
);

-- RLS: Enable RLS on payroll tables
ALTER TABLE public.merchant_employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salary_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payroll_batches ENABLE ROW LEVEL SECURITY;

-- Merchant Owner Policy: Only merchant owner can manage employees and payroll
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'merchant_employees_owner_all' AND tablename = 'merchant_employees') THEN
    CREATE POLICY "merchant_employees_owner_all" ON public.merchant_employees
      FOR ALL TO authenticated
      USING (EXISTS (SELECT 1 FROM public.merchants m WHERE m.id = merchant_id AND m.owner_id = auth.uid()));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'salary_payments_owner_all' AND tablename = 'salary_payments') THEN
    CREATE POLICY "salary_payments_owner_all" ON public.salary_payments
      FOR ALL TO authenticated
      USING (EXISTS (SELECT 1 FROM public.merchants m WHERE m.id = merchant_id AND m.owner_id = auth.uid()));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'payroll_batches_owner_all' AND tablename = 'payroll_batches') THEN
    CREATE POLICY "payroll_batches_owner_all" ON public.payroll_batches
      FOR ALL TO authenticated
      USING (EXISTS (SELECT 1 FROM public.merchants m WHERE m.id = merchant_id AND m.owner_id = auth.uid()));
  END IF;
END $$;
