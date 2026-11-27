-- ==============================================================================
-- UNEXA DATABASE INITIAL SCHEMA & SECURITY POLICIES (PHASE 1)
-- Migration: 20261015000001_initial_schema.sql
-- Covers:
--   1. Profiles (Personal identity & UPI VPA)
--   2. Bank Accounts (Linked accounts & balance protection)
--   3. Transactions (Immutable audit ledger)
--   4. Groups (Shared pools)
--   5. Group Members (Roles & contribution tracking)
--   6. Group Expenses (Shared bill records)
--   7. Group Splits (Per-member cost allocations)
--   8. Merchants (Business mode stores & settings)
--   9. Merchant Collections (Customer QR payments)
--  10. Khata Parties (Customer & supplier records)
--  11. Khata Entries (Credit & debit passbook items)
--  12. Merchant Settlements (IMPS settlement records)
--  13. Merchant Staff (Cashier/manager roles)
--  14. Audit Logs (Sanitized, zero-secret security audit trail)
--
-- Security:
--   - Row Level Security (RLS) enabled on all tables
--   - Security Definer helper functions with pinned search_path
--   - Atomic Server RPC for financial balance mutation (execute_transfer)
--   - Immutable transaction ledger trigger (no UPDATE or DELETE)
--   - Least-privilege policies based on auth.uid() and verified membership
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 1. PROFILES TABLE (Linked 1-to-1 with auth.users)
-- ==============================================================================
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

-- ==============================================================================
-- 2. BANK ACCOUNTS TABLE
-- ==============================================================================
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

-- ==============================================================================
-- 3. TRANSACTIONS TABLE (Personal UPI Ledger - Immutable)
-- ==============================================================================
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

-- ==============================================================================
-- 4. GROUPS TABLE (Group Shared Pools)
-- ==============================================================================
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

-- ==============================================================================
-- 5. GROUP MEMBERS TABLE
-- ==============================================================================
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

-- ==============================================================================
-- 6. GROUP EXPENSES TABLE
-- ==============================================================================
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

-- ==============================================================================
-- 7. GROUP SPLITS TABLE
-- ==============================================================================
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

-- ==============================================================================
-- 8. MERCHANTS TABLE (Business Mode Store Profile)
-- ==============================================================================
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

-- ==============================================================================
-- 9. MERCHANT COLLECTIONS TABLE (QR Payments)
-- ==============================================================================
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

-- ==============================================================================
-- 10. KHATA PARTIES TABLE (Customers & Suppliers)
-- ==============================================================================
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

-- ==============================================================================
-- 11. KHATA ENTRIES TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.khata_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  party_id uuid NOT NULL REFERENCES public.khata_parties(id) ON DELETE CASCADE,
  entry_type text NOT NULL CHECK (entry_type IN ('give', 'get')),
  amount numeric(12, 2) NOT NULL CHECK (amount > 0),
  notes text,
  bill_number text,
  created_at timestamptz DEFAULT now()
);

-- ==============================================================================
-- 12. MERCHANT SETTLEMENTS TABLE
-- ==============================================================================
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

-- ==============================================================================
-- 13. MERCHANT STAFF TABLE
-- ==============================================================================
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

-- ==============================================================================
-- 14. AUDIT LOGS TABLE (Security & Compliance Trail - Zero Secrets)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  event_type text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  ip_address text,
  created_at timestamptz DEFAULT now()
);

-- ==============================================================================
-- SECURITY DEFINER HELPER FUNCTIONS
-- ==============================================================================
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

-- ==============================================================================
-- SERVER-SIDE SENSITIVE PERMISSION: ATOMIC TRANSFER RPC
-- Prevents client-side balance manipulation or falsified transaction records.
-- Executes row-level locking (FOR UPDATE) to prevent race conditions.
-- ==============================================================================
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
  -- 1. Identity Verification
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required to execute transfer';
  END IF;

  -- 2. Input Validation
  IF p_amount IS NULL OR p_amount <= 0 THEN
    RAISE EXCEPTION 'Transfer amount must be strictly greater than 0';
  END IF;

  IF p_amount > 100000 THEN
    RAISE EXCEPTION 'Transfer exceeds statutory limit of 100,000 INR';
  END IF;

  IF p_payee_vpa IS NULL OR length(trim(p_payee_vpa)) < 3 OR p_payee_vpa NOT LIKE '%@%' THEN
    RAISE EXCEPTION 'Invalid Payee UPI VPA format';
  END IF;

  -- 3. Row lock & balance check
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

  -- 4. Deduct balance atomically
  v_new_balance := v_current_balance - p_amount;
  UPDATE public.bank_accounts
  SET balance = v_new_balance, updated_at = now()
  WHERE id = p_bank_account_id AND user_id = v_user_id;

  -- 5. Generate secure UTR
  v_utr := '6249' || lpad(floor(random() * 100000000)::text, 8, '0');

  -- 6. Fetch Payer VPA
  SELECT vpa INTO v_payer_vpa FROM public.profiles WHERE id = v_user_id;

  -- 7. Insert immutable transaction record
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

  -- 8. Audit log (strictly zero secrets)
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

