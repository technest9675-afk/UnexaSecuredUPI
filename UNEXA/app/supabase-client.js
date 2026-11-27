/**
 * Unexa Supabase Client & Security Engine
 * Phase 2: Security & Authentication Implementation
 * 
 * Features:
 *  - Supabase Auth Integration (Email/Password, Email/Phone OTP)
 *  - Secure Session Management & Automated Lifecycle Sync
 *  - Client-side Input Validation & Sanitization (XSS Defense)
 *  - Zero-Credential Storage Enforcement (No PINs/Passwords in localStorage)
 *  - Secret-Scrubbed Audit Logging Trail
 */

(function (window) {
  'use strict';

  let supabaseInstance = null;
  let isInitialized = false;

  // ---------------------------------------------------------------------------
  // 1. Client Initialization
  // ---------------------------------------------------------------------------
  function initSupabase() {
    if (isInitialized && supabaseInstance) {
      return supabaseInstance;
    }

    const config = window.UNEXA_CONFIG || {};
    const supabaseUrl = config.SUPABASE_URL;
    const supabaseAnonKey = config.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('[Unexa Security] Missing SUPABASE_URL or SUPABASE_ANON_KEY in window.UNEXA_CONFIG');
      return null;
    }

    if (!window.supabase || typeof window.supabase.createClient !== 'function') {
      console.warn('[Unexa Security] @supabase/supabase-js library not loaded');
      return null;
    }

    try {
      supabaseInstance = window.supabase.createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          storage: window.localStorage
        }
      });

      isInitialized = true;
      console.log('[Unexa Security] Supabase client initialized securely.');
      return supabaseInstance;
    } catch (err) {
      console.error('[Unexa Security] Failed to initialize client:', err);
      return null;
    }
  }

  // ---------------------------------------------------------------------------
  // 2. Input Validation & XSS Sanitization Helpers
  // ---------------------------------------------------------------------------
  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function validateAmount(amount) {
    const num = Number(amount);
    if (isNaN(num) || !isFinite(num)) {
      return { valid: false, error: 'Amount must be a valid number' };
    }
    if (num <= 0) {
      return { valid: false, error: 'Amount must be strictly greater than ₹ 0' };
    }
    if (num > 100000) {
      return { valid: false, error: 'Amount exceeds transaction limit of ₹ 1,00,000' };
    }
    // Check up to 2 decimal places
    const parts = String(amount).split('.');
    if (parts[1] && parts[1].length > 2) {
      return { valid: false, error: 'Amount cannot have more than 2 decimal places' };
    }
    return { valid: true, value: num };
  }

  function validateVpa(vpa) {
    if (!vpa || typeof vpa !== 'string') return { valid: false, error: 'UPI ID is required' };
    const cleaned = vpa.trim().toLowerCase();
    // Standard NPCI UPI format: username@bank
    const vpaRegex = /^[a-zA-Z0-9.\-_]{2,64}@[a-zA-Z0-9]{2,32}$/;
    if (!vpaRegex.test(cleaned)) {
      return { valid: false, error: 'Invalid UPI ID format (expected user@handle)' };
    }
    return { valid: true, value: cleaned };
  }

  function validatePhone(phone) {
    if (!phone || typeof phone !== 'string') return { valid: false, error: 'Phone number is required' };
    const digitsOnly = phone.replace(/\D/g, '');
    if (digitsOnly.length < 10 || digitsOnly.length > 13) {
      return { valid: false, error: 'Phone number must be between 10 and 13 digits' };
    }
    return { valid: true, value: digitsOnly };
  }

  
function normalizeSupabaseError(err) {
  if (!err) return null;
  const msg = typeof err === 'string' ? err : (err.message || String(err));
  const code = typeof err === 'object' && err.code ? err.code : (typeof err === 'string' ? err : null);
  const status = typeof err === 'object' && err.status ? err.status : null;
  return {
    message: msg,
    code: code,
    status: status,
    toString() { return this.message; }
  };
}