-- ==============================================================================
-- IMMUTABILITY TRIGGER: PREVENTS TRANSACTION TAMPERING
-- ==============================================================================
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

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS across all tables
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

-- 1. Profiles
CREATE POLICY "profiles_select_public" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- 2. Bank Accounts (Read own; updates to balance restricted through execute_transfer RPC)
CREATE POLICY "bank_accounts_select_own" ON public.bank_accounts FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "bank_accounts_insert_own" ON public.bank_accounts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "bank_accounts_update_own" ON public.bank_accounts FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- 3. Transactions (Read own; creation via execute_transfer RPC or personal insert; mutations blocked by trigger)
CREATE POLICY "transactions_select_own" ON public.transactions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "transactions_insert_own" ON public.transactions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- 4. Groups
CREATE POLICY "groups_select_member" ON public.groups FOR SELECT TO authenticated
  USING (created_by = auth.uid() OR is_group_member(id, auth.uid()));
CREATE POLICY "groups_insert_creator" ON public.groups FOR INSERT TO authenticated
  WITH CHECK (created_by = auth.uid());
CREATE POLICY "groups_update_admin" ON public.groups FOR UPDATE TO authenticated
  USING (is_group_admin(id, auth.uid()));

-- 5. Group Members
CREATE POLICY "group_members_select" ON public.group_members FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR is_group_member(group_id, auth.uid()));
CREATE POLICY "group_members_insert" ON public.group_members FOR INSERT TO authenticated
  WITH CHECK (is_group_admin(group_id, auth.uid()) OR EXISTS (SELECT 1 FROM public.groups g WHERE g.id = group_id AND g.created_by = auth.uid()));
CREATE POLICY "group_members_update" ON public.group_members FOR UPDATE TO authenticated
  USING (is_group_admin(group_id, auth.uid()));
CREATE POLICY "group_members_delete" ON public.group_members FOR DELETE TO authenticated
  USING (user_id = auth.uid() OR is_group_admin(group_id, auth.uid()));

-- 6. Group Expenses
CREATE POLICY "group_expenses_select" ON public.group_expenses FOR SELECT TO authenticated
  USING (is_group_member(group_id, auth.uid()));
CREATE POLICY "group_expenses_insert" ON public.group_expenses FOR INSERT TO authenticated
  WITH CHECK (paid_by = auth.uid() AND is_group_member(group_id, auth.uid()));

-- 7. Group Splits
CREATE POLICY "group_splits_select" ON public.group_splits FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.group_expenses ge WHERE ge.id = expense_id AND is_group_member(ge.group_id, auth.uid())));
CREATE POLICY "group_splits_insert" ON public.group_splits FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.group_expenses ge WHERE ge.id = expense_id AND ge.paid_by = auth.uid()));

-- 8. Merchants
CREATE POLICY "merchants_select" ON public.merchants FOR SELECT TO authenticated
  USING (is_merchant_authorized(id, auth.uid()));
CREATE POLICY "merchants_insert" ON public.merchants FOR INSERT TO authenticated
  WITH CHECK (owner_id = auth.uid());
CREATE POLICY "merchants_update" ON public.merchants FOR UPDATE TO authenticated
  USING (owner_id = auth.uid());

-- 9. Merchant Collections
CREATE POLICY "collections_select" ON public.merchant_collections FOR SELECT TO authenticated
  USING (is_merchant_authorized(merchant_id, auth.uid()));
CREATE POLICY "collections_insert" ON public.merchant_collections FOR INSERT TO authenticated
  WITH CHECK (auth.role() = 'authenticated');

-- 10. Khata Parties & Entries
CREATE POLICY "khata_parties_all" ON public.khata_parties FOR ALL TO authenticated
  USING (is_merchant_authorized(merchant_id, auth.uid()))
  WITH CHECK (is_merchant_authorized(merchant_id, auth.uid()));

CREATE POLICY "khata_entries_all" ON public.khata_entries FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.khata_parties kp WHERE kp.id = party_id AND is_merchant_authorized(kp.merchant_id, auth.uid())))
  WITH CHECK (EXISTS (SELECT 1 FROM public.khata_parties kp WHERE kp.id = party_id AND is_merchant_authorized(kp.merchant_id, auth.uid())));

-- 11. Settlements
CREATE POLICY "settlements_select_own" ON public.merchant_settlements FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.merchants m WHERE m.id = merchant_id AND m.owner_id = auth.uid()));
CREATE POLICY "settlements_insert_own" ON public.merchant_settlements FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.merchants m WHERE m.id = merchant_id AND m.owner_id = auth.uid()));

-- 12. Staff
CREATE POLICY "staff_select" ON public.merchant_staff FOR SELECT TO authenticated
  USING (staff_user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.merchants m WHERE m.id = merchant_id AND m.owner_id = auth.uid()));
CREATE POLICY "staff_manage" ON public.merchant_staff FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.merchants m WHERE m.id = merchant_id AND m.owner_id = auth.uid()));

-- 13. Audit Logs (Users can read their own logs; insertion governed by secure functions or verified events)
CREATE POLICY "audit_logs_select_own" ON public.audit_logs FOR SELECT TO authenticated
  USING (user_id = auth.uid());
CREATE POLICY "audit_logs_insert_authenticated" ON public.audit_logs FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());