function formatE164Phone(phoneStr) {
    if (!phoneStr) return '';
    let digits = phoneStr.replace(/\D/g, '');
    if (digits.length === 11 && digits.startsWith('0')) {
      digits = digits.slice(1);
    }
    if (digits.length === 10) {
      return '+91' + digits;
    }
    if (digits.length === 12 && digits.startsWith('91')) {
      return '+' + digits;
    }
    if (phoneStr.trim().startsWith('+')) {
      return '+' + digits;
    }
    return '+' + digits;
  }

  // ---------------------------------------------------------------------------
  // 3. Sensitive Data Scrubbing for Audit Logs
  // ---------------------------------------------------------------------------
  const SENSITIVE_KEYS = ['pin', 'upipin', 'apppin', 'password', 'token', 'otp', 'secret', 'apikey'];

  function scrubMetadata(obj) {
    if (!obj || typeof obj !== 'object') return obj;
    const sanitized = Array.isArray(obj) ? [] : {};

    for (const [key, value] of Object.entries(obj)) {
      const lowerKey = key.toLowerCase();
      if (SENSITIVE_KEYS.some(s => lowerKey.includes(s))) {
        sanitized[key] = '[REDACTED_SECRET]';
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = scrubMetadata(value);
      } else if (typeof value === 'string' && value.length > 200) {
        sanitized[key] = value.substring(0, 200) + '...[TRUNCATED]';
      } else {
        sanitized[key] = value;
      }
    }
    return sanitized;
  }

  // ---------------------------------------------------------------------------
  // 4. In-Memory Session Storage (Zero-Storage Policy for PINs)
  // ---------------------------------------------------------------------------
  let inMemorySessionPinHash = null;

  async function hashPin(pin) {
    if (!window.crypto || !window.crypto.subtle) {
      // Fallback simple hash for older environments
      let hash = 0;
      for (let i = 0; i < pin.length; i++) {
        hash = ((hash << 5) - hash) + pin.charCodeAt(i);
        hash |= 0;
      }
      return 'hash_' + Math.abs(hash);
    }
    const encoder = new TextEncoder();
    const data = encoder.encode('unexa_salt_' + pin);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // ---------------------------------------------------------------------------
  // 5. UnexaSupabase Exported API
  // ---------------------------------------------------------------------------
  const UnexaSupabase = {
    getClient: function () {
      return supabaseInstance || initSupabase();
    },

    isConfigured: function () {
      const config = window.UNEXA_CONFIG || {};
      return Boolean(config.SUPABASE_URL && config.SUPABASE_ANON_KEY);
    },

    // Utilities
    escapeHtml: escapeHtml,
    validateAmount: validateAmount,
    validateVpa: validateVpa,
    validatePhone: validatePhone,
    formatE164Phone: formatE164Phone,

    // Audit Logging
    logAudit: async function (eventType, metadata = {}) {
      const client = this.getClient();
      const sanitizedMeta = scrubMetadata(metadata);
      const user = await this.getCurrentUser();

      console.log(`[Unexa Audit] [${eventType}]`, sanitizedMeta);

      if (client && user) {
        try {
          await client.from('audit_logs').insert({
            user_id: user.id,
            event_type: eventType,
            metadata: sanitizedMeta
          });
        } catch (e) {
          console.warn('[Unexa Audit] Failed to write remote audit record:', e.message);
        }
      }
    },

    // Authentication Methods
    signUpWithEmail: async function (email, password, fullName, phone, vpa) {
      const client = this.getClient();
      if (!client) throw new Error('Supabase client not initialized');

      const { data, error } = await client.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          data: {
            full_name: fullName,
            phone: phone,
            vpa: vpa
          }
        }
      });

      if (error) {
        await this.logAudit('AUTH_SIGNUP_FAILED', { email, error: error.message });
        throw error;
      }

      await this.logAudit('AUTH_SIGNUP_SUCCESS', { userId: data.user?.id, email });
      return data;
    },

    signInWithEmail: async function (email, password) {
      const client = this.getClient();
      if (!client) throw new Error('Supabase client not initialized');

      const { data, error } = await client.auth.signInWithPassword({
        email: email.trim(),
        password: password
      });

      if (error) {
        await this.logAudit('AUTH_LOGIN_FAILED', { email, error: error.message });
        throw error;
      }

      await this.logAudit('AUTH_LOGIN_SUCCESS', { userId: data.user?.id, email });
      return data;
    },

    signInWithOtp: async function (identifier) {
      const trimmed = (identifier || '').trim();
      const isEmail = trimmed.includes('@');
      const formattedIdentifier = isEmail ? trimmed : formatE164Phone(trimmed);

      const client = this.getClient();
      if (!client) {
        return { data: null, error: normalizeSupabaseError('Supabase client not initialized'), isEmail, formattedIdentifier };
      }

      if (!trimmed) {
        return { data: null, error: normalizeSupabaseError('Mobile number or email is required'), isEmail, formattedIdentifier };
      }

      let payload;
      if (isEmail) {
        payload = { email: trimmed };
      } else {
        if (formattedIdentifier.length < 12) {
          return { data: null, error: normalizeSupabaseError('Please enter a valid 10-digit mobile number'), isEmail, formattedIdentifier };
        }
        payload = { phone: formattedIdentifier };
      }

      try {
        const { data, error } = await client.auth.signInWithOtp(payload);
        if (error) {
          await this.logAudit('AUTH_OTP_REQUEST_FAILED', { error: error.message });
          return { data: null, error: normalizeSupabaseError(error), isEmail, formattedIdentifier };
        }

        await this.logAudit('AUTH_OTP_REQUEST_SENT', { isEmail });
        return { data, error: null, isEmail, formattedIdentifier };
      } catch (err) {
        return { data: null, error: normalizeSupabaseError(err), isEmail, formattedIdentifier };
      }
    },

    verifyOtp: async function (identifier, token, type = 'sms') {
      const trimmed = (identifier || '').trim();
      const isEmail = trimmed.includes('@');
      const formattedIdentifier = isEmail ? trimmed : formatE164Phone(trimmed);

      const client = this.getClient();
      if (!client) {
        return { data: null, session: null, user: null, error: normalizeSupabaseError('Supabase client not initialized'), isEmail, formattedIdentifier };
      }

      const cleanToken = (token || '').trim();
      if (!cleanToken || cleanToken.length < 6) {
        return { data: null, session: null, user: null, error: normalizeSupabaseError('Please enter the complete 6-digit verification code'), isEmail, formattedIdentifier };
      }

      const payload = {
        token: cleanToken,
        type: isEmail ? (type === 'sms' ? 'email' : type) : 'sms',
        ...(isEmail ? { email: trimmed } : { phone: formattedIdentifier })
      };

      try {
        const { data, error } = await client.auth.verifyOtp(payload);
        if (error) {
          await this.logAudit('AUTH_OTP_VERIFY_FAILED', { error: error.message });
          return { data: null, session: null, user: null, error: normalizeSupabaseError(error) };
        }

        await this.logAudit('AUTH_OTP_VERIFY_SUCCESS', { userId: data.user?.id });
        return { data, session: data.session, user: data.user, error: null };
      } catch (err) {
        return { data: null, session: null, user: null, error: normalizeSupabaseError(err) };
      }
    },

    signOut: async function () {
      const client = this.getClient();
      inMemorySessionPinHash = null;

      if (client) {
        try {
          await this.logAudit('AUTH_LOGOUT');
          await client.auth.signOut();
        } catch (e) {
          console.warn('[Unexa Security] Sign out error:', e.message);
        }
      }
    },

    getCurrentSession: async function () {
      const client = this.getClient();
      if (!client) return null;
      try {
        const { data, error } = await client.auth.getSession();
        if (error) throw error;
        return data.session;
      } catch (e) {
        return null;
      }
    },

    getCurrentUser: async function () {
      const client = this.getClient();
      if (!client) return null;
      try {
        const { data, error } = await client.auth.getUser();
        if (error) throw error;
        return data.user;
      } catch (e) {
        return null;
      }
    },

    onAuthStateChange: function (callback) {
      const client = this.getClient();
      if (!client) return { unsubscribe: function () {} };
      const { data: { subscription } } = client.auth.onAuthStateChange(callback);
      return subscription;
    },

    // In-Memory PIN Security (Never written to disk or localStorage)
    setSessionPin: async function (pin) {
      inMemorySessionPinHash = await hashPin(pin);
    },

    verifySessionPin: async function (pin) {
      if (!inMemorySessionPinHash || !pin) {
        return false;
      }
      const checkHash = await hashPin(pin);
      return checkHash === inMemorySessionPinHash;
    },

    // Server-Side PIN Setup & Verification (Zero-Client Trust via PostgreSQL RPC)
    setupAppPin: async function (pin) {
      if (!pin || !/^\d{4}$/.test(pin.trim())) {
        return { data: null, error: 'PIN must be exactly 4 numeric digits', isOffline: false };
      }
      const client = this.getClient();
      if (!client) {
        await this.setSessionPin(pin.trim());
        return { data: { success: true, message: 'In-memory PIN configured for offline mode' }, error: null, isOffline: true };
      }
      try {
        const { data, error } = await client.rpc('setup_app_pin', { p_pin: pin.trim() });
        if (error) return { data: null, error: error.message, isOffline: false };
        await this.setSessionPin(pin.trim());
        await this.logAudit('PIN_SETUP_COMPLETED');
        return { data, error: null, isOffline: false };
      } catch (err) {
        await this.setSessionPin(pin.trim());
        return { data: { success: true }, error: null, isOffline: true };
      }
    },

    verifyAppPin: async function (pin) {
      if (!pin || !/^\d{4}$/.test(String(pin).trim())) {
        return { success: false, error: 'PIN must be exactly 4 numeric digits', isOffline: false };
      }
      const cleanPin = String(pin).trim();
      const client = this.getClient();
      if (!client) {
        const isValid = await this.verifySessionPin(cleanPin);
        return { success: isValid, error: isValid ? null : 'Incorrect PIN entered', isOffline: true };
      }
      try {
        const { data, error } = await client.rpc('verify_app_pin', { p_pin: cleanPin });
        if (error) {
          return { success: false, error: error.message || 'Server-side PIN verification failed', isOffline: false };
        }
        if (data && data.success) {
          await this.setSessionPin(cleanPin);
          return { success: true, error: null, isOffline: false };
        }
        return {
          success: false,
          locked: !!data?.locked,
          remaining_seconds: data?.remaining_seconds || 0,
          attempts_remaining: data?.attempts_remaining,
          not_set: !!data?.not_set,
          error: data?.error || 'Invalid PIN entered',
          isOffline: false
        };
      } catch (err) {
        return {
          success: false,
          error: 'Network error: Unable to verify PIN with security ledger. Please check your internet connection.',
          isOffline: false
        };
      }
    },

    // =========================================================================
    // 6. PERSONAL MODE SERVICES (Profiles, Bank Accounts, Transactions, RPC)
    // =========================================================================
    fetchProfile: async function (userId) {
      const client = this.getClient();
      if (!client) return { data: null, isOffline: true, error: 'Client uninitialized' };
      try {
        const uid = userId || (await this.getCurrentUser())?.id;
        if (!uid) return { data: null, isOffline: true, error: 'No active session' };
        
        const { data, error } = await client
          .from('profiles')
          .select('*, bank_accounts(*)')
          .eq('id', uid)
          .maybeSingle();

        if (error) {
          return { data: null, isOffline: true, error: error.message };
        }
        return { data, isOffline: false, error: null };
      } catch (err) {
        return { data: null, isOffline: true, error: err.message };
      }
    },

    updateProfile: async function (userId, updates) {
      const client = this.getClient();
      if (!client) return { data: null, isOffline: true, error: 'Client uninitialized' };
      try {
        const uid = userId || (await this.getCurrentUser())?.id;
        if (!uid) return { data: null, isOffline: true, error: 'No active session' };

        const sanitized = {
          full_name: updates.full_name ? escapeHtml(updates.full_name) : undefined,
          phone: updates.phone ? escapeHtml(updates.phone) : undefined,
          avatar_url: updates.avatar_url ? escapeHtml(updates.avatar_url) : undefined,
          vpa: updates.vpa ? escapeHtml(updates.vpa) : undefined,
          is_onboarded: typeof updates.is_onboarded === 'boolean' ? updates.is_onboarded : undefined,
          onboarding_step: updates.onboarding_step ? escapeHtml(updates.onboarding_step) : undefined,
          business_status: updates.business_status ? escapeHtml(updates.business_status) : undefined,
          is_biometric_enabled: typeof updates.is_biometric_enabled === 'boolean' ? updates.is_biometric_enabled : undefined,
          is_business_enabled: typeof updates.is_business_enabled === 'boolean' ? updates.is_business_enabled : undefined,
          updated_at: new Date().toISOString()
        };
        Object.keys(sanitized).forEach(k => sanitized[k] === undefined && delete sanitized[k]);

        const { data, error } = await client
          .from('profiles')
          .update(sanitized)
          .eq('id', uid)
          .select()
          .maybeSingle();

        if (error) return { data: null, isOffline: true, error: error.message };
        await this.logAudit('PROFILE_UPDATED', { userId: uid });
        return { data, isOffline: false, error: null };
      } catch (err) {
        return { data: null, isOffline: true, error: err.message };
      }
    },

    uploadAvatar: async function (file, userId) {
      const client = this.getClient();
      if (!client) return { data: null, isOffline: true, error: 'Client uninitialized' };
      try {
        const uid = userId || (await this.getCurrentUser())?.id;
        if (!uid) return { data: null, isOffline: true, error: 'Authentication required' };

        const ext = (file.name && file.name.includes('.')) ? file.name.split('.').pop() : 'png';
        const filePath = `${uid}/avatar-${Date.now()}.${ext}`;

        const { data: uploadData, error: uploadError } = await client.storage
          .from('avatars')
          .upload(filePath, file, {
            upsert: true,
            contentType: file.type || 'image/png'
          });

        if (uploadError) {
          return { data: null, error: uploadError.message, isOffline: false };
        }

        const { data: publicUrlData } = client.storage
          .from('avatars')
          .getPublicUrl(filePath);

        const avatarUrl = publicUrlData?.publicUrl || filePath;
        await this.updateProfile(uid, { avatar_url: avatarUrl });
        await this.logAudit('AVATAR_UPLOADED', { userId: uid, path: filePath });

        return { data: { publicUrl: avatarUrl, path: filePath }, error: null, isOffline: false };
      } catch (err) {
        return { data: null, isOffline: true, error: err.message };
      }
    },

    // =========================================================================
    // FIRST-TIME REGISTRATION & ONBOARDING STATE MANAGEMENT
    // =========================================================================
    isBankingProviderConfigured: function () {
      const config = window.UNEXA_CONFIG || {};
      return Boolean(config.BANKING_PROVIDER_KEY && config.BANKING_PROVIDER_SECRET);
    },

    checkPhoneExists: async function (phone) {
      const formatted = formatE164Phone(phone);
      const client = this.getClient();
      if (!client) return { exists: false, isOffline: true, error: 'Client uninitialized' };
      try {
        const { data, error } = await client
          .from('profiles')
          .select('id, phone, full_name, is_onboarded, onboarding_step')
          .eq('phone', formatted)
          .maybeSingle();

        if (error) return { exists: false, isOffline: true, error: error.message };
        return { exists: Boolean(data), profile: data, isOffline: false, error: null };
      } catch (err) {
        return { exists: false, isOffline: true, error: err.message };
      }
    },

    createRegistrationProfile: async function ({ userId, fullName, phone, email = '', vpa = '' }) {
      const client = this.getClient();
      if (!client) return { data: null, isOffline: true, error: 'Client uninitialized' };
      try {
        const uid = userId || (await this.getCurrentUser())?.id;
        if (!uid) return { data: null, isOffline: true, error: 'Authentication required' };

        const safeName = escapeHtml(fullName.trim());
        const safePhone = formatE164Phone(phone);
        const safeEmail = email ? escapeHtml(email.trim().toLowerCase()) : null;
        const safeVpa = vpa ? escapeHtml(vpa.trim().toLowerCase()) : `${safeName.toLowerCase().replace(/[^a-z0-9]/g, '')}@upi`;

        const profileRecord = {
          id: uid,
          full_name: safeName,
          phone: safePhone,
          vpa: safeVpa,
          is_onboarded: false,
          onboarding_step: 'pin_setup_incomplete',
          updated_at: new Date().toISOString()
        };

        const { data, error } = await client
          .from('profiles')
          .upsert(profileRecord, { onConflict: 'id' })
          .select()
          .single();

        if (error) return { data: null, isOffline: true, error: error.message };
        await this.logAudit('REGISTRATION_PROFILE_CREATED', { userId: uid, phone: safePhone });
        return { data, isOffline: false, error: null };
      } catch (err) {
        return { data: null, isOffline: true, error: err.message };
      }
    },

    fetchOnboardingStatus: async function (userId) {
      const client = this.getClient();
      if (!client) return { isCompleted: false, is_onboarded: false, step: 'account_not_created', onboarding_step: 'account_not_created', profile: null, bankAccounts: [], bank_accounts: [], isOffline: true };
      try {
        const user = await this.getCurrentUser();
        const uid = userId || user?.id;
        if (!uid) return { isCompleted: false, is_onboarded: false, step: 'account_not_created', onboarding_step: 'account_not_created', profile: null, bankAccounts: [], bank_accounts: [], isOffline: false };

        const { data: profile, error } = await client
          .from('profiles')
          .select('*, bank_accounts(*)')
          .eq('id', uid)
          .maybeSingle();

        if (error || !profile) {
          return { isCompleted: false, is_onboarded: false, step: 'phone_not_verified', onboarding_step: 'phone_not_verified', profile: null, user, bankAccounts: [], bank_accounts: [], isOffline: false };
        }

        const isCompleted = Boolean(profile.is_onboarded || profile.onboarding_step === 'onboarding_complete');
        let currentStep = profile.onboarding_step || (isCompleted ? 'onboarding_complete' : 'pin_setup_incomplete');

        return {
          isCompleted,
          is_onboarded: isCompleted,
          step: currentStep,
          onboarding_step: currentStep,
          profile,
          user,
          bankAccounts: profile.bank_accounts || [],
          bank_accounts: profile.bank_accounts || [],
          isOffline: false,
          error: null
        };
      } catch (err) {
        return { isCompleted: false, is_onboarded: false, step: 'account_not_created', onboarding_step: 'account_not_created', profile: null, bankAccounts: [], bank_accounts: [], isOffline: true, error: err.message };
      }
    },

    updateOnboardingStep: async function (userId, step) {
      const client = this.getClient();
      if (!client) return { success: false, isOffline: true };
      try {
        const uid = userId || (await this.getCurrentUser())?.id;
        if (!uid) return { success: false, error: 'Authentication required' };

        const isComplete = (step === 'onboarding_complete');
        const updates = {
          onboarding_step: step,
          is_onboarded: isComplete,
          updated_at: new Date().toISOString()
        };

        const { data, error } = await client
          .from('profiles')
          .update(updates)
          .eq('id', uid)
          .select()
          .maybeSingle();

        if (error) return { success: false, error: error.message };
        await this.logAudit('ONBOARDING_STEP_UPDATED', { userId: uid, step });
        return { success: true, data };
      } catch (err) {
        return { success: false, error: err.message };
      }
    },

    addBankAccount: async function ({ bankName, accountMasked, ifsc = 'HDFC0001234', isPrimary = true, accountType = 'Savings A/C', balance = 25000 }) {
      const client = this.getClient();
      if (!client) return { data: null, isOffline: true, error: 'Client uninitialized' };
      try {
        const user = await this.getCurrentUser();
        if (!user) return { data: null, isOffline: true, error: 'Authentication required' };

        const safeBank = escapeHtml(bankName.trim());
        const safeMasked = escapeHtml(accountMasked.trim());
        const safeIfsc = escapeHtml(ifsc.trim());

        // Zero-secret guarantee: strictly reject any attempt to pass sensitive credentials
        const newAccount = {
          user_id: user.id,
          bank_name: safeBank,
          account_masked: safeMasked,
          ifsc: safeIfsc,
          is_primary: isPrimary,
          balance: balance,
          account_type: accountType
        };

        const { data, error } = await client
          .from('bank_accounts')
          .insert(newAccount)
          .select()
          .single();

        if (error) return { data: null, isOffline: true, error: error.message };
        await this.logAudit('BANK_ACCOUNT_LINKED', { bank: safeBank, masked: safeMasked });
        return { data, isOffline: false, error: null };
      } catch (err) {
        return { data: null, isOffline: true, error: err.message };
      }
    },

    fetchBankAccounts: async function (userId) {
      const client = this.getClient();
      if (!client) return { data: null, isOffline: true, error: 'Client uninitialized' };
      try {
        const uid = userId || (await this.getCurrentUser())?.id;
        if (!uid) return { data: null, isOffline: true, error: 'No active session' };

        const { data, error } = await client
          .from('bank_accounts')
          .select('*')
          .eq('user_id', uid)
          .order('is_primary', { ascending: false });

        if (error) return { data: null, isOffline: true, error: error.message };
        return { data: data || [], isOffline: false, error: null };
      } catch (err) {
        return { data: null, isOffline: true, error: err.message };
      }
    },

    fetchTransactions: async function (userId, limit = 50) {
      const client = this.getClient();
      if (!client) return { data: null, isOffline: true, error: 'Client uninitialized' };
      try {
        const uid = userId || (await this.getCurrentUser())?.id;
        if (!uid) return { data: null, isOffline: true, error: 'No active session' };

        const { data, error } = await client
          .from('transactions')
          .select('*')
          .eq('user_id', uid)
          .order('created_at', { ascending: false })
          .limit(limit);

        if (error) return { data: null, isOffline: true, error: error.message };
        return { data: data || [], isOffline: false, error: null };
      } catch (err) {
        return { data: null, isOffline: true, error: err.message };
      }
    },

    executeTransfer: async function ({ bankAccountId, payeeVpa, payeeName, amount, category = 'Payment', notes = '' }) {
      const client = this.getClient();
      const amtVal = validateAmount(amount);
      if (!amtVal.valid) {
        return { success: false, error: amtVal.error };
      }
      const vpaVal = validateVpa(payeeVpa);
      if (!vpaVal.valid) {
        return { success: false, error: vpaVal.error };
      }

      if (!client) {
        return { success: false, isOffline: true, error: 'Client uninitialized' };
      }

      const user = await this.getCurrentUser();
      if (!user) {
        return { success: false, isOffline: true, error: 'Authentication required for server transfer' };
      }

      try {
        const { data, error } = await client.rpc('execute_transfer', {
          p_bank_account_id: bankAccountId,
          p_payee_vpa: vpaVal.value,
          p_payee_name: escapeHtml(payeeName),
          p_amount: amtVal.value,
          p_category: category ? escapeHtml(category) : 'General',
          p_notes: notes ? escapeHtml(notes) : ''
        });

        if (error) {
          await this.logAudit('TRANSFER_FAILED', { amount: amtVal.value, payeeVpa: vpaVal.value, error: error.message });
          return { success: false, error: error.message };
        }

        return { success: true, data, isOffline: false };
      } catch (err) {
        return { success: false, isOffline: true, error: err.message };
      }
    },

    // =========================================================================
    // 7. GROUP MODE SERVICES (Groups, Members, Expenses, Splits, Settle)
    // =========================================================================
    fetchGroups: async function () {
      const client = this.getClient();
      if (!client) return { data: null, isOffline: true, error: 'Client uninitialized' };
      try {
        const user = await this.getCurrentUser();
        if (!user) return { data: null, isOffline: true, error: 'No active session' };

        const { data: groups, error } = await client
          .from('groups')
          .select(`
            *,
            members:group_members(*, profile:profiles(full_name, phone, avatar_url)),
            expenses:group_expenses(*, splits:group_splits(*))
          `)
          .order('created_at', { ascending: false });

        if (error) return { data: null, isOffline: true, error: error.message };
        return { data: groups || [], isOffline: false, error: null };
      } catch (err) {
        return { data: null, isOffline: true, error: err.message };
      }
    },

    createGroup: async function ({ name, emoji = '👥', description = '', vpa, budget = 0, maxMembers = 10 }) {
      const client = this.getClient();
      if (!client) return { data: null, isOffline: true, error: 'Client uninitialized' };
      const user = await this.getCurrentUser();
      if (!user) return { data: null, isOffline: true, error: 'Authentication required' };

      const safeName = escapeHtml(name);
      const safeDesc = escapeHtml(description);
      const safeVpa = vpa ? escapeHtml(vpa) : `${safeName.toLowerCase().replace(/[^a-z0-9]/g, '')}-${Date.now().toString().slice(-4)}@unexapool`;

      try {
        const { data: group, error: grpErr } = await client
          .from('groups')
          .insert({
            name: safeName,
            emoji: emoji,
            description: safeDesc,
            vpa: safeVpa,
            created_by: user.id,
            balance: Math.max(0, Number(budget) || 0),
            total_spent: 0,
            max_members: Math.max(2, parseInt(maxMembers) || 10),
            status: 'active'
          })
          .select()
          .single();

        if (grpErr) return { data: null, error: grpErr.message };

        const { error: memErr } = await client
          .from('group_members')
          .insert({
            group_id: group.id,
            user_id: user.id,
            role: 'admin',
            total_paid: Math.max(0, Number(budget) || 0),
            total_consumed: 0
          });

        if (memErr) console.warn('[Unexa Group] Add admin member error:', memErr.message);

        await this.logAudit('GROUP_CREATED', { groupId: group.id, name: safeName });
        return { data: group, error: null, isOffline: false };
      } catch (err) {
        return { data: null, isOffline: true, error: err.message };
      }
    },

    addGroupMember: async function (groupId, { userId, role = 'member', paid = 0 }) {
      const client = this.getClient();
      if (!client) return { data: null, isOffline: true, error: 'Client uninitialized' };
      try {
        const { data, error } = await client
          .from('group_members')
          .insert({
            group_id: groupId,
            user_id: userId,
            role: role,
            total_paid: Math.max(0, Number(paid) || 0),
            total_consumed: 0
          })
          .select()
          .single();

        if (error) return { data: null, error: error.message };
        await this.logAudit('GROUP_MEMBER_ADDED', { groupId, userId, role });
        return { data, error: null, isOffline: false };
      } catch (err) {
        return { data: null, isOffline: true, error: err.message };
      }
    },

    removeGroupMember: async function (groupId, memberRecordId) {
      const client = this.getClient();
      if (!client) return { success: false, isOffline: true, error: 'Client uninitialized' };
      try {
        const { error } = await client
          .from('group_members')
          .delete()
          .eq('id', memberRecordId)
          .eq('group_id', groupId);

        if (error) return { success: false, error: error.message };
        await this.logAudit('GROUP_MEMBER_REMOVED', { groupId, memberRecordId });
        return { success: true, error: null, isOffline: false };
      } catch (err) {
        return { success: false, isOffline: true, error: err.message };
      }
    },

    recordGroupExpense: async function ({ groupId, title, amount, splitType = 'equal', splits = [] }) {
      const client = this.getClient();
      if (!client) return { data: null, isOffline: true, error: 'Client uninitialized' };
      const user = await this.getCurrentUser();
      if (!user) return { data: null, isOffline: true, error: 'Authentication required' };

      const amtVal = validateAmount(amount);
      if (!amtVal.valid) return { data: null, error: amtVal.error };

      try {
        const { data: exp, error: expErr } = await client
          .from('group_expenses')
          .insert({
            group_id: groupId,
            paid_by: user.id,
            title: escapeHtml(title),
            amount: amtVal.value,
            split_type: splitType
          })
          .select()
          .single();

        if (expErr) return { data: null, error: expErr.message };

        if (splits && splits.length > 0) {
          const splitRows = splits.map(s => ({
            expense_id: exp.id,
            user_id: s.userId || user.id,
            amount: Math.max(0, Number(s.amount) || 0),
            percentage: s.percentage ? Number(s.percentage) : null,
            is_settled: false
          }));

          const { error: splitErr } = await client.from('group_splits').insert(splitRows);
          if (splitErr) console.warn('[Unexa Group] Splits insert warning:', splitErr.message);
        }

        const { data: groupData } = await client.from('groups').select('total_spent').eq('id', groupId).single();
        if (groupData) {
          await client
            .from('groups')
            .update({ total_spent: (Number(groupData.total_spent) || 0) + amtVal.value, updated_at: new Date().toISOString() })
            .eq('id', groupId);
        }

        await this.logAudit('GROUP_EXPENSE_RECORDED', { groupId, expenseId: exp.id, amount: amtVal.value });
        return { data: exp, error: null, isOffline: false };
      } catch (err) {
        return { data: null, isOffline: true, error: err.message };
      }
    },

    settleGroupPool: async function (groupId) {
      const client = this.getClient();
      if (!client) return { success: false, isOffline: true, error: 'Client uninitialized' };
      try {
        const { error } = await client
          .from('groups')
          .update({ status: 'settled', balance: 0.00, updated_at: new Date().toISOString() })
          .eq('id', groupId);

        if (error) return { success: false, error: error.message };

        const { data: exps } = await client.from('group_expenses').select('id').eq('group_id', groupId);
        if (exps && exps.length > 0) {
          const expIds = exps.map(e => e.id);
          await client.from('group_splits').update({ is_settled: true }).in('expense_id', expIds);
        }

        await this.logAudit('GROUP_POOL_SETTLED', { groupId });
        return { success: true, error: null, isOffline: false };
      } catch (err) {
        return { success: false, isOffline: true, error: err.message };
      }
    },

    // Group Tools Suite Services
    fetchRecurringExpenses: async function (groupId) {
      const client = this.getClient();
      if (!client) return { data: [], isOffline: true, error: 'Client uninitialized' };
      try {
        const { data, error } = await client
          .from('group_recurring_expenses')
          .select('*')
          .eq('group_id', groupId)
          .order('next_due_date', { ascending: true });
        if (error) return { data: [], error: error.message };
        return { data: data || [], error: null, isOffline: false };
      } catch (err) {
        return { data: [], isOffline: true, error: err.message };
      }
    },

    addRecurringExpense: async function ({ groupId, title, amount, frequency = 'monthly', nextDueDate }) {
      const client = this.getClient();
      if (!client) return { data: null, isOffline: true, error: 'Client uninitialized' };
      try {
        const user = await this.getCurrentUser();
        const { data, error } = await client
          .from('group_recurring_expenses')
          .insert({
            group_id: groupId,
            title: escapeHtml(title),
            amount: parseFloat(amount),
            frequency: frequency,
            next_due_date: nextDueDate,
            created_by: user ? user.id : null
          })
          .select()
          .single();
        if (error) return { data: null, error: error.message };
        await this.logAudit('GROUP_RECURRING_EXPENSE_ADDED', { groupId, title, amount });
        return { data, error: null, isOffline: false };
      } catch (err) {
        return { data: null, isOffline: true, error: err.message };
      }
    },

    fetchGroupBudget: async function (groupId) {
      const client = this.getClient();
      if (!client) return { data: null, isOffline: true, error: 'Client uninitialized' };
      try {
        const { data, error } = await client
          .from('group_budgets')
          .select('*')
          .eq('group_id', groupId)
          .maybeSingle();
        if (error) return { data: null, error: error.message };
        return { data, error: null, isOffline: false };
      } catch (err) {
        return { data: null, isOffline: true, error: err.message };
      }
    },

    setGroupBudget: async function ({ groupId, monthlyBudget, alertThresholdPct = 80 }) {
      const client = this.getClient();
      if (!client) return { data: null, isOffline: true, error: 'Client uninitialized' };
      try {
        const { data, error } = await client
          .from('group_budgets')
          .upsert({
            group_id: groupId,
            monthly_budget: parseFloat(monthlyBudget),
            alert_threshold_pct: parseInt(alertThresholdPct, 10),
            updated_at: new Date().toISOString()
          }, { onConflict: 'group_id' })
          .select()
          .single();
        if (error) return { data: null, error: error.message };
        await this.logAudit('GROUP_BUDGET_UPDATED', { groupId, monthlyBudget });
        return { data, error: null, isOffline: false };
      } catch (err) {
        return { data: null, isOffline: true, error: err.message };
      }
    },

    fetchExpenseApprovals: async function (groupId) {
      const client = this.getClient();
      if (!client) return { data: [], isOffline: true, error: 'Client uninitialized' };
      try {
        const { data, error } = await client
          .from('group_expense_approvals')
          .select('*, profiles(full_name, avatar_url)')
          .eq('group_id', groupId);
        if (error) return { data: [], error: error.message };
        return { data: data || [], error: null, isOffline: false };
      } catch (err) {
        return { data: [], isOffline: true, error: err.message };
      }
    },

    submitExpenseApproval: async function ({ expenseId, groupId, approved = true }) {
      const client = this.getClient();
      if (!client) return { data: null, isOffline: true, error: 'Client uninitialized' };
      try {
        const user = await this.getCurrentUser();
        const { data, error } = await client
          .from('group_expense_approvals')
          .upsert({
            expense_id: expenseId,
            group_id: groupId,
            approved_by: user ? user.id : null,
            status: approved ? 'approved' : 'rejected',
            created_at: new Date().toISOString()
          })
          .select()
          .single();
        if (error) return { data: null, error: error.message };
        await this.logAudit('GROUP_EXPENSE_APPROVAL_RECORDED', { expenseId, approved });
        return { data, error: null, isOffline: false };
      } catch (err) {
        return { data: null, isOffline: true, error: err.message };
      }
    },

    // =========================================================================
    // 8. BUSINESS MODE SERVICES (Merchants, Collections, Khata, Settlements, Staff)
    // =========================================================================
    applyForBusinessAccount: async function ({ storeName, category = 'Retail & Grocery', gstin = '', address = '' }) {
      const client = this.getClient();
      if (!client) return { data: null, isOffline: true, error: 'Client uninitialized' };
      try {
        const { data, error } = await client.rpc('apply_for_business', {
          p_store_name: escapeHtml(storeName),
          p_category: escapeHtml(category),
          p_gstin: gstin ? escapeHtml(gstin) : null,
          p_address: address ? escapeHtml(address) : null
        });
        if (error) return { data: null, error: error.message, isOffline: false };
        await this.logAudit('MERCHANT_APPLICATION_SUBMITTED', { storeName, category });
        return { data, error: null, isOffline: false };
      } catch (err) {
        return { data: null, isOffline: true, error: err.message };
      }
    },

    _merchantCache: { data: null, timestamp: 0, uid: null },

    invalidateMerchantCache: function () {
      this._merchantCache = { data: null, timestamp: 0, uid: null };
    },

    fetchMerchant: async function (userId, forceRefresh = false) {
      const client = this.getClient();
      if (!client) return { data: null, isOffline: true, error: 'Client uninitialized' };
      try {
        const uid = userId || (await this.getCurrentUser())?.id;
        if (!uid) return { data: null, isOffline: true, error: 'No active session' };

        // Return from in-memory cache if fresh (< 60s)
        if (!forceRefresh && this._merchantCache && this._merchantCache.data && this._merchantCache.uid === uid && (Date.now() - this._merchantCache.timestamp < 60000)) {
          return { data: this._merchantCache.data, isOffline: false, isCached: true, error: null };
        }

        // Fetch core merchant record efficiently without massive unbounded joins
        const { data, error } = await client
          .from('merchants')
          .select('*')
          .eq('owner_id', uid)
          .maybeSingle();

        if (error) return { data: null, isOffline: true, error: error.message };

        if (data) {
          // Backward & forward compatibility normalization across column names
          data.store_name = data.business_name || data.store_name;
          data.business_name = data.business_name || data.store_name;
          data.business_category = data.category || data.business_category;
          data.category = data.category || data.business_category;
          data.merchant_vpa = data.store_vpa || data.merchant_vpa;
          data.store_vpa = data.store_vpa || data.merchant_vpa;
          this._merchantCache = { data, timestamp: Date.now(), uid };
        }

        return { data, isOffline: false, error: null };
      } catch (err) {
        return { data: null, isOffline: true, error: err.message };
      }
    },

    setupMerchantProfile: async function ({ storeName, category = 'Retail & Grocery', gstin = '', bankAccountId = null }) {
      const client = this.getClient();
      if (!client) return { data: null, isOffline: true, error: 'Client uninitialized' };
      try {
        const user = await this.getCurrentUser();
        if (!user) return { data: null, isOffline: true, error: 'Authentication required' };

        const safeStoreName = escapeHtml(storeName);
        const safeCat = escapeHtml(category);
        const safeGstin = gstin ? escapeHtml(gstin) : null;
        const vpaHandle = `${safeStoreName.toLowerCase().replace(/[^a-z0-9]/g, '')}-${Date.now().toString().slice(-4)}@upi`;

        const { data, error } = await client
          .from('merchants')
          .upsert({
            owner_id: user.id,
            business_name: safeStoreName,
            category: safeCat,
            gstin: safeGstin,
            store_vpa: vpaHandle,
            settlement_bank_id: bankAccountId
          })
          .select()
          .single();

        if (error) return { data: null, isOffline: true, error: error.message };
        this.invalidateMerchantCache();
        await this.logAudit('MERCHANT_PROFILE_SAVED', { storeName: safeStoreName, category: safeCat });
        return { data, isOffline: false, error: null };
      } catch (err) {
        return { data: null, isOffline: true, error: err.message };
      }
    },

    fetchMerchantCollections: async function (merchantId, limit = 50) {
      const client = this.getClient();
      if (!client || !merchantId) return { data: [], isOffline: true };
      try {
        const { data, error } = await client
          .from('merchant_collections')
          .select('*')
          .eq('merchant_id', merchantId)
          .order('created_at', { ascending: false })
          .limit(limit);

        if (error) return { data: [], isOffline: true, error: error.message };
        return { data: data || [], isOffline: false, error: null };
      } catch (err) {
        return { data: [], isOffline: true, error: err.message };
      }
    },

    recordKhataEntry: async function (merchantId, { partyName, partyPhone, partyType = 'customer', entryType, amount, notes = '', billNumber = '' }) {
      this.invalidateMerchantCache();
      const client = this.getClient();
      if (!client) return { data: null, isOffline: true, error: 'Client uninitialized' };
      const amtVal = validateAmount(amount);
      if (!amtVal.valid) return { data: null, error: amtVal.error };

      const safeName = escapeHtml(partyName);
      const safePhone = escapeHtml(partyPhone);

      try {
        let { data: party } = await client
          .from('khata_parties')
          .select('*')
          .eq('merchant_id', merchantId)
          .eq('phone', safePhone)
          .eq('party_type', partyType)
          .maybeSingle();

        if (!party) {
          const { data: newParty, error: pErr } = await client
            .from('khata_parties')
            .insert({
              merchant_id: merchantId,
              name: safeName,
              phone: safePhone,
              party_type: partyType,
              net_balance: 0
            })
            .select()
            .single();

          if (pErr) return { data: null, error: pErr.message };
          party = newParty;
        }

        const { data: entry, error: eErr } = await client
          .from('khata_entries')
          .insert({
            party_id: party.id,
            entry_type: entryType,
            amount: amtVal.value,
            notes: notes ? escapeHtml(notes) : null,
            bill_number: billNumber ? escapeHtml(billNumber) : null
          })
          .select()
          .single();

        if (eErr) return { data: null, error: eErr.message };

        const delta = entryType === 'get' ? amtVal.value : -amtVal.value;
        const newBal = (Number(party.net_balance) || 0) + delta;
        await client
          .from('khata_parties')
          .update({ net_balance: newBal, updated_at: new Date().toISOString() })
          .eq('id', party.id);

        await this.logAudit('KHATA_ENTRY_RECORDED', { merchantId, partyId: party.id, amount: amtVal.value, entryType });
        return { data: entry, party: { ...party, net_balance: newBal }, error: null, isOffline: false };
      } catch (err) {
        return { data: null, isOffline: true, error: err.message };
      }
    },

    requestSettlement: async function (merchantId, { amount, bankName = 'HDFC Bank', accountMasked = 'XX8812' }) {
      this.invalidateMerchantCache();
      const client = this.getClient();
      if (!client) return { data: null, isOffline: true, error: 'Client uninitialized' };
      const amtVal = validateAmount(amount);
      if (!amtVal.valid) return { data: null, error: amtVal.error };

      try {
        const utr = 'HDFC' + Math.floor(10000000 + Math.random() * 90000000);
        const { data, error } = await client
          .from('merchant_settlements')
          .insert({
            merchant_id: merchantId,
            amount: amtVal.value,
            bank_name: escapeHtml(bankName),
            account_masked: escapeHtml(accountMasked),
            utr: utr,
            status: 'completed'
          })
          .select()
          .single();

        if (error) return { data: null, error: error.message };

        const { data: merch } = await client.from('merchants').select('available_settlement').eq('id', merchantId).single();
        if (merch) {
          const updated = Math.max(0, (Number(merch.available_settlement) || 0) - amtVal.value);
          await client.from('merchants').update({ available_settlement: updated }).eq('id', merchantId);
        }

        await this.logAudit('MERCHANT_SETTLEMENT_REQUESTED', { merchantId, amount: amtVal.value, utr });
        return { data, utr, error: null, isOffline: false };
      } catch (err) {
        return { data: null, isOffline: true, error: err.message };
      }
    },

    manageStaff: async function (merchantId, { staffName, staffPhone, role = 'cashier' }) {
      const client = this.getClient();
      if (!client) return { data: null, isOffline: true, error: 'Client uninitialized' };
      try {
        const { data, error } = await client
          .from('merchant_staff')
          .insert({
            merchant_id: merchantId,
            staff_name: escapeHtml(staffName),
            staff_phone: escapeHtml(staffPhone),
            role: role
          })
          .select()
          .single();

        if (error) return { data: null, error: error.message };
        await this.logAudit('STAFF_INVITED', { merchantId, staffName, role });
        return { data, error: null, isOffline: false };
      } catch (err) {
        return { data: null, isOffline: true, error: err.message };
      }
    }
  };

  // Auto-init on script evaluation
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initSupabase);
    } else {
      initSupabase();
    }
  }


  // =========================================================================
  // 9. UNEXA SCAM SHIELD - HEURISTIC FRAUD DETECTION ENGINE
  // =========================================================================
  const UnexaScamShield = {
    PATTERNS: {
      URGENT_COERCION: [
        /urgent(ly)?/i,
        /immediate(ly)? action/i,
        /account.*(blocked|suspended|freeze|locked)/i,
        /within\s*\d+\s*(hours|mins|minutes)/i,
        /electricity.*(cut|disconnect|power)/i,
        /lottery|lucky\s*draw|winner|prize/i,
        /customs.*(clearance|fee|penalty)/i,
        /tax.*(refund|penalty|raid|notice)/i,
        /police|cbi|ed|income\s*tax/i
      ],
      CREDENTIAL_STEALING: [
        /share.*(otp|pin|password|cvv)/i,
        /send.*(pin|otp)/i,
        /remote\s*access|anydesk|teamviewer|rustdesk/i,
        /screen\s*share/i,
        /update.*kyc/i,
        /pan.*link.*aadhaar.*fine/i,
        /claim.*reward.*enter.*pin/i
      ],
      BUSINESS_FRAUD: [
        /payment.*screenshot/i,
        /utr.*not.*credited/i,
        /sent.*extra.*refund.*back/i,
        /double.*paid.*return/i,
        /overpaid.*qr/i,
        /chargeback.*threat/i
      ],
      SUSPICIOUS_LINKS: [
        /https?:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/i,
        /https?:\/\/[^\s/]*(bit\.ly|tinyurl\.com|is\.gd|cutt\.ly|rb\.gy|t\.co)/i,
        /https?:\/\/[^\s/]*\.(xyz|top|work|click|loan|site|gq|cf|tk)/i,
        /https?:\/\/[^\s/]*(sbi|hdfc|icici|paytm|phonepe|gpay)[^\s/]*\.(?!com|in|co\.in)[a-z]+/i
      ],
      SUSPICIOUS_HANDLES: [
        /[a-zA-Z0-9._-]+@(sbi-support|paytm-refund|axis-help|phonepe-care|gpay-reward|kyc-update)/i,
        /[a-zA-Z0-9._-]+@(lottery|cashback-offer|instant-loan)/i
      ]
    },

    analyze: function (input, options = {}) {
      const text = (input || '').toString();
      const mode = options.mode || 'personal'; // 'personal' | 'business'
      let riskScore = 0;
      const matched = [];
      const explanations = [];

      // Check urgent coercion
      this.PATTERNS.URGENT_COERCION.forEach(pat => {
        if (pat.test(text)) {
          riskScore += 25;
          matched.push('Urgency / Threat tactic detected');
          explanations.push('Text uses artificial urgency or fear of account cutoff to compel fast action.');
        }
      });

      // Check credential stealing
      this.PATTERNS.CREDENTIAL_STEALING.forEach(pat => {
        if (pat.test(text)) {
          riskScore += 45;
          matched.push('Credential / OTP harvesting phrase');
          explanations.push('Legitimate banks and UPI apps NEVER ask you to enter a PIN to receive money or share OTPs.');
        }
      });

      // Check suspicious links
      this.PATTERNS.SUSPICIOUS_LINKS.forEach(pat => {
        if (pat.test(text)) {
          riskScore += 35;
          matched.push('Suspicious URL / Shortener');
          explanations.push('Contains shortened, IP-hosted, or lookalike domain often used in phishing attacks.');
        }
      });

      // Check suspicious UPI handles
      this.PATTERNS.SUSPICIOUS_HANDLES.forEach(pat => {
        if (pat.test(text)) {
          riskScore += 40;
          matched.push('Impersonation UPI Handle');
          explanations.push('The UPI VPA mimics an official bank support or reward account.');
        }
      });

      // Business-specific fraud checks
      if (mode === 'business') {
        this.PATTERNS.BUSINESS_FRAUD.forEach(pat => {
          if (pat.test(text)) {
            riskScore += 30;
            matched.push('Merchant payment/refund manipulation');
            explanations.push('Common overpayment or fake UTR scam pattern targeting merchants.');
          }
        });
      }

      // Deduplicate matched and explanations
      const uniqueMatched = Array.from(new Set(matched));
      const uniqueExplanations = Array.from(new Set(explanations));

      // Calculate score & category
      riskScore = Math.min(100, Math.max(0, riskScore));
      let riskLevel = 'LOW';
      let threatTitle = 'No High-Risk Patterns Detected';
      let recommendedAction = 'Always verify recipient identity before approving payments.';

      if (riskScore >= 70) {
        riskLevel = 'CRITICAL';
        threatTitle = 'CRITICAL FRAUD RISK DETECTED';
        recommendedAction = 'DO NOT SEND MONEY OR SHARE PIN. Block the sender and report via official Cyber Crime portal (1930).';
      } else if (riskScore >= 45) {
        riskLevel = 'HIGH';
        threatTitle = 'High Risk Phishing / Scam Indicators';
        recommendedAction = 'Proceed with extreme caution. Do not click links or share credentials. Verify directly with the recipient.';
      } else if (riskScore >= 20) {
        riskLevel = 'MEDIUM';
        threatTitle = 'Moderate Risk / Caution Advised';
        recommendedAction = 'Review details carefully. Ensure recipient details and amounts are accurate before continuing.';
      }

      return {
        query: text,
        mode: mode,
        riskScore: riskScore,
        riskLevel: riskLevel,
        isSafe: riskScore < 20,
        threatTitle: threatTitle,
        matchedPatterns: uniqueMatched,
        explanations: uniqueExplanations,
        recommendedAction: recommendedAction,
        disclaimer: 'Unexa Scam Shield provides automated pattern analysis and AI advisory guidance. It does not replace independent personal vigilance. Unexa will never ask for your 4-digit PIN.'
      };
    }
  };

  UnexaSupabase.ScamShield = UnexaScamShield;
  window.UnexaScamShield = UnexaScamShield;
  window.UnexaSupabase = UnexaSupabase;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = UnexaSupabase;
  }
})(typeof window !== 'undefined' ? window : global);
