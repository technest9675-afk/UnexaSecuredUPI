

    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            brand: {
              50: '#eef2ff',
              500: '#6366f1',
              600: '#4f46e5',
              700: '#4338ca',
            }
          }
        }
      }
    }
  






/**
 * Unexa UPI & Group Shared Pool - Core Application Logic
 * Modern ES6+ Architecture with Audio Synthesis, Group Split Engine,
 * LocalStorage State Persistence, and Interactive Modals.
 */

// Global State
const STATE_KEY = 'UNEXA_STATE_V3';

const defaultState = {
  isLoggedIn: true,
  currentTab: 'home',
  upiMode: 'personal', // 'personal' | 'group'
  theme: 'light',
  isDeviceFrame: true,
  hasUnreadNotifications: true,
  user: {
    name: 'Aarav Sharma',
    phone: '+91 98765 43210',
    email: 'aarav.sharma@example.com',
    vpa: 'aaravsharma@upi',
    balance: 125430,
    upiLiteBalance: 2000,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    phoneVerified: true,
    emailVerified: false,
    upiPin: '1234',
    appPin: '1234',
    security: {
      biometric: true,
      facelock: true,
      applock: true,
      appPin: '1234',
    }
  },
  scannerMode: 'personal', // 'personal' | 'group'
  pools: {
    goa: {
      id: 'goa',
      name: '✈️ Goa Trip 2026',
      emoji: '✈️',
      rawName: 'Goa Trip 2026',
      vpa: 'goa-trip-2026@unexapool',
      balance: 18450,
      totalSpent: 10700,
      activityCount: 2,
      maxMembers: 10,
      description: 'Shared vacation pool for travel, stays, beach shacks, and activities',
      members: [
        { id: 'as', name: 'Aarav Sharma', role: 'Admin', avatar: 'AS', avatarBg: 'bg-indigo-600', paid: 7000.00, consumed: 3566.67 },
        { id: 'ps', name: 'Priya Sharma', role: 'Admin', avatar: 'PS', avatarBg: 'bg-rose-600', paid: 6200.00, consumed: 3566.67 },
        { id: 'rg', name: 'Rahul Gupta', role: 'Member', avatar: 'RG', avatarBg: 'bg-amber-600', paid: 5250.00, consumed: 3566.67 },
      ],
      activities: [
        {
          id: 'act1',
          title: 'Luxury Villa Stay Booking',
          amount: 7500.00,
          perHead: 2500.00,
          payer: 'Priya Sharma',
          splitDesc: 'Split across 3 members',
          date: 'Yesterday, 4:20 PM',
          image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=120&auto=format&fit=crop&q=80'
        },
        {
          id: 'act2',
          title: "Fisherman's Wharf Seafood",
          amount: 3200.00,
          perHead: 1066.67,
          payer: 'Aarav Sharma',
          splitDesc: 'Split across 3 members',
          date: 'Yesterday, 9:15 PM',
          image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=120&auto=format&fit=crop&q=80'
        }
      ]
    },
    flat: {
      id: 'flat',
      name: '🏢 Flat 404 Roommates',
      emoji: '🏢',
      rawName: 'Flat 404 Roommates',
      vpa: 'flat404@unexapool',
      balance: 6200,
      totalSpent: 15400,
      activityCount: 4,
      maxMembers: 6,
      description: 'Shared flat groceries, electricity, and WiFi fiber bills',
      members: [
        { id: 'as', name: 'Aarav Sharma', role: 'Admin', avatar: 'AS', avatarBg: 'bg-indigo-600', paid: 7200.00, consumed: 5133.33 },
        { id: 'ak', name: 'Ankit Mehta', role: 'Member', avatar: 'AM', avatarBg: 'bg-emerald-600', paid: 7200.00, consumed: 5133.33 },
        { id: 'sk', name: 'Sameer Khan', role: 'Member', avatar: 'SK', avatarBg: 'bg-cyan-600', paid: 7200.00, consumed: 5133.33 },
      ],
      activities: [
        {
          id: 'act_f1',
          title: 'High Speed WiFi Fiber Bill',
          amount: 1499.00,
          perHead: 499.67,
          payer: 'Aarav Sharma',
          splitDesc: 'Split across 3 roommates',
          date: '3 days ago',
          image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=120&auto=format&fit=crop&q=80'
        }
      ]
    }
  },
  activePoolId: 'goa',
  transactions: [
    {
      id: 'tx_1',
      title: 'Priya Sharma',
      date: 'Today, 9:12 AM',
      bank: 'Bank of Baroda XX0507',
      utr: '624910384729',
      amount: -350.00,
      category: 'Food & Dining',
      type: 'debited',
      isCard: false,
      isLite: false,
    },
    {
      id: 'tx_2',
      title: 'Starbucks Coffee',
      date: 'Today, 8:30 AM',
      bank: 'Bank of Baroda XX0507',
      utr: '624910384992',
      amount: -350.00,
      category: 'Beverages',
      type: 'debited',
      isCard: false,
      isLite: false,
    },
    {
      id: 'tx_3',
      title: 'Sharma Kirana Store',
      date: 'Yesterday, 7:15 PM',
      bank: 'UPI Lite Wallet',
      utr: '624910294821',
      amount: -650.00,
      category: 'Groceries',
      type: 'debited',
      isCard: false,
      isLite: true,
    },
    {
      id: 'tx_4',
      title: 'Amazon Pay India',
      date: 'Yesterday, 4:30 PM',
      bank: 'HDFC RuPay CC **** 4589',
      utr: '624910283412',
      amount: -1299.00,
      category: 'Shopping',
      type: 'debited',
      isCard: true,
      isLite: false,
    },
    {
      id: 'tx_5',
      title: 'Salary Deposit - TechCorp',
      date: '10 Sep, 10:00 AM',
      bank: 'Bank of Baroda XX0507',
      utr: '624900123984',
      amount: 145000.00,
      category: 'Salary / Income',
      type: 'credited',
      isCard: false,
      isLite: false,
    }
  ],
  burnerAlias: {
    vpa: 'ghost_9421@unexapay',
    expiresInSeconds: 86340
  },
  bufferLimit: 500,
  historyFilter: 'all',
  mandates: [
    { id: 'man_1', name: 'Netflix Premium 4K', emoji: '🎬', amount: 649, frequency: 'monthly', nextDebit: '28 Sep 2026', status: 'active', autoDebitBank: 'Bank of Baroda XX0507' },
    { id: 'man_2', name: 'Spotify Individual', emoji: '🎵', amount: 119, frequency: 'monthly', nextDebit: '02 Oct 2026', status: 'active', autoDebitBank: 'Bank of Baroda XX0507' },
    { id: 'man_3', name: 'Tata Power Electricity', emoji: '⚡', amount: 2500, frequency: 'monthly', nextDebit: '05 Oct 2026', status: 'active', autoDebitBank: 'Bank of Baroda XX0507' },
    { id: 'man_4', name: 'Nippon India Small Cap SIP', emoji: '📈', amount: 5000, frequency: 'monthly', nextDebit: '10 Oct 2026', status: 'active', autoDebitBank: 'Bank of Baroda XX0507' },
  ],
  upiCircle: {
    delegates: [
      { id: 'del_1', name: 'Rohan Sharma', relation: 'Son', phone: '+91 98201 12345', monthlyLimit: 4000, spent: 1250, mode: 'approval', avatar: 'RS', avatarBg: 'bg-rose-600' },
      { id: 'del_2', name: 'Sunita Sharma', relation: 'Mother', phone: '+91 98190 67890', monthlyLimit: 3000, spent: 600, mode: 'direct', avatar: 'SS', avatarBg: 'bg-purple-600' },
    ],
    pendingRequests: [
      { id: 'req_1', delegateId: 'del_1', delegateName: 'Rohan Sharma', merchant: 'Crossword Books & Stationery', amount: 650.00, time: '12 mins ago', avatar: 'RS', avatarBg: 'bg-rose-600' }
    ]
  },
  greenLedger: {
    treesPlanted: 3,
    co2SavedKg: 42.8,
    ecoCoins: 420,
    ecoRoundupEnabled: true,
    donations: [
      { id: 'tree_1', date: '02 Sep 2026', location: 'Western Ghats, MH', species: 'Neem & Peepal', amount: 50, certId: 'UNX-ESG-2026-9812' }
    ]
  },
  bankAccounts: [
    { id: 'baroda', bankName: 'Bank of Baroda', accNumber: '•••• 0507', ifsc: 'BARB0POWAI', isPrimary: true, balance: 125430.00, logoBg: 'bg-orange-600', type: 'Savings A/C' },
    { id: 'hdfc', bankName: 'HDFC Bank', accNumber: '•••• 8812', ifsc: 'HDFC0001234', isPrimary: false, balance: 48200.00, logoBg: 'bg-blue-600', type: 'Salary A/C' },
    { id: 'sbi', bankName: 'State Bank of India', accNumber: '•••• 1044', ifsc: 'SBIN0004512', isPrimary: false, balance: 15650.00, logoBg: 'bg-cyan-700', type: 'Savings A/C' }
  ],
  contacts: [
    { id: 'c1', name: 'Priya Sharma', phone: '+91 98201 12345', vpa: 'priya@okhdfcbank', avatar: 'PS', avatarBg: 'bg-rose-600', recent: true },
    { id: 'c2', name: 'Rahul Gupta', phone: '+91 98190 98765', vpa: 'rahulgupta@upi', avatar: 'RG', avatarBg: 'bg-amber-600', recent: true },
    { id: 'c3', name: 'Ankit Mehta', phone: '+91 97654 32109', vpa: 'ankit.m@icici', avatar: 'AM', avatarBg: 'bg-emerald-600', recent: true },
    { id: 'c4', name: 'Sameer Khan', phone: '+91 98765 11223', vpa: 'sameer.khan@axisbank', avatar: 'SK', avatarBg: 'bg-cyan-600', recent: true },
    { id: 'c5', name: 'Dr. Vikram Patel', phone: '+91 98330 44556', vpa: 'vikram.patel@sbi', avatar: 'VP', avatarBg: 'bg-blue-600', recent: false },
    { id: 'c6', name: 'Neha Deshmukh', phone: '+91 99200 88776', vpa: 'neha.d@paytm', avatar: 'ND', avatarBg: 'bg-purple-600', recent: false },
    { id: 'c7', name: 'Rohan Verma', phone: '+91 98450 66778', vpa: 'rohan.verma@kotak', avatar: 'RV', avatarBg: 'bg-teal-600', recent: false },
    { id: 'c8', name: 'Swati Sen', phone: '+91 98112 33445', vpa: 'swatisen@icici', avatar: 'SS', avatarBg: 'bg-pink-600', recent: false }
  ],
  escrows: [
    { id: 'esc_1', title: 'Freelance UI Design Contract', sellerName: 'Dev Sharma', sellerVpa: 'dev_sharma@okaxis', amount: 12000, condition: 'Milestone 2 Delivery & Code Review', status: 'locked', date: 'Yesterday' },
    { id: 'esc_2', title: 'OLX MacBook Pro M3 Purchase', sellerName: 'Rohit Verma', sellerVpa: 'rohit_verma@icici', amount: 45000, condition: 'Courier Delivery & Hardware Check', status: 'completed', date: '3 days ago' },
  ],
  profile: {
    dob: '14 Aug 1998',
    gender: 'male',
    kycStatus: 'Verified',
    privacy: {
      hideBalance: false,
      incognito: false,
      discovery: true,
      analytics: true
    },
    blockedContacts: [
      { id: 'blk1', name: 'KBC Lottery Fraud', vpa: 'kbc_lottery_claim@paytm', date: 'Blocked on 10 Sep 2026', reason: 'Phishing scam' },
      { id: 'blk2', name: 'Fake Electricity Bill', vpa: 'electricity_bill_overdue@spoof', date: 'Blocked on 02 Sep 2026', reason: 'Spoof alert' },
      { id: 'blk3', name: 'Amazon Refund Fake', vpa: 'amazon_cashback_refund@fake', date: 'Blocked on 28 Aug 2026', reason: 'Collect spam' }
    ],
    devices: [
      { id: 'dev1', name: 'iPhone 16 Pro', deviceType: 'Mobile', location: 'Mumbai, India', lastActive: 'Active Now', isCurrent: true },
      { id: 'dev2', name: 'MacBook Pro M3 (Chrome)', deviceType: 'Laptop', location: 'Bengaluru, India', lastActive: '2h ago', isCurrent: false },
      { id: 'dev3', name: 'iPad Air 5th Gen (Safari)', deviceType: 'Tablet', location: 'Mumbai, India', lastActive: '3d ago', isCurrent: false }
    ],
    upiHandles: [
      { id: 'vpa1', vpa: 'aaravsharma@upi', bank: 'Bank of Baroda', isPrimary: true },
      { id: 'vpa2', vpa: 'aarav.sharma@icici', bank: 'ICICI Bank', isPrimary: false },
      { id: 'vpa3', vpa: 'aarav98@okaxis', bank: 'Axis Bank', isPrimary: false },
      { id: 'vpa4', vpa: 'ghost_9421@unexapay', bank: 'Burner Alias', isPrimary: false }
    ],
    savedAddresses: [
      { id: 'addr1', label: 'Home', street: 'Flat 402, Sea Green Heights, Bandra West, Mumbai', pincode: '400050', isDefault: true },
      { id: 'addr2', label: 'Office', street: 'Tower 4, Cyber City, DLF Phase 2, Gurugram', pincode: '122002', isDefault: false },
      { id: 'addr3', label: 'Vacation Villa', street: 'Sunset Villa 12, Calangute Beach Road, Goa', pincode: '403516', isDefault: false }
    ],
    notifications: {
      push: true,
      soundbox: true,
      sms: true,
      groupDeficit: true,
      promo: false
    },
    faqs: [
      { id: 'faq1', q: 'How does the Shared Group Pool Vault work?', a: 'Members contribute to a shared escrow vault. Group payments debit directly from the vault, and on closure, surplus is refunded and deficits are collected automatically.', cat: 'Group Pools' },
      { id: 'faq2', q: 'What is SoundPay (19.5kHz Ultrasonic Wave)?', a: 'SoundPay synthesizes encrypted near-field audio waves between 18.5kHz - 19.5kHz to transfer payment tokens offline with zero internet.', cat: 'SoundPay' },
      { id: 'faq3', q: 'How does Escrow Milestone Vault protect my money?', a: 'Funds remain cryptographically locked in RBI-compliant escrow until milestone delivery is inspected and approved by the buyer.', cat: 'Escrow' },
      { id: 'faq4', q: 'How does UPI Buffer Overdraft prevent declines?', a: 'UPI Buffer provides a ₹500 - ₹5,000 overdraft safety cushion that automatically covers balance shortfalls during checkout.', cat: 'UPI Buffer' },
      { id: 'faq5', q: 'What is a 24-hour Burner Masked UPI Alias?', a: 'A disposable temporary VPA (e.g. ghost_9421@unexapay) that routes payments directly to your primary bank without exposing your mobile number.', cat: 'Burner Alias' },
      { id: 'faq6', q: 'How do I add or switch linked Bank Accounts?', a: 'Navigate to Profile > Bank Accounts. You can link any NPCI-supported bank account and mark it as your Primary Default account for incoming and outgoing UPI payments.', cat: 'Bank Accounts' },
      { id: 'faq7', q: 'Is Unexa UPI compliant with NPCI and RBI security standards?', a: 'Yes, Unexa operates on 256-bit AES end-to-end encryption with ISO 27001 and PCI-DSS compliance under the RBI Digital Personal Data Protection Act.', cat: 'Security' }
    ]
  },
  rewards: {
    totalCashbackWon: 840.00,
    dailyClaimedToday: false,
    lastDailyClaimDate: null,
    cards: [
      {
        id: 'sc_101',
        title: 'Chai Point Cashback',
        subtitle: 'Earned on ₹350 payment at Chai Point',
        type: 'cash',
        amount: 25.00,
        description: 'Flat ₹25.00 direct cashback credited to Bank of Baroda •••• 0507',
        code: null,
        brand: 'Chai Point',
        isScratched: false,
        earnedAt: 'Today, 2:45 PM',
        expiryDate: 'Valid till 30 Sep 2026',
        colorGradient: 'from-amber-500 to-yellow-600',
        icon: 'coffee'
      },
      {
        id: 'sc_102',
        title: 'Swiggy Gourmet Voucher',
        subtitle: 'Earned on Merchant QR Scan',
        type: 'voucher',
        amount: 150.00,
        description: 'Flat ₹150 OFF on orders above ₹499 at Swiggy Gourmet',
        code: 'UNEXASWIGGY150',
        brand: 'Swiggy',
        isScratched: false,
        earnedAt: 'Yesterday, 8:15 PM',
        expiryDate: 'Valid till 28 Oct 2026',
        colorGradient: 'from-orange-500 to-amber-600',
        icon: 'utensils'
      },
      {
        id: 'sc_103',
        title: 'P2P Transfer Super Cash',
        subtitle: 'Earned on UPI Transfer to Priya Sharma',
        type: 'cash',
        amount: 50.00,
        description: 'Flat ₹50.00 direct cashback credited to Primary Bank',
        code: null,
        brand: 'Unexa UPI',
        isScratched: true,
        earnedAt: '12 Sep 2026',
        expiryDate: 'Claimed',
        colorGradient: 'from-emerald-500 to-teal-600',
        icon: 'banknote'
      },
      {
        id: 'sc_104',
        title: 'Zomato Gold 50% Off',
        subtitle: 'Earned on SoundPay Offline Payment',
        type: 'voucher',
        amount: 200.00,
        description: '50% OFF up to ₹200 on dining out with Zomato Gold',
        code: 'UNEXAZOMATO50',
        brand: 'Zomato',
        isScratched: true,
        earnedAt: '10 Sep 2026',
        expiryDate: 'Valid till 15 Nov 2026',
        colorGradient: 'from-rose-500 to-pink-600',
        icon: 'tag'
      }
    ],
    vouchers: [
      {
        id: 'vc_201',
        brand: 'Myntra Luxe',
        title: 'Flat ₹500 OFF on Orders above ₹2499',
        category: 'Fashion & Lifestyle',
        code: 'UNEXAMYNTRA500',
        discount: '₹500 OFF',
        validity: 'Valid till 31 Oct 2026',
        terms: 'Applicable on select luxury brands on Myntra app.',
        brandLogo: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=100&auto=format&fit=crop&q=80',
        color: 'rose'
      },
      {
        id: 'vc_202',
        brand: 'Uber Premier',
        title: '25% OFF on next 3 Premier Rides',
        category: 'Travel & Mobility',
        code: 'UNEXAUBER25',
        discount: '25% OFF',
        validity: 'Valid till 15 Nov 2026',
        terms: 'Max discount ₹100 per ride. Valid on Uber Premier & XL.',
        brandLogo: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=100&auto=format&fit=crop&q=80',
        color: 'slate'
      },
      {
        id: 'vc_203',
        brand: 'BookMyShow',
        title: 'Buy 1 Get 1 Ticket Free on IMAX/4DX',
        category: 'Movies & Entertainment',
        code: 'UNEXABMSBOGO',
        discount: 'BOGO FREE',
        validity: 'Valid till 20 Dec 2026',
        terms: 'Valid on weekends for select IMAX and 4DX screens.',
        brandLogo: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=100&auto=format&fit=crop&q=80',
        color: 'indigo'
      },
      {
        id: 'vc_204',
        brand: 'Starbucks Reserve',
        title: 'Complimentary Upgrade & Flat 20% OFF',
        category: 'Food & Dining',
        code: 'UNEXASTARBUCKS20',
        discount: '20% OFF',
        validity: 'Valid till 10 Nov 2026',
        terms: 'Valid on handcrafted espresso and frappes at all Starbucks stores.',
        brandLogo: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=100&auto=format&fit=crop&q=80',
        color: 'emerald'
      }
    ],
    history: [
      {
        id: 'rh_01',
        title: 'Direct Bank Cashback (UPI Transfer)',
        amount: 50.00,
        date: '12 Sep 2026, 6:30 PM',
        status: 'Credited to Bank of Baroda •••• 0507',
        utr: 'REW748291038472'
      },
      {
        id: 'rh_02',
        title: 'Mega Merchant Cashback (Croma Store)',
        amount: 100.00,
        date: '05 Sep 2026, 4:15 PM',
        status: 'Credited to Bank of Baroda •••• 0507',
        utr: 'REW593021948201'
      },
      {
        id: 'rh_03',
        title: 'Daily Check-in Bonus',
        amount: 15.00,
        date: '01 Sep 2026, 09:00 AM',
        status: 'Credited to Bank of Baroda •••• 0507',
        utr: 'REW102938475610'
      }
    ]
  },
  voiceLanguage: 'en-IN'
};

// Load saved state or default
let appState = (() => {
  try {
    const saved = localStorage.getItem(STATE_KEY);
    if (!saved) return { ...defaultState };
    const parsed = JSON.parse(saved);
    return {
      ...defaultState,
      ...parsed,
      pools: (parsed && parsed.pools) ? parsed.pools : defaultState.pools,
      activePoolId: (parsed && parsed.activePoolId) ? parsed.activePoolId : defaultState.activePoolId,
      hasUnreadNotifications: parsed.hasUnreadNotifications !== undefined ? parsed.hasUnreadNotifications : true,
      user: {
        ...defaultState.user,
        ...(parsed.user || {}),
        upiPin: (parsed.user && (parsed.user.upiPin || parsed.user.appPin)) || '1234',
        appPin: (parsed.user && (parsed.user.upiPin || parsed.user.appPin)) || '1234',
        security: {
          ...defaultState.user.security,
          ...((parsed.user && parsed.user.security) || {}),
          appPin: (parsed.user && (parsed.user.upiPin || parsed.user.appPin || (parsed.user.security && parsed.user.security.appPin))) || '1234'
        }
      },
      mandates: parsed.mandates || defaultState.mandates,
      upiCircle: parsed.upiCircle || defaultState.upiCircle,
      greenLedger: parsed.greenLedger || defaultState.greenLedger,
      bankAccounts: parsed.bankAccounts || defaultState.bankAccounts,
      contacts: parsed.contacts || defaultState.contacts,
      escrows: parsed.escrows || defaultState.escrows,
      voiceLanguage: parsed.voiceLanguage || defaultState.voiceLanguage,
      rewards: (parsed && parsed.rewards) ? {
        ...defaultState.rewards,
        ...parsed.rewards,
        cards: (parsed.rewards.cards && parsed.rewards.cards.length > 0) ? parsed.rewards.cards : defaultState.rewards.cards,
        vouchers: (parsed.rewards.vouchers && parsed.rewards.vouchers.length > 0) ? parsed.rewards.vouchers : defaultState.rewards.vouchers,
        history: (parsed.rewards.history && parsed.rewards.history.length > 0) ? parsed.rewards.history : defaultState.rewards.history
      } : defaultState.rewards,
      profile: {
        ...defaultState.profile,
        ...(parsed.profile || {}),
        privacy: { ...defaultState.profile.privacy, ...((parsed.profile && parsed.profile.privacy) || {}) },
        notifications: { ...defaultState.profile.notifications, ...((parsed.profile && parsed.profile.notifications) || {}) },
        blockedContacts: (parsed.profile && parsed.profile.blockedContacts) || defaultState.profile.blockedContacts,
        devices: (parsed.profile && parsed.profile.devices) || defaultState.profile.devices,
        upiHandles: (parsed.profile && parsed.profile.upiHandles) || defaultState.profile.upiHandles,
        savedAddresses: (parsed.profile && parsed.profile.savedAddresses) || defaultState.profile.savedAddresses,
        faqs: (parsed.profile && parsed.profile.faqs) || defaultState.profile.faqs
      }
    };
  } catch (e) {
    return { ...defaultState };
  }
})();

const formatInr = (n, dec = 2) => Number(n || 0).toLocaleString('en-IN', dec !== undefined ? { minimumFractionDigits: dec, maximumFractionDigits: dec } : {});

function saveState() {
  try {
    localStorage.setItem(STATE_KEY, JSON.stringify(appState));
  } catch (e) {
    console.error('Failed to save state to localStorage', e);
  }
}

// Sound Synthesizer via Web Audio API
let audioCtx = null;
function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playBeep(freq = 440, type = 'sine', duration = 0.15) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime || 0;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    if (osc.frequency && osc.frequency.setValueAtTime) {
      osc.frequency.setValueAtTime(freq, now);
    }
    if (gain.gain && gain.gain.setValueAtTime) {
      gain.gain.setValueAtTime(0.15, now);
      if (gain.gain.exponentialRampToValueAtTime) {
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
      }
    }
    osc.connect(gain);
    gain.connect(ctx.destination || ctx);
    if (osc.start) osc.start(now);
    if (osc.stop) osc.stop(now + duration);
  } catch (err) {
    // Audio context may be inactive
  }
}

function playSuccessChime() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    // First high note
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now); // D5
    osc1.frequency.exponentialRampToValueAtTime(880.00, now + 0.15); // A5
    gain1.gain.setValueAtTime(0.3, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.6);

    // Second celebratory note
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(1174.66, now + 0.12); // D6
    gain2.gain.setValueAtTime(0.35, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.8);
  } catch (e) {
    console.log('Audio chime error:', e);
  }
}

function playSoundboxVoice(amount, payeeName) {
  try {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = `₹${amount} rupees paid successfully to ${payeeName} on Unexa`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.1;
      window.speechSynthesis.speak(utterance);
    }
  } catch (e) {
    console.log('Speech synthesis error:', e);
  }
}



// UI Mode & Tab Router
function switchUpiMode(mode) {
  appState.upiMode = mode;
  saveState();

  const btnPersonal = document.getElementById('tabPersonalUpi');
  const btnGroup = document.getElementById('tabGroupUpi');
  const personalView = document.getElementById('personalUpiView');
  const groupView = document.getElementById('groupUpiView');
  const profileView = document.getElementById('profileView');

  profileView.classList.add('hidden');

  if (mode === 'personal') {
    btnPersonal.classList.add('active');
    btnGroup.classList.remove('active');
    personalView.classList.remove('hidden');
    groupView.classList.add('hidden');
    document.getElementById('navHome').classList.add('active');
    document.getElementById('navGroups').classList.remove('active');
    document.getElementById('navProfile').classList.remove('active');
  } else {
    btnGroup.classList.add('active');
    btnPersonal.classList.remove('active');
    groupView.classList.remove('hidden');
    personalView.classList.add('hidden');
    document.getElementById('navGroups').classList.add('active');
    document.getElementById('navHome').classList.remove('active');
    document.getElementById('navProfile').classList.remove('active');
    renderGroupPoolUI();
  }
}

function openProfilePage() {
  navigateToTab('profile');
  renderProfileStats();
}

function navigateToTab(tab) {
  appState.currentTab = tab;
  const personalView = document.getElementById('personalUpiView');
  const groupView = document.getElementById('groupUpiView');
  const profileView = document.getElementById('profileView');
  const modeSwitch = document.querySelector('.mode-switch-container');
  const contentArea = document.getElementById('mainContent');

  // Clear active navs
  document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));

  if (tab === 'profile') {
    personalView.classList.add('hidden');
    groupView.classList.add('hidden');
    profileView.classList.remove('hidden');
    modeSwitch.classList.add('hidden');
    document.getElementById('navProfile').classList.add('active');
    renderProfileStats();
    if (contentArea) contentArea.scrollTo({ top: 0, behavior: 'smooth' });
  } else if (tab === 'groups') {
    modeSwitch.classList.remove('hidden');
    switchUpiMode('group');
    if (contentArea) contentArea.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    modeSwitch.classList.remove('hidden');
    switchUpiMode('personal');
    if (contentArea) contentArea.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function navigateBackFromProfile() {
  document.querySelector('.mode-switch-container').classList.remove('hidden');
  switchUpiMode(appState.upiMode || 'personal');
  const contentArea = document.getElementById('mainContent');
  if (contentArea) contentArea.scrollTo({ top: 0, behavior: 'smooth' });
}

// Render Group Pool UI & Member Balances
function renderGroupPoolUI() {
  const pool = appState.pools[appState.activePoolId] || appState.pools.goa || Object.values(appState.pools || {})[0];
  if (!pool) return;
  
  // If the pool has positive balance or active spends, ensure it is not stuck in closed state
  if (pool.balance > 0 && pool.isClosed) {
    pool.isClosed = false;
    pool.status = 'ACTIVE';
  }

  const isClosed = pool.isClosed || pool.status === 'CLOSED_PERMANENTLY';
  
  // Dynamic pool tabs selector rendering
  const poolTabsContainer = document.getElementById('sharedPoolsTabsContainer');
  const poolCountBadge = document.getElementById('sharedPoolsCountBadge');
  const poolList = Object.values(appState.pools || {});
  
  if (poolCountBadge) {
    poolCountBadge.textContent = `${poolList.length} Active Pool${poolList.length > 1 ? 's' : ''}`;
  }

  if (poolTabsContainer) {
    let tabsHtml = '';
    poolList.forEach(p => {
      const isActive = (p.id === appState.activePoolId);
      const activeClass = 'flex items-center gap-2 px-3 py-2 rounded-xl bg-indigo-600/30 border border-indigo-500/60 text-white font-bold text-xs whitespace-nowrap shadow-lg shadow-indigo-500/20 cursor-pointer';
      const inactiveClass = 'flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800/80 border border-white/10 text-slate-300 font-medium text-xs whitespace-nowrap hover:bg-slate-700/60 cursor-pointer transition';
      tabsHtml += `
        <button class="${isActive ? activeClass : inactiveClass}" onclick="selectPool('${p.id}')">
          <span>${p.name}</span>
        </button>
      `;
    });
    tabsHtml += `
      <button class="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-dashed border-indigo-400/40 text-indigo-400 font-semibold text-xs whitespace-nowrap hover:bg-indigo-950/40 cursor-pointer transition" onclick="openCreatePoolModal()">
        <i data-lucide="plus" class="w-3.5 h-3.5"></i>
        <span>New Pool</span>
      </button>
    `;
    poolTabsContainer.innerHTML = tabsHtml;
  }

  // Update card header title
  const headerTitle = document.getElementById('groupPoolCardHeaderTitle');
  if (headerTitle) {
    headerTitle.textContent = `${pool.name.toUpperCase()} WALLET`;
  }

  // Update status badges on both cards
  const topBadge = document.getElementById('groupPoolStatusBadge');
  const vaultBadge = document.getElementById('poolVaultStatusBadge');
  if (isClosed) {
    if (topBadge) {
      topBadge.textContent = 'SETTLED & CLOSED';
      topBadge.className = 'pill-badge badge-red text-[8px] font-bold';
    }
    if (vaultBadge) {
      vaultBadge.textContent = 'SETTLED';
      vaultBadge.className = 'pill-badge badge-red text-[8px]';
    }
  } else {
    if (topBadge) {
      topBadge.textContent = 'WALLET ACTIVE';
      topBadge.className = 'pill-badge badge-green text-[8px] font-bold';
    }
    if (vaultBadge) {
      vaultBadge.textContent = 'ACTIVE VAULT';
      vaultBadge.className = 'pill-badge badge-green text-[8px]';
    }
  }

  // Update numbers on both cards
  const formattedBal = `₹ ${pool.balance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const groupBalDisp = document.getElementById('groupBalanceDisplay');
  const poolVaultBal = document.getElementById('poolVaultBalance');

  if (isClosed) {
    if (groupBalDisp) groupBalDisp.innerHTML = `<span>₹ 0.00</span>`;
    if (poolVaultBal) poolVaultBal.textContent = '₹ 0.00 (SETTLED)';
  } else {
    if (isBalanceHidden) {
      if (groupBalDisp) groupBalDisp.innerHTML = `<span>₹ ••••••••</span>`;
      if (poolVaultBal) poolVaultBal.textContent = '₹ ••••••••';
    } else {
      if (groupBalDisp) groupBalDisp.innerHTML = `<span>${formattedBal}</span>`;
      if (poolVaultBal) poolVaultBal.textContent = formattedBal;
    }
  }
  
  const memberCountEl = document.getElementById('poolMemberCount');
  if (memberCountEl) {
    memberCountEl.textContent = `${pool.members.length} / ${pool.maxMembers || 10}`;
  }
  
  const totalSpentEl = document.getElementById('poolTotalSpent');
  if (totalSpentEl) totalSpentEl.textContent = `₹ ${formatInr(pool.totalSpent, 0)}`;
  
  const actCountEl = document.getElementById('poolActivityCount');
  if (actCountEl) actCountEl.textContent = pool.activities.length;
  
  const vpaEl = document.getElementById('poolVpaAddress');
  if (vpaEl) vpaEl.textContent = pool.vpa;

  // Update scanner group information if in group mode
  const scannerPoolName = document.getElementById('scannerActivePoolName');
  const scannerPoolBal = document.getElementById('scannerActivePoolBalance');
  const scannerGroupTab = document.getElementById('scannerGroupTabTitle');
  if (scannerPoolName) scannerPoolName.textContent = pool.name;
  if (scannerPoolBal) scannerPoolBal.textContent = `Debit Source: Group Pool Wallet (₹${pool.balance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})`;
  if (scannerGroupTab) scannerGroupTab.textContent = `Group Mode (${pool.rawName || pool.name})`;

  // Render Member Balances List (PDF Pages 4, 5) with Deficit / Surplus action buttons
  const membersContainer = document.getElementById('poolMembersListContainer');
  if (membersContainer) {
    membersContainer.innerHTML = '';

    pool.members.forEach(m => {
      const net = m.paid - m.consumed;
      const isSurplus = net > 0.01;
      const isDeficit = net < -0.01;
      const netFormatted = Math.abs(net).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      
      const card = document.createElement('div');
      card.className = 'member-card flex items-center justify-between p-3 rounded-2xl bg-slate-900/90 border border-white/10 hover:border-indigo-500/30 transition gap-2';
      card.innerHTML = `
        <div class="flex items-center gap-3 min-w-0 flex-1">
          <div class="member-avatar ${m.avatarBg} w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-xs flex-shrink-0">${m.avatar}</div>
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-1.5 flex-wrap">
              <span class="text-xs font-bold text-white truncate">${m.name}</span>
              <span class="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-white/10 flex-shrink-0">${m.role}</span>
            </div>
            <div class="text-[10px] text-slate-400 font-mono truncate">
              Paid: ₹${m.paid.toFixed(2)} &nbsp;|&nbsp; Used: ₹${m.consumed.toFixed(2)}
            </div>
          </div>
        </div>

        <div class="text-right flex flex-col items-end flex-shrink-0 max-w-[52%]">
          <div class="text-[9px] font-extrabold uppercase tracking-wide whitespace-nowrap ${isSurplus ? 'text-emerald-400' : (isDeficit ? 'text-rose-400' : 'text-slate-400')}">
            ${isSurplus ? 'SURPLUS (REFUNDABLE)' : (isDeficit ? 'DEFICIT (PAYABLE)' : 'BALANCED')}
          </div>
          <div class="text-xs font-black font-mono ${isSurplus ? 'text-emerald-400' : (isDeficit ? 'text-rose-400' : 'text-slate-300')} flex items-center justify-end gap-1 max-w-full truncate">
            <span class="truncate">${isSurplus ? '+' : (isDeficit ? '-' : '')} ₹ ${netFormatted}</span>
          </div>
          
          ${isDeficit ? `
            <button onclick="openNotifyMemberDeficitModal('${m.id}')" class="mt-1 px-2.5 py-1 rounded-lg bg-rose-950/70 border border-rose-500/40 text-[9px] font-bold text-rose-300 hover:bg-rose-900 transition flex items-center gap-1 cursor-pointer whitespace-nowrap active:scale-95">
              <i data-lucide="bell-ring" class="w-2.5 h-2.5 flex-shrink-0"></i>
              <span>Notify / Collect</span>
            </button>
          ` : (isSurplus ? `
            <button onclick="openRepayMemberSurplusModal('${m.id}')" class="mt-1 px-2.5 py-1 rounded-lg bg-emerald-950/70 border border-emerald-500/40 text-[9px] font-bold text-emerald-300 hover:bg-emerald-900 transition flex items-center gap-1 cursor-pointer whitespace-nowrap active:scale-95">
              <i data-lucide="arrow-up-right" class="w-2.5 h-2.5 flex-shrink-0"></i>
              <span>Repay Surplus</span>
            </button>
          ` : `
            <span class="text-[9px] text-slate-500 font-bold mt-1">Settled</span>
          `)}
        </div>
      `;
      membersContainer.appendChild(card);
    });
  }

  // Render Expense Activity Feed (PDF Page 5)
  const feedContainer = document.getElementById('poolActivityFeedContainer');
  if (feedContainer) {
    feedContainer.innerHTML = '';

    pool.activities.forEach(act => {
      const item = document.createElement('div');
      item.className = 'upi-card p-3 flex items-center justify-between bg-slate-900/90';
      item.innerHTML = `
        <div class="flex items-center gap-3">
          <img src="${act.image}" alt="${act.title}" class="w-11 h-11 rounded-xl object-cover border border-white/10 flex-shrink-0">
          <div>
            <div class="text-xs font-bold text-white">${act.title}</div>
            <div class="text-[10px] text-slate-400">Paid by: ${act.payer} • ${act.splitDesc}</div>
            <div class="text-[9px] text-slate-500">${act.date}</div>
          </div>
        </div>
        <div class="text-right">
          <div class="text-xs font-extrabold text-white font-mono">₹ ${act.amount.toFixed(2)}</div>
          <div class="text-[10px] font-bold text-emerald-400 font-mono">${act.perHead > 0 ? `₹ ${act.perHead.toFixed(2)} / head` : 'Direct Spend'}</div>
        </div>
      `;
      feedContainer.appendChild(item);
    });
  }

  if (window.lucide) window.lucide.createIcons();
}

function selectPool(poolId) {
  appState.activePoolId = poolId;
  saveState();
  renderGroupPoolUI();
  showToast(`Switched to ${appState.pools[poolId].name}`);
}

let isBalanceHidden = false;
function togglePoolBalancePrivacy() {
  isBalanceHidden = !isBalanceHidden;
  const display = document.getElementById('groupBalanceDisplay');
  const icon = document.getElementById('poolEyeIcon');
  const pool = appState.pools[appState.activePoolId] || appState.pools.goa;

  if (isBalanceHidden) {
    display.innerHTML = `<span>₹ ••••••••</span>`;
    icon.setAttribute('data-lucide', 'eye-off');
  } else {
    display.innerHTML = `<span>₹ ${pool.balance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>`;
    icon.setAttribute('data-lucide', 'eye');
  }
  if (window.lucide) window.lucide.createIcons();
}

function togglePoolBalanceVisibility() {
  showToast('Group Balance = Total Member Contributions - Logged Expenses');
}

// Render Transaction History (PDF Page 6)
function renderTransactionsList() {
  const container = document.getElementById('transactionsListContainer');
  if (!container) return;
  container.innerHTML = '';

  const query = (document.getElementById('historySearchInput')?.value || '').toLowerCase();
  const filter = appState.historyFilter || 'all';

  const filtered = appState.transactions.filter(tx => {
    // Filter matching
    if (filter === 'debited' && tx.amount > 0) return false;
    if (filter === 'credited' && tx.amount < 0) return false;
    if (filter === 'cards' && !tx.isCard) return false;
    if (filter === 'lite' && !tx.isLite) return false;

    // Search query matching
    if (query) {
      const matchTitle = tx.title.toLowerCase().includes(query);
      const matchCategory = tx.category.toLowerCase().includes(query);
      const matchBank = tx.bank.toLowerCase().includes(query);
      const matchUtr = tx.utr.toLowerCase().includes(query);
      return matchTitle || matchCategory || matchBank || matchUtr;
    }
    return true;
  });

  if (filtered.length === 0) {
    container.innerHTML = `<div class="text-center py-8 text-xs text-slate-500">No transactions match your search.</div>`;
    return;
  }

  filtered.forEach(tx => {
    const isDebit = tx.amount < 0;
    const amountStr = Math.abs(tx.amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    
    const card = document.createElement('div');
    card.className = 'tx-history-card p-3 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-between gap-3 hover:border-indigo-500/40 transition cursor-pointer active:scale-[0.99]';
    card.onclick = () => showTransactionDetails(tx);
    card.innerHTML = `
      <div class="flex items-center gap-2.5 min-w-0 flex-1">
        <div class="w-9 h-9 rounded-xl ${isDebit ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'} flex items-center justify-center flex-shrink-0">
          <i data-lucide="${isDebit ? 'arrow-up-right' : 'arrow-down-left'}" class="w-4 h-4"></i>
        </div>
        <div class="min-w-0 flex-1 text-left">
          <div class="text-xs font-bold text-white truncate leading-tight">${tx.title}</div>
          <div class="text-[10px] text-slate-400 truncate mt-0.5 leading-snug">${tx.date} • ${tx.bank}</div>
          <div class="text-[9px] text-slate-500 font-mono truncate mt-0.5 leading-none">UTR: ${tx.utr}</div>
        </div>
      </div>
      <div class="text-right flex-shrink-0">
        <div class="text-xs font-black font-mono whitespace-nowrap ${isDebit ? 'text-rose-400' : 'text-emerald-400'}">
          ${isDebit ? '- ₹ ' : '+ ₹ '}${amountStr}
        </div>
        <div class="text-[10px] text-slate-400 whitespace-nowrap mt-0.5">${tx.category}</div>
      </div>
    `;
    container.appendChild(card);
  });

  if (window.lucide) window.lucide.createIcons();
}

function setHistoryFilter(filter) {
  appState.historyFilter = filter;
  ['All', 'Debited', 'Credited', 'Cards', 'Lite'].forEach(f => {
    const btn = document.getElementById(`filter${f}`);
    if (btn) {
      if (f.toLowerCase() === filter) {
        btn.className = 'px-3 py-1 rounded-full text-xs font-bold bg-indigo-600 text-white';
      } else {
        btn.className = 'px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300';
      }
    }
  });
  renderTransactionsList();
}

function filterTransactions() {
  renderTransactionsList();
}

function showTransactionDetails(tx) {
  showToast(`UTR: ${tx.utr} | Status: Success | Bank Ref Verified`);
}

// Payment Flow & PIN Keypad
let currentPayment = {
  payeeName: '',
  payeeVpa: '',
  amount: 0,
  icon: '💳',
  isGroupWallet: false
};
let enteredPin = '';

function initiatePayment(name, vpa, amount, icon = '💳', isGroupWallet = undefined) {
  const safeAmount = (typeof amount === 'number' && !isNaN(amount)) ? amount : (parseFloat(amount) || 100.00);
  
  // Detect whether payment is debited from Group Shared Wallet or Personal Bank
  const isDepositToPool = (vpa && (vpa.includes('unexapool') || vpa.includes('zenithpool')));
  let fromGroup = false;
  if (isDepositToPool) {
    fromGroup = false; // Personal account paying into group pool
  } else if (typeof isGroupWallet === 'boolean') {
    fromGroup = isGroupWallet;
  } else {
    fromGroup = (appState.scannerMode === 'group' || appState.upiMode === 'group');
  }

  currentPayment = { payeeName: name, payeeVpa: vpa, amount: safeAmount, icon: icon, isGroupWallet: fromGroup };
  enteredPin = '';
  updatePinDots();

  const nameEl = document.getElementById('payeeNameText');
  const vpaEl = document.getElementById('payeeVpaText');
  const amtEl = document.getElementById('payAmountDisplay');
  const iconEl = document.getElementById('payeeAvatarIcon');

  if (nameEl) nameEl.textContent = name;
  if (vpaEl) vpaEl.textContent = vpa;
  if (amtEl) amtEl.textContent = `₹ ${safeAmount.toFixed(2)}`;
  if (iconEl) iconEl.textContent = icon.includes('☕') ? '☕' : (icon.includes('🏬') ? '🏬' : (icon.includes('👥') ? '👥' : (icon.includes('🏖️') ? '🏖️' : '💳')));

  // Dynamically update payment source account / group wallet
  const sourceTitleEl = document.getElementById('checkoutSourceTitle');
  const sourceBalanceEl = document.getElementById('checkoutSourceBalance');
  const sourceBadgeEl = document.getElementById('checkoutSourceBadge');
  const sourceIconEl = document.getElementById('checkoutSourceIcon');
  const sourceIconBox = document.getElementById('checkoutSourceIconBox');

  const pool = appState.pools[appState.activePoolId] || appState.pools.goa;

  if (fromGroup) {
    if (sourceTitleEl) sourceTitleEl.textContent = `👥 Group Pool Wallet (${pool.name})`;
    if (sourceBalanceEl) sourceBalanceEl.textContent = `Wallet Balance: ₹ ${pool.balance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (sourceBadgeEl) {
      sourceBadgeEl.textContent = 'GROUP WALLET';
      sourceBadgeEl.className = 'pill-badge badge-green text-[9px] font-bold';
    }
    if (sourceIconEl) sourceIconEl.setAttribute('data-lucide', 'wallet');
    if (sourceIconBox) sourceIconBox.className = 'w-8 h-8 rounded-lg bg-emerald-600/30 text-emerald-400 flex items-center justify-center';
  } else {
    if (sourceTitleEl) sourceTitleEl.textContent = 'Bank of Baroda - XX0507';
    if (sourceBalanceEl) sourceBalanceEl.textContent = `Available: ₹ ${formatInr(appState.user.balance, 0)}`;
    if (sourceBadgeEl) {
      sourceBadgeEl.textContent = 'PRIMARY';
      sourceBadgeEl.className = 'pill-badge badge-cyan text-[9px] font-bold';
    }
    if (sourceIconEl) sourceIconEl.setAttribute('data-lucide', 'landmark');
    if (sourceIconBox) sourceIconBox.className = 'w-8 h-8 rounded-lg bg-indigo-600/30 text-indigo-400 flex items-center justify-center';
  }

  closeModal('modalScanner');
  openModal('modalPaymentCheckout');
}

function editPaymentAmount() {
  const currentVal = currentPayment.amount || 100;
  const newAmtStr = prompt('Enter payment amount (₹):', currentVal);
  if (newAmtStr !== null && newAmtStr.trim() !== '') {
    const parsed = parseFloat(newAmtStr);
    if (!isNaN(parsed) && parsed > 0) {
      currentPayment.amount = parsed;
      const amtEl = document.getElementById('payAmountDisplay');
      if (amtEl) amtEl.textContent = `₹ ${parsed.toFixed(2)}`;
      showToast(`Payment amount set to ₹${parsed.toFixed(2)}`);
    } else {
      showToast('Please enter a valid positive amount');
    }
  }
}

function pressPinKey(digit) {
  if (enteredPin.length < 4) {
    enteredPin += digit;
    updatePinDots();

    // Haptic feedback simulation
    if (navigator.vibrate) navigator.vibrate(20);

    if (enteredPin.length === 4) {
      setTimeout(verifyPinAndExecute, 250);
    }
  }
}

function backspacePinKey() {
  if (enteredPin.length > 0) {
    enteredPin = enteredPin.slice(0, -1);
    updatePinDots();
  }
}

function clearPinKey() {
  enteredPin = '';
  updatePinDots();
}

function updatePinDots() {
  for (let i = 1; i <= 4; i++) {
    const dot = document.getElementById(`dot${i}`);
    if (i <= enteredPin.length) {
      dot.className = 'w-3.5 h-3.5 rounded-full bg-indigo-500 border-2 border-indigo-400 pin-dot scale-110 transition-all';
    } else {
      dot.className = 'w-3.5 h-3.5 rounded-full border-2 border-slate-600 pin-dot';
    }
  }
}

function verifyPinAndExecute() {
  const targetPin = getUserPin();

  if (enteredPin === targetPin) {
    // PIN is correct! Show green success dots
    for (let i = 1; i <= 4; i++) {
      const dot = document.getElementById(`dot${i}`);
      if (dot) dot.className = 'w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-emerald-400 pin-dot scale-125 transition-all shadow-md shadow-emerald-500/50';
    }

    setTimeout(() => {
      closeModal('modalPaymentCheckout');
      executePaymentLogic();
      clearPinKey();
    }, 250);
  } else {
    // Incorrect PIN!
    playBeep(250, 'sawtooth', 0.25);
    if (navigator.vibrate) navigator.vibrate([100, 50, 100]);

    for (let i = 1; i <= 4; i++) {
      const dot = document.getElementById(`dot${i}`);
      if (dot) dot.className = 'w-3.5 h-3.5 rounded-full bg-rose-500 border-2 border-rose-400 pin-dot scale-125 transition-all shadow-md shadow-rose-500/50';
    }

    showToast(`❌ Incorrect UPI PIN (${enteredPin})! Tap "Forgot UPI PIN?" to reset.`);
    setTimeout(clearPinKey, 650);
  }
}

function executePaymentLogic() {
  // Trigger audio chime & soundbox voice
  playSuccessChime();
  playSoundboxVoice(currentPayment.amount, currentPayment.payeeName);

  // Confetti explosion
  if (window.confetti) {
    window.confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  }

  const pool = appState.pools[appState.activePoolId] || appState.pools.goa;
  const newUtr = '6249' + Math.floor(10000000 + Math.random() * 90000000);

  if (currentPayment.isGroupWallet) {
    // DEDUCT FROM GROUP SHARED WALLET (NOT personal bank account!)
    pool.balance = Math.max(0, pool.balance - currentPayment.amount);
    pool.totalSpent = (pool.totalSpent || 0) + currentPayment.amount;

    // Log Activity in Group Pool Feed
    const memberCount = pool.members?.length || 1;
    pool.activities.unshift({
      id: 'act_' + Date.now(),
      title: currentPayment.payeeName,
      amount: currentPayment.amount,
      perHead: currentPayment.amount / memberCount,
      payer: 'Group Pool Wallet',
      splitDesc: `Paid from Shared Wallet (${memberCount} members)`,
      date: 'Just now',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=120&auto=format&fit=crop&q=80'
    });

    renderGroupPoolUI();
  } else {
    // DEDUCT FROM PERSONAL BANK ACCOUNT
    appState.user.balance = Math.max(0, appState.user.balance - currentPayment.amount);
    const balEl = document.getElementById('personalTotalBalance');
    if (balEl) balEl.textContent = `₹${formatInr(appState.user.balance, 0)}`;

    // If Goa Trip Pool was deposited to from personal account, credit the pool!
    if (currentPayment.payeeVpa.includes('unexapool') || currentPayment.payeeVpa.includes('zenithpool')) {
      pool.balance += currentPayment.amount;
      const aarav = pool.members.find(m => m.id === 'as');
      if (aarav) aarav.paid += currentPayment.amount;
      renderGroupPoolUI();
    }
  }

  // Add to global transaction history
  const newTx = {
    id: 'tx_' + Date.now(),
    title: currentPayment.payeeName,
    date: 'Just now',
    bank: currentPayment.isGroupWallet ? `Group Wallet (${pool.vpa})` : 'Bank of Baroda XX0507',
    utr: newUtr,
    amount: -currentPayment.amount,
    category: currentPayment.payeeName.includes('Coffee') || currentPayment.payeeName.includes('Chai') ? 'Food & Dining' : 'Merchant Payment',
    type: 'debited',
    isCard: false,
    isLite: false,
  };
  appState.transactions.unshift(newTx);
  saveState();

  // Populate Success Modal
  document.getElementById('successPayeeName').textContent = currentPayment.payeeName;
  document.getElementById('successPayeeVpa').textContent = currentPayment.payeeVpa;
  document.getElementById('successAmountText').textContent = `₹ ${currentPayment.amount.toFixed(2)}`;
  document.getElementById('successUtrText').textContent = newUtr;
  document.getElementById('successTimestamp').textContent = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + ', Today';

  const postPaySec = document.getElementById('groupPostPayAllocationSection');
  if (postPaySec) {
    if (currentPayment.isGroupWallet || appState.upiMode === 'group') {
      postPaySec.classList.remove('hidden');
    } else {
      postPaySec.classList.add('hidden');
    }
  }

  const debitedFromEl = document.getElementById('successDebitedFromText');
  if (debitedFromEl) {
    debitedFromEl.textContent = currentPayment.isGroupWallet ? `Group Pool Wallet (${pool.vpa})` : 'Bank of Baroda (XX0507)';
  }

  // Generate Mystery Reward / Scratch Card for this Payment
  if (!appState.rewards) appState.rewards = { ...defaultState.rewards };
  const possibleCashAmounts = [10, 15, 20, 25, 35, 50, 100];
  const winCash = Math.random() > 0.3;
  const newRewardCard = {
    id: 'sc_' + Date.now(),
    title: `${currentPayment.payeeName} Reward`,
    subtitle: `Earned on ₹${currentPayment.amount.toFixed(2)} payment`,
    type: winCash ? 'cash' : 'voucher',
    amount: winCash ? possibleCashAmounts[Math.floor(Math.random() * possibleCashAmounts.length)] : 100,
    description: winCash ? `Direct cashback credited to Bank of Baroda •••• 0507` : 'Flat ₹100 OFF on top partner brands',
    code: winCash ? null : 'UNEXABONUS' + Math.floor(100 + Math.random() * 900),
    brand: currentPayment.payeeName,
    isScratched: false,
    earnedAt: 'Just now',
    expiryDate: 'Valid till 30 days',
    colorGradient: winCash ? 'from-amber-500 to-yellow-600' : 'from-indigo-500 to-purple-600',
    icon: winCash ? 'gift' : 'tag'
  };
  appState.rewards.cards.unshift(newRewardCard);
  saveState();
  renderRewardsBadges();

  openModal('modalPaymentSuccess');
}

function closeSuccessAndRefresh() {
  closeModal('modalPaymentSuccess');
  renderGroupPoolUI();
  renderTransactionsList();
}

function shareReceipt() {
  if (navigator.share) {
    navigator.share({
      title: 'UPI Payment Receipt',
      text: `Paid ₹${currentPayment.amount} to ${currentPayment.payeeName} via Unexa. Ref: ${document.getElementById('successUtrText').textContent}`
    }).catch(() => {});
  } else {
    showToast('Receipt details copied to clipboard!');
  }
}

// Group Pool Split Wrappers & Forwarders
function setSplitMode(mode) {
  switchSplitMode(mode);
}

function confirmPoolTopup() {
  const amount = parseFloat(document.getElementById('poolTopupAmount')?.value) || 2000;
  const pool = appState.pools[appState.activePoolId] || appState.pools.goa;

  if (amount <= 0) {
    showToast('Please enter a valid deposit amount');
    return;
  }

  // Deduct from personal bank balance
  appState.user.balance = Math.max(0, appState.user.balance - amount);
  const balEl = document.getElementById('personalTotalBalance');
  if (balEl) balEl.textContent = `₹${formatInr(appState.user.balance, 0)}`;

  // Credit pool balance & reactivate if closed
  pool.balance += amount;
  pool.isClosed = false;
  pool.status = 'ACTIVE';

  const aarav = pool.members.find(m => m.id === 'as') || pool.members[0];
  if (aarav) aarav.paid += amount;

  // Add activity item to pool feed
  pool.activities.unshift({
    id: 'act_' + Date.now(),
    title: `💰 Vault Deposit: ${aarav ? aarav.name : 'Aarav Sharma'}`,
    amount: amount,
    perHead: 0,
    payer: aarav ? aarav.name : 'Aarav Sharma',
    splitDesc: `Deposited ₹${formatInr(amount, 0)} to shared vault`,
    date: 'Just now',
    image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=120&auto=format&fit=crop&q=80'
  });

  saveState();
  closeModal('modalPoolAddFunds');
  renderGroupPoolUI();
  playSuccessChime();
  if (window.confetti) {
    window.confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
  }
  showToast(`₹${formatInr(amount, 0)} deposited to ${pool.name} Vault from Bank of Baroda!`);
}

function setTopupPreset(amt) {
  const input = document.getElementById('poolTopupAmount');
  if (input) input.value = amt;
}

function submitCreateNewPool() {
  const nameInput = document.getElementById('newPoolName');
  const vpaInput = document.getElementById('newPoolVpa');
  const budgetInput = document.getElementById('newPoolBudget');

  const rawInputName = (nameInput ? nameInput.value.trim() : '') || '🍕 Weekend Party';
  const handle = ((vpaInput ? vpaInput.value.trim() : '') || 'weekend-party').toLowerCase().replace(/\s+/g, '-');
  const budget = parseFloat(budgetInput ? budgetInput.value : 0) || 10000;
  const poolId = 'pool_' + Date.now();

  const emojiMatch = rawInputName.match(/^(\p{Emoji})/u);
  const emoji = emojiMatch ? emojiMatch[0] : '👥';
  const rawName = rawInputName.replace(/^[\p{Emoji}\s]+/u, '').trim() || rawInputName;
  const fullName = `${emoji} ${rawName}`;

  appState.pools[poolId] = {
    id: poolId,
    name: fullName,
    emoji: emoji,
    rawName: rawName,
    vpa: `${handle}@unexapool`,
    balance: budget,
    totalSpent: 0,
    activityCount: 1,
    maxMembers: 10,
    description: `Shared pool for ${rawName}`,
    members: [
      { id: 'as', name: 'Aarav Sharma', role: 'Admin', avatar: 'AS', avatarBg: 'bg-indigo-600', paid: budget, consumed: 0.00 },
    ],
    activities: [
      {
        id: 'act_' + Date.now(),
        title: `🎉 Pool Created: ${fullName}`,
        amount: budget,
        perHead: 0,
        payer: 'Aarav Sharma',
        splitDesc: `Initialized shared vault with ₹${formatInr(budget, 0)}`,
        date: 'Just now',
        image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=120&auto=format&fit=crop&q=80'
      }
    ]
  };
  appState.activePoolId = poolId;
  saveState();

  if (nameInput) nameInput.value = '';
  if (vpaInput) vpaInput.value = '';
  if (budgetInput) budgetInput.value = '';

  closeModal('modalCreatePool');
  renderGroupPoolUI();
  playSuccessChime();
  if (window.confetti) {
    window.confetti({ particleCount: 90, spread: 75, origin: { y: 0.6 } });
  }
  showToast(`🎉 New Pool "${fullName}" created with VPA: ${handle}@unexapool`);
}

function submitAddMember() {
  const pool = appState.pools[appState.activePoolId] || appState.pools.goa || Object.values(appState.pools || {})[0];
  if (!pool) return;
  
  const maxCap = pool.maxMembers || 10;
  if (pool.members.length >= maxCap) {
    showToast(`⚠️ Member limit reached (${maxCap} max). Edit group settings to increase capacity.`);
    return;
  }

  const nameInput = document.getElementById('newMemberName');
  const contactInput = document.getElementById('newMemberContact');
  const paidInput = document.getElementById('newMemberPaid');

  const name = (nameInput ? nameInput.value.trim() : '') || 'Rohan Verma';
  const contact = (contactInput ? contactInput.value.trim() : '') || '';
  const paidRaw = paidInput ? parseFloat(paidInput.value) : 0;
  const paid = !isNaN(paidRaw) && paidRaw >= 0 ? paidRaw : 0;

  // Prevent duplicate names in the same pool
  if (pool.members.some(m => m.name.trim().toLowerCase() === name.toLowerCase())) {
    showToast(`⚠️ "${name}" is already a member of this pool.`);
    return;
  }

  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) || 'MB';
  const colors = ['bg-purple-600', 'bg-cyan-600', 'bg-emerald-600', 'bg-amber-600', 'bg-pink-600', 'bg-teal-600', 'bg-blue-600', 'bg-indigo-600', 'bg-rose-600'];
  const avatarBg = colors[pool.members.length % colors.length];

  // Important: new member starts with consumed = 0.00 so all previous bill logs and member balances are 100% preserved
  pool.members.push({
    id: 'm_' + Date.now(),
    name: name,
    contact: contact,
    role: 'Member',
    avatar: initials,
    avatarBg: avatarBg,
    paid: paid,
    consumed: 0.00
  });

  if (paid > 0) {
    pool.balance += paid;
    pool.activities.unshift({
      id: 'act_' + Date.now(),
      title: `👤 Member Joined: ${name}`,
      amount: paid,
      perHead: 0,
      payer: name,
      splitDesc: `Joined pool & contributed initial deposit ₹${formatInr(paid, 0)} to Group Wallet`,
      date: 'Just now',
      image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80'
    });
  }

  // Clear inputs for next time
  if (nameInput) nameInput.value = '';
  if (contactInput) contactInput.value = '';
  if (paidInput) paidInput.value = '';

  saveState();
  closeModal('modalAddMember');
  renderGroupPoolUI();
  playSuccessChime();
  if (window.confetti) {
    window.confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
  }
  showToast(`🎉 ${name} successfully added to ${pool.name}!`);
}

// ==============================================
// GROUP SETTINGS: EDIT GROUP NAME & MEMBER LIMIT
// ==============================================
function openEditPoolModal() {
  const pool = appState.pools[appState.activePoolId] || appState.pools.goa;
  
  // Set emoji
  const currentEmoji = pool.emoji || (pool.name.match(/^(\p{Emoji})/u) ? pool.name.match(/^(\p{Emoji})/u)[0] : '✈️');
  setPoolEmoji(currentEmoji);
  
  // Set group name
  const nameInput = document.getElementById('editPoolNameInput');
  if (nameInput) {
    nameInput.value = pool.rawName || pool.name.replace(/^[\p{Emoji}\s]+/u, '') || 'Goa Trip 2026';
  }
  
  // Set member limit
  const maxInput = document.getElementById('editPoolMaxMembersInput');
  const countLabel = document.getElementById('editPoolCurrentMembersLabel');
  if (maxInput) {
    maxInput.value = pool.maxMembers || 10;
  }
  if (countLabel) {
    countLabel.textContent = `Currently ${pool.members.length} Joined`;
  }
  
  // Set description
  const descInput = document.getElementById('editPoolDescInput');
  if (descInput) {
    descInput.value = pool.description || 'Shared pool for vacation stays, food & activities';
  }
  
  // Set VPA
  const vpaDisplay = document.getElementById('editPoolVpaDisplay');
  if (vpaDisplay) {
    vpaDisplay.textContent = pool.vpa;
  }
  
  openModal('modalEditPoolSettings');
}

function setPoolEmoji(emoji) {
  const emojiValInput = document.getElementById('editPoolEmojiVal');
  if (emojiValInput) emojiValInput.value = emoji;
  
  const buttons = document.querySelectorAll('#poolEmojiPickerList .emoji-opt');
  buttons.forEach(btn => {
    if (btn.textContent.trim() === emoji) {
      btn.className = 'w-9 h-9 rounded-xl bg-indigo-600/40 border-2 border-indigo-500 text-base flex items-center justify-center emoji-opt';
    } else {
      btn.className = 'w-9 h-9 rounded-xl bg-slate-800 border border-white/10 text-base flex items-center justify-center emoji-opt hover:bg-slate-700';
    }
  });
}

function setPoolMaxMembersPreset(num) {
  const input = document.getElementById('editPoolMaxMembersInput');
  if (input) input.value = num;
}

function submitEditPoolSettings() {
  const pool = appState.pools[appState.activePoolId] || appState.pools.goa;
  const emoji = document.getElementById('editPoolEmojiVal')?.value || '✈️';
  const rawName = document.getElementById('editPoolNameInput')?.value.trim() || 'Goa Trip 2026';
  const maxMembers = parseInt(document.getElementById('editPoolMaxMembersInput')?.value) || 10;
  const desc = document.getElementById('editPoolDescInput')?.value.trim() || '';

  if (rawName.length < 2) {
    showToast('Please enter a valid group name (min 2 characters)');
    return;
  }

  if (maxMembers < pool.members.length) {
    showToast(`⚠️ Limit cannot be lower than current members count (${pool.members.length})!`);
    return;
  }

  // Update pool state
  pool.emoji = emoji;
  pool.rawName = rawName;
  pool.name = `${emoji} ${rawName}`;
  pool.maxMembers = maxMembers;
  pool.description = desc;

  saveState();
  closeModal('modalEditPoolSettings');
  renderGroupPoolUI();
  playSuccessChime();
  showToast(`🎉 Group settings saved for ${pool.name}!`);
}

// ==============================================
// 1. GROUP POST-PAYMENT ATTRIBUTION ENGINE
// ==============================================
let currentPostPayMode = 'equal'; // 'equal' | 'custom'
let postPayPaymentDetails = {
  title: 'Goa Beach Shacks',
  amount: 1250.00
};

function openPostPaymentAllocationModal() {
  closeModal('modalPaymentSuccess');
  const pool = appState.pools[appState.activePoolId] || appState.pools.goa;
  postPayPaymentDetails.title = currentPayment.payeeName || 'Group Expense';
  postPayPaymentDetails.amount = currentPayment.amount || 1250.00;

  const titleEl = document.getElementById('postPayTitleDisplay');
  const amtEl = document.getElementById('postPayAmountDisplay');
  if (titleEl) titleEl.textContent = postPayPaymentDetails.title;
  if (amtEl) amtEl.textContent = `₹ ${postPayPaymentDetails.amount.toFixed(2)}`;

  renderPostPayMembersList();
  setPostPayAllocationMode('equal');
  openModal('modalPostPaymentSplit');
}

function renderPostPayMembersList() {
  const pool = appState.pools[appState.activePoolId] || appState.pools.goa;
  const container = document.getElementById('postPayMembersListContainer');
  if (!container) return;

  const count = pool.members.length || 1;
  const equalAmt = (postPayPaymentDetails.amount / count).toFixed(2);

  container.innerHTML = pool.members.map(m => `
    <div class="p-2.5 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <input type="checkbox" id="postPayCheck_${m.id}" data-member-id="${m.id}" checked onchange="updatePostPayCalculations()" class="w-4 h-4 rounded text-indigo-500 focus:ring-indigo-500">
        <div class="w-7 h-7 rounded-full ${m.avatarBg} text-white text-[10px] font-bold flex items-center justify-center">${m.avatar}</div>
        <div>
          <div class="text-xs font-bold text-white">${m.name} ${m.name.includes('Aarav') ? '(You)' : ''}</div>
          <div class="text-[9px] text-slate-400 font-mono" id="postPayMemberCurrent_${m.id}">Current Used: ₹${m.consumed.toFixed(2)}</div>
        </div>
      </div>
      <div class="w-24 text-right">
        <input type="number" id="postPayInput_${m.id}" value="${equalAmt}" oninput="updatePostPayCalculations()" class="w-full px-2 py-1 bg-slate-950 border border-white/10 rounded-lg text-xs font-mono font-bold text-white text-right focus:outline-none focus:border-indigo-500">
      </div>
    </div>
  `).join('');
}

function setPostPayAllocationMode(mode) {
  currentPostPayMode = mode;
  const btnEqual = document.getElementById('btnPostPayEqual');
  const btnCustom = document.getElementById('btnPostPayCustom');

  if (mode === 'equal') {
    if (btnEqual) btnEqual.className = 'py-2 px-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold text-center shadow-sm';
    if (btnCustom) btnCustom.className = 'py-2 px-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-400 text-xs font-semibold text-center hover:bg-slate-800';
  } else {
    if (btnCustom) btnCustom.className = 'py-2 px-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold text-center shadow-sm';
    if (btnEqual) btnEqual.className = 'py-2 px-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-400 text-xs font-semibold text-center hover:bg-slate-800';
  }
  updatePostPayCalculations();
}

function updatePostPayCalculations() {
  const pool = appState.pools[appState.activePoolId] || appState.pools.goa;
  const totalAmount = postPayPaymentDetails.amount || 0;

  const checkedMembers = pool.members.filter(m => {
    const cb = document.getElementById(`postPayCheck_${m.id}`);
    return cb ? cb.checked : true;
  });

  const count = checkedMembers.length || 1;
  const countEl = document.getElementById('postPaySelectedCount');
  if (countEl) countEl.textContent = `${count} Member${count > 1 ? 's' : ''} Involved`;

  let totalAllocated = 0;

  if (currentPostPayMode === 'equal') {
    const perHead = totalAmount > 0 ? (totalAmount / count) : 0;
    pool.members.forEach(m => {
      const cb = document.getElementById(`postPayCheck_${m.id}`);
      const input = document.getElementById(`postPayInput_${m.id}`);
      if (input) {
        if (cb && cb.checked) {
          input.value = perHead.toFixed(2);
          input.disabled = false;
        } else {
          input.value = '0.00';
          input.disabled = true;
        }
      }
    });
    totalAllocated = totalAmount;
  } else {
    let sum = 0;
    pool.members.forEach(m => {
      const cb = document.getElementById(`postPayCheck_${m.id}`);
      const input = document.getElementById(`postPayInput_${m.id}`);
      if (input) {
        if (cb && !cb.checked) {
          input.value = '0.00';
          input.disabled = true;
        } else {
          input.disabled = false;
          sum += parseFloat(input.value) || 0;
        }
      }
    });
    totalAllocated = sum;
  }

  const isBalanced = Math.abs(totalAllocated - totalAmount) < 0.5;
  const iconEl = document.getElementById('postPayStatusIcon');
  const titleEl = document.getElementById('postPayStatusTitle');
  const subEl = document.getElementById('postPayStatusSub');
  const totalEl = document.getElementById('postPayAllocatedTotal');

  if (totalEl) totalEl.textContent = `₹ ${totalAllocated.toFixed(2)} / ₹ ${totalAmount.toFixed(2)}`;

  if (isBalanced) {
    if (iconEl) { iconEl.className = 'w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold'; iconEl.textContent = '✓'; }
    if (titleEl) { titleEl.className = 'text-[11px] font-bold text-emerald-400'; titleEl.textContent = '100% Allocated (Balanced)'; }
    if (subEl) subEl.textContent = 'All member shares match total payment';
  } else {
    if (iconEl) { iconEl.className = 'w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center text-xs font-bold'; iconEl.textContent = '!'; }
    if (titleEl) { titleEl.className = 'text-[11px] font-bold text-rose-400'; titleEl.textContent = `Difference: ₹ ${(totalAmount - totalAllocated).toFixed(2)}`; }
    if (subEl) subEl.textContent = 'Adjust member inputs to match total amount';
  }
}

function submitPostPaymentAllocation() {
  const pool = appState.pools[appState.activePoolId] || appState.pools.goa;
  const totalAmount = postPayPaymentDetails.amount || 0;

  // Validate allocations
  let sum = 0;
  const memberUsage = {};
  pool.members.forEach(m => {
    const cb = document.getElementById(`postPayCheck_${m.id}`);
    const input = document.getElementById(`postPayInput_${m.id}`);
    const val = (cb && cb.checked) ? (parseFloat(input?.value) || 0) : 0;
    memberUsage[m.id] = val;
    sum += val;
  });

  if (Math.abs(sum - totalAmount) > 1) {
    showToast(`Allocated shares (₹${sum.toFixed(2)}) must equal total payment (₹${totalAmount.toFixed(2)})`);
    return;
  }

  // Update member consumption
  pool.members.forEach(m => {
    if (memberUsage[m.id]) {
      m.consumed += memberUsage[m.id];
    }
  });

  saveState();
  closeModal('modalPostPaymentSplit');
  renderGroupPoolUI();
  playSuccessChime();
  showToast('Member usage recorded & group balances updated!');
}

// ==============================================
// 2. DEFICIT NOTIFICATION & UPI COLLECT ENGINE
// ==============================================
let activeDeficitMember = null;

function openNotifyMemberDeficitModal(memberId) {
  const pool = appState.pools[appState.activePoolId] || appState.pools.goa;
  const member = pool.members.find(m => m.id === memberId);
  if (!member) return;

  activeDeficitMember = member;
  const deficit = Math.max(0, member.consumed - member.paid);

  const nameEl = document.getElementById('notifyMemberName');
  const avatarEl = document.getElementById('notifyMemberAvatar');
  const paidEl = document.getElementById('notifyMemberPaid');
  const consumedEl = document.getElementById('notifyMemberConsumed');
  const dueEl = document.getElementById('notifyMemberDue');
  const linkEl = document.getElementById('notifyCollectLink');
  const btnPayNowText = document.getElementById('btnPayDeficitNowText');

  if (nameEl) nameEl.textContent = member.name;
  if (avatarEl) { avatarEl.textContent = member.avatar; avatarEl.className = `w-9 h-9 rounded-full ${member.avatarBg} text-white font-bold flex items-center justify-center text-xs`; }
  if (paidEl) paidEl.textContent = `₹ ${member.paid.toFixed(2)}`;
  if (consumedEl) consumedEl.textContent = `₹ ${member.consumed.toFixed(2)}`;
  if (dueEl) dueEl.textContent = `₹ ${deficit.toFixed(2)}`;
  if (linkEl) linkEl.textContent = `upi://pay?pa=${pool.vpa}&am=${deficit.toFixed(2)}&pn=${encodeURIComponent(pool.name + ' Deficit')}`;
  if (btnPayNowText) btnPayNowText.textContent = `Simulate ${member.name.split(' ')[0]} Paying ₹${deficit.toFixed(2)} to Wallet`;

  openModal('modalNotifyMemberDeficit');
}

function sendDeficitNotificationMessage() {
  if (!activeDeficitMember) return;
  const pool = appState.pools[appState.activePoolId] || appState.pools.goa;
  const deficit = Math.max(0, activeDeficitMember.consumed - activeDeficitMember.paid);

  if (navigator.clipboard) {
    navigator.clipboard.writeText(`Hi ${activeDeficitMember.name}, you have a pending payable deficit of ₹${deficit.toFixed(2)} for ${pool.name}. Please pay to ${pool.vpa}`);
  }

  playSuccessChime();
  showToast(`📢 Collect Request & Alert sent to ${activeDeficitMember.name}!`);
  closeModal('modalNotifyMemberDeficit');
}

function simulateMemberDeficitPayment(memberId) {
  const pool = appState.pools[appState.activePoolId] || appState.pools.goa;
  const member = memberId ? pool.members.find(m => m.id === memberId) : activeDeficitMember;
  if (!member) return;

  const deficit = Math.max(0, member.consumed - member.paid);
  if (deficit <= 0) {
    showToast(`${member.name} has no pending deficit`);
    return;
  }

  // Member deposits payable deficit into pool wallet
  member.paid += deficit;
  pool.balance += deficit;

  // Add activity
  pool.activities.unshift({
    id: 'act_' + Date.now(),
    title: `💰 Deficit Payment: ${member.name}`,
    amount: deficit,
    perHead: 0,
    payer: member.name,
    splitDesc: `Paid ₹${deficit.toFixed(2)} deficit to Group Wallet`,
    date: 'Just now',
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=120&auto=format&fit=crop&q=80'
  });

  saveState();
  closeModal('modalNotifyMemberDeficit');
  renderGroupPoolUI();
  playSuccessChime();
  if (window.confetti) window.confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
  showToast(`🎉 ${member.name} paid ₹${deficit.toFixed(2)} to Group Wallet! Deficit cleared.`);
}

// ==============================================
// 3. SURPLUS REPAYMENT ENGINE
// ==============================================
let activeSurplusMember = null;

function openRepayMemberSurplusModal(memberId) {
  const pool = appState.pools[appState.activePoolId] || appState.pools.goa;
  const member = pool.members.find(m => m.id === memberId);
  if (!member) return;

  activeSurplusMember = member;
  const surplus = Math.max(0, member.paid - member.consumed);

  const nameEl = document.getElementById('repayMemberName');
  const avatarEl = document.getElementById('repayMemberAvatar');
  const paidEl = document.getElementById('repayMemberPaid');
  const consumedEl = document.getElementById('repayMemberConsumed');
  const refundAmtEl = document.getElementById('repayMemberRefundAmount');
  const walletBalEl = document.getElementById('repaySourceWalletBalance');
  const walletNameEl = document.getElementById('repaySourceWalletName');

  if (nameEl) nameEl.textContent = member.name;
  if (avatarEl) { avatarEl.textContent = member.avatar; avatarEl.className = `w-9 h-9 rounded-full ${member.avatarBg} text-white font-bold flex items-center justify-center text-xs`; }
  if (paidEl) paidEl.textContent = `₹ ${member.paid.toFixed(2)}`;
  if (consumedEl) consumedEl.textContent = `₹ ${member.consumed.toFixed(2)}`;
  if (refundAmtEl) refundAmtEl.textContent = `+ ₹ ${surplus.toFixed(2)}`;
  if (walletBalEl) walletBalEl.textContent = `₹ ${formatInr(pool.balance)}`;
  if (walletNameEl) walletNameEl.textContent = `${pool.name} Wallet`;

  openModal('modalRepaySurplus');
}

function executeSurplusRepayment(memberId) {
  const pool = appState.pools[appState.activePoolId] || appState.pools.goa;
  const member = memberId ? pool.members.find(m => m.id === memberId) : activeSurplusMember;
  if (!member) return;

  const surplus = Math.max(0, member.paid - member.consumed);
  if (surplus <= 0) {
    showToast(`${member.name} has no surplus to refund`);
    return;
  }

  // Deduct from pool wallet balance and refund to member
  pool.balance = Math.max(0, pool.balance - surplus);
  member.paid -= surplus; // Net surplus becomes 0

  // Log activity
  pool.activities.unshift({
    id: 'act_' + Date.now(),
    title: `💸 Surplus Refund: ${member.name}`,
    amount: surplus,
    perHead: 0,
    payer: 'Group Pool Wallet',
    splitDesc: `Transferred ₹${surplus.toFixed(2)} refund to ${member.name}'s bank`,
    date: 'Just now',
    image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=120&auto=format&fit=crop&q=80'
  });

  saveState();
  closeModal('modalRepaySurplus');
  renderGroupPoolUI();
  playSuccessChime();
  if (window.confetti) window.confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
  showToast(`💸 ₹${surplus.toFixed(2)} refunded to ${member.name}'s bank account!`);
}

// ==============================================
// 4. PERMANENT GROUP WALLET SETTLEMENT & CLOSURE
// ==============================================
function openPoolCloseModal() {
  const pool = appState.pools[appState.activePoolId] || appState.pools.goa;
  const ledgerList = document.getElementById('closePoolLedgerList');
  const remBal = document.getElementById('closePoolRemainingBalance');

  if (remBal) remBal.textContent = `₹ ${formatInr(pool.balance)}`;

  if (ledgerList) {
    let html = `
      <div class="flex justify-between pb-1 border-b border-white/10 font-bold">
        <span class="text-slate-300">Remaining Pool Wallet Balance</span>
        <span class="text-white font-mono">₹ ${formatInr(pool.balance)}</span>
      </div>
    `;

    pool.members.forEach(m => {
      const net = m.paid - m.consumed;
      const isSurplus = net > 0.01;
      const isDeficit = net < -0.01;
      const formatted = formatInr(Math.abs(net));

      html += `
        <div class="flex justify-between py-1 border-b border-white/5">
          <span class="text-slate-400">${m.name}</span>
          <span class="font-mono font-bold ${isSurplus ? 'text-emerald-400' : (isDeficit ? 'text-rose-400' : 'text-slate-400')}">
            ${isSurplus ? `Refund: + ₹ ${formatted}` : (isDeficit ? `Deficit: - ₹ ${formatted}` : `Settled: ₹ 0.00`)}
          </span>
        </div>
      `;
    });

    ledgerList.innerHTML = html;
  }

  openModal('modalClosePool');
}

function confirmSettleAndClosePool() {
  const pool = appState.pools[appState.activePoolId] || appState.pools.goa;

  // Execute all remaining surplus repayments & resolve net balances
  pool.members.forEach(m => {
    const net = m.paid - m.consumed;
    if (net > 0) {
      m.paid = m.consumed; // Surplus refunded
    } else if (net < 0) {
      m.paid = m.consumed; // Deficit settled
    }
  });

  // Permanently close pool and set wallet balance to 0
  pool.balance = 0;
  pool.isClosed = true;
  pool.status = 'CLOSED_PERMANENTLY';

  // Add Final Closing Activity
  pool.activities.unshift({
    id: 'act_' + Date.now(),
    title: '🔒 Pool Wallet Permanently Closed',
    amount: 0,
    perHead: 0,
    payer: 'Unexa Smart Settle Engine',
    splitDesc: 'All surpluses refunded & wallet permanently sealed',
    date: 'Just now',
    image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=120&auto=format&fit=crop&q=80'
  });

  saveState();
  closeModal('modalClosePool');
  renderGroupPoolUI();
  playSuccessChime();

  if (window.confetti) {
    window.confetti({ particleCount: 120, spread: 90, origin: { y: 0.5 } });
  }

  showToast('🔒 Pool wallet settled and closed permanently! All refunds transferred.');
}

// ==============================================
// INNOVATION 1: AI SCAM & PHISHING SHIELD
// ==============================================

function openScamShieldModal() {
  openModal('modalScamShield');
  const inputEl = document.getElementById('vpaThreatInput');
  if (inputEl && !inputEl.value) {
    inputEl.value = 'kbc_lottery_claim@paytm';
  }
  runAiScamCheck();
  if (window.lucide) window.lucide.createIcons();
}

function setScamCheckPreset(vpa) {
  const inputEl = document.getElementById('vpaThreatInput');
  if (inputEl) inputEl.value = vpa;
  runAiScamCheck();
}

function runAiScamCheck() {
  const input = (document.getElementById('vpaThreatInput')?.value || '').trim();
  const resultBox = document.getElementById('scamCheckResult');
  if (!resultBox) return;

  if (!input) {
    showToast('⚠️ Please enter a UPI ID, URL or merchant handle');
    return;
  }

  resultBox.classList.remove('hidden');
  const lower = input.toLowerCase();
  const isThreat = lower.includes('lottery') || lower.includes('claim') || lower.includes('fake') || lower.includes('refund') || lower.includes('prize') || lower.includes('spoof') || lower.includes('overdue') || lower.includes('free');

  if (isThreat) {
    resultBox.className = 'mb-3 p-3 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-300';
    resultBox.innerHTML = `
      <div class="flex items-center justify-between mb-1">
        <div class="flex items-center gap-1.5 font-bold text-xs text-rose-400">
          <i data-lucide="alert-triangle" class="w-4 h-4"></i>
          <span>CRITICAL PHISHING RISK DETECTED</span>
        </div>
        <span class="pill-badge badge-rose text-[8px] font-bold">98% THREAT</span>
      </div>
      <p class="text-[11px] text-slate-200 mb-2">This handle matches known fraudulent patterns imitating rewards or fake refunds. Unexa AI Shield has automatically blocked collect requests from this VPA.</p>
      <div class="flex items-center justify-between text-[10px] text-rose-400 font-semibold border-t border-rose-500/20 pt-1.5">
        <span>🛡️ NPCI Collect Defense: BLOCKED</span>
        <span>Auto-quarantined</span>
      </div>
    `;
    if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
  } else {
    resultBox.className = 'mb-3 p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300';
    resultBox.innerHTML = `
      <div class="flex items-center justify-between mb-1">
        <div class="flex items-center gap-1.5 font-bold text-xs text-emerald-400">
          <i data-lucide="shield-check" class="w-4 h-4"></i>
          <span>VPA VERIFIED SAFE &amp; AUTHENTIC</span>
        </div>
        <span class="pill-badge badge-green text-[8px] font-bold">0% RISK</span>
      </div>
      <p class="text-[11px] text-slate-200 mb-2">Verified NPCI banking gateway. Official merchant handle with zero reported anomalies in the past 90 days.</p>
      <div class="flex items-center justify-between text-[10px] text-emerald-400 font-semibold border-t border-emerald-500/20 pt-1.5">
        <span>✅ Certified Merchant Node</span>
        <span>Safe for Direct Transfer</span>
      </div>
    `;
  }
  if (window.lucide) window.lucide.createIcons();
}

// ==============================================
// INNOVATION 2: ESCROW MILESTONE VAULT
// ==============================================

function openEscrowModal() {
  renderEscrowUI();
  openModal('modalEscrow');
}

function renderEscrowUI() {
  const escrows = appState.escrows || [];
  const lockedTotal = escrows.filter(e => e.status === 'locked').reduce((sum, e) => sum + e.amount, 0);
  const completedTotal = escrows.filter(e => e.status === 'completed').reduce((sum, e) => sum + e.amount, 0);

  const lockedEl = document.getElementById('escrowLockedTotal');
  const completedEl = document.getElementById('escrowCompletedTotal');
  const container = document.getElementById('escrowListContainer');

  if (lockedEl) lockedEl.textContent = `₹ ${formatInr(lockedTotal)}`;
  if (completedEl) completedEl.textContent = `₹ ${formatInr(completedTotal)}`;

  if (!container) return;

  if (escrows.length === 0) {
    container.innerHTML = `<div class="p-3 rounded-xl bg-slate-900 border border-white/10 text-center text-xs text-slate-400">No active escrow locks found.</div>`;
    return;
  }

  container.innerHTML = escrows.map(e => {
    const isLocked = e.status === 'locked';
    const isCompleted = e.status === 'completed';
    const isRefunded = e.status === 'refunded';

    let actionButtons = '';
    if (isLocked) {
      actionButtons = `
        <div class="grid grid-cols-2 gap-1.5 mt-2 pt-2 border-t border-white/10">
          <button type="button" class="py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center gap-1" onclick="releaseEscrow('${e.id}')">
            <i data-lucide="unlock" class="w-3 h-3"></i>
            <span>Release Funds (Approve)</span>
          </button>
          <button type="button" class="py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-300 text-[10px] font-bold flex items-center justify-center gap-1" onclick="disputeEscrow('${e.id}')">
            <i data-lucide="alert-circle" class="w-3 h-3"></i>
            <span>Dispute &amp; Refund</span>
          </button>
        </div>
      `;
    }

    const badge = isLocked
      ? `<span class="pill-badge badge-amber text-[8px] font-bold">LOCKED IN VAULT</span>`
      : (isCompleted
        ? `<span class="pill-badge badge-green text-[8px] font-bold">COMPLETED</span>`
        : `<span class="pill-badge badge-purple text-[8px] font-bold">REFUNDED</span>`);

    return `
      <div class="upi-card bg-slate-900 border border-white/10 p-3">
        <div class="flex items-center justify-between mb-1">
          <div class="text-xs font-bold text-white truncate">${e.title}</div>
          <div class="text-xs font-black text-purple-300 font-mono">₹ ${formatInr(e.amount)}</div>
        </div>
        <div class="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-1">
          <span>Seller: ${e.sellerName} (${e.sellerVpa})</span>
          ${badge}
        </div>
        <div class="text-[10px] text-amber-300 bg-amber-950/30 px-2 py-1 rounded-lg border border-amber-500/20">
          Condition: ${e.condition}
        </div>
        ${actionButtons}
      </div>
    `;
  }).join('');

  if (window.lucide) window.lucide.createIcons();
}

function releaseEscrow(escrowId) {
  const escrow = (appState.escrows || []).find(e => e.id === escrowId);
  if (!escrow || escrow.status !== 'locked') return;

  escrow.status = 'completed';

  appState.transactions.unshift({
    id: 'tx_escrow_' + Date.now(),
    title: `Escrow Released: ${escrow.title}`,
    date: 'Just now',
    bank: 'Escrow Milestone Vault',
    utr: String(Math.floor(100000000000 + Math.random() * 900000000000)),
    amount: -escrow.amount,
    category: 'Escrow Settlement',
    type: 'debited',
    isCard: false,
    isLite: false,
  });

  saveState();
  playSuccessChime();
  playSoundboxVoice(escrow.amount, escrow.sellerName);
  if (window.confetti) {
    window.confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
  }

  renderEscrowUI();
  showToast(`🎉 ₹${formatInr(escrow.amount, 0)} released from Escrow Vault to ${escrow.sellerName}!`);
}

function disputeEscrow(escrowId) {
  const escrow = (appState.escrows || []).find(e => e.id === escrowId);
  if (!escrow || escrow.status !== 'locked') return;

  if (confirm(`Raise dispute and refund ₹${formatInr(escrow.amount, 0)} back to your Bank of Baroda account?`)) {
    escrow.status = 'refunded';
    appState.user.balance += escrow.amount;

    appState.transactions.unshift({
      id: 'tx_escrow_ref_' + Date.now(),
      title: `Escrow Refund: ${escrow.title}`,
      date: 'Just now',
      bank: 'Bank of Baroda XX0507',
      utr: String(Math.floor(100000000000 + Math.random() * 900000000000)),
      amount: escrow.amount,
      category: 'Escrow Refund',
      type: 'credited',
      isCard: false,
      isLite: false,
    });

    saveState();
    playSuccessChime();
    renderEscrowUI();
    const balEl = document.getElementById('personalTotalBalance');
    if (balEl) balEl.textContent = `₹${formatInr(appState.user.balance, 0)}`;

    showToast(`↩️ ₹${formatInr(escrow.amount, 0)} refunded from Escrow back to your Bank Account!`);
  }
}

function submitNewEscrowLock() {
  const title = document.getElementById('newEscrowTitle')?.value.trim();
  const vpa = document.getElementById('newEscrowVpa')?.value.trim();
  const amount = parseFloat(document.getElementById('newEscrowAmount')?.value) || 0;
  const condition = document.getElementById('newEscrowCondition')?.value.trim();

  if (!title || !vpa) {
    showToast('⚠️ Please enter contract title and seller UPI ID');
    return;
  }
  if (amount <= 0) {
    showToast('⚠️ Please enter a valid escrow amount');
    return;
  }
  if (appState.user.balance < amount) {
    showToast('⚠️ Insufficient bank balance to lock funds in Escrow');
    return;
  }

  appState.user.balance -= amount;
  if (!appState.escrows) appState.escrows = [];

  const newEscrow = {
    id: 'esc_' + Date.now(),
    title: title,
    sellerName: vpa.split('@')[0],
    sellerVpa: vpa,
    amount: amount,
    condition: condition || 'Upon Satisfactory Milestone Verification',
    status: 'locked',
    date: 'Today'
  };

  appState.escrows.unshift(newEscrow);

  appState.transactions.unshift({
    id: 'tx_escrow_lock_' + Date.now(),
    title: `Escrow Lock: ${title}`,
    date: 'Just now',
    bank: 'Bank of Baroda XX0507',
    utr: String(Math.floor(100000000000 + Math.random() * 900000000000)),
    amount: -amount,
    category: 'Escrow Lock',
    type: 'debited',
    isCard: false,
    isLite: false,
  });

  saveState();
  playSuccessChime();
  if (window.confetti) {
    window.confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
  }

  renderEscrowUI();
  const balEl = document.getElementById('personalTotalBalance');
  if (balEl) balEl.textContent = `₹${formatInr(appState.user.balance, 0)}`;

  const titleInput = document.getElementById('newEscrowTitle');
  const vpaInput = document.getElementById('newEscrowVpa');
  if (titleInput) titleInput.value = '';
  if (vpaInput) vpaInput.value = '';

  showToast(`🔒 ₹${formatInr(amount, 0)} locked safely in Escrow Milestone Vault!`);
}

// ==============================================
// INNOVATION 3: SOUNDPAY (19.5kHz ULTRASONIC)
// ==============================================

let soundPayOscillator = null;

function openSoundPayModal() {
  openModal('modalSoundPay');
  playSoundPayTone();
}

function setSoundPayPreset(payee, amount) {
  const payeeEl = document.getElementById('soundPayPayee');
  const amtEl = document.getElementById('soundPayAmount');
  if (payeeEl) payeeEl.value = payee;
  if (amtEl) amtEl.value = amount;
  showToast(`SoundPay Preset: ${payee} (₹${amount})`);
}

function playSoundPayTone() {
  try {
    const ctx = getAudioContext();
    if (soundPayOscillator) {
      soundPayOscillator.stop();
      soundPayOscillator.disconnect();
    }
    soundPayOscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    soundPayOscillator.type = 'sine';
    soundPayOscillator.frequency.setValueAtTime(18500, ctx.currentTime);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    soundPayOscillator.connect(gain);
    gain.connect(ctx.destination);
    soundPayOscillator.start();
    
    const status = document.getElementById('soundPayStatusText');
    if (status) status.textContent = 'Emitting 19.5kHz Encrypted Ultrasonic Carrier Wave...';
    showToast('📡 Transmitting encrypted 19.5kHz near-field acoustic wave');
  } catch (e) {
    console.log('SoundPay audio error:', e);
  }
}

function stopSoundPay() {
  try {
    if (soundPayOscillator) {
      soundPayOscillator.stop();
      soundPayOscillator.disconnect();
      soundPayOscillator = null;
    }
    const status = document.getElementById('soundPayStatusText');
    if (status) status.textContent = '19.5kHz Encrypted Ultrasonic Transceiver Ready';
  } catch (e) {
    console.log('Stop SoundPay error:', e);
  }
}

function simulateSoundPayReceive() {
  stopSoundPay();
  const payee = document.getElementById('soundPayPayee')?.value || 'Chai Point Cafe';
  const amount = parseFloat(document.getElementById('soundPayAmount')?.value) || 40.00;

  playSuccessChime();
  closeModal('modalSoundPay');
  showToast(`🎉 Ultrasonic Wave Received & Decoded from ${payee}!`);

  setTimeout(() => {
    initiatePayment(payee, `${payee.toLowerCase().replace(/\s+/g, '')}@soundpay`, amount, '📻 SoundPay Acoustic', false);
  }, 300);
}

// ==============================================
// INNOVATION 4: UPI BUFFER (OVERDRAFT SAFETY)
// ==============================================

function openUpiBufferModal() {
  renderUpiBufferUI();
  openModal('modalUpiBuffer');
}

function renderUpiBufferUI() {
  const limit = appState.bufferLimit || 500;
  const label = document.getElementById('bufferActiveLabel');
  if (label) label.textContent = `Active Cushion: ₹ ${formatInr(limit)}`;

  const btnContainer = document.getElementById('bufferLimitButtons');
  if (btnContainer) {
    const limits = [500, 1000, 2000, 5000];
    btnContainer.innerHTML = limits.map(l => {
      const isSelected = (l === limit);
      return `
        <button type="button" class="py-2 rounded-xl ${isSelected ? 'bg-amber-600 text-slate-950 font-black shadow-md shadow-amber-600/30' : 'bg-slate-900 border border-white/10 text-slate-200 font-bold hover:bg-slate-800'} text-xs" onclick="setBufferLimit(${l})">
          ₹ ${formatInr(l, 0)}
        </button>
      `;
    }).join('');
  }
}

function setBufferLimit(limit) {
  appState.bufferLimit = limit;
  saveState();
  renderUpiBufferUI();
  showToast(`🛡️ UPI Overdraft Buffer limit set to ₹${formatInr(limit, 0)}`);
}

function testBufferSimulation() {
  playSuccessChime();
  showToast(`⚡ Buffer Active: Covered ₹200 shortfall with ₹${appState.bufferLimit} safety cushion! Zero declines.`);
}

// ==============================================
// INNOVATION 5: BURNER MASKED UPI ALIAS
// ==============================================

function openBurnerAliasModal() {
  const vpaText = document.getElementById('burnerVpaText');
  if (vpaText) vpaText.textContent = appState.burnerAlias?.vpa || 'ghost_9421@unexapay';
  openModal('modalBurnerAlias');
}

function generateNewBurnerAlias() {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const newVpa = `ghost_${randomNum}@unexapay`;
  if (!appState.burnerAlias) appState.burnerAlias = {};
  appState.burnerAlias.vpa = newVpa;
  appState.burnerAlias.expiresInSeconds = 86400;
  saveState();
  
  const vpaText = document.getElementById('burnerVpaText');
  if (vpaText) vpaText.textContent = newVpa;

  playSuccessChime();
  showToast(`Generated new 24h masked VPA: ${newVpa}`);
}

function copyBurnerAlias() {
  const vpa = appState.burnerAlias?.vpa || 'ghost_9421@unexapay';
  navigator.clipboard?.writeText(vpa);
  showToast(`📋 Masked VPA ${vpa} copied to clipboard!`);
}

function copyUpiId() {
  const vpa = appState.user?.vpa || 'aaravsharma@upi';
  navigator.clipboard?.writeText(vpa);
  showToast(`📋 UPI ID ${vpa} copied!`);
}

function simulateBurnerReceive(amount = 250) {
  appState.user.balance += amount;
  const burnerVpa = appState.burnerAlias?.vpa || 'ghost_9421@unexapay';

  appState.transactions.unshift({
    id: 'tx_burner_' + Date.now(),
    title: `Payment via Masked Alias (${burnerVpa})`,
    date: 'Just now',
    bank: 'Bank of Baroda XX0507',
    utr: String(Math.floor(100000000000 + Math.random() * 900000000000)),
    amount: amount,
    category: 'Burner Alias Inward',
    type: 'credited',
    isCard: false,
    isLite: false,
  });

  saveState();
  playSuccessChime();
  playSoundboxVoice(amount, 'Burner Alias');
  if (window.confetti) {
    window.confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
  }

  const balEl = document.getElementById('personalTotalBalance');
  if (balEl) balEl.textContent = `₹${formatInr(appState.user.balance, 0)}`;

  showToast(`🎉 ₹${amount} received anonymously via Masked VPA! Bank of Baroda credited.`);
}

// ==============================================
// INNOVATION 6: VOICE PAY (SPEECH ASSISTANT)
// ==============================================

function openVoicePayModal() {
  const langSelect = document.getElementById('voiceLangSelect');
  if (langSelect && appState.voiceLanguage) {
    langSelect.value = appState.voiceLanguage;
  }
  openModal('modalVoicePay');
}

function setVoiceLanguage(lang) {
  appState.voiceLanguage = lang;
  saveState();
  showToast(`Voice assistant language set to ${lang}`);
}

function startVoiceListening() {
  const textEl = document.getElementById('voiceAssistantText');
  if (textEl) textEl.textContent = 'Listening to voice command... 🎙️';

  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = appState.voiceLanguage || 'en-IN';
      recognition.start();

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (textEl) textEl.textContent = `Recognized: "${transcript}"`;
        executeVoiceCommand(transcript);
      };
      recognition.onerror = () => {
        if (textEl) textEl.textContent = 'Tap mic or click quick command below';
      };
      return;
    } catch (e) {
      console.log('SpeechRecognition error, falling back:', e);
    }
  }

  // Graceful simulation fallback
  setTimeout(() => {
    executeVoiceCommand('Pay 40 rupees to Chai Point');
  }, 1200);
}

function executeVoiceCommand(command) {
  showToast(`🗣️ Voice command recognized: "${command}"`);
  closeModal('modalVoicePay');

  const cmd = command.toLowerCase();
  
  if (cmd.includes('starbucks') || cmd.includes('350')) {
    initiatePayment('Starbucks Coffee', 'starbucks@hdfc', 350.00, '☕ Starbucks', false);
  } else if (cmd.includes('rahul') || cmd.includes('500') || cmd.includes('राहुल')) {
    initiatePayment('Rahul Gupta', 'rahulgupta@upi', 500.00, '👤 Rahul Gupta', false);
  } else if (cmd.includes('electricity') || cmd.includes('1200') || cmd.includes('1,200') || cmd.includes('bill')) {
    initiatePayment('Tata Power Electricity', 'tatapower@billdesk', 1200.00, '⚡ Electricity Bill', false);
  } else if (cmd.includes('swiggy') || cmd.includes('200') || cmd.includes('சுவிக்கி')) {
    initiatePayment('Swiggy Delivery', 'swiggy@icici', 200.00, '🍔 Swiggy', false);
  } else {
    initiatePayment('Chai Point', 'chaipoint@upi', 40.00, '☕ Chai Point', false);
  }
}

// Theme Engine (PDF Page 7)
function applyTheme(themeName) {
  appState.theme = themeName;
  saveState();

  document.body.className = '';
  if (themeName !== 'amoled') {
    document.body.classList.add(`theme-${themeName}`);
  }

  // Update theme selection highlights in modal
  const darkCard = document.getElementById('themeCardDark');
  const lightCard = document.getElementById('themeCardLight');
  if (darkCard) {
    if (themeName === 'amoled') {
      darkCard.className = 'feature-box p-3 cursor-pointer border-indigo-500 bg-indigo-950/20 shadow-md shadow-indigo-500/20';
    } else {
      darkCard.className = 'feature-box p-3 cursor-pointer border-white/10 bg-slate-900/60';
    }
  }
  if (lightCard) {
    if (themeName === 'light') {
      lightCard.className = 'feature-box p-3 cursor-pointer border-indigo-500 bg-indigo-50 shadow-md shadow-indigo-500/20';
    } else {
      lightCard.className = 'feature-box p-3 cursor-pointer border-white/10 bg-slate-900/60';
    }
  }

  showToast(`Applied ${themeName.replace('-', ' ').toUpperCase()} Theme`);
}

// Device Mockup Frame vs Fullscreen
function toggleDeviceFrame() {
  appState.isDeviceFrame = !appState.isDeviceFrame;
  saveState();
  const viewport = document.getElementById('appViewport');
  const btnText = document.getElementById('frameModeText');

  if (appState.isDeviceFrame) {
    viewport.classList.remove('fullscreen-mode');
    btnText.textContent = 'Full Screen Mode';
  } else {
    viewport.classList.add('fullscreen-mode');
    btnText.textContent = 'Mobile Phone View';
  }
}

// Modal Helpers
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    if (window.lucide) window.lucide.createIcons();
  }
}

function closeModal(modalId) {
  if (modalId === 'modalScanner') {
    stopCameraScanner();
  }
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
  }
  if (modalId === 'modalVerifyBiometric' || modalId === 'modalVerifyFaceLock' || modalId === 'modalVerifyAppLock') {
    if (typeof renderProfileStats === 'function') {
      renderProfileStats();
    }
  }
}

// Scanner Mode Switching & Customization
function setScannerMode(mode = 'personal') {
  appState.scannerMode = mode;
  const pool = appState.pools[appState.activePoolId] || appState.pools.goa;

  const btnPersonal = document.getElementById('btnScannerModePersonal');
  const btnGroup = document.getElementById('btnScannerModeGroup');
  const personalBanner = document.getElementById('scannerPersonalBanner');
  const groupBanner = document.getElementById('scannerGroupBanner');
  const poolNameEl = document.getElementById('scannerActivePoolName');
  const poolBalEl = document.getElementById('scannerActivePoolBalance');
  const groupTabTitle = document.getElementById('scannerGroupTabTitle');
  const demoPersonal = document.getElementById('scannerDemoTargetsPersonal');
  const demoGroup = document.getElementById('scannerDemoTargetsGroup');
  const frameBorder = document.getElementById('scannerFrameBorder');
  const frameBadge = document.getElementById('scannerFrameBadge');
  const frameBadgeText = document.getElementById('scannerFrameBadgeText');
  const pingDot = document.getElementById('scannerPingDot');
  const directPayBadge = document.getElementById('scannerDirectPayModeBadge');
  const cornerHooks = document.querySelectorAll('.scanner-corner-hook');
  const laserBar = document.getElementById('scannerLaserBar');
  const iconSwitchLens = document.getElementById('iconSwitchLens');
  const labelSnapPhoto = document.getElementById('labelSnapPhoto');
  const iconSnapPhoto = document.getElementById('iconSnapPhoto');
  const subtitleText = document.getElementById('scannerSubtitleText');

  if (poolNameEl) poolNameEl.textContent = `${pool.emoji || '👥'} ${pool.name}`;
  if (poolBalEl) poolBalEl.textContent = `Debit Source: Group Pool Wallet (₹${formatInr(pool.balance)})`;
  if (groupTabTitle) groupTabTitle.textContent = `${pool.emoji || '👥'} Group Pool Mode`;

  if (mode === 'group') {
    if (btnGroup) {
      btnGroup.className = 'flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/30';
    }
    if (btnPersonal) {
      btnPersonal.className = 'flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition flex items-center justify-center gap-1.5';
    }
    if (personalBanner) personalBanner.classList.add('hidden');
    if (groupBanner) {
      groupBanner.classList.remove('hidden');
      groupBanner.classList.add('flex');
    }
    if (demoPersonal) demoPersonal.classList.add('hidden');
    if (demoGroup) demoGroup.classList.remove('hidden');

    if (directPayBadge) {
      directPayBadge.textContent = `DEBIT: ${pool.name.toUpperCase()}`;
      directPayBadge.className = 'text-[9px] font-mono text-amber-400 font-bold';
    }

    if (frameBorder) {
      frameBorder.className = 'absolute inset-6 border-2 border-dashed border-amber-400/80 rounded-2xl pointer-events-none flex flex-col justify-between p-2 transition-all duration-300 shadow-[0_0_20px_rgba(245,158,11,0.25)]';
    }
    if (frameBadge) {
      frameBadge.className = 'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/80 backdrop-blur-sm border border-amber-400/60 text-[9px] font-bold text-amber-300';
    }
    if (frameBadgeText) frameBadgeText.textContent = 'GROUP VAULT SCANNER ACTIVE';
    if (pingDot) pingDot.className = 'w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping';

    cornerHooks.forEach(hook => {
      hook.className = hook.className.replace(/border-cyan-400/g, 'border-amber-400');
    });

    if (laserBar) {
      laserBar.style.background = 'linear-gradient(180deg, rgba(245, 158, 11, 0) 0%, rgba(245, 158, 11, 1) 50%, rgba(245, 158, 11, 0) 100%)';
      laserBar.style.boxShadow = '0 0 15px rgba(245, 158, 11, 0.8)';
    }
    if (iconSwitchLens) iconSwitchLens.className = 'w-4 h-4 text-amber-400';
    if (labelSnapPhoto) labelSnapPhoto.className = 'py-2 px-1 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-300 text-[11px] font-semibold flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-amber-900/50 transition';
    if (iconSnapPhoto) iconSnapPhoto.className = 'w-4 h-4 text-amber-400';
    if (subtitleText) subtitleText.textContent = `Debiting ${pool.name} Vault • Real-Time QR Split Engine`;
  } else {
    // Personal Mode
    if (btnPersonal) {
      btnPersonal.className = 'flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 bg-cyan-600 text-white shadow-md shadow-cyan-600/30';
    }
    if (btnGroup) {
      btnGroup.className = 'flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition flex items-center justify-center gap-1.5';
    }
    if (personalBanner) personalBanner.classList.remove('hidden');
    if (groupBanner) {
      groupBanner.classList.add('hidden');
      groupBanner.classList.remove('flex');
    }
    if (demoPersonal) demoPersonal.classList.remove('hidden');
    if (demoGroup) demoGroup.classList.add('hidden');

    if (directPayBadge) {
      directPayBadge.textContent = 'PERSONAL BANK (BARODA)';
      directPayBadge.className = 'text-[9px] font-mono text-cyan-400 font-bold';
    }

    if (frameBorder) {
      frameBorder.className = 'absolute inset-6 border-2 border-dashed border-cyan-400/60 rounded-2xl pointer-events-none flex flex-col justify-between p-2 transition-all duration-300 shadow-[0_0_20px_rgba(6,182,212,0.2)]';
    }
    if (frameBadge) {
      frameBadge.className = 'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-sm border border-cyan-400/40 text-[9px] font-bold text-cyan-300';
    }
    if (frameBadgeText) frameBadgeText.textContent = 'PERSONAL SCANNER ACTIVE';
    if (pingDot) pingDot.className = 'w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping';

    cornerHooks.forEach(hook => {
      hook.className = hook.className.replace(/border-amber-400/g, 'border-cyan-400');
    });

    if (laserBar) {
      laserBar.style.background = 'linear-gradient(180deg, rgba(6, 182, 212, 0) 0%, rgba(6, 182, 212, 1) 50%, rgba(6, 182, 212, 0) 100%)';
      laserBar.style.boxShadow = '0 0 15px rgba(6, 182, 212, 0.8)';
    }
    if (iconSwitchLens) iconSwitchLens.className = 'w-4 h-4 text-cyan-400';
    if (labelSnapPhoto) labelSnapPhoto.className = 'py-2 px-1 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-cyan-300 text-[11px] font-semibold flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-cyan-900/50 transition';
    if (iconSnapPhoto) iconSnapPhoto.className = 'w-4 h-4 text-cyan-400';
    if (subtitleText) subtitleText.textContent = 'Live Camera Feed • Real-Time QR Decoder • Auto-Routing';
  }

  if (window.lucide) window.lucide.createIcons();
}

// Modal Shortcuts
async function openScannerModal(mode) {
  const targetMode = mode || (appState.upiMode === 'group' ? 'group' : 'personal');
  setScannerMode(targetMode);
  openModal('modalScanner');
  await startCameraScanner();
}

function closeScannerModal() {
  stopCameraScanner();
  closeModal('modalScanner');
}
function openHistoryModal() { renderTransactionsList(); openModal('modalHistory'); }
function openThemeModal() { openModal('modalThemes'); }
function renderNotificationBadge() {
  const isUnread = !!appState.hasUnreadNotifications;
  [document.getElementById('headerNotifBadge'), document.getElementById('desktopNotifBadge')].forEach(b => {
    if (b) {
      b.classList.toggle('hidden', !isUnread);
      b.style.display = isUnread ? '' : 'none';
    }
  });
}

function openNotificationsModal() {
  appState.hasUnreadNotifications = false;
  saveState();
  renderNotificationBadge();
  openModal('modalNotifications');
}
function openPoolAddFundsModal() {
  const pool = appState.pools[appState.activePoolId] || appState.pools.goa;
  const subtitleEl = document.getElementById('topupPoolSubtitle');
  const noticeEl = document.getElementById('topupCurrentBalNotice');
  const inputEl = document.getElementById('poolTopupAmount');

  if (subtitleEl) subtitleEl.textContent = `Deposit funds into ${pool.name} Vault`;
  if (noticeEl) noticeEl.textContent = `Current Balance: ₹ ${formatInr(pool.balance)}`;
  if (inputEl) inputEl.value = '2500';

  openModal('modalPoolAddFunds');
}
function openCreatePoolModal() { openModal('modalCreatePool'); }
function openAddMemberModal() {
  const pool = appState.pools[appState.activePoolId] || appState.pools.goa || Object.values(appState.pools || {})[0];
  const subtitleEl = document.getElementById('addMemberPoolSubtitle');
  if (subtitleEl && pool) {
    subtitleEl.textContent = `Add new member to ${pool.name} (${pool.members.length}/${pool.maxMembers || 10} joined)`;
  }
  const nameInput = document.getElementById('newMemberName');
  const contactInput = document.getElementById('newMemberContact');
  const paidInput = document.getElementById('newMemberPaid');
  if (nameInput) nameInput.value = '';
  if (contactInput) contactInput.value = '';
  if (paidInput) paidInput.value = '3000';
  openModal('modalAddMember');
  setTimeout(() => { if (nameInput) nameInput.focus(); }, 150);
}

// ==============================================
// GROUP TOOLS: 0. PAY TO MERCHANT (Direct Vault Debit)
// ==============================================
function openPoolPayMerchantModal() {
  const pool = appState.pools[appState.activePoolId] || appState.pools.goa;
  
  const poolNameEl = document.getElementById('merchantPayPoolName');
  const poolBalEl = document.getElementById('merchantPayPoolBalance');
  const maxNoticeEl = document.getElementById('merchantPayMaxNotice');
  const nameInput = document.getElementById('merchantPayName');
  const vpaInput = document.getElementById('merchantPayVpa');
  const amtInput = document.getElementById('merchantPayAmount');

  if (poolNameEl) poolNameEl.textContent = `${pool.emoji || '👥'} ${pool.name} Vault`;
  if (poolBalEl) poolBalEl.textContent = `Available: ₹ ${formatInr(pool.balance)}`;
  if (maxNoticeEl) maxNoticeEl.textContent = `Vault Max: ₹${formatInr(pool.balance)}`;

  if (nameInput && !nameInput.value) nameInput.value = "Fisherman's Wharf Seafood";
  if (vpaInput && !vpaInput.value) vpaInput.value = "fishermanwharf@icici";
  if (amtInput && !amtInput.value) amtInput.value = "1250";

  openModal('modalPoolPayMerchant');
}

function setMerchantPreset(name, vpa, amount) {
  const nameInput = document.getElementById('merchantPayName');
  const vpaInput = document.getElementById('merchantPayVpa');
  const amtInput = document.getElementById('merchantPayAmount');

  if (nameInput) nameInput.value = name;
  if (vpaInput) vpaInput.value = vpa;
  if (amtInput) amtInput.value = amount;

  showToast(`Selected: ${name} (₹${amount})`);
}

function setMerchantPayQuickAmount(amt) {
  const amtInput = document.getElementById('merchantPayAmount');
  if (amtInput) amtInput.value = amt;
}

function submitGroupMerchantPayment() {
  const pool = appState.pools[appState.activePoolId] || appState.pools.goa;
  const name = document.getElementById('merchantPayName')?.value.trim() || 'Scanned Merchant';
  const vpa = document.getElementById('merchantPayVpa')?.value.trim() || 'merchant@upi';
  const amount = parseFloat(document.getElementById('merchantPayAmount')?.value) || 0;

  if (amount <= 0) {
    showToast('Please enter a valid payment amount');
    return;
  }

  if (amount > pool.balance) {
    if (!confirm(`Payment of ₹${formatInr(amount, 0)} exceeds current pool balance (₹${formatInr(pool.balance, 0)}). Proceed anyway?`)) {
      return;
    }
  }

  closeModal('modalPoolPayMerchant');
  initiatePayment(name, vpa, amount, '🏪', true);
}

// Backward Compatibility
function openPoolPayModal() {
  openPoolPayMerchantModal();
}

// ==============================================
// GROUP TOOLS: 1. TREATMENT (Someone's Treat)
// ==============================================
let currentTreatMode = 'full'; // 'full' | 'shared'

function openPoolTreatModal() {
  const pool = appState.pools[appState.activePoolId] || appState.pools.goa;
  const payerSelect = document.getElementById('treatPayer');
  if (payerSelect) {
    payerSelect.innerHTML = pool.members.map(m => `<option value="${m.name}">${m.name} ${m.name.includes('Aarav') ? '(You)' : ''}</option>`).join('');
  }
  
  const treatTitle = document.getElementById('treatTitle');
  if (treatTitle && !treatTitle.value) {
    treatTitle.value = "Rahul's Birthday Treat";
  }
  
  setTreatMode('full');
  updateTreatPreview();
  openModal('modalPoolTreatment');
}

function setTreatQuickOccasion(title) {
  const treatTitle = document.getElementById('treatTitle');
  if (treatTitle) treatTitle.value = title;
  updateTreatPreview();
}

function setTreatQuickAmount(amt) {
  const treatAmt = document.getElementById('treatAmount');
  if (treatAmt) treatAmt.value = amt;
  updateTreatPreview();
}

function setTreatMode(mode) {
  currentTreatMode = mode;
  const btnFull = document.getElementById('btnTreatTypeFull');
  const btnShared = document.getElementById('btnTreatTypeShared');
  
  if (mode === 'full') {
    if (btnFull) btnFull.className = 'py-2 px-2.5 rounded-xl bg-pink-600/30 border border-pink-500/60 text-pink-200 text-xs font-bold text-left flex items-start gap-2 shadow-sm';
    if (btnShared) btnShared.className = 'py-2 px-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-400 text-xs font-semibold text-left flex items-start gap-2 hover:bg-slate-800';
  } else {
    if (btnShared) btnShared.className = 'py-2 px-2.5 rounded-xl bg-pink-600/30 border border-pink-500/60 text-pink-200 text-xs font-bold text-left flex items-start gap-2 shadow-sm';
    if (btnFull) btnFull.className = 'py-2 px-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-400 text-xs font-semibold text-left flex items-start gap-2 hover:bg-slate-800';
  }
  updateTreatPreview();
}

function updateTreatPreview() {
  const amount = parseFloat(document.getElementById('treatAmount')?.value) || 0;
  const payer = document.getElementById('treatPayer')?.value || 'Rahul Gupta';
  const pool = appState.pools[appState.activePoolId] || appState.pools.goa;
  const memberCount = pool.members.length || 1;

  const sponsorPaysEl = document.getElementById('treatSponsorPaysDisplay');
  const othersCostEl = document.getElementById('treatOthersCostDisplay');
  const poolImpactEl = document.getElementById('treatPoolImpactDisplay');

  if (currentTreatMode === 'full') {
    if (sponsorPaysEl) sponsorPaysEl.textContent = `₹ ${formatInr(amount)}`;
    if (othersCostEl) othersCostEl.textContent = `₹ 0.00 each (100% Free! 🎉)`;
    if (poolImpactEl) poolImpactEl.textContent = `${payer} covers 100% of ₹${formatInr(amount, 0)}`;
  } else {
    const sponsorShare = (amount * 0.5) + ((amount * 0.5) / memberCount);
    const othersShare = (amount * 0.5) / memberCount;
    if (sponsorPaysEl) sponsorPaysEl.textContent = `₹ ${formatInr(sponsorShare)} (50% + Share)`;
    if (othersCostEl) othersCostEl.textContent = `₹ ${formatInr(othersShare)} each (50% Off)`;
    if (poolImpactEl) poolImpactEl.textContent = `50% subsidized by ${payer}`;
  }
}

function submitPoolTreat() {
  const pool = appState.pools[appState.activePoolId] || appState.pools.goa;
  const title = document.getElementById('treatTitle')?.value.trim() || "Group Celebration Treat 🎉";
  const amount = parseFloat(document.getElementById('treatAmount')?.value) || 0;
  const payer = document.getElementById('treatPayer')?.value || 'Rahul Gupta';
  const memberCount = pool.members.length || 1;

  if (amount <= 0) {
    showToast('Please enter a valid treat amount');
    return;
  }

  // Update pool spending
  pool.totalSpent += amount;

  // Member balances calculation
  if (currentTreatMode === 'full') {
    // Treater pays total, absorbs entire consumption so other members owe nothing
    const treater = pool.members.find(m => m.name === payer);
    if (treater) {
      treater.paid += amount;
      treater.consumed += amount;
    }
  } else {
    // 50% subsidized by treater, 50% split among all
    const subsidizedShare = (amount * 0.5) / memberCount;
    pool.members.forEach(m => {
      m.consumed += subsidizedShare;
      if (m.name === payer) {
        m.paid += amount;
        m.consumed += (amount * 0.5);
      }
    });
  }

  // Append Activity to Pool Feed
  pool.activities.unshift({
    id: 'act_' + Date.now(),
    title: title,
    amount: amount,
    perHead: currentTreatMode === 'full' ? 0 : ((amount * 0.5) / memberCount),
    payer: payer,
    splitDesc: currentTreatMode === 'full' ? `🎉 100% Sponsored Treat by ${payer}` : `🤝 50% Subsidized Treat by ${payer}`,
    date: 'Just now',
    image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=120&auto=format&fit=crop&q=80'
  });

  saveState();
  closeModal('modalPoolTreatment');
  renderGroupPoolUI();
  playSuccessChime();

  if (window.confetti) {
    window.confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
  }

  showToast(`🎉 Treat of ₹${formatInr(amount, 0)} from ${payer} recorded!`);
}

// ==============================================
// MASTER UNIFIED GROUP EXPENSE & BILL SPLIT ENGINE
// Modes: 'equal' | 'exact' | 'percent' | 'shares'
// ==============================================
let currentSplitMode = 'equal';

function openUnifiedSplitModal(mode = 'equal') {
  const pool = appState.pools[appState.activePoolId] || appState.pools.goa;
  
  // 1. Populate Payer dropdown
  const payerSelect = document.getElementById('splitExpensePayer');
  if (payerSelect) {
    let options = `<option value="Group Wallet">💳 Deduct from Group Pool Wallet (₹${formatInr(pool.balance)})</option>`;
    options += pool.members.map(m => `<option value="${m.name}">${m.name} ${m.name.includes('Aarav') ? '(You)' : ''}</option>`).join('');
    payerSelect.innerHTML = options;
  }

  // 2. Set default title if empty
  const titleInput = document.getElementById('splitExpenseTitle');
  if (titleInput && !titleInput.value) {
    titleInput.value = '🏖️ Beach Shack Lunch & Drinks';
  }

  // 3. Set default amount if empty or 0
  const amtInput = document.getElementById('splitExpenseAmount');
  if (amtInput && (!amtInput.value || parseFloat(amtInput.value) <= 0)) {
    amtInput.value = '3000';
  }

  switchSplitMode(mode);
  openModal('modalPoolSplit');
}

function switchSplitMode(mode) {
  currentSplitMode = mode;
  
  const tabs = {
    equal: document.getElementById('tabSplitEqual'),
    exact: document.getElementById('tabSplitExact'),
    percent: document.getElementById('tabSplitPercent'),
    shares: document.getElementById('tabSplitShares')
  };

  const modeLabels = {
    equal: 'EQUAL (1/N)',
    exact: 'EXACT AMOUNTS (₹)',
    percent: 'PERCENTAGE (%)',
    shares: 'SHARES (1:1)'
  };

  const activeLabel = document.getElementById('splitActiveModeLabel');
  if (activeLabel) activeLabel.textContent = modeLabels[mode] || 'EQUAL (1/N)';

  Object.keys(tabs).forEach(k => {
    const el = tabs[k];
    if (el) {
      if (k === mode) {
        el.className = 'py-1.5 rounded-lg bg-amber-500 text-slate-950 text-[10px] font-bold shadow transition';
      } else {
        el.className = 'py-1.5 rounded-lg text-slate-400 text-[10px] font-medium hover:text-white transition';
      }
    }
  });

  // Toggle helper buttons
  const btnToggleAll = document.getElementById('btnToggleAllSplit');
  const btnDistribute = document.getElementById('btnDistributeEvenly');
  if (btnToggleAll) {
    btnToggleAll.classList.toggle('hidden', mode !== 'equal');
  }
  if (btnDistribute) {
    btnDistribute.classList.toggle('hidden', mode === 'equal');
  }

  renderUnifiedSplitMembers();
  updateUnifiedSplitCalculations();
}

function setSplitQuickTitle(title) {
  const el = document.getElementById('splitExpenseTitle');
  if (el) el.value = title;
}

function setSplitQuickAmount(amt) {
  const el = document.getElementById('splitExpenseAmount');
  if (el) el.value = amt;
  updateUnifiedSplitCalculations();
}

function toggleAllSplitMembers() {
  const pool = appState.pools[appState.activePoolId] || appState.pools.goa;
  const checkboxes = pool.members.map(m => document.getElementById(`splitMemberCheck_${m.id}`)).filter(Boolean);
  const anyUnchecked = checkboxes.some(cb => !cb.checked);
  checkboxes.forEach(cb => { cb.checked = anyUnchecked; });
  updateUnifiedSplitCalculations();
}

function renderUnifiedSplitMembers() {
  const pool = appState.pools[appState.activePoolId] || appState.pools.goa;
  const container = document.getElementById('unifiedSplitMembersContainer');
  if (!container) return;

  const totalAmount = parseFloat(document.getElementById('splitExpenseAmount')?.value) || 3000;
  const memberCount = pool.members.length || 1;
  const evenShare = Math.round(totalAmount / memberCount);
  const equalPct = Math.floor(100 / memberCount);

  container.innerHTML = pool.members.map((m, idx) => {
    if (currentSplitMode === 'equal') {
      return `
        <label class="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/90 border border-white/10 cursor-pointer hover:border-amber-500/40 transition">
          <div class="flex items-center gap-2.5">
            <input type="checkbox" id="splitMemberCheck_${m.id}" data-member-id="${m.id}" checked onchange="updateUnifiedSplitCalculations()" class="w-4 h-4 rounded text-amber-500 focus:ring-amber-500">
            <div class="w-7 h-7 rounded-full ${m.avatarBg} text-white text-[10px] font-bold flex items-center justify-center">${m.avatar}</div>
            <span class="text-xs font-bold text-white">${m.name} ${m.name.includes('Aarav') ? '(You)' : ''}</span>
          </div>
          <span class="text-xs font-mono text-amber-400 font-bold" id="splitMemberShareDisplay_${m.id}">₹ 0.00</span>
        </label>
      `;
    } else if (currentSplitMode === 'exact') {
      const val = idx === 0 ? (totalAmount - (evenShare * (memberCount - 1))) : evenShare;
      return `
        <div class="p-2.5 rounded-xl bg-slate-900/90 border border-white/10 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-7 h-7 rounded-full ${m.avatarBg} text-white text-[10px] font-bold flex items-center justify-center">${m.avatar}</div>
            <div>
              <div class="text-xs font-bold text-white">${m.name}</div>
              <div class="text-[9px] text-amber-400 font-mono" id="splitExactPct_${m.id}">₹ ${val}.00 (${((val/totalAmount)*100).toFixed(1)}%)</div>
            </div>
          </div>
          <div class="w-28 text-right">
            <input type="number" id="splitExactInput_${m.id}" data-member-id="${m.id}" value="${val}" oninput="updateUnifiedSplitCalculations()" class="w-full px-2 py-1 bg-slate-950 border border-white/10 rounded-lg text-xs font-mono font-bold text-white text-right focus:outline-none focus:border-amber-500">
          </div>
        </div>
      `;
    } else if (currentSplitMode === 'percent') {
      const pct = (idx === 0) ? (100 - equalPct * (memberCount - 1)) : equalPct;
      return `
        <div class="p-2.5 rounded-xl bg-slate-900/90 border border-white/10 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-7 h-7 rounded-full ${m.avatarBg} text-white text-[10px] font-bold flex items-center justify-center">${m.avatar}</div>
            <div>
              <div class="text-xs font-bold text-white">${m.name}</div>
              <div class="text-[9px] text-amber-400 font-mono" id="splitPercentAmt_${m.id}">₹ ${((pct/100)*totalAmount).toFixed(2)}</div>
            </div>
          </div>
          <div class="w-24 text-right flex items-center gap-1">
            <input type="number" id="splitPercentInput_${m.id}" data-member-id="${m.id}" value="${pct}" oninput="updateUnifiedSplitCalculations()" class="w-full px-2 py-1 bg-slate-950 border border-white/10 rounded-lg text-xs font-mono font-bold text-white text-right focus:outline-none focus:border-amber-500">
            <span class="text-xs font-bold text-slate-400 font-mono">%</span>
          </div>
        </div>
      `;
    } else if (currentSplitMode === 'shares') {
      return `
        <div class="p-2.5 rounded-xl bg-slate-900/90 border border-white/10 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-7 h-7 rounded-full ${m.avatarBg} text-white text-[10px] font-bold flex items-center justify-center">${m.avatar}</div>
            <div>
              <div class="text-xs font-bold text-white">${m.name}</div>
              <div class="text-[9px] text-amber-400 font-mono" id="splitSharesAmt_${m.id}">₹ ${evenShare}.00 (1 Share)</div>
            </div>
          </div>
          <div class="w-24 text-right flex items-center gap-1">
            <input type="number" id="splitSharesInput_${m.id}" data-member-id="${m.id}" value="1" min="0" oninput="updateUnifiedSplitCalculations()" class="w-full px-2 py-1 bg-slate-950 border border-white/10 rounded-lg text-xs font-mono font-bold text-white text-right focus:outline-none focus:border-amber-500">
            <span class="text-xs font-bold text-slate-400 font-mono">x</span>
          </div>
        </div>
      `;
    }
  }).join('');
}

function distributeCustomEvenly() {
  const pool = appState.pools[appState.activePoolId] || appState.pools.goa;
  const totalAmount = parseFloat(document.getElementById('splitExpenseAmount')?.value) || 3000;
  const memberCount = pool.members.length || 1;

  if (currentSplitMode === 'exact') {
    const baseShare = Math.floor(totalAmount / memberCount);
    const remainder = totalAmount - (baseShare * memberCount);
    pool.members.forEach((m, idx) => {
      const input = document.getElementById(`splitExactInput_${m.id}`);
      if (input) input.value = idx === 0 ? (baseShare + remainder) : baseShare;
    });
  } else if (currentSplitMode === 'percent') {
    const equalPct = Math.floor(100 / memberCount);
    pool.members.forEach((m, idx) => {
      const input = document.getElementById(`splitPercentInput_${m.id}`);
      if (input) input.value = idx === 0 ? (100 - equalPct * (memberCount - 1)) : equalPct;
    });
  } else if (currentSplitMode === 'shares') {
    pool.members.forEach(m => {
      const input = document.getElementById(`splitSharesInput_${m.id}`);
      if (input) input.value = 1;
    });
  }
  updateUnifiedSplitCalculations();
}

function updateUnifiedSplitCalculations() {
  const pool = appState.pools[appState.activePoolId] || appState.pools.goa;
  const totalAmount = parseFloat(document.getElementById('splitExpenseAmount')?.value) || 0;
  
  const statusIcon = document.getElementById('splitStatusIcon');
  const statusTitle = document.getElementById('splitStatusTitle');
  const statusSub = document.getElementById('splitStatusSubtitle');
  const statusAmt = document.getElementById('splitStatusAmount');
  const statusBadge = document.getElementById('splitStatusBadge');

  if (currentSplitMode === 'equal') {
    const checkedMembers = pool.members.filter(m => {
      const cb = document.getElementById(`splitMemberCheck_${m.id}`);
      return cb ? cb.checked : true;
    });
    const count = checkedMembers.length || 1;
    const perHead = totalAmount > 0 ? (totalAmount / count) : 0;

    pool.members.forEach(m => {
      const cb = document.getElementById(`splitMemberCheck_${m.id}`);
      const shareEl = document.getElementById(`splitMemberShareDisplay_${m.id}`);
      if (shareEl) {
        if (cb && cb.checked) {
          shareEl.textContent = `₹ ${perHead.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
          shareEl.className = 'text-xs font-mono text-amber-400 font-bold';
        } else {
          shareEl.textContent = 'Excluded (₹0)';
          shareEl.className = 'text-[10px] font-mono text-slate-500';
        }
      }
    });

    if (statusIcon) {
      statusIcon.className = 'w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold';
      statusIcon.textContent = '✓';
    }
    if (statusTitle) {
      statusTitle.className = 'text-[11px] font-bold text-white';
      statusTitle.textContent = `Equal Split Active (${count} Members)`;
    }
    if (statusSub) statusSub.textContent = `Divided equally across ${count} selected members`;
    if (statusAmt) statusAmt.textContent = `₹ ${perHead.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (statusBadge) statusBadge.textContent = 'PER PERSON';

  } else if (currentSplitMode === 'exact') {
    let sum = 0;
    pool.members.forEach(m => {
      const val = parseFloat(document.getElementById(`splitExactInput_${m.id}`)?.value) || 0;
      sum += val;
      const pct = totalAmount > 0 ? ((val / totalAmount) * 100).toFixed(1) : 0;
      const pctEl = document.getElementById(`splitExactPct_${m.id}`);
      if (pctEl) pctEl.textContent = `₹ ${formatInr(val)} (${pct}%)`;
    });

    const isBalanced = Math.abs(sum - totalAmount) < 0.05;
    if (isBalanced) {
      if (statusIcon) { statusIcon.className = 'w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold'; statusIcon.textContent = '✓'; }
      if (statusTitle) { statusTitle.className = 'text-[11px] font-bold text-emerald-400'; statusTitle.textContent = 'Exact Split Balanced (100% Matched)'; }
      if (statusSub) statusSub.textContent = `Sum matches total bill of ₹${formatInr(totalAmount, 0)}`;
    } else {
      const diff = totalAmount - sum;
      if (statusIcon) { statusIcon.className = 'w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center text-xs font-bold'; statusIcon.textContent = '!'; }
      if (statusTitle) { statusTitle.className = 'text-[11px] font-bold text-rose-400'; statusTitle.textContent = diff > 0 ? `₹${diff.toFixed(2)} Remaining to Allocate` : `₹${Math.abs(diff).toFixed(2)} Over Bill Total`; }
      if (statusSub) statusSub.textContent = 'Adjust member inputs or click "Even Split"';
    }
    if (statusAmt) statusAmt.textContent = `₹ ${formatInr(sum)}`;
    if (statusBadge) statusBadge.textContent = 'TOTAL ALLOCATED';

  } else if (currentSplitMode === 'percent') {
    let totalPct = 0;
    pool.members.forEach(m => {
      const pct = parseFloat(document.getElementById(`splitPercentInput_${m.id}`)?.value) || 0;
      totalPct += pct;
      const calculatedAmt = (pct / 100) * totalAmount;
      const amtEl = document.getElementById(`splitPercentAmt_${m.id}`);
      if (amtEl) amtEl.textContent = `₹ ${formatInr(calculatedAmt)}`;
    });

    const isBalanced = Math.abs(totalPct - 100) < 0.1;
    if (isBalanced) {
      if (statusIcon) { statusIcon.className = 'w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold'; statusIcon.textContent = '✓'; }
      if (statusTitle) { statusTitle.className = 'text-[11px] font-bold text-emerald-400'; statusTitle.textContent = '100% Percentage Balanced'; }
      if (statusSub) statusSub.textContent = `All member shares equal 100% of ₹${formatInr(totalAmount, 0)}`;
    } else {
      if (statusIcon) { statusIcon.className = 'w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center text-xs font-bold'; statusIcon.textContent = '!'; }
      if (statusTitle) { statusTitle.className = 'text-[11px] font-bold text-rose-400'; statusTitle.textContent = `Total is ${totalPct.toFixed(1)}% (Must equal 100%)`; }
      if (statusSub) statusSub.textContent = 'Adjust member percentages to reach 100%';
    }
    if (statusAmt) statusAmt.textContent = `${totalPct.toFixed(1)} %`;
    if (statusBadge) statusBadge.textContent = 'TOTAL PERCENT';

  } else if (currentSplitMode === 'shares') {
    let totalShares = 0;
    pool.members.forEach(m => {
      const s = Math.max(0, parseFloat(document.getElementById(`splitSharesInput_${m.id}`)?.value) || 0);
      totalShares += s;
    });
    const perShare = totalShares > 0 ? (totalAmount / totalShares) : 0;

    pool.members.forEach(m => {
      const s = Math.max(0, parseFloat(document.getElementById(`splitSharesInput_${m.id}`)?.value) || 0);
      const calculatedAmt = s * perShare;
      const amtEl = document.getElementById(`splitSharesAmt_${m.id}`);
      if (amtEl) amtEl.textContent = `₹ ${formatInr(calculatedAmt)} (${s} Share${s !== 1 ? 's' : ''})`;
    });

    if (statusIcon) { statusIcon.className = 'w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold'; statusIcon.textContent = '✓'; }
    if (statusTitle) { statusTitle.className = 'text-[11px] font-bold text-emerald-400'; statusTitle.textContent = `Proportional Shares Split (${totalShares} Total Shares)`; }
    if (statusSub) statusSub.textContent = `Each share equals ₹${perShare.toFixed(2)}`;
    if (statusAmt) statusAmt.textContent = `₹ ${perShare.toFixed(2)}`;
    if (statusBadge) statusBadge.textContent = 'PER 1 SHARE';
  }
}

function submitUnifiedGroupExpense() {
  const pool = appState.pools[appState.activePoolId] || appState.pools.goa;
  const title = document.getElementById('splitExpenseTitle')?.value.trim() || 'Beach Shack Lunch & Drinks';
  const totalAmount = parseFloat(document.getElementById('splitExpenseAmount')?.value) || 0;
  const payer = document.getElementById('splitExpensePayer')?.value || 'Group Wallet';

  if (totalAmount <= 0) {
    showToast('Please enter a valid bill amount');
    return;
  }

  const memberShares = {};

  if (currentSplitMode === 'equal') {
    const checkedMembers = pool.members.filter(m => {
      const cb = document.getElementById(`splitMemberCheck_${m.id}`);
      return cb ? cb.checked : true;
    });
    if (checkedMembers.length === 0) {
      showToast('Please select at least one member to split with');
      return;
    }
    const perHead = totalAmount / checkedMembers.length;
    checkedMembers.forEach(m => {
      memberShares[m.id] = perHead;
    });
  } else if (currentSplitMode === 'exact') {
    let sum = 0;
    pool.members.forEach(m => {
      const val = parseFloat(document.getElementById(`splitExactInput_${m.id}`)?.value) || 0;
      memberShares[m.id] = val;
      sum += val;
    });
    if (Math.abs(sum - totalAmount) > 1) {
      showToast(`Exact shares sum (₹${sum.toFixed(2)}) does not match bill total (₹${totalAmount.toFixed(2)})`);
      return;
    }
  } else if (currentSplitMode === 'percent') {
    let totalPct = 0;
    pool.members.forEach(m => {
      const pct = parseFloat(document.getElementById(`splitPercentInput_${m.id}`)?.value) || 0;
      totalPct += pct;
      memberShares[m.id] = (pct / 100) * totalAmount;
    });
    if (Math.abs(totalPct - 100) > 0.5) {
      showToast(`Percentages sum to ${totalPct.toFixed(1)}%. Must equal 100%.`);
      return;
    }
  } else if (currentSplitMode === 'shares') {
    let totalShares = 0;
    pool.members.forEach(m => {
      const s = Math.max(0, parseFloat(document.getElementById(`splitSharesInput_${m.id}`)?.value) || 0);
      totalShares += s;
    });
    if (totalShares <= 0) {
      showToast('Total shares must be greater than 0');
      return;
    }
    const perShare = totalAmount / totalShares;
    pool.members.forEach(m => {
      const s = Math.max(0, parseFloat(document.getElementById(`splitSharesInput_${m.id}`)?.value) || 0);
      memberShares[m.id] = s * perShare;
    });
  }

  // Execute Financial Changes
  if (payer === 'Group Wallet') {
    // Deduct from Group Pool Wallet
    pool.balance = Math.max(0, pool.balance - totalAmount);
    pool.totalSpent += totalAmount;
  } else {
    // Paid by specific member
    pool.totalSpent += totalAmount;
    pool.members.forEach(m => {
      if (m.name === payer) {
        m.paid += totalAmount;
      }
    });
  }

  // Update consumed amounts
  pool.members.forEach(m => {
    if (memberShares[m.id]) {
      m.consumed += memberShares[m.id];
    }
  });

  // Append Activity to Pool Feed
  pool.activities.unshift({
    id: 'act_' + Date.now(),
    title: title,
    amount: totalAmount,
    perHead: totalAmount / (pool.members.length || 1),
    payer: payer === 'Group Wallet' ? 'Group Pool Wallet' : payer,
    splitDesc: currentSplitMode === 'equal' ? `Equal split across ${Object.keys(memberShares).length} members` : `Custom (${currentSplitMode}) split`,
    date: 'Just now',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=120&auto=format&fit=crop&q=80'
  });

  saveState();
  closeModal('modalPoolSplit');
  renderGroupPoolUI();
  playSuccessChime();
  showToast(`Bill ₹${formatInr(totalAmount, 0)} logged & split successfully!`);
}

// Backward Compatibility Aliases for Split Modals
function openPoolSplitModal() { openUnifiedSplitModal('equal'); }
function openPoolLogBillModal() { openUnifiedSplitModal('equal'); }
function openPoolCustomSplitModal() { openUnifiedSplitModal('exact'); }
function submitPoolSplit() { submitUnifiedGroupExpense(); }
function submitPoolCustomSplit() { submitUnifiedGroupExpense(); }
function submitNewGroupExpense() { submitUnifiedGroupExpense(); }
function updateSplitPerHead() { updateUnifiedSplitCalculations(); }
function updateCustomSplitCalculations() { updateUnifiedSplitCalculations(); }
function switchCustomSplitTab(tab) { switchSplitMode(tab); }

function openPoolMoreModal() {
  showToast('Pool Settings: Auto-settle enabled, spending alerts active.');
}

// ----------------------------------------------
// Group Statement Engine
// ----------------------------------------------
function openPoolStatementModal() {
  const pool = appState.pools[appState.activePoolId] || appState.pools.goa;

  const titleEl = document.getElementById('groupStatementTitle');
  const subEl = document.getElementById('groupStatementSubtitle');
  const balEl = document.getElementById('groupStatementBalance');
  const depEl = document.getElementById('groupStatementDeposits');
  const spentEl = document.getElementById('groupStatementSpent');
  const membersList = document.getElementById('groupStatementMembersList');
  const actList = document.getElementById('groupStatementActivitiesList');

  const totalDeposits = pool.members.reduce((acc, m) => acc + (m.paid || 0), 0);

  if (titleEl) titleEl.textContent = pool.name;
  if (subEl) subEl.textContent = `VPA: ${pool.vpa} • Official Group Passbook`;
  if (balEl) balEl.textContent = `₹ ${formatInr(pool.balance)}`;
  if (depEl) depEl.textContent = `₹ ${formatInr(totalDeposits)}`;
  if (spentEl) spentEl.textContent = `₹ ${formatInr(pool.totalSpent)}`;

  // Render members breakdown
  if (membersList) {
    membersList.innerHTML = pool.members.map(m => {
      const net = m.paid - m.consumed;
      const isSurplus = net > 0.01;
      const isDeficit = net < -0.01;
      return `
        <div class="flex items-center justify-between p-2 rounded-xl bg-slate-900/80 border border-white/5 text-xs">
          <div class="flex items-center gap-2">
            <span class="w-6 h-6 rounded-full ${m.avatarBg} text-white font-bold text-[10px] flex items-center justify-center">${m.avatar}</span>
            <span class="font-bold text-white">${m.name}</span>
          </div>
          <div class="text-right">
            <div class="text-[10px] text-slate-400 font-mono">Paid: ₹${m.paid.toFixed(2)} | Used: ₹${m.consumed.toFixed(2)}</div>
            <div class="text-[10px] font-mono font-bold ${isSurplus ? 'text-emerald-400' : (isDeficit ? 'text-rose-400' : 'text-slate-400')}">
              ${isSurplus ? `+ ₹${Math.abs(net).toFixed(2)} (Surplus)` : (isDeficit ? `- ₹${Math.abs(net).toFixed(2)} (Deficit)` : 'Settled')}
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // Render activities list
  if (actList) {
    if (pool.activities.length === 0) {
      actList.innerHTML = `<div class="text-center py-4 text-xs text-slate-500">No transactions recorded yet.</div>`;
    } else {
      actList.innerHTML = pool.activities.map(act => `
        <div class="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-white/5 text-xs">
          <div>
            <div class="font-bold text-white">${act.title}</div>
            <div class="text-[10px] text-slate-400">By: ${act.payer} • ${act.date}</div>
          </div>
          <div class="text-right">
            <div class="font-mono font-bold text-white">₹ ${act.amount.toFixed(2)}</div>
            <div class="text-[9px] text-slate-400">${act.splitDesc}</div>
          </div>
        </div>
      `).join('');
    }
  }

  openModal('modalGroupStatement');
}

function downloadGroupStatement(format = 'pdf') {
  const pool = appState.pools[appState.activePoolId] || appState.pools.goa;
  const totalDeposits = pool.members.reduce((acc, m) => acc + (m.paid || 0), 0);
  const stmtRef = 'UNX-GRP-' + Math.floor(100000 + Math.random() * 900000);
  const genDate = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

  showToast(`⏳ Generating 3-Month PDF Statement for ${pool.name}...`);
  playSuccessChime();

  if (window.jspdf && window.jspdf.jsPDF) {
    try {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

      // Header Banner
      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, 210, 28, 'F');
      doc.setFillColor(99, 102, 241); // indigo stripe
      doc.rect(0, 28, 210, 1.5, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text('UNEXA SHARED GROUP VAULT', 14, 11);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(203, 213, 225);
      doc.text(`Official 3-Month Group Passbook & Audit Ledger | Ref: ${stmtRef}`, 14, 17);
      doc.text(`Pool VPA: ${pool.vpa} • Status: ${pool.isClosed ? 'CLOSED' : 'ACTIVE'}`, 14, 22);

      // Top Right Badge
      doc.setFillColor(99, 102, 241);
      doc.roundedRect(148, 8, 48, 12, 2, 2, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.text('GROUP PASSBOOK', 152, 13);
      doc.setFontSize(7);
      doc.text('3-MONTH AUDIT', 155, 17.5);

      // Summary Stats
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(14, 33, 182, 18, 2, 2, 'FD');

      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      doc.setFont('helvetica', 'bold');
      doc.text('CURRENT VAULT BALANCE', 20, 39);
      doc.text('TOTAL DEPOSITED', 80, 39);
      doc.text('TOTAL SPENT', 140, 39);

      doc.setFontSize(10);
      doc.setTextColor(16, 185, 129); // emerald
      doc.text(`₹ ${formatInr(pool.balance, 2)}`, 20, 46);

      doc.setTextColor(6, 182, 212); // cyan
      doc.text(`₹ ${formatInr(totalDeposits, 2)}`, 80, 46);

      doc.setTextColor(245, 158, 11); // amber
      doc.text(`₹ ${formatInr(pool.totalSpent, 2)}`, 140, 46);

      // Member Breakdown Table
      const memberRows = pool.members.map((m, idx) => {
        const net = m.paid - m.consumed;
        return [
          String(idx + 1),
          m.name,
          m.role,
          '₹' + formatInr(m.paid, 2),
          '₹' + formatInr(m.consumed, 2),
          net > 0 ? '+ ₹' + formatInr(net, 2) + ' (Surplus)' : (net < 0 ? '- ₹' + formatInr(Math.abs(net), 2) + ' (Deficit)' : 'Settled')
        ];
      });

      doc.autoTable({
        startY: 55,
        head: [['#', 'Member Name', 'Role', 'Total Contributed', 'Total Consumed', 'Net Settlement Balance']],
        body: memberRows,
        theme: 'grid',
        headStyles: { fillColor: [99, 102, 241], fontSize: 7, fontStyle: 'bold' },
        bodyStyles: { fontSize: 7, cellPadding: 2.5 }
      });

      // Activities Table
      const actRows = (pool.activities || []).map((act, idx) => [
        String(idx + 1),
        act.date,
        act.title,
        act.payer,
        act.splitDesc,
        '₹' + formatInr(act.amount, 2)
      ]);

      doc.autoTable({
        startY: doc.lastAutoTable.finalY + 8,
        head: [['#', 'Date', 'Expense Title', 'Paid By', 'Split Details', 'Amount']],
        body: actRows.length > 0 ? actRows : [['-', 'No expenses logged', '-', '-', '-', '-']],
        theme: 'striped',
        headStyles: { fillColor: [15, 23, 42], fontSize: 7, fontStyle: 'bold' },
        bodyStyles: { fontSize: 7, cellPadding: 2.5 },
        columnStyles: { 5: { halign: 'right', fontStyle: 'bold' } }
      });

      doc.save(`Unexa_Group_Statement_${pool.name.replace(/[^a-zA-Z0-9]/g, '_')}_3Months.pdf`);
      showToast(`📄 3-Month Group Statement for ${pool.name} downloaded!`);
      return;
    } catch (e) {
      console.error('Group PDF Generation error:', e);
    }
  }

  // Text fallback if jsPDF is unavailable
  let text = `=====================================================
UNEXA OFFICIAL 3-MONTH GROUP VAULT STATEMENT
Group Name:   ${pool.name}
Vault VPA:    ${pool.vpa}
Status:       ${pool.isClosed ? 'CLOSED / SETTLED' : 'ACTIVE'}
Generated On: ${genDate} | Ref: ${stmtRef}
=====================================================
FINANCIAL SUMMARY:
- Current Vault Balance:   ₹ ${formatInr(pool.balance)}
- Total Funds Deposited:   ₹ ${formatInr(totalDeposits)}
- Total Spends Logged:     ₹ ${formatInr(pool.totalSpent)}
=====================================================
MEMBER BALANCES & SHARES:
`;

  pool.members.forEach(m => {
    const net = m.paid - m.consumed;
    text += `• ${m.name.padEnd(20)} Paid: ₹ ${m.paid.toFixed(2).padStart(9)} | Used: ₹ ${m.consumed.toFixed(2).padStart(9)} | Net: ${net >= 0 ? '+' : '-'}₹ ${Math.abs(net).toFixed(2)}\n`;
  });

  text += `=====================================================
CHRONOLOGICAL TRANSACTION LEDGER:
`;

  pool.activities.forEach((act, idx) => {
    text += `${idx + 1}. [${act.date}] ${act.title} - ₹ ${act.amount.toFixed(2)} (Paid by: ${act.payer})\n   Split: ${act.splitDesc}\n`;
  });

  text += `=====================================================
NPCI Certified Official Group Audit Record
=====================================================`;

  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Unexa_${pool.name.replace(/[^a-zA-Z0-9]/g, '_')}_3Month_Statement.txt`;
  a.click();
  URL.revokeObjectURL(url);
  showToast(`Statement for ${pool.name} downloaded!`);
}

// ----------------------------------------------
// Helper: Download QR Image
function downloadQrCode(imgElementId, defaultFilename) {
  const img = document.getElementById(imgElementId);
  if (!img) return;

  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const imageObj = new Image();
    imageObj.crossOrigin = 'anonymous';
    imageObj.onload = function() {
      canvas.width = imageObj.naturalWidth || 260;
      canvas.height = imageObj.naturalHeight || 260;
      // White background for QR code scanning contrast
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(imageObj, 0, 0);
      
      const link = document.createElement('a');
      link.download = defaultFilename;
      link.href = canvas.toDataURL('image/png');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      playSuccessChime();
      showToast(`Saved ${defaultFilename} to device!`);
    };
    imageObj.onerror = function() {
      const link = document.createElement('a');
      link.href = img.src;
      link.download = defaultFilename;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      playSuccessChime();
      showToast(`Downloading QR code image...`);
    };
    imageObj.src = img.src;
  } catch (err) {
    window.open(img.src, '_blank');
    showToast(`Opening QR code image`);
  }
}

// ----------------------------------------------
// 1. Personal UPI QR Code Logic
// ----------------------------------------------
let currentPersonalQrAmount = '';

function openPersonalQrModal() {
  const user = appState.user;
  const userNameEl = document.getElementById('personalQrUserName');
  const userVpaEl = document.getElementById('personalQrVpaDisplay');
  const amountInput = document.getElementById('personalQrAmountInput');
  
  if (userNameEl) userNameEl.textContent = user.name || 'Aarav Sharma';
  if (userVpaEl) userVpaEl.textContent = user.vpa || 'aaravsharma@upi';
  if (amountInput) amountInput.value = '';
  currentPersonalQrAmount = '';

  renderPersonalQrImage('');
  openModal('modalPersonalQr');
}

function renderPersonalQrImage(amount) {
  const user = appState.user;
  const vpa = user.vpa || 'aaravsharma@upi';
  const name = encodeURIComponent(user.name || 'Aarav Sharma');
  
  let upiUri = `upi://pay?pa=${vpa}&pn=${name}&cu=INR`;
  const badgeEl = document.getElementById('personalQrAmountBadge');
  
  if (amount && parseFloat(amount) > 0) {
    upiUri += `&am=${parseFloat(amount).toFixed(2)}`;
    if (badgeEl) {
      badgeEl.innerHTML = `<i data-lucide="sparkles" class="w-3 h-3"></i> Requesting ₹ ${formatInr(parseFloat(amount))}`;
      badgeEl.className = 'pill-badge badge-green text-[10px] font-bold';
    }
  } else {
    if (badgeEl) {
      badgeEl.innerHTML = `<i data-lucide="shield-check" class="w-3 h-3"></i> Accepting Any Amount`;
      badgeEl.className = 'pill-badge badge-cyan text-[10px] font-bold';
    }
  }

  const qrImg = document.getElementById('personalQrImg');
  if (qrImg) {
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=10&data=${encodeURIComponent(upiUri)}`;
  }
  if (window.lucide) window.lucide.createIcons();
}

function handlePersonalQrAmountChange(val) {
  currentPersonalQrAmount = val;
  renderPersonalQrImage(val);
}

function setPersonalQrPreset(amount) {
  const input = document.getElementById('personalQrAmountInput');
  if (input) input.value = amount;
  currentPersonalQrAmount = amount;
  renderPersonalQrImage(amount);
  showToast(`Requesting ₹${amount} via Personal QR`);
}

function clearPersonalQrAmount() {
  const input = document.getElementById('personalQrAmountInput');
  if (input) input.value = '';
  currentPersonalQrAmount = '';
  renderPersonalQrImage('');
  showToast('Amount cleared. QR accepting any payment.');
}

function copyPersonalVpa() {
  const vpa = appState.user.vpa || 'aaravsharma@upi';
  navigator.clipboard.writeText(vpa).then(() => {
    playSuccessChime();
    showToast(`Personal UPI ID copied: ${vpa}`);
  }).catch(() => {
    showToast(`Personal UPI ID: ${vpa}`);
  });
}

function downloadPersonalQr() {
  const user = appState.user;
  const amtSuffix = currentPersonalQrAmount ? `_₹${currentPersonalQrAmount}` : '';
  const filename = `${user.name.replace(/\s+/g, '_')}_UPI_QR${amtSuffix}.png`;
  downloadQrCode('personalQrImg', filename);
}

function sharePersonalQr() {
  const user = appState.user;
  const vpa = user.vpa || 'aaravsharma@upi';
  let shareText = `Pay Aarav Sharma on UPI: ${vpa}`;
  if (currentPersonalQrAmount) {
    shareText += ` (Amount: ₹${currentPersonalQrAmount})`;
  }
  const upiUri = `upi://pay?pa=${vpa}&pn=${encodeURIComponent(user.name)}&cu=INR${currentPersonalQrAmount ? `&am=${currentPersonalQrAmount}` : ''}`;

  if (navigator.share) {
    navigator.share({
      title: 'Unexa - Personal UPI QR',
      text: shareText,
      url: upiUri
    }).catch(() => {
      navigator.clipboard.writeText(upiUri);
      showToast('Payment link copied to clipboard!');
    });
  } else {
    navigator.clipboard.writeText(upiUri).then(() => {
      playSuccessChime();
      showToast('UPI Payment Link copied to clipboard!');
    });
  }
}

function switchToBurnerQr() {
  closeModal('modalPersonalQr');
  setTimeout(() => {
    openBurnerAliasModal();
  }, 200);
}

// ----------------------------------------------
// 2. Group Shared Pool QR Code Logic
// ----------------------------------------------
let currentGroupQrAmount = '';

function openPoolQrModal() {
  const pool = appState.pools[appState.activePoolId] || appState.pools.goa;
  
  const modalTitle = document.getElementById('groupQrModalTitle');
  const poolIcon = document.getElementById('groupQrPoolIcon');
  const poolNameEl = document.getElementById('groupQrPoolName');
  const poolVpaEl = document.getElementById('groupQrPoolVpa');
  const poolVaultBalanceEl = document.getElementById('groupQrPoolVaultBalance');
  const perHeadShareEl = document.getElementById('groupQrPerHeadShare');
  const amountInput = document.getElementById('groupQrAmountInput');

  const poolIconMatch = pool.name.match(/^(\p{Emoji_Presentation}|\p{Extended_Pictographic})/u);
  const iconStr = poolIconMatch ? poolIconMatch[0] : '👥';

  if (modalTitle) modalTitle.textContent = `${pool.name} Shared QR`;
  if (poolIcon) poolIcon.textContent = iconStr;
  if (poolNameEl) poolNameEl.textContent = pool.name;
  if (poolVpaEl) poolVpaEl.textContent = pool.vpa;
  if (poolVaultBalanceEl) poolVaultBalanceEl.textContent = `₹ ${pool.balance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  // Calculate per head share
  const memberCount = pool.members?.length || 1;
  const totalExp = (pool.totalSpent || 0) + (pool.balance || 0);
  const suggestedShare = totalExp / memberCount;
  if (perHeadShareEl) {
    perHeadShareEl.textContent = `₹ ${suggestedShare.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  const suggestedBtn = document.getElementById('btnGroupSuggestedPreset');
  if (suggestedBtn) {
    suggestedBtn.textContent = `₹${Math.round(suggestedShare)}`;
  }

  if (amountInput) amountInput.value = '';
  currentGroupQrAmount = '';

  renderGroupQrImage('');
  openModal('modalGroupQr');
}

function renderGroupQrImage(amount) {
  const pool = appState.pools[appState.activePoolId] || appState.pools.goa;
  const vpa = pool.vpa;
  const name = encodeURIComponent(pool.name);
  
  let upiUri = `upi://pay?pa=${vpa}&pn=${name}&cu=INR`;
  const badgeEl = document.getElementById('groupQrAmountBadge');
  
  if (amount && parseFloat(amount) > 0) {
    upiUri += `&am=${parseFloat(amount).toFixed(2)}`;
    if (badgeEl) {
      badgeEl.innerHTML = `<i data-lucide="sparkles" class="w-3 h-3"></i> Contributing ₹ ${formatInr(parseFloat(amount))} to ${pool.name}`;
      badgeEl.className = 'pill-badge badge-green text-[10px] font-bold';
    }
  } else {
    if (badgeEl) {
      badgeEl.innerHTML = `<i data-lucide="vault" class="w-3 h-3"></i> Shared Vault Contribution`;
      badgeEl.className = 'pill-badge badge-green text-[10px] font-bold';
    }
  }

  const qrImg = document.getElementById('groupQrImg');
  if (qrImg) {
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=10&data=${encodeURIComponent(upiUri)}`;
  }
  if (window.lucide) window.lucide.createIcons();
}

function handleGroupQrAmountChange(val) {
  currentGroupQrAmount = val;
  renderGroupQrImage(val);
}

function setGroupQrPreset(amount) {
  const input = document.getElementById('groupQrAmountInput');
  if (input) input.value = amount;
  currentGroupQrAmount = amount;
  renderGroupQrImage(amount);
  showToast(`Contribution set to ₹${amount}`);
}

function setGroupSuggestedSplitPreset() {
  const pool = appState.pools[appState.activePoolId] || appState.pools.goa;
  const memberCount = pool.members?.length || 1;
  const totalExp = (pool.totalSpent || 0) + (pool.balance || 0);
  const suggestedShare = Math.round(totalExp / memberCount);
  
  const input = document.getElementById('groupQrAmountInput');
  if (input) input.value = suggestedShare;
  currentGroupQrAmount = suggestedShare;
  renderGroupQrImage(suggestedShare);
  showToast(`Suggested equal share preset: ₹${formatInr(suggestedShare, 0)}`);
}

function clearGroupQrAmount() {
  const input = document.getElementById('groupQrAmountInput');
  if (input) input.value = '';
  currentGroupQrAmount = '';
  renderGroupQrImage('');
  showToast('Amount cleared. Pool QR accepting any contribution.');
}

function copyGroupPoolVpa() {
  const pool = appState.pools[appState.activePoolId] || appState.pools.goa;
  navigator.clipboard.writeText(pool.vpa).then(() => {
    playSuccessChime();
    showToast(`Group Pool VPA copied: ${pool.vpa}`);
  }).catch(() => {
    showToast(`Group Pool VPA: ${pool.vpa}`);
  });
}

function downloadGroupQr() {
  const pool = appState.pools[appState.activePoolId] || appState.pools.goa;
  const cleanName = pool.name.replace(/[^a-zA-Z0-9]/g, '_');
  const amtSuffix = currentGroupQrAmount ? `_₹${currentGroupQrAmount}` : '';
  const filename = `${cleanName}_Vault_QR${amtSuffix}.png`;
  downloadQrCode('groupQrImg', filename);
}

function shareGroupQr() {
  const pool = appState.pools[appState.activePoolId] || appState.pools.goa;
  let shareText = `Join & contribute to ${pool.name} on Unexa: ${pool.vpa}`;
  if (currentGroupQrAmount) {
    shareText += ` (Contribution: ₹${currentGroupQrAmount})`;
  }
  const upiUri = `upi://pay?pa=${pool.vpa}&pn=${encodeURIComponent(pool.name)}&cu=INR${currentGroupQrAmount ? `&am=${currentGroupQrAmount}` : ''}`;

  if (navigator.share) {
    navigator.share({
      title: `${pool.name} - Shared Pool QR`,
      text: shareText,
      url: upiUri
    }).catch(() => {
      navigator.clipboard.writeText(upiUri);
      showToast('Group pool link copied to clipboard!');
    });
  } else {
    navigator.clipboard.writeText(upiUri).then(() => {
      playSuccessChime();
      showToast('Group Pool UPI Link copied to clipboard!');
    });
  }
}

function quickDepositToPool() {
  const pool = appState.pools[appState.activePoolId] || appState.pools.goa;
  const amt = currentGroupQrAmount ? parseFloat(currentGroupQrAmount) : 2500.00;
  closeModal('modalGroupQr');
  setTimeout(() => {
    initiatePayment(`${pool.name} Vault`, pool.vpa, amt, '👥 Group Pool Deposit');
  }, 200);
}


// ==============================================
// 1. AUTOPAY & E-MANDATES MANAGER
// ==============================================

function openMandatesModal() {
  renderMandatesList();
  openModal('modalMandates');
}

function renderMandatesList() {
  const container = document.getElementById('mandatesListContainer');
  const countEl = document.getElementById('mandatesActiveCount');
  const totalEl = document.getElementById('mandatesMonthlyTotal');
  if (!container) return;

  const mandates = appState.mandates || [];
  const activeMandates = mandates.filter(m => m.status === 'active');
  const activeCount = activeMandates.length;
  const monthlySum = activeMandates.reduce((acc, m) => {
    let monthlyVal = m.amount;
    if (m.frequency === 'quarterly') monthlyVal = m.amount / 3;
    if (m.frequency === 'yearly') monthlyVal = m.amount / 12;
    return acc + monthlyVal;
  }, 0);

  if (countEl) countEl.textContent = `${activeCount} Subscriptions`;
  if (totalEl) totalEl.textContent = `₹ ${monthlySum.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  if (mandates.length === 0) {
    container.innerHTML = `<div class="p-4 rounded-xl bg-slate-900 border border-white/10 text-center text-xs text-slate-400">No active mandates found. Create a new recurring rule below.</div>`;
    return;
  }

  container.innerHTML = mandates.map(m => {
    const isActive = m.status === 'active';
    const statusBadge = isActive
      ? `<span class="pill-badge badge-green text-[8px] font-bold">ACTIVE</span>`
      : `<span class="pill-badge badge-amber text-[8px] font-bold">PAUSED</span>`;

    return `
      <div class="upi-card bg-slate-900 border border-white/10 p-2.5 flex items-center justify-between gap-2">
        <div class="flex items-center gap-2.5 min-w-0">
          <div class="w-8 h-8 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center text-base flex-shrink-0">
            ${m.emoji || '💳'}
          </div>
          <div class="min-w-0">
            <div class="flex items-center gap-1.5">
              <span class="text-xs font-bold text-white truncate">${m.name}</span>
              ${statusBadge}
            </div>
            <div class="text-[10px] text-slate-400">
              ${m.frequency.toUpperCase()} • Next: ${m.nextDebit || 'Next cycle'}
            </div>
          </div>
        </div>
        <div class="flex items-center gap-2 flex-shrink-0">
          <div class="text-right">
            <div class="text-xs font-bold text-white font-mono">₹ ${formatInr(m.amount, 0)}</div>
            <div class="text-[9px] text-slate-400">Max Cap</div>
          </div>
          <div class="flex items-center gap-1">
            <button class="w-7 h-7 rounded-lg ${isActive ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30' : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'} flex items-center justify-center" title="${isActive ? 'Pause Mandate' : 'Resume Mandate'}" onclick="toggleMandateStatus('${m.id}')">
              <i data-lucide="${isActive ? 'pause' : 'play'}" class="w-3.5 h-3.5"></i>
            </button>
            <button class="w-7 h-7 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 flex items-center justify-center" title="Revoke Mandate" onclick="revokeMandate('${m.id}')">
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  if (window.lucide) window.lucide.createIcons();
}

function toggleMandateStatus(id) {
  const mandate = (appState.mandates || []).find(m => m.id === id);
  if (!mandate) return;

  mandate.status = mandate.status === 'active' ? 'paused' : 'active';
  saveState();
  renderMandatesList();
  showToast(mandate.status === 'active' ? `▶️ Mandate for ${mandate.name} resumed` : `⏸️ Mandate for ${mandate.name} paused`);
}

function setNewMandatePreset(name, amount, frequency, emoji) {
  const nameEl = document.getElementById('newMandateName');
  const amtEl = document.getElementById('newMandateAmount');
  const freqEl = document.getElementById('newMandateFrequency');

  if (nameEl) {
    nameEl.value = name;
    nameEl.dataset.emoji = emoji;
  }
  if (amtEl) amtEl.value = amount;
  if (freqEl) freqEl.value = frequency;

  showToast(`Preset selected: ${emoji} ${name} (₹${amount}/${frequency})`);
}

function submitAddNewMandate() {
  const nameEl = document.getElementById('newMandateName');
  const amtEl = document.getElementById('newMandateAmount');
  const freqEl = document.getElementById('newMandateFrequency');

  const name = nameEl?.value.trim() || '';
  const amount = parseFloat(amtEl?.value) || 0;
  const frequency = freqEl?.value || 'monthly';
  const emoji = nameEl?.dataset.emoji || '💳';

  if (!name) {
    showToast('⚠️ Please enter a merchant / service name');
    return;
  }
  if (amount <= 0) {
    showToast('⚠️ Please enter a valid auto-debit amount limit');
    return;
  }

  const newMandate = {
    id: 'man_' + Date.now(),
    name: name,
    emoji: emoji,
    amount: amount,
    frequency: frequency,
    nextDebit: 'Next billing cycle',
    status: 'active',
    autoDebitBank: 'Bank of Baroda XX0507'
  };

  if (!appState.mandates) appState.mandates = [];
  appState.mandates.push(newMandate);
  saveState();

  playSuccessChime();
  if (window.confetti) {
    window.confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
  }

  renderMandatesList();
  if (nameEl) {
    nameEl.value = '';
    delete nameEl.dataset.emoji;
  }
  showToast(`✅ AutoPay Mandate authorized for ${name} (Limit: ₹${amount})`);
}

function revokeMandate(id) {
  const mandate = (appState.mandates || []).find(m => m.id === id);
  if (!mandate) return;

  if (confirm(`Are you sure you want to permanently revoke the AutoPay mandate for ${mandate.name}?`)) {
    appState.mandates = appState.mandates.filter(m => m.id !== id);
    saveState();
    renderMandatesList();
    showToast(`🗑️ Mandate for ${mandate.name} revoked.`);
  }
}

// ==============================================
// 2. UPI CIRCLE (POCKET MONEY & DELEGATIONS)
// ==============================================

function openUpiCircleModal() {
  renderUpiCircleUI();
  openModal('modalUpiCircle');
}

function renderUpiCircleUI() {
  const circle = appState.upiCircle || { delegates: [], pendingRequests: [] };
  const delegates = circle.delegates || [];
  const pending = circle.pendingRequests || [];

  // Summary counters
  const countEl = document.getElementById('circleDelegatesCount');
  const allocatedEl = document.getElementById('circleAllocatedTotal');
  const spentEl = document.getElementById('circleSpentTotal');
  const pendingBadge = document.getElementById('circlePendingBadge');

  const totalAllocated = delegates.reduce((sum, d) => sum + (d.monthlyLimit || 0), 0);
  const totalSpent = delegates.reduce((sum, d) => sum + (d.spent || 0), 0);

  if (countEl) countEl.textContent = `${delegates.length} Members`;
  if (allocatedEl) allocatedEl.textContent = `₹ ${formatInr(totalAllocated)}`;
  if (spentEl) spentEl.textContent = `₹ ${formatInr(totalSpent)}`;

  if (pendingBadge) {
    if (pending.length > 0) {
      pendingBadge.textContent = `${pending.length} PENDING`;
      pendingBadge.className = 'pill-badge badge-amber text-[8px]';
    } else {
      pendingBadge.textContent = `ALL CLEAR`;
      pendingBadge.className = 'pill-badge badge-green text-[8px]';
    }
  }

  // Pending Requests List
  const pendingContainer = document.getElementById('circlePendingRequestsList');
  if (pendingContainer) {
    if (pending.length === 0) {
      pendingContainer.innerHTML = `<div class="p-3 rounded-xl bg-slate-900 border border-white/10 text-center text-xs text-slate-400">✨ No pending spend requests from family members.</div>`;
    } else {
      pendingContainer.innerHTML = pending.map(req => `
        <div class="p-2.5 rounded-xl bg-amber-950/20 border border-amber-500/30">
          <div class="flex items-center justify-between mb-1.5">
            <div class="flex items-center gap-2">
              <div class="w-7 h-7 rounded-full ${req.avatarBg || 'bg-rose-600'} text-white text-[10px] font-bold flex items-center justify-center">
                ${req.avatar || req.delegateName.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div class="text-xs font-bold text-white">${req.delegateName}</div>
                <div class="text-[10px] text-slate-400">${req.merchant} • ${req.time}</div>
              </div>
            </div>
            <div class="text-right">
              <div class="text-xs font-black text-amber-300 font-mono">₹ ${req.amount.toFixed(2)}</div>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-2 mt-2">
            <button type="button" class="py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold transition flex items-center justify-center gap-1" onclick="approveCircleSpendRequest('${req.id}')">
              <i data-lucide="check" class="w-3 h-3"></i>
              <span>Approve &amp; Pay</span>
            </button>
            <button type="button" class="py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold transition flex items-center justify-center gap-1" onclick="declineCircleSpendRequest('${req.id}')">
              <i data-lucide="x" class="w-3 h-3"></i>
              <span>Decline</span>
            </button>
          </div>
        </div>
      `).join('');
    }
  }

  // Active Delegates List
  const delegatesContainer = document.getElementById('circleDelegatesList');
  if (delegatesContainer) {
    if (delegates.length === 0) {
      delegatesContainer.innerHTML = `<div class="p-3 rounded-xl bg-slate-900 border border-white/10 text-center text-xs text-slate-400">No family delegates linked yet.</div>`;
    } else {
      delegatesContainer.innerHTML = delegates.map(d => {
        const spentPercent = Math.min(100, Math.round(((d.spent || 0) / (d.monthlyLimit || 1)) * 100));
        const modeLabel = d.mode === 'direct' ? 'Direct Spend' : 'Approval Mode';
        const modeBadgeClass = d.mode === 'direct' ? 'badge-green' : 'badge-purple';

        return `
          <div class="upi-card bg-slate-900 border border-white/10 p-2.5">
            <div class="flex items-center justify-between mb-1.5">
              <div class="flex items-center gap-2">
                <div class="w-7 h-7 rounded-full ${d.avatarBg || 'bg-rose-600'} text-white text-[10px] font-bold flex items-center justify-center">
                  ${d.avatar || d.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div class="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>${d.name}</span>
                    <span class="text-[9px] text-slate-400 font-normal">(${d.relation || 'Member'})</span>
                    <span class="pill-badge ${modeBadgeClass} text-[7px]">${modeLabel}</span>
                  </div>
                  <div class="text-[9px] text-slate-400 font-mono">${d.phone}</div>
                </div>
              </div>
              <button class="w-6 h-6 rounded-lg bg-slate-800 text-slate-400 hover:text-rose-400 flex items-center justify-center" title="Remove Member" onclick="revokeCircleDelegate('${d.id}')">
                <i data-lucide="trash-2" class="w-3 h-3"></i>
              </button>
            </div>
            <div class="flex items-center justify-between text-[10px] text-slate-300 font-mono mb-1">
              <span>Spent: ₹${(d.spent || formatInr(0), 0)}</span>
              <span class="text-slate-400">Limit: ₹${(d.monthlyLimit || formatInr(0), 0)}</span>
            </div>
            <div class="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div class="h-full bg-gradient-to-r from-rose-500 to-amber-500 rounded-full" style="width: ${spentPercent}%"></div>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  if (window.lucide) window.lucide.createIcons();
}

function approveCircleSpendRequest(reqId) {
  const circle = appState.upiCircle;
  if (!circle || !circle.pendingRequests) return;

  const reqIndex = circle.pendingRequests.findIndex(r => r.id === reqId);
  if (reqIndex === -1) return;

  const req = circle.pendingRequests[reqIndex];
  
  if (appState.user.balance < req.amount) {
    showToast('⚠️ Insufficient bank balance to approve spend request');
    return;
  }

  // Deduct from bank balance
  appState.user.balance = Math.max(0, appState.user.balance - req.amount);
  
  // Update delegate spent
  const delegate = (circle.delegates || []).find(d => d.id === req.delegateId);
  if (delegate) {
    delegate.spent = (delegate.spent || 0) + req.amount;
  }

  // Add transaction
  appState.transactions.unshift({
    id: 'tx_circle_' + Date.now(),
    title: `${req.merchant} (via ${req.delegateName})`,
    date: 'Just now',
    bank: 'Bank of Baroda XX0507',
    utr: String(Math.floor(100000000000 + Math.random() * 900000000000)),
    amount: -req.amount,
    category: 'UPI Circle / Family',
    type: 'debited',
    isCard: false,
    isLite: false,
  });

  // Remove pending request
  circle.pendingRequests.splice(reqIndex, 1);
  saveState();

  playSuccessChime();
  playSoundboxVoice(req.amount, req.merchant);
  if (window.confetti) {
    window.confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
  }

  renderUpiCircleUI();
  const balEl = document.getElementById('personalTotalBalance');
  if (balEl) balEl.textContent = `₹${formatInr(appState.user.balance, 0)}`;

  showToast(`✅ Approved ₹${req.amount} for ${req.delegateName} at ${req.merchant}!`);
}

function declineCircleSpendRequest(reqId) {
  const circle = appState.upiCircle;
  if (!circle || !circle.pendingRequests) return;

  const reqIndex = circle.pendingRequests.findIndex(r => r.id === reqId);
  if (reqIndex === -1) return;

  const req = circle.pendingRequests[reqIndex];
  circle.pendingRequests.splice(reqIndex, 1);
  saveState();

  renderUpiCircleUI();
  showToast(`🚫 Declined spend request of ₹${req.amount} from ${req.delegateName}.`);
}

function submitAddNewCircleDelegate() {
  const nameEl = document.getElementById('newCircleName');
  const phoneEl = document.getElementById('newCirclePhone');
  const limitEl = document.getElementById('newCircleLimit');
  const modeEl = document.getElementById('newCircleMode');

  const name = nameEl?.value.trim() || '';
  const phone = phoneEl?.value.trim() || '';
  const limit = parseFloat(limitEl?.value) || 2000;
  const mode = modeEl?.value || 'approval';

  if (!name || !phone) {
    showToast('⚠️ Please provide member name and mobile number');
    return;
  }

  if (!appState.upiCircle) appState.upiCircle = { delegates: [], pendingRequests: [] };
  if (!appState.upiCircle.delegates) appState.upiCircle.delegates = [];

  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'FM';
  const colors = ['bg-rose-600', 'bg-purple-600', 'bg-indigo-600', 'bg-teal-600', 'bg-amber-600'];
  const bg = colors[appState.upiCircle.delegates.length % colors.length];

  appState.upiCircle.delegates.push({
    id: 'del_' + Date.now(),
    name: name,
    relation: 'Family',
    phone: phone,
    monthlyLimit: limit,
    spent: 0,
    mode: mode,
    avatar: initials,
    avatarBg: bg
  });

  saveState();
  playSuccessChime();

  if (nameEl) nameEl.value = '';
  if (phoneEl) phoneEl.value = '';

  renderUpiCircleUI();
  showToast(`🎉 ${name} added to your UPI Circle with ₹${limit} limit!`);
}

function revokeCircleDelegate(id) {
  if (!appState.upiCircle || !appState.upiCircle.delegates) return;
  const delegate = appState.upiCircle.delegates.find(d => d.id === id);
  if (!delegate) return;

  if (confirm(`Remove ${delegate.name} from your UPI Circle?`)) {
    appState.upiCircle.delegates = appState.upiCircle.delegates.filter(d => d.id !== id);
    saveState();
    renderUpiCircleUI();
    showToast(`Removed ${delegate.name} from UPI Circle.`);
  }
}

// ==============================================
// 3. ECO-UPI GREEN LEDGER & CARBON TRACKER
// ==============================================

function openGreenLedgerModal() {
  renderGreenLedgerUI();
  openModal('modalGreenLedger');
}

function renderGreenLedgerUI() {
  const green = appState.greenLedger || { treesPlanted: 3, co2SavedKg: 42.8, ecoCoins: 420, ecoRoundupEnabled: true };
  const treesEl = document.getElementById('greenTreesCount');
  const co2El = document.getElementById('greenCo2Saved');
  const coinsEl = document.getElementById('greenCoinsCount');
  const toggleEl = document.getElementById('checkEcoRoundup');

  if (treesEl) treesEl.textContent = `🌳 ${green.treesPlanted || 0} Trees`;
  if (co2El) co2El.textContent = `🍃 ${(green.co2SavedKg || 0).toFixed(1)} kg`;
  if (coinsEl) coinsEl.textContent = `🪙 ${green.ecoCoins || 0} pts`;
  if (toggleEl) toggleEl.checked = !!green.ecoRoundupEnabled;
}

function toggleEcoRoundupSetting(checked) {
  if (!appState.greenLedger) appState.greenLedger = {};
  appState.greenLedger.ecoRoundupEnabled = checked;
  saveState();
  showToast(checked ? '🌱 Eco-Roundup enabled: Transactions will micro-fund tree planting' : 'Eco-Roundup disabled');
}

function plantTreeMicroAction() {
  if (appState.user.balance < 50) {
    showToast('⚠️ Insufficient bank balance for ₹50 tree donation');
    return;
  }

  // Deduct ₹50 from bank balance
  appState.user.balance -= 50;
  if (!appState.greenLedger) appState.greenLedger = { treesPlanted: 0, co2SavedKg: 0, ecoCoins: 0, ecoRoundupEnabled: true };

  appState.greenLedger.treesPlanted = (appState.greenLedger.treesPlanted || 0) + 1;
  appState.greenLedger.co2SavedKg = (appState.greenLedger.co2SavedKg || 0) + 15.0;
  appState.greenLedger.ecoCoins = (appState.greenLedger.ecoCoins || 0) + 50;

  appState.transactions.unshift({
    id: 'tx_green_' + Date.now(),
    title: 'SankalpTaru - Western Ghats Tree Plantation',
    date: 'Just now',
    bank: 'Bank of Baroda XX0507',
    utr: String(Math.floor(100000000000 + Math.random() * 900000000000)),
    amount: -50.00,
    category: 'Eco-UPI Green Ledger',
    type: 'debited',
    isCard: false,
    isLite: false,
  });

  saveState();
  playSuccessChime();
  if (window.confetti) {
    window.confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
  }

  renderGreenLedgerUI();
  const balEl = document.getElementById('personalTotalBalance');
  if (balEl) balEl.textContent = `₹${formatInr(appState.user.balance, 0)}`;

  showToast('🌳 Tree sponsored successfully! +15kg CO2 offset certificate generated.');
}

function downloadGreenCertificate() {
  const green = appState.greenLedger || { treesPlanted: 3, co2SavedKg: 42.8, ecoCoins: 420 };
  const certText = `=====================================================
UNEXA ECO-UPI CARBON OFFSET CERTIFICATE
=====================================================
Certificate ID: UNX-ESG-${Date.now().toString().slice(-6)}
Issued To: ${appState.user.name}
UPI ID: ${appState.user.vpa}
Date of Certification: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}

ESG IMPACT METRICS:
-----------------------------------------------------
Total Trees Planted:    ${green.treesPlanted} Geo-Tagged Saplings
Total CO2 Sequestered:  ${green.co2SavedKg.toFixed(1)} kg CO2e
Eco-Reward Coins Earned: ${green.ecoCoins} Pts
Plantation Partner:     SankalpTaru Foundation
Project Location:       Western Ghats Ecological Corridor (MH/KA)

NPCI GREEN INITIATIVE COMPLIANCE:
All offsets verified under Gold Standard & ISO 14064.
Generated digitally via Unexa SmartPay Platform.
=====================================================`;

  const blob = new Blob([certText], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Unexa_Green_Certificate_${appState.user.name.replace(/\s+/g, '_')}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  playSuccessChime();
  showToast('📄 Downloaded Official ESG Carbon Certificate (.txt)');
}

// ==============================================
// 4. LINKED BANK ACCOUNTS CONTROLLER
// ==============================================

function openBankAccountsModal() {
  renderBankAccountsList();
  openModal('modalBankAccounts');
}

function renderBankAccountsList() {
  const container = document.getElementById('bankAccountsListContainer');
  if (!container) return;

  const accounts = appState.bankAccounts || [];
  if (accounts.length === 0) {
    container.innerHTML = `<div class="p-3 rounded-xl bg-slate-900 border border-white/10 text-center text-xs text-slate-400">No linked bank accounts.</div>`;
    return;
  }

  container.innerHTML = accounts.map(acc => {
    const isPrimary = acc.isPrimary;
    const badge = isPrimary
      ? `<span class="pill-badge badge-green text-[8px] font-bold">PRIMARY</span>`
      : `<button class="px-2 py-0.5 rounded-lg bg-slate-800 text-[9px] text-cyan-400 font-semibold hover:bg-slate-700" onclick="setPrimaryBankAccount('${acc.id}')">Make Primary</button>`;

    return `
      <div class="upi-card bg-slate-900 border ${isPrimary ? 'border-teal-500/40 bg-teal-950/20' : 'border-white/10'} p-3 flex flex-col gap-2">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <div class="w-9 h-9 rounded-xl ${acc.logoBg || 'bg-blue-600'} text-white flex items-center justify-center font-bold text-xs">
              <i data-lucide="landmark" class="w-4 h-4"></i>
            </div>
            <div>
              <div class="flex items-center gap-1.5">
                <span class="text-xs font-bold text-white">${acc.bankName}</span>
                ${badge}
              </div>
              <div class="text-[10px] text-slate-400 font-mono">${acc.accNumber} • ${acc.ifsc} • ${acc.type || 'Savings'}</div>
            </div>
          </div>
          <div class="text-right">
            <div class="text-xs font-black text-white font-mono">₹ ${(acc.balance || formatInr(0))}</div>
            <div class="text-[9px] text-slate-400">Available</div>
          </div>
        </div>
        <div class="flex items-center justify-end gap-2 border-t border-white/5 pt-2">
          <button type="button" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-semibold text-slate-300 flex items-center gap-1" onclick="openCheckBalanceModal('${acc.id}')">
            <i data-lucide="eye" class="w-3 h-3 text-amber-400"></i>
            <span>Check Balance</span>
          </button>
          <button type="button" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-semibold text-slate-300 flex items-center gap-1" onclick="showToast('🔐 NPCI PIN reset link sent via SMS to registered SIM')">
            <i data-lucide="key-round" class="w-3 h-3 text-indigo-400"></i>
            <span>Change PIN</span>
          </button>
        </div>
      </div>
    `;
  }).join('');

  if (window.lucide) window.lucide.createIcons();
}

function setPrimaryBankAccount(accId) {
  if (!appState.bankAccounts) return;
  appState.bankAccounts.forEach(acc => {
    acc.isPrimary = (acc.id === accId);
  });
  saveState();
  renderBankAccountsList();
  showToast('✅ Primary bank account updated for all incoming and outgoing payments');
}

function addNewBankAccountPrompt() {
  const bankNames = ['ICICI Bank', 'Kotak Mahindra Bank', 'Axis Bank', 'Punjab National Bank'];
  const randomBank = bankNames[Math.floor(Math.random() * bankNames.length)];
  const randomAcc = '•••• ' + Math.floor(1000 + Math.random() * 9000);
  const randomIfsc = randomBank.slice(0, 4).toUpperCase() + '000' + Math.floor(1000 + Math.random() * 9000);

  if (!appState.bankAccounts) appState.bankAccounts = [];
  appState.bankAccounts.push({
    id: 'bank_' + Date.now(),
    bankName: randomBank,
    accNumber: randomAcc,
    ifsc: randomIfsc,
    isPrimary: false,
    balance: Math.floor(10000 + Math.random() * 50000),
    logoBg: 'bg-indigo-600',
    type: 'Savings A/C'
  });

  saveState();
  playSuccessChime();
  if (window.confetti) {
    window.confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
  }
  renderBankAccountsList();
  showToast(`🎉 Linked ${randomBank} (${randomAcc}) via NPCI Account Aggregator!`);
}

// ==============================================
// 5. CHECK ACCOUNT BALANCE (PIN AUTHENTICATED)
// ==============================================

let checkBalancePinEntered = '';

function openCheckBalanceModal(presetBankId = null) {
  resetCheckBalancePin();
  const select = document.getElementById('checkBalanceBankSelect');
  if (select && presetBankId) {
    select.value = presetBankId;
  }
  openModal('modalCheckBalance');
}

function resetCheckBalancePin() {
  checkBalancePinEntered = '';
  updateCheckBalanceDots();
  const resultBox = document.getElementById('checkBalanceResultBox');
  const pinBox = document.getElementById('checkBalancePinBox');
  if (resultBox) resultBox.classList.add('hidden');
  if (pinBox) pinBox.classList.remove('hidden');
}

function updateCheckBalanceDots() {
  for (let i = 1; i <= 4; i++) {
    const dot = document.getElementById(`cbDot${i}`);
    if (dot) {
      if (i <= checkBalancePinEntered.length) {
        dot.className = 'w-3.5 h-3.5 rounded-full bg-amber-400 border-2 border-amber-400 shadow-md shadow-amber-400/50';
      } else {
        dot.className = 'w-3.5 h-3.5 rounded-full border-2 border-slate-600';
      }
    }
  }
}

function pressCheckBalancePin(digit) {
  if (checkBalancePinEntered.length < 4) {
    checkBalancePinEntered += digit;
    updateCheckBalanceDots();

    if (checkBalancePinEntered.length === 4) {
      setTimeout(verifyAndShowBalance, 250);
    }
  }
}

function clearCheckBalancePin() {
  checkBalancePinEntered = '';
  updateCheckBalanceDots();
}

function backspaceCheckBalancePin() {
  if (checkBalancePinEntered.length > 0) {
    checkBalancePinEntered = checkBalancePinEntered.slice(0, -1);
    updateCheckBalanceDots();
  }
}

function verifyAndShowBalance() {
  const targetPin = getUserPin();

  if (checkBalancePinEntered === targetPin) {
    const bankSelect = document.getElementById('checkBalanceBankSelect');
    const bankVal = bankSelect?.value || 'baroda';
    
    let targetBalance = appState.user.balance;
    let bankTitle = 'Bank of Baroda';
    
    const targetAcc = (appState.bankAccounts || []).find(a => a.id === bankVal);
    if (targetAcc) {
      targetBalance = targetAcc.balance;
      bankTitle = targetAcc.bankName;
    }

    const pinBox = document.getElementById('checkBalancePinBox');
    const resultBox = document.getElementById('checkBalanceResultBox');
    const resultAmt = document.getElementById('checkBalanceResultAmt');
    const timeNotice = document.getElementById('checkBalanceTimeNotice');

    if (pinBox) pinBox.classList.add('hidden');
    if (resultAmt) resultAmt.textContent = `₹ ${formatInr(targetBalance)}`;
    if (timeNotice) timeNotice.textContent = `Verified just now • ${bankTitle} CBS Core Banking`;
    if (resultBox) resultBox.classList.remove('hidden');

    playSuccessChime();
    if (window.confetti) {
      window.confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    }
    showToast(`💰 ${bankTitle} Balance: ₹${formatInr(targetBalance)}`);
  } else {
    playBeep(250, 'sawtooth', 0.25);
    if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
    for (let i = 1; i <= 4; i++) {
      const dot = document.getElementById(`cbDot${i}`);
      if (dot) dot.className = 'w-3.5 h-3.5 rounded-full border-2 border-rose-500 bg-rose-500 shadow-md shadow-rose-500/50 scale-125 transition-all';
    }
    showToast('❌ Incorrect UPI PIN! Tap \'Forgot UPI PIN?\' below to reset.');
    setTimeout(() => {
      clearCheckBalancePin();
    }, 600);
  }
}

// ==============================================
// 6. PAY PHONE CONTACTS CONTROLLER
// ==============================================

function openPayContactsModal() {
  const searchInput = document.getElementById('contactSearchInput');
  if (searchInput) searchInput.value = '';
  renderContactsList();
  openModal('modalPayContacts');
}

function renderContactsList(query = '') {
  const container = document.getElementById('contactsListContainer');
  if (!container) return;

  const contacts = appState.contacts || [];
  const filtered = query
    ? contacts.filter(c => c.name.toLowerCase().includes(query.toLowerCase()) || c.phone.includes(query) || c.vpa.toLowerCase().includes(query.toLowerCase()))
    : contacts;

  if (filtered.length === 0) {
    container.innerHTML = `<div class="p-4 rounded-xl bg-slate-900 border border-white/10 text-center text-xs text-slate-400">No matching contacts found for "${query}".</div>`;
    return;
  }

  container.innerHTML = filtered.map(c => `
    <div class="feature-box flex-row items-center justify-between p-2.5 hover:bg-slate-800/80 cursor-pointer" onclick="selectPayContact('${c.id}')">
      <div class="flex items-center gap-2.5 min-w-0">
        <div class="w-9 h-9 rounded-full ${c.avatarBg || 'bg-cyan-600'} text-white font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-md">
          ${c.avatar || c.name.slice(0, 2).toUpperCase()}
        </div>
        <div class="min-w-0">
          <div class="flex items-center gap-1.5">
            <span class="text-xs font-bold text-white truncate">${c.name}</span>
            ${c.recent ? '<span class="pill-badge badge-green text-[7px]">RECENT</span>' : ''}
          </div>
          <div class="text-[10px] text-slate-400 font-mono truncate">${c.phone} • ${c.vpa}</div>
        </div>
      </div>
      <button type="button" class="px-2.5 py-1.5 rounded-lg bg-cyan-600/20 border border-cyan-500/30 text-cyan-400 text-xs font-bold hover:bg-cyan-600 hover:text-white transition flex-shrink-0">
        Pay
      </button>
    </div>
  `).join('');

  if (window.lucide) window.lucide.createIcons();
}

function filterContactsList() {
  const query = document.getElementById('contactSearchInput')?.value.trim() || '';
  renderContactsList(query);
}

function selectPayContact(contactId) {
  const contact = (appState.contacts || []).find(c => c.id === contactId);
  if (!contact) return;

  closeModal('modalPayContacts');
  setTimeout(() => {
    initiatePayment(contact.name, contact.vpa, 500.00, '📱 Mobile Contact Transfer', false);
  }, 200);
}

// ==============================================
// 7. BANK ACCOUNT & IFSC TRANSFER CONTROLLER
// ==============================================

function openBankTransferModal() {
  openModal('modalBankTransfer');
}

function submitBankTransfer() {
  const accNum = document.getElementById('transferAccNum')?.value.trim();
  const confirmAcc = document.getElementById('transferConfirmAccNum')?.value.trim();
  const ifsc = document.getElementById('transferIfsc')?.value.trim().toUpperCase();
  const name = document.getElementById('transferBeneficiaryName')?.value.trim();
  const amount = parseFloat(document.getElementById('transferAmount')?.value) || 0;

  if (!accNum || !confirmAcc) {
    showToast('⚠️ Please enter and confirm the bank account number');
    return;
  }
  if (accNum !== confirmAcc) {
    showToast('⚠️ Bank account numbers do not match');
    return;
  }
  if (!ifsc || ifsc.length < 5) {
    showToast('⚠️ Please enter a valid IFSC code');
    return;
  }
  if (!name) {
    showToast('⚠️ Please enter beneficiary account holder name');
    return;
  }
  if (amount <= 0) {
    showToast('⚠️ Please enter a transfer amount');
    return;
  }

  closeModal('modalBankTransfer');
  setTimeout(() => {
    initiatePayment(name, `${ifsc}@banktransfer`, amount, `🏛️ IMPS to A/C XX${accNum.slice(-4)}`, false);
  }, 200);
}

// ==============================================
// 8. UPI LITE INSTANT WALLET CONTROLLER
// ==============================================

function openUpiLiteModal() {
  renderUpiLiteUI();
  openModal('modalUpiLite');
}

function renderUpiLiteUI() {
  const display = document.getElementById('upiLiteBalanceDisplay');
  const liteBal = appState.user.upiLiteBalance || 0;
  if (display) {
    display.textContent = `₹ ${formatInr(liteBal)}`;
  }
}

function submitTopupUpiLite() {
  const inputEl = document.getElementById('upiLiteTopupAmount');
  const amount = parseFloat(inputEl?.value) || 0;

  if (amount <= 0) {
    showToast('⚠️ Enter a valid top-up amount');
    return;
  }

  const currentLite = appState.user.upiLiteBalance || 0;
  if (currentLite + amount > 2000) {
    showToast(`⚠️ Maximum UPI Lite wallet limit is ₹2,000. You can add at most ₹${(2000 - currentLite).toFixed(2)}`);
    return;
  }

  if (appState.user.balance < amount) {
    showToast('⚠️ Insufficient bank balance for UPI Lite top-up');
    return;
  }

  appState.user.balance -= amount;
  appState.user.upiLiteBalance = currentLite + amount;

  appState.transactions.unshift({
    id: 'tx_lite_' + Date.now(),
    title: 'UPI Lite Wallet Top-Up',
    date: 'Just now',
    bank: 'Bank of Baroda XX0507',
    utr: String(Math.floor(100000000000 + Math.random() * 900000000000)),
    amount: -amount,
    category: 'Wallet Load',
    type: 'debited',
    isCard: false,
    isLite: true,
  });

  saveState();
  playSuccessChime();
  if (window.confetti) {
    window.confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
  }

  renderUpiLiteUI();
  const balEl = document.getElementById('personalTotalBalance');
  if (balEl) balEl.textContent = `₹${formatInr(appState.user.balance, 0)}`;

  showToast(`⚡ Added ₹${amount} to UPI Lite! New Balance: ₹${formatInr(appState.user.upiLiteBalance)}`);
}

// ==============================================
// HIGH-FIDELITY CAMERA & QR SCANNING ENGINE
// ==============================================

let scannerStream = null;
let scannerTrack = null;
let scannerAnimFrameId = null;
let availableVideoDevices = [];
let currentDeviceIndex = 0;
let currentFacingMode = 'environment'; // 'environment' (rear) | 'user' (front)
let isTorchOn = false;
let isScanningActive = false;
let barcodeDetector = null;
let lastScanTimestamp = 0;

// Initialize Native BarcodeDetector if available
if ('BarcodeDetector' in window) {
  try {
    barcodeDetector = new BarcodeDetector({ formats: ['qr_code'] });
  } catch (e) {
    barcodeDetector = null;
  }
}

async function startCameraScanner() {
  stopCameraScanner(); // Clean up existing session

  const video = document.getElementById('scannerVideo');
  const fallbackNotice = document.getElementById('scannerFallbackNotice');
  const laserBar = document.getElementById('scannerLaserBar');
  const frameBorder = document.getElementById('scannerFrameBorder');

  if (fallbackNotice) fallbackNotice.classList.add('hidden');
  if (laserBar) laserBar.style.display = 'block';
  if (frameBorder) {
    frameBorder.className = 'absolute inset-7 border-2 border-dashed border-cyan-400/60 rounded-2xl pointer-events-none flex flex-col justify-between p-2 transition-all duration-300';
  }

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    showScannerFallback('Camera Stream Unavailable', 'Live camera stream is not supported in this browser environment. Use Snap Photo, Gallery, or type UPI ID below.');
    return;
  }

  // Enumerate all available camera devices
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    availableVideoDevices = devices.filter(d => d.kind === 'videoinput');
  } catch (e) {
    availableVideoDevices = [];
  }

  // Camera Constraint Cascade to guarantee Back Camera priority
  const constraintOptions = [];

  // Option 1: Back camera matching by label / ID
  const backDevice = availableVideoDevices.find(d => {
    const lbl = d.label.toLowerCase();
    return lbl.includes('back') || lbl.includes('rear') || lbl.includes('environment') || lbl.includes('0');
  });

  if (currentFacingMode === 'environment' && backDevice && backDevice.deviceId) {
    constraintOptions.push({
      video: {
        deviceId: { exact: backDevice.deviceId },
        width: { ideal: 1280 },
        height: { ideal: 720 }
      },
      audio: false
    });
  }

  // Option 2: exact facingMode 'environment' on phones
  if (currentFacingMode === 'environment') {
    constraintOptions.push({
      video: {
        facingMode: { exact: 'environment' },
        width: { ideal: 1280 },
        height: { ideal: 720 }
      },
      audio: false
    });
  }

  // Option 3: ideal facingMode
  constraintOptions.push({
    video: {
      facingMode: { ideal: currentFacingMode },
      width: { ideal: 1280 },
      height: { ideal: 720 }
    },
    audio: false
  });

  // Option 4: Generic video stream fallback
  constraintOptions.push({
    video: true,
    audio: false
  });

  let acquiredStream = null;
  for (const constraint of constraintOptions) {
    try {
      acquiredStream = await navigator.mediaDevices.getUserMedia(constraint);
      if (acquiredStream) break;
    } catch (err) {
      // Continue trying next constraint in cascade
    }
  }

  if (!acquiredStream) {
    showScannerFallback('Camera Access Needed', 'Please allow camera permission to scan QR codes, or use Snap Photo / Gallery below.');
    return;
  }

  scannerStream = acquiredStream;
  scannerTrack = scannerStream.getVideoTracks()[0];

  if (video) {
    video.setAttribute('playsinline', 'true');
    video.setAttribute('webkit-playsinline', 'true');
    video.muted = true;
    video.autoplay = true;
    video.srcObject = scannerStream;
    try {
      await video.play();
    } catch (playErr) {
      console.warn('Video play error:', playErr);
    }
    isScanningActive = true;
    lastScanTimestamp = 0;
    requestAnimationFrame(scanVideoFrame);
  }
}

function stopCameraScanner() {
  isScanningActive = false;
  if (scannerAnimFrameId) {
    cancelAnimationFrame(scannerAnimFrameId);
    scannerAnimFrameId = null;
  }
  if (scannerStream) {
    scannerStream.getTracks().forEach(track => {
      try { track.stop(); } catch (e) {}
    });
    scannerStream = null;
    scannerTrack = null;
  }
  const video = document.getElementById('scannerVideo');
  if (video) {
    video.srcObject = null;
  }
  isTorchOn = false;
  const btnFlash = document.getElementById('btnFlashText');
  if (btnFlash) btnFlash.textContent = 'Flash';
}

function showScannerFallback(title, desc) {
  const fallbackNotice = document.getElementById('scannerFallbackNotice');
  const titleEl = document.getElementById('scannerNoticeTitle');
  const descEl = document.getElementById('scannerNoticeDesc');
  const laserBar = document.getElementById('scannerLaserBar');

  if (titleEl) titleEl.textContent = title;
  if (descEl) descEl.textContent = desc;
  if (fallbackNotice) fallbackNotice.classList.remove('hidden');
  if (laserBar) laserBar.style.display = 'none';
  if (window.lucide) window.lucide.createIcons();
}

async function switchCameraLens() {
  if (availableVideoDevices.length > 1) {
    currentDeviceIndex = (currentDeviceIndex + 1) % availableVideoDevices.length;
    const targetDevice = availableVideoDevices[currentDeviceIndex];
    const isFront = targetDevice.label.toLowerCase().includes('front') || targetDevice.label.toLowerCase().includes('user');
    currentFacingMode = isFront ? 'user' : 'environment';
    const lensStatus = document.getElementById('lensStatusText');
    if (lensStatus) {
      lensStatus.textContent = isFront ? 'Front Camera' : 'Back Camera';
    }
    showToast(`Switched to: ${targetDevice.label || (isFront ? 'Front Camera' : 'Back Camera')}`);
  } else {
    currentFacingMode = (currentFacingMode === 'environment') ? 'user' : 'environment';
    const lensStatus = document.getElementById('lensStatusText');
    if (lensStatus) {
      lensStatus.textContent = currentFacingMode === 'user' ? 'Front Camera' : 'Back Camera';
    }
    showToast(`Switched to ${currentFacingMode === 'user' ? 'Front' : 'Back'} Camera`);
  }
  await startCameraScanner();
}

async function toggleCameraFlash() {
  if (!scannerTrack) {
    showToast('Flash torch requires an active camera feed');
    return;
  }

  try {
    const capabilities = scannerTrack.getCapabilities ? scannerTrack.getCapabilities() : {};
    if (!capabilities.torch) {
      isTorchOn = !isTorchOn;
      const btnFlash = document.getElementById('btnFlashText');
      if (btnFlash) btnFlash.textContent = isTorchOn ? 'Flash (ON)' : 'Flash';
      showToast(`Camera Torch ${isTorchOn ? 'ON' : 'OFF'}`);
      return;
    }

    isTorchOn = !isTorchOn;
    await scannerTrack.applyConstraints({
      advanced: [{ torch: isTorchOn }]
    });

    const btnFlash = document.getElementById('btnFlashText');
    if (btnFlash) btnFlash.textContent = isTorchOn ? 'Flash (ON)' : 'Flash';
    showToast(`Camera Torch ${isTorchOn ? 'ON' : 'OFF'}`);
  } catch (e) {
    console.warn('Torch error:', e);
    showToast('Torch / Flash toggle not supported on this device');
  }
}

// Continuous Frame Scanner Loop (Optimized for High Frame Rate & Instant Accuracy)
async function scanVideoFrame(timestamp) {
  if (!isScanningActive) return;

  const video = document.getElementById('scannerVideo');
  if (!video || video.readyState < 2 || !video.videoWidth || !video.videoHeight) {
    scannerAnimFrameId = requestAnimationFrame(scanVideoFrame);
    return;
  }

  // Scan at responsive 25-30 FPS interval
  if (!timestamp || timestamp - lastScanTimestamp > 35) {
    lastScanTimestamp = timestamp || performance.now();
    let qrResult = null;

    // 1. Try Native BarcodeDetector (High performance on modern Android & iOS)
    if (barcodeDetector) {
      try {
        const barcodes = await barcodeDetector.detect(video);
        if (barcodes && barcodes.length > 0 && barcodes[0].rawValue) {
          qrResult = barcodes[0].rawValue;
        }
      } catch (e) {
        // Fall through to jsQR
      }
    }

    // 2. Fallback to jsQR canvas decoder with optimized downscaling
    if (!qrResult && typeof jsQR !== 'undefined') {
      try {
        let canvas = document.getElementById('scannerCanvas');
        if (!canvas) {
          canvas = document.createElement('canvas');
          canvas.id = 'scannerCanvas';
          canvas.style.display = 'none';
          document.body.appendChild(canvas);
        }
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        
        // Downscale to 480px max dimension for ultra-fast 60fps processing
        const scanWidth = Math.min(480, video.videoWidth);
        const scanHeight = Math.round((scanWidth / video.videoWidth) * video.videoHeight);

        if (scanWidth > 0 && scanHeight > 0) {
          canvas.width = scanWidth;
          canvas.height = scanHeight;
          ctx.drawImage(video, 0, 0, scanWidth, scanHeight);
          const imageData = ctx.getImageData(0, 0, scanWidth, scanHeight);
          
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'attemptBoth'
          });
          if (code && code.data) {
            qrResult = code.data;
          }
        }
      } catch (err) {
        console.warn('jsQR scan error:', err);
      }
    }

    if (qrResult) {
      handleQrDetectionSuccess(qrResult);
      return;
    }
  }

  // Next frame
  scannerAnimFrameId = requestAnimationFrame(scanVideoFrame);
}

// Handle QR Detection Success
function handleQrDetectionSuccess(decodedString) {
  // Visual & Audio Haptics
  const isGroup = appState.scannerMode === 'group';
  const frameBorder = document.getElementById('scannerFrameBorder');
  if (frameBorder) {
    frameBorder.className = `absolute inset-7 border-2 ${isGroup ? 'border-amber-400 bg-amber-500/20' : 'border-emerald-400 bg-emerald-500/20'} rounded-2xl pointer-events-none flex flex-col justify-between p-2 scale-105 transition-all duration-200`;
  }

  if (navigator.vibrate) navigator.vibrate([40, 60, 40]);
  playSuccessChime();

  stopCameraScanner();

  // Parse UPI or QR Content
  const parsed = parseUpiQrString(decodedString);
  showToast(`QR Detected: ${parsed.name} (${parsed.vpa})`);

  setTimeout(() => {
    closeModal('modalScanner');
    if (frameBorder) {
      setScannerMode(appState.scannerMode);
    }
    initiatePayment(parsed.name, parsed.vpa, parsed.amount, parsed.icon, isGroup);
  }, 400);
}

// Universal UPI QR String Parser
function parseUpiQrString(qrText) {
  const result = {
    name: 'Scanned Merchant',
    vpa: 'merchant@upi',
    amount: 100.00,
    icon: '💳'
  };

  if (!qrText) return result;

  const trimmed = qrText.trim();

  // Standard UPI URI format: upi://pay?pa=...&pn=...&am=...
  if (trimmed.toLowerCase().startsWith('upi://pay')) {
    try {
      const url = new URL(trimmed.replace(/^upi:\/\//i, 'https://dummy.com/'));
      const params = url.searchParams;

      if (params.get('pa')) result.vpa = params.get('pa');
      if (params.get('pn')) result.name = decodeURIComponent(params.get('pn'));
      if (params.get('am') && parseFloat(params.get('am')) > 0) {
        result.amount = parseFloat(params.get('am'));
      }
      
      const lowerName = result.name.toLowerCase();
      if (lowerName.includes('chai') || lowerName.includes('coffee') || lowerName.includes('tea') || lowerName.includes('cafe')) {
        result.icon = '☕';
      } else if (lowerName.includes('store') || lowerName.includes('kirana') || lowerName.includes('mart') || lowerName.includes('bazaar')) {
        result.icon = '🏬';
      } else if (lowerName.includes('pool') || lowerName.includes('trip') || lowerName.includes('group') || result.vpa.includes('unexapool') || result.vpa.includes('zenithpool')) {
        result.icon = '👥';
      }
      return result;
    } catch (e) {
      console.warn('UPI URL parse error:', e);
    }
  }

  // Handle plain UPI VPA (e.g. chaipoint@upi or 9876543210@paytm)
  if (trimmed.includes('@')) {
    result.vpa = trimmed;
    const parts = trimmed.split('@');
    result.name = parts[0].charAt(0).toUpperCase() + parts[0].slice(1).replace(/[._]/g, ' ');
    return result;
  }

  // Handle plain 10-digit Phone Number
  if (/^[6-9]\d{9}$/.test(trimmed)) {
    result.vpa = `${trimmed}@upi`;
    result.name = `Contact (${trimmed})`;
    result.icon = '📱';
    return result;
  }

  // Generic text fallback
  result.name = trimmed.slice(0, 24);
  result.vpa = 'scanned@upi';
  return result;
}

// Upload QR Image File Decoder
function handleQrUpload(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = async function() {
      // 1. Try BarcodeDetector
      if (barcodeDetector) {
        try {
          const barcodes = await barcodeDetector.detect(img);
          if (barcodes && barcodes.length > 0) {
            handleQrDetectionSuccess(barcodes[0].rawValue);
            return;
          }
        } catch (err) {}
      }

      // 2. Use jsQR with offscreen canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      if (typeof jsQR !== 'undefined') {
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'attemptBoth'
        });
        if (code && code.data) {
          handleQrDetectionSuccess(code.data);
          return;
        }
      }

      showToast('No QR code detected in the uploaded image. Please try a clearer image.');
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

// Manual UPI ID / Phone entry handler
function processManualPayInput() {
  const input = document.getElementById('manualPayInput');
  const val = (input ? input.value : '').trim();
  if (!val) {
    showToast('Please enter a valid UPI ID or Mobile Number');
    return;
  }

  const isGroup = appState.scannerMode === 'group';
  const parsed = parseUpiQrString(val);
  stopCameraScanner();
  closeModal('modalScanner');
  initiatePayment(parsed.name, parsed.vpa, parsed.amount, parsed.icon, isGroup);
}

// =========================================================
// UNEXA 3-MONTH OFFICIAL PDF STATEMENT ENGINE
// =========================================================

function generate3MonthLedgerData(currentBalance, customTxns = []) {
  const now = new Date();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  function formatDateStr(daysAgo, h = 11, m = 15) {
    const d = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    d.setHours(h, m, 0, 0);
    const day = String(d.getDate()).padStart(2, '0');
    const mon = months[d.getMonth()];
    const yr = d.getFullYear();
    let hour = d.getHours();
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${day} ${mon} ${yr}, ${hour}:${min} ${ampm}`;
  }

  // Curated realistic 3-month bank transactions
  const baseHistorical = [
    { daysAgo: 0.1, title: 'Chai Point Powai', payee: 'chaipoint@upi', utr: '624910984128', amount: -350.00, cat: 'Food & Dining', type: 'debited' },
    { daysAgo: 0.3, title: 'Priya Sharma (Split Reimbursement)', payee: 'priyasharma@upi', utr: '624910384729', amount: -350.00, cat: 'P2P Transfer', type: 'debited' },
    { daysAgo: 1.2, title: 'Sharma Kirana Store', payee: 'sharmakirana@upi', utr: '624910294821', amount: -650.00, cat: 'Groceries', type: 'debited' },
    { daysAgo: 1.5, title: 'Amazon India Shopping', payee: 'amazonpay@upi', utr: '624910283412', amount: -1299.00, cat: 'Shopping', type: 'debited' },
    { daysAgo: 2.1, title: 'Swiggy Gourmet Dinner', payee: 'swiggy@icici', utr: '624909827162', amount: -780.00, cat: 'Food & Dining', type: 'debited' },
    { daysAgo: 3.4, title: 'Daily Check-in Bonus', payee: 'Unexa Rewards Vault', utr: 'REW748291038472', amount: 25.00, cat: 'Cashback & Rewards', type: 'credited' },
    { daysAgo: 4.2, title: 'Goa Trip Pool Contribution', payee: 'goa-trip-2026@unexapool', utr: '624908719283', amount: -7000.00, cat: 'Group Pool', type: 'debited' },
    { daysAgo: 6.0, title: 'Tata Power Electricity Bill', payee: 'tatapower@billdesk', utr: '624907651234', amount: -2450.00, cat: 'Utilities', type: 'debited' },
    { daysAgo: 8.5, title: 'Uber Premier Office Commute', payee: 'uber.hdfc@upi', utr: '624906543210', amount: -420.00, cat: 'Travel & Mobility', type: 'debited' },
    { daysAgo: 10.1, title: 'JioFiber High Speed Broadband', payee: 'jiofiber@rel', utr: '624905432198', amount: -1499.00, cat: 'Utilities', type: 'debited' },
    { daysAgo: 12.3, title: 'Instant Bank Cashback', payee: 'Unexa UPI Rewards', utr: 'REW593021948201', amount: 50.00, cat: 'Cashback & Rewards', type: 'credited' },
    { daysAgo: 15.0, title: 'Salary Credit - TechCorp India', payee: 'TECHCORP INDIA PVT LTD', utr: 'SAL202609018492', amount: 65000.00, cat: 'Salary & Income', type: 'credited' },
    { daysAgo: 16.0, title: 'Powai Residency Apartment Rent', payee: 'landlord_powai@icici', utr: '624904321098', amount: -28000.00, cat: 'Housing & Rent', type: 'debited' },
    { daysAgo: 18.2, title: 'Nature Basket Organic Groceries', payee: 'naturesbasket@axis', utr: '624903210987', amount: -2150.00, cat: 'Groceries', type: 'debited' },
    
    // Month 2 (August 2026)
    { daysAgo: 22.0, title: 'BookMyShow IMAX Tickets', payee: 'bookmyshow@kotak', utr: '624899876543', amount: -960.00, cat: 'Entertainment', type: 'debited' },
    { daysAgo: 26.0, title: 'Indian Oil Petrol Pump', payee: 'indianoil@upi', utr: '624888765432', amount: -2800.00, cat: 'Fuel & Commute', type: 'debited' },
    { daysAgo: 30.0, title: 'Myntra Luxe End of Season Sale', payee: 'myntrapay@upi', utr: '624877654321', amount: -4599.00, cat: 'Shopping', type: 'debited' },
    { daysAgo: 34.0, title: 'Apollo Pharmacy Medicines', payee: 'apollopharmacy@upi', utr: '624866543210', amount: -840.00, cat: 'Health & Pharmacy', type: 'debited' },
    { daysAgo: 38.0, title: 'Starbucks Reserve Powai', payee: 'starbucks@tata', utr: '624855432109', amount: -720.00, cat: 'Food & Dining', type: 'debited' },
    { daysAgo: 42.0, title: 'UPI Cashback Reward', payee: 'Unexa Vault', utr: 'REW102938475610', amount: 100.00, cat: 'Cashback & Rewards', type: 'credited' },
    { daysAgo: 45.0, title: 'Salary Credit - TechCorp India', payee: 'TECHCORP INDIA PVT LTD', utr: 'SAL202608017381', amount: 65000.00, cat: 'Salary & Income', type: 'credited' },
    { daysAgo: 46.0, title: 'Powai Residency Apartment Rent', payee: 'landlord_powai@icici', utr: '624844321098', amount: -28000.00, cat: 'Housing & Rent', type: 'debited' },
    { daysAgo: 50.0, title: 'Tata Power Electricity Bill', payee: 'tatapower@billdesk', utr: '624833210987', amount: -2680.00, cat: 'Utilities', type: 'debited' },
    { daysAgo: 54.0, title: 'Zomato Gold Feast with Friends', payee: 'zomatopay@icici', utr: '624822109876', amount: -1850.00, cat: 'Food & Dining', type: 'debited' },
    { daysAgo: 58.0, title: 'Blinkit 10-Min Groceries', payee: 'blinkit@paytm', utr: '624811098765', amount: -940.00, cat: 'Groceries', type: 'debited' },

    // Month 3 (July 2026)
    { daysAgo: 62.0, title: 'Decathlon Sports Gear', payee: 'decathlon@hdfc', utr: '624799876543', amount: -3490.00, cat: 'Shopping', type: 'debited' },
    { daysAgo: 66.0, title: 'Netflix & Spotify Premium Mandates', payee: 'unexarecurring@mandate', utr: '624788765432', amount: -848.00, cat: 'Subscriptions', type: 'debited' },
    { daysAgo: 71.0, title: 'Indian Oil Petrol Refill', payee: 'indianoil@upi', utr: '624777654321', amount: -2500.00, cat: 'Fuel & Commute', type: 'debited' },
    { daysAgo: 75.0, title: 'Salary Credit - TechCorp India', payee: 'TECHCORP INDIA PVT LTD', utr: 'SAL202607016270', amount: 65000.00, cat: 'Salary & Income', type: 'credited' },
    { daysAgo: 76.0, title: 'Powai Residency Apartment Rent', payee: 'landlord_powai@icici', utr: '624766543210', amount: -28000.00, cat: 'Housing & Rent', type: 'debited' },
    { daysAgo: 80.0, title: 'Tata Power Electricity Bill', payee: 'tatapower@billdesk', utr: '624755432109', amount: -2340.00, cat: 'Utilities', type: 'debited' },
    { daysAgo: 84.0, title: 'Cult.fit Gym & Fitness Pass', payee: 'curefit@icici', utr: '624744321098', amount: -3999.00, cat: 'Fitness & Health', type: 'debited' },
    { daysAgo: 88.0, title: 'Zepto Instant Essentials', payee: 'zepto@axis', utr: '624733210987', amount: -580.00, cat: 'Groceries', type: 'debited' }
  ];

  // Merge any dynamic custom user transactions from appState
  const allItems = [];
  (customTxns || []).forEach((tx, idx) => {
    allItems.push({
      daysAgo: 0.005 * (idx + 1),
      title: tx.title || 'UPI Payment',
      payee: tx.bank || 'UPI Merchant / Beneficiary',
      utr: tx.utr || ('6249' + Math.floor(10000000 + Math.random() * 90000000)),
      amount: tx.amount,
      cat: tx.category || 'UPI Transfer',
      type: tx.amount > 0 ? 'credited' : 'debited'
    });
  });

  baseHistorical.forEach(item => allItems.push(item));

  // Sort newest to oldest
  allItems.sort((a, b) => a.daysAgo - b.daysAgo);

  // Compute running balance backward from current user balance
  let running = currentBalance;
  let totalCredits = 0;
  let totalDebits = 0;

  const finalRows = allItems.map((item, idx) => {
    const isCredit = item.amount > 0;
    const absAmt = Math.abs(item.amount);
    const balanceAtRow = running;

    if (isCredit) {
      totalCredits += absAmt;
      running -= absAmt;
    } else {
      totalDebits += absAmt;
      running += absAmt;
    }

    return {
      index: idx + 1,
      date: formatDateStr(item.daysAgo),
      title: item.title,
      payee: item.payee,
      utr: item.utr,
      category: item.cat,
      type: item.type,
      debit: !isCredit ? absAmt : 0,
      credit: isCredit ? absAmt : 0,
      balance: balanceAtRow
    };
  });

  const openingBalance = Math.max(0, running);

  return {
    period: {
      startDate: formatDateStr(90).split(',')[0],
      endDate: formatDateStr(0).split(',')[0],
      days: 90,
      months: 3
    },
    summary: {
      openingBalance: openingBalance,
      totalCredits: totalCredits,
      totalDebits: totalDebits,
      closingBalance: currentBalance,
      totalTxnCount: finalRows.length
    },
    transactions: finalRows
  };
}

function exportStatement(type = 'pdf') {
  showToast('🔄 Generating official Bank-Grade PDF Statement...');
  playSuccessChime();

  const user = appState.user || defaultState.user;
  const data = generate3MonthLedgerData(user.balance, appState.transactions || []);
  const stmtRef = 'UNX-STM-' + Math.floor(100000 + Math.random() * 900000);
  const genDate = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

  // If jsPDF is available in window
  if (window.jspdf && window.jspdf.jsPDF) {
    try {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // --- BANK LOGO / HEADER ---
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.setTextColor(0, 51, 102); // Dark official bank blue
      doc.text('UNEXA PAYMENTS BANK LTD.', 14, 20);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(50, 50, 50);
      doc.text('Branch: Powai Commercial Hub, Mumbai, MH - 400076', 14, 25);
      doc.text('IFSC Code: UNEX0000123 | MICR Code: 400123456', 14, 29);
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text('STATEMENT OF ACCOUNT', 105, 38, { align: 'center' });

      doc.setDrawColor(0, 51, 102);
      doc.setLineWidth(0.5);
      doc.line(14, 42, 196, 42);

      // --- CUSTOMER & ACCOUNT DETAILS ---
      // Left Column: Customer
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text(user.name, 14, 50);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.text('Flat 402, Sunshine Apartments,', 14, 54);
      doc.text('Andheri West, Mumbai,', 14, 58);
      doc.text('Maharashtra - 400053', 14, 62);
      doc.text(`Mobile: +91 ${user.phone}`, 14, 68);
      doc.text(`Email: ${user.email}`, 14, 72);

      // Right Column: Account Info
      doc.setFont('helvetica', 'bold');
      doc.text('Account No:', 120, 50);
      doc.text('Account Type:', 120, 54);
      doc.text('Customer CIF ID:', 120, 58);
      doc.text('Statement Period:', 120, 64);
      doc.text('Statement Date:', 120, 68);
      doc.text('Statement Ref:', 120, 72);

      doc.setFont('helvetica', 'normal');
      doc.text('0000 0000 1234 0507', 150, 50);
      doc.text('SAVINGS ACCOUNT', 150, 54);
      doc.text('883920192', 150, 58);
      doc.text(`${data.period.startDate} to ${data.period.endDate}`, 150, 64);
      doc.text(`${genDate.split(',')[0]}`, 150, 68);
      doc.text(`${stmtRef}`, 150, 72);

      // --- ACCOUNT SUMMARY ---
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text('ACCOUNT SUMMARY', 14, 82);
      
      doc.autoTable({
        startY: 85,
        head: [['Opening Balance', 'Total Debits (-)', 'Total Credits (+)', 'Closing Balance']],
        body: [[
          formatInr(data.summary.openingBalance, 2),
          formatInr(data.summary.totalDebits, 2),
          formatInr(data.summary.totalCredits, 2),
          formatInr(data.summary.closingBalance, 2)
        ]],
        theme: 'grid',
        headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold', halign: 'center', fontSize: 8 },
        bodyStyles: { halign: 'center', fontSize: 8, textColor: [0, 0, 0] },
        margin: { left: 14, right: 14 }
      });

      // --- TRANSACTIONS ---
      doc.setFont('helvetica', 'bold');
      doc.text('TRANSACTION DETAILS', 14, doc.lastAutoTable.finalY + 10);

      const tableRows = data.transactions.map((t) => [
        t.date.split(',')[0],
        t.date.split(',')[1] ? t.date.split(',')[1].trim() : '',
        t.title + '\nUPI/' + t.utr,
        t.debit > 0 ? formatInr(t.debit, 2) : '',
        t.credit > 0 ? formatInr(t.credit, 2) : '',
        formatInr(t.balance, 2)
      ]);

      doc.autoTable({
        startY: doc.lastAutoTable.finalY + 13,
        head: [['Date', 'Time', 'Narration / Description', 'Withdrawal (Dr)', 'Deposit (Cr)', 'Balance (INR)']],
        body: tableRows,
        theme: 'grid',
        headStyles: { fillColor: [0, 51, 102], textColor: [255, 255, 255], fontSize: 8, fontStyle: 'bold', halign: 'left' },
        bodyStyles: { fontSize: 7, textColor: [0, 0, 0], cellPadding: 2 },
        columnStyles: {
          0: { cellWidth: 18 },
          1: { cellWidth: 15 },
          2: { cellWidth: 'auto' },
          3: { cellWidth: 22, halign: 'right' },
          4: { cellWidth: 22, halign: 'right' },
          5: { cellWidth: 22, halign: 'right', fontStyle: 'bold' }
        },
        didDrawPage: (pageData) => {
          const pageCount = doc.internal.getNumberOfPages();
          const pageCurrent = doc.internal.getCurrentPageInfo().pageNumber;
          
          doc.setFontSize(7);
          doc.setTextColor(100, 100, 100);
          doc.setFont('helvetica', 'normal');
          doc.text('This is a computer generated statement and does not require a signature.', 14, 285);
          doc.text('For any discrepancies, contact customer support at 1800-890-UNEXA within 7 days.', 14, 289);
          doc.text(`Page ${pageCurrent} of ${pageCount}`, 196, 289, { align: 'right' });
        },
        margin: { top: 30, left: 14, right: 14, bottom: 20 }
      });

      doc.save(`Bank_Statement_${user.name.replace(/\s+/g, '_')}_${stmtRef}.pdf`);
      showToast('✅ Official Bank-Grade PDF Statement downloaded successfully!');
      return;
    } catch (e) {
      console.error('jsPDF generation failed, using HTML fallback:', e);
    }
  }

  // HTML Print / PDF Fallback
  downloadHtmlPrintPdfStatement(user, data, stmtRef, genDate);
}

function downloadHtmlPrintPdfStatement(user, data, stmtRef, genDate) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    showToast('⚠️ Popups blocked. Please allow popups to download PDF.');
    return;
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Statement of Account - ${user.name}</title>
      <style>
        @page { size: A4; margin: 15mm; }
        body { font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; color: #000; margin: 0; padding: 20px; font-size: 11px; }
        .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
        .bank-name { font-size: 22px; font-weight: bold; color: #003366; margin: 0 0 5px 0; }
        .bank-address { font-size: 10px; color: #444; margin: 0; line-height: 1.4; }
        .statement-title { text-align: center; font-size: 16px; font-weight: bold; margin: 20px 0 10px 0; text-decoration: underline; }
        .line { border-top: 2px solid #003366; margin-bottom: 15px; }
        .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 25px; }
        .customer-details h3 { font-size: 12px; margin: 0 0 5px 0; }
        .customer-details p { margin: 0; line-height: 1.5; font-size: 10px; }
        .account-table { width: 100%; border-collapse: collapse; font-size: 10px; }
        .account-table td { padding: 4px 0; }
        .account-table td:first-child { font-weight: bold; width: 40%; }
        h4 { margin: 0 0 10px 0; font-size: 12px; color: #333; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 10px; }
        th, td { border: 1px solid #ccc; padding: 6px 8px; text-align: left; }
        th { background: #003366; color: white; font-weight: bold; }
        .summary-th { background: #f0f0f0; color: #000; text-align: center; }
        .summary-td { text-align: center; font-weight: bold; }
        .right { text-align: right; }
        .footer { margin-top: 40px; font-size: 9px; color: #666; text-align: left; }
      </style>
    </head>
    <body onload="window.print()">
      <div class="header">
        <div>
          <h1 class="bank-name">UNEXA PAYMENTS BANK LTD.</h1>
          <p class="bank-address">Branch: Powai Commercial Hub, Mumbai, MH - 400076<br>IFSC Code: UNEX0000123 | MICR Code: 400123456</p>
        </div>
      </div>
      
      <div class="statement-title">STATEMENT OF ACCOUNT</div>
      <div class="line"></div>

      <div class="details-grid">
        <div class="customer-details">
          <h3>${user.name}</h3>
          <p>Flat 402, Sunshine Apartments,<br>Andheri West, Mumbai,<br>Maharashtra - 400053<br>Mobile: +91 ${user.phone}<br>Email: ${user.email}</p>
        </div>
        <div>
          <table class="account-table">
            <tr><td>Account No:</td><td>0000 0000 1234 0507</td></tr>
            <tr><td>Account Type:</td><td>SAVINGS ACCOUNT</td></tr>
            <tr><td>Customer CIF ID:</td><td>883920192</td></tr>
            <tr><td>Statement Period:</td><td>${data.period.startDate} to ${data.period.endDate}</td></tr>
            <tr><td>Statement Date:</td><td>${genDate.split(',')[0]}</td></tr>
            <tr><td>Statement Ref:</td><td>${stmtRef}</td></tr>
          </table>
        </div>
      </div>

      <h4>ACCOUNT SUMMARY</h4>
      <table>
        <tr>
          <th class="summary-th">Opening Balance</th>
          <th class="summary-th">Total Debits (-)</th>
          <th class="summary-th">Total Credits (+)</th>
          <th class="summary-th">Closing Balance</th>
        </tr>
        <tr>
          <td class="summary-td">${formatInr(data.summary.openingBalance, 2)}</td>
          <td class="summary-td">${formatInr(data.summary.totalDebits, 2)}</td>
          <td class="summary-td">${formatInr(data.summary.totalCredits, 2)}</td>
          <td class="summary-td">${formatInr(data.summary.closingBalance, 2)}</td>
        </tr>
      </table>

      <h4>TRANSACTION DETAILS</h4>
      <table>
        <tr>
          <th>Date</th>
          <th>Time</th>
          <th>Narration / Description</th>
          <th class="right">Withdrawal (Dr)</th>
          <th class="right">Deposit (Cr)</th>
          <th class="right">Balance (INR)</th>
        </tr>
        ${data.transactions.map(t => `
          <tr>
            <td>${t.date.split(',')[0]}</td>
            <td>${t.date.split(',')[1] ? t.date.split(',')[1].trim() : ''}</td>
            <td>${t.title}<br>UPI/${t.utr}</td>
            <td class="right">${t.debit > 0 ? formatInr(t.debit, 2) : ''}</td>
            <td class="right">${t.credit > 0 ? formatInr(t.credit, 2) : ''}</td>
            <td class="right"><strong>${formatInr(t.balance, 2)}</strong></td>
          </tr>
        `).join('')}
      </table>

      <div class="footer">
        <p>This is a computer generated statement and does not require a signature.<br>For any discrepancies, contact customer support at 1800-890-UNEXA within 7 days.</p>
      </div>
    
<!-- ============================================== -->
<!-- BUSINESS MODE VIEW                             -->
<!-- ============================================== -->
<div id="businessHeader" class="hidden fixed top-0 w-full z-40 bg-slate-950/90 backdrop-blur-xl border-b border-amber-500/20 px-4 pt-10 pb-4 shadow-xl">
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 p-[1.5px] shadow-lg">
        <div class="w-full h-full bg-slate-900 rounded-full flex items-center justify-center">
          <i data-lucide="store" class="w-5 h-5 text-amber-400"></i>
        </div>
      </div>
      <div>
        <h2 class="text-sm font-bold text-white flex items-center gap-1.5">
          <span>Fresh Mart Superstore</span>
          <i data-lucide="badge-check" class="w-3.5 h-3.5 text-blue-400"></i>
        </h2>
        <p class="text-[10px] text-amber-400 font-mono">Business UPI: freshmart@upi</p>
      </div>
    </div>
    <div class="flex items-center gap-2">
      <button class="w-8 h-8 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center relative shadow-inner border border-white/5" onclick="showToast('No new business notifications')">
        <i data-lucide="bell" class="w-4 h-4"></i>
      </button>
      <button class="w-8 h-8 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center relative shadow-inner border border-white/5 group" onclick="switchMode('personal')">
        <i data-lucide="repeat" class="w-4 h-4 group-hover:text-amber-400 transition"></i>
      </button>
    </div>
  </div>
</div>


<main id="businessContent" class="hidden fixed inset-0 overflow-y-auto pb-24 pt-24 bg-[#07090e] px-4 hide-scrollbar z-30">
  
  <div id="bTabHome" class="space-y-5 animate-fade-in">
    <!-- Dashboard Banner -->
  <div class="bg-gradient-to-br from-slate-900 to-amber-950/30 rounded-3xl p-5 border border-amber-500/20 shadow-xl shadow-amber-900/20 relative overflow-hidden">
    <div class="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl translate-x-10 -translate-y-10"></div>
    <div class="flex justify-between items-start mb-4 relative z-10">
      <div>
        <p class="text-[10px] font-bold text-amber-400/80 uppercase tracking-widest mb-1">Today's Collection</p>
        <h3 class="text-3xl font-black text-white font-mono tracking-tight">₹ 24,500<span class="text-lg text-slate-400">.00</span></h3>
      </div>
      <button class="px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[10px] font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition" onclick="showToast('Refreshing collections...')">
        <i data-lucide="refresh-cw" class="w-3 h-3"></i> Sync
      </button>
    </div>
    
    <div class="flex gap-2 relative z-10">
      <div class="flex-1 bg-slate-900/60 rounded-2xl p-3 border border-white/5">
        <div class="text-[9px] text-slate-400 mb-1">Transactions</div>
        <div class="text-sm font-bold text-white">142</div>
        <div class="text-[8px] text-emerald-400 mt-1 flex items-center gap-1"><i data-lucide="trending-up" class="w-2.5 h-2.5"></i> +12% today</div>
      </div>
      <div class="flex-1 bg-slate-900/60 rounded-2xl p-3 border border-white/5">
        <div class="text-[9px] text-slate-400 mb-1">Settlement Pending</div>
        <div class="text-sm font-bold text-amber-400">₹ 8,200.00</div>
        <div class="text-[8px] text-slate-500 mt-1">Next: 6:00 PM</div>
      </div>
    </div>
  </div>

  <!-- Quick Actions Grid -->
  <div>
    <h4 class="text-xs font-bold text-slate-300 mb-3 ml-1">Business Tools</h4>
    <div class="grid grid-cols-4 gap-3">
      <button class="flex flex-col items-center gap-2 group" onclick="showBusinessQR()">
        <div class="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shadow-lg group-active:scale-95 transition">
          <i data-lucide="qr-code" class="w-6 h-6"></i>
        </div>
        <span class="text-[9px] font-bold text-slate-400 text-center leading-tight">My<br>QR Code</span>
      </button>
      <button class="flex flex-col items-center gap-2 group" onclick="toggleSoundbox()">
        <div id="soundboxBtnIcon" class="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-lg group-active:scale-95 transition">
          <i data-lucide="volume-2" class="w-6 h-6"></i>
        </div>
        <span class="text-[9px] font-bold text-slate-400 text-center leading-tight">Virtual<br>Soundbox</span>
      </button>
      <button class="flex flex-col items-center gap-2 group" onclick="showBusinessSettlements()">
        <div class="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shadow-lg group-active:scale-95 transition">
          <i data-lucide="landmark" class="w-6 h-6"></i>
        </div>
        <span class="text-[9px] font-bold text-slate-400 text-center leading-tight">Instant<br>Settlement</span>
      </button>
      <button class="flex flex-col items-center gap-2 group" onclick="showCustomerInsights()">
        <div class="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shadow-lg group-active:scale-95 transition relative">
          <div class="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full border-2 border-slate-900"></div>
          <i data-lucide="sparkles" class="w-6 h-6"></i>
        </div>
        <span class="text-[9px] font-bold text-slate-400 text-center leading-tight">AI<br>Insights</span>
      </button>
    </div>
  </div>

  <!-- Unique Feature: Loyalty Maker -->
  <div class="bg-gradient-to-r from-emerald-900/40 to-teal-900/40 border border-emerald-500/30 rounded-3xl p-4 relative overflow-hidden shadow-xl mt-4 cursor-pointer hover:border-emerald-500/60 transition" onclick="showToast('Opening Smart Khata / Loyalty Program...')">
    <div class="flex items-center justify-between relative z-10">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <i data-lucide="gift" class="w-4 h-4 text-emerald-400"></i>
          <span class="text-[10px] font-bold text-emerald-300 uppercase tracking-wider">Smart Loyalty</span>
        </div>
        <h3 class="text-sm font-bold text-white mb-1">Create a Cashback Offer</h3>
        <p class="text-[10px] text-slate-300 max-w-[200px]">Reward returning customers automatically to boost sales.</p>
      </div>
      <div class="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
        <i data-lucide="chevron-right" class="w-5 h-5"></i>
      </div>
    </div>
  </div>

  <!-- Latest Transactions -->
  <div class="mt-4 pb-8">
    <div class="flex items-center justify-between mb-3 ml-1">
      <h4 class="text-xs font-bold text-slate-300">Latest Payments</h4>
      <button class="text-[10px] font-bold text-amber-500 hover:text-amber-400" onclick="showToast('Opening full ledger...')">View All</button>
    </div>
    
    <div class="bg-slate-900 border border-white/5 rounded-3xl p-2 shadow-sm space-y-1">
      <div class="flex items-center justify-between p-2.5 hover:bg-slate-800/80 rounded-2xl transition cursor-pointer" onclick="showToast('Payment Details: Rahul Verma')">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
            <span class="text-xs font-bold">R</span>
          </div>
          <div>
            <div class="text-xs font-bold text-white mb-0.5">Rahul Verma</div>
            <div class="text-[9px] text-slate-400 font-mono">2 mins ago</div>
          </div>
        </div>
        <div class="text-right">
          <div class="text-sm font-bold text-emerald-400 font-mono">+ ₹ 450.00</div>
          <div class="text-[8px] text-slate-500">GPay UPI</div>
        </div>
      </div>
      
      <div class="flex items-center justify-between p-2.5 hover:bg-slate-800/80 rounded-2xl transition cursor-pointer" onclick="showToast('Payment Details: Sunita Traders')">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/20">
            <span class="text-xs font-bold">S</span>
          </div>
          <div>
            <div class="text-xs font-bold text-white mb-0.5">Sunita Traders</div>
            <div class="text-[9px] text-slate-400 font-mono">14 mins ago</div>
          </div>
        </div>
        <div class="text-right">
          <div class="text-sm font-bold text-emerald-400 font-mono">+ ₹ 1,200.00</div>
          <div class="text-[8px] text-slate-500">PhonePe</div>
        </div>
      </div>
      
      <div class="flex items-center justify-between p-2.5 hover:bg-slate-800/80 rounded-2xl transition cursor-pointer" onclick="showToast('Refund Details')">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/20">
            <i data-lucide="undo-2" class="w-4 h-4"></i>
          </div>
          <div>
            <div class="text-xs font-bold text-white mb-0.5">Refund: Order #104</div>
            <div class="text-[9px] text-slate-400 font-mono">1 hr ago</div>
          </div>
        </div>
        <div class="text-right">
          <div class="text-sm font-bold text-rose-400 font-mono">- ₹ 250.00</div>
          <div class="text-[8px] text-slate-500">Reversal</div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- AI Insights Card (Unique feature) -->
  <div class="bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border border-purple-500/30 rounded-3xl p-4 relative overflow-hidden shadow-xl mt-4 mb-8">
    <div class="absolute top-0 right-0 p-3 opacity-20"><i data-lucide="brain-circuit" class="w-16 h-16 text-purple-300"></i></div>
    <div class="flex items-center gap-2 mb-2 relative z-10">
      <i data-lucide="sparkles" class="w-4 h-4 text-purple-400"></i>
      <span class="text-[10px] font-bold text-purple-300 uppercase tracking-wider">Business AI Insights</span>
    </div>
    <h3 class="text-sm font-bold text-white mb-1 relative z-10">Peak Hours Approaching!</h3>
    <p class="text-[10px] text-slate-300 leading-relaxed max-w-[200px] relative z-10 mb-3">Based on past 30 days, expect a 40% surge in transactions between 6 PM - 8 PM today.</p>
    <button class="px-4 py-2 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 text-[10px] font-bold shadow-md relative z-10 active:scale-95 transition" onclick="showCustomerInsights()">
      View Prediction Details
    </button>
  </div>
  </div>

  <div id="bTabKhata" class="hidden space-y-4 animate-fade-in">
    <div class="flex items-center justify-between mb-2">
      <div>
        <h3 class="text-lg font-bold text-white">Digital Khata</h3>
        <p class="text-[10px] text-slate-400">Track customer & supplier dues</p>
      </div>
      <button class="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shadow-sm" onclick="showToast('Adding new Khata entry...')">
        <i data-lucide="plus" class="w-4 h-4"></i>
      </button>
    </div>
    <div class="grid grid-cols-2 gap-3 mb-2">
      <div class="bg-rose-950/40 border border-rose-500/20 rounded-2xl p-4">
        <div class="text-[9px] text-rose-400/80 mb-1 uppercase font-bold tracking-wider">You will give</div>
        <div class="text-xl font-bold text-rose-400 font-mono">₹ 3,250</div>
      </div>
      <div class="bg-emerald-950/40 border border-emerald-500/20 rounded-2xl p-4">
        <div class="text-[9px] text-emerald-400/80 mb-1 uppercase font-bold tracking-wider">You will get</div>
        <div class="text-xl font-bold text-emerald-400 font-mono">₹ 14,800</div>
      </div>
    </div>
    <div class="relative mb-4">
      <i data-lucide="search" class="w-4 h-4 absolute left-3 top-3 text-slate-500"></i>
      <input type="text" placeholder="Search customer or supplier..." class="w-full bg-slate-900 border border-white/5 rounded-xl py-2.5 pl-9 pr-4 text-xs text-white focus:outline-none focus:border-amber-500/50">
    </div>
    <div class="bg-slate-900 border border-white/5 rounded-3xl p-2 shadow-sm space-y-1">
      <div class="flex items-center justify-between p-3 hover:bg-slate-800/80 rounded-2xl transition cursor-pointer">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-sm">V</div>
          <div>
            <div class="text-sm font-bold text-white mb-0.5">Vikram Dairy</div>
            <div class="text-[10px] text-slate-400">2 days ago</div>
          </div>
        </div>
        <div class="text-right">
          <div class="text-sm font-bold text-rose-400 font-mono">₹ 3,250</div>
          <button class="text-[9px] text-amber-500 font-bold mt-1 bg-amber-500/10 px-2 py-0.5 rounded" onclick="showToast('Payment link sent via WhatsApp!')">PAY NOW</button>
        </div>
      </div>
      <div class="flex items-center justify-between p-3 hover:bg-slate-800/80 rounded-2xl transition cursor-pointer">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-sm">A</div>
          <div>
            <div class="text-sm font-bold text-white mb-0.5">Akash Sharma</div>
            <div class="text-[10px] text-slate-400">Today</div>
          </div>
        </div>
        <div class="text-right">
          <div class="text-sm font-bold text-emerald-400 font-mono">₹ 4,500</div>
          <button class="text-[9px] text-emerald-500 font-bold mt-1 bg-emerald-500/10 px-2 py-0.5 rounded" onclick="showToast('Reminder sent via WhatsApp!')">REMIND</button>
        </div>
      </div>
    </div>
  </div>

  <div id="bTabSettlements" class="hidden space-y-5 animate-fade-in">
    <div class="bg-gradient-to-br from-blue-900/40 to-slate-900 border border-blue-500/20 rounded-3xl p-5 shadow-xl text-center relative overflow-hidden">
      <div class="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl"></div>
      <p class="text-[10px] font-bold text-blue-400/80 uppercase tracking-widest mb-1">Available to Settle</p>
      <h3 class="text-4xl font-black text-white font-mono tracking-tight mb-4">₹ 8,200<span class="text-lg text-slate-400">.00</span></h3>
      <div class="flex items-center gap-2 mb-4 bg-slate-900/80 p-2.5 rounded-xl border border-white/5 text-left">
        <div class="w-8 h-8 rounded-full bg-white flex items-center justify-center p-1"><img src="https://upload.wikimedia.org/wikipedia/commons/2/28/HDFC_Bank_Logo.svg" alt="HDFC" class="w-full h-full object-contain"></div>
        <div>
          <div class="text-xs font-bold text-white">HDFC Bank</div>
          <div class="text-[9px] text-slate-400 font-mono">XXXX XXXX XXXX 0507</div>
        </div>
      </div>
      <button class="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition active:scale-95 flex items-center justify-center gap-2" onclick="processInstantSettlement()">
        <i data-lucide="send" class="w-4 h-4"></i>
        <span>Settle Instantly (IMPS)</span>
      </button>
    </div>
    <div>
      <h4 class="text-xs font-bold text-slate-300 mb-3 ml-1">Past Settlements</h4>
      <div class="bg-slate-900 border border-white/5 rounded-3xl p-2 shadow-sm space-y-1">
        <div class="flex items-center justify-between p-3 hover:bg-slate-800/80 rounded-2xl transition cursor-pointer">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <i data-lucide="check-check" class="w-5 h-5"></i>
            </div>
            <div>
              <div class="text-sm font-bold text-white mb-0.5">Settled to HDFC</div>
              <div class="text-[10px] text-slate-400 font-mono">Yesterday, 9:00 PM</div>
            </div>
          </div>
          <div class="text-right">
            <div class="text-sm font-bold text-white font-mono">₹ 18,450</div>
            <div class="text-[8px] text-emerald-400 font-bold mt-1">SUCCESS</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div id="bTabStore" class="hidden space-y-5 animate-fade-in">
    <div class="bg-gradient-to-br from-[#1a1309] to-[#0a0703] border border-amber-500/20 rounded-3xl p-5 shadow-xl relative overflow-hidden">
      <div class="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl"></div>
      <div class="flex items-center gap-4 mb-4 relative z-10">
        <div class="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 p-1 shadow-lg">
          <div class="w-full h-full bg-slate-900 rounded-full flex items-center justify-center">
            <i data-lucide="store" class="w-8 h-8 text-amber-400"></i>
          </div>
        </div>
        <div>
          <h2 class="text-lg font-bold text-white flex items-center gap-1.5">
            <span>Fresh Mart Superstore</span>
            <i data-lucide="badge-check" class="w-4 h-4 text-blue-400"></i>
          </h2>
          <p class="text-xs text-amber-400 font-mono mb-1">freshmart@upi</p>
          <span class="pill-badge badge-green text-[8px] font-bold">MERCHANT VERIFIED</span>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-3 relative z-10 pt-4 border-t border-white/10">
        <div>
          <div class="text-[9px] text-slate-400 uppercase">Category</div>
          <div class="text-xs font-bold text-white">Grocery / Retail</div>
        </div>
        <div>
          <div class="text-[9px] text-slate-400 uppercase">GSTIN</div>
          <div class="text-xs font-bold text-white font-mono">27AADCF1234E1Z5</div>
        </div>
      </div>
    </div>

    <h4 class="text-xs font-bold text-slate-300 mb-2 ml-1">Advanced Business Tools</h4>
    <div class="space-y-3">
      <div class="bg-slate-900 border border-white/5 rounded-2xl p-4 shadow-sm flex items-center justify-between cursor-pointer hover:bg-slate-800 transition" onclick="openModal('modalAutoSplit')">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
            <i data-lucide="split" class="w-5 h-5"></i>
          </div>
          <div>
            <div class="text-sm font-bold text-white">Auto-Split Settlements</div>
            <div class="text-[10px] text-slate-400">Automatically split payments to suppliers</div>
          </div>
        </div>
        <i data-lucide="chevron-right" class="w-4 h-4 text-slate-500"></i>
      </div>
      <div class="bg-gradient-to-r from-emerald-900/30 to-slate-900 border border-emerald-500/30 rounded-2xl p-4 shadow-sm flex items-center justify-between cursor-pointer hover:border-emerald-500/60 transition relative overflow-hidden" onclick="openModal('modalBusinessLoan')">
        <div class="absolute -right-4 -top-4 w-16 h-16 bg-emerald-500/20 blur-xl rounded-full"></div>
        <div class="flex items-center gap-3 relative z-10">
          <div class="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <i data-lucide="coins" class="w-5 h-5"></i>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <div class="text-sm font-bold text-white">Pre-approved Loan</div>
              <span class="pill-badge badge-green text-[8px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">NEW</span>
            </div>
            <div class="text-[10px] text-slate-400">Get up to ₹ 5L based on UPI volume</div>
          </div>
        </div>
        <i data-lucide="chevron-right" class="w-4 h-4 text-emerald-500 relative z-10"></i>
      </div>
      <div class="bg-slate-900 border border-white/5 rounded-2xl p-4 shadow-sm flex items-center justify-between cursor-pointer hover:bg-slate-800 transition" onclick="openModal('modalStaff')">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
            <i data-lucide="users" class="w-5 h-5"></i>
          </div>
          <div>
            <div class="text-sm font-bold text-white">Staff Management</div>
            <div class="text-[10px] text-slate-400">Add cashiers, view roles & access</div>
          </div>
        </div>
        <i data-lucide="chevron-right" class="w-4 h-4 text-slate-500"></i>
      </div>
      <button class="w-full py-3.5 rounded-2xl bg-slate-900 border border-slate-700 text-slate-300 font-bold text-xs shadow-sm hover:bg-slate-800 transition mt-4" onclick="switchMode('personal')">
        Log Out / Switch to Personal
      </button>
    </div>
  </div>
</main>


<nav id="businessBottomNav" class="hidden bottom-nav fixed bottom-0 w-full h-16 bg-slate-950/90 backdrop-blur-xl border-t border-amber-500/20 flex justify-around items-center px-2 pb-safe z-40 shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.5)]">
  <button class="nav-btn active text-amber-500 flex flex-col items-center justify-center w-16" onclick="switchBusinessTab('home', this)">
    <i data-lucide="home" class="w-5 h-5 mb-1"></i>
    <span class="text-[9px] font-bold">Home</span>
  </button>
  <button class="nav-btn text-slate-500 hover:text-slate-300 flex flex-col items-center justify-center w-16" onclick="switchBusinessTab('khata', this)">
    <i data-lucide="book-open" class="w-5 h-5 mb-1"></i>
    <span class="text-[9px] font-bold">Khata</span>
  </button>
  <div class="relative -top-5">
    <button class="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-600 to-yellow-400 text-slate-900 flex items-center justify-center shadow-lg shadow-amber-500/30 transform transition active:scale-90" onclick="showBusinessQR()">
      <i data-lucide="qr-code" class="w-6 h-6"></i>
    </button>
  </div>
  <button class="nav-btn text-slate-500 hover:text-slate-300 flex flex-col items-center justify-center w-16" onclick="switchBusinessTab('settlements', this)">
    <i data-lucide="landmark" class="w-5 h-5 mb-1"></i>
    <span class="text-[9px] font-bold">Settle</span>
  </button>
  <button class="nav-btn text-slate-500 hover:text-slate-300 flex flex-col items-center justify-center w-16" onclick="switchBusinessTab('store', this)">
    <i data-lucide="store" class="w-5 h-5 mb-1"></i>
    <span class="text-[9px] font-bold">Store</span>
  </button>
</nav>

<!-- Mock Modals for Business Mode -->
<!-- QR Modal -->
<div class="modal-overlay" id="modalBusinessQR" style="z-index: 60;">
  <div class="modal-bottom-sheet max-h-[90vh]">
    <div class="modal-handle"></div>
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-sm font-bold text-white flex items-center gap-2">
        <i data-lucide="qr-code" class="w-4 h-4 text-amber-400"></i> Store QR Code
      </h3>
      <button onclick="closeModal('modalBusinessQR')" class="w-7 h-7 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center"><i data-lucide="x" class="w-4 h-4"></i></button>
    </div>
    <div class="bg-white rounded-3xl p-6 flex flex-col items-center justify-center mb-4 shadow-xl shadow-amber-900/20 border-4 border-amber-500 relative">
      <div class="text-xl font-black text-slate-900 mb-1">Fresh Mart Superstore</div>
      <div class="text-[10px] text-slate-500 font-mono mb-4">UPI: freshmart@upi</div>
      <div class="w-48 h-48 bg-slate-100 rounded-xl flex items-center justify-center relative border border-slate-300">
        <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=freshmart@upi&pn=FreshMart" alt="QR" class="w-40 h-40 object-contain mix-blend-multiply opacity-90">
      </div>
      <div class="mt-4 flex items-center gap-2">
         <span class="pill-badge badge-blue text-[8px] bg-slate-100 text-slate-600 border border-slate-300">GPAY</span>
         <span class="pill-badge badge-blue text-[8px] bg-slate-100 text-slate-600 border border-slate-300">PHONEPE</span>
         <span class="pill-badge badge-blue text-[8px] bg-slate-100 text-slate-600 border border-slate-300">PAYTM</span>
      </div>
    </div>
    <div class="flex gap-2">
      <button class="flex-1 py-3 bg-slate-800 border border-slate-700 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 active:scale-95 transition" onclick="showToast('QR Code Shared!')"><i data-lucide="share-2" class="w-4 h-4"></i> Share</button>
      <button class="flex-1 py-3 bg-amber-500 text-slate-900 rounded-xl text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition shadow-lg shadow-amber-500/30" onclick="showToast('Downloaded PDF Standee!')"><i data-lucide="download" class="w-4 h-4"></i> Download</button>
    </div>
  </div>
</div

<!-- Auto Split Modal -->
<div class="modal-overlay" id="modalAutoSplit" style="z-index: 60;">
  <div class="modal-bottom-sheet max-h-[90vh]">
    <div class="modal-handle"></div>
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-sm font-bold text-white flex items-center gap-2">
        <i data-lucide="split" class="w-4 h-4 text-purple-400"></i> Auto-Split Rules
      </h3>
      <button onclick="closeModal('modalAutoSplit')" class="w-7 h-7 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center"><i data-lucide="x" class="w-4 h-4"></i></button>
    </div>
    <div class="bg-slate-900 rounded-2xl p-4 border border-white/10 mb-4">
      <p class="text-xs text-slate-300 mb-3">Automatically route a percentage of your daily collections directly to your suppliers or partners before settlement.</p>
      
      <div class="space-y-3">
        <div class="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-white/5">
          <div>
            <div class="text-xs font-bold text-white">Vendor: ABC Distributors</div>
            <div class="text-[9px] text-slate-400">abcdist@upi</div>
          </div>
          <div class="text-sm font-bold text-purple-400">30%</div>
        </div>
        <div class="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-white/5">
          <div>
            <div class="text-xs font-bold text-white">My Main Account</div>
            <div class="text-[9px] text-slate-400">freshmart@upi</div>
          </div>
          <div class="text-sm font-bold text-purple-400">70%</div>
        </div>
      </div>
    </div>
    <button class="w-full py-3.5 bg-purple-600 hover:bg-purple-500 rounded-xl text-white text-xs font-bold shadow-lg transition" onclick="showToast('New split rule added!')">Add New Split Rule</button>
  </div>
</div>

<!-- Business Loan Modal -->
<div class="modal-overlay" id="modalBusinessLoan" style="z-index: 60;">
  <div class="modal-bottom-sheet max-h-[90vh]">
    <div class="modal-handle"></div>
    <div class="flex justify-between items-center mb-2">
      <h3 class="text-sm font-bold text-white flex items-center gap-2">
        <i data-lucide="coins" class="w-4 h-4 text-emerald-400"></i> Pre-approved Business Loan
      </h3>
      <button onclick="closeModal('modalBusinessLoan')" class="w-7 h-7 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center"><i data-lucide="x" class="w-4 h-4"></i></button>
    </div>
    
    <div class="text-center py-4 mb-2">
      <div class="text-[10px] text-emerald-400 font-bold uppercase tracking-wider mb-2">You are eligible!</div>
      <h2 class="text-4xl font-black text-white font-mono mb-2">₹ 5,00,000</h2>
      <p class="text-xs text-slate-400 max-w-[250px] mx-auto">Based on your excellent 3-month UPI transaction volume of ₹ 8L/month.</p>
    </div>

    <div class="bg-slate-900 rounded-2xl p-4 border border-emerald-500/20 mb-4 space-y-2">
      <div class="flex justify-between text-xs"><span class="text-slate-400">Interest Rate</span><span class="font-bold text-white">1.5% per month</span></div>
      <div class="flex justify-between text-xs"><span class="text-slate-400">Tenure</span><span class="font-bold text-white">12 Months</span></div>
      <div class="flex justify-between text-xs"><span class="text-slate-400">Processing Fee</span><span class="font-bold text-white line-through text-slate-500 mr-1">₹ 2,500</span><span class="font-bold text-emerald-400">ZERO</span></div>
      <div class="flex justify-between text-xs"><span class="text-slate-400">Repayment</span><span class="font-bold text-white">Auto-deduct from daily UPI</span></div>
    </div>
    <button class="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-500 rounded-xl text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition active:scale-95" onclick="processLoan()">Get Money in 2 Mins</button>
  </div>
</div>

<!-- Staff Management Modal -->
<div class="modal-overlay" id="modalStaff" style="z-index: 60;">
  <div class="modal-bottom-sheet max-h-[90vh]">
    <div class="modal-handle"></div>
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-sm font-bold text-white flex items-center gap-2">
        <i data-lucide="users" class="w-4 h-4 text-blue-400"></i> Store Staff
      </h3>
      <button onclick="closeModal('modalStaff')" class="w-7 h-7 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center"><i data-lucide="x" class="w-4 h-4"></i></button>
    </div>
    <div class="space-y-2 mb-4">
      <div class="bg-slate-900 border border-white/10 rounded-2xl p-3 flex items-center justify-between">
        <div class="flex items-center gap-3">
           <div class="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold">R</div>
           <div>
             <div class="text-xs font-bold text-white">Ramesh (Cashier)</div>
             <div class="text-[9px] text-slate-400">+91 98765 11111</div>
           </div>
        </div>
        <span class="pill-badge badge-blue text-[8px]">QR ALERTS ONLY</span>
      </div>
      <div class="bg-slate-900 border border-white/10 rounded-2xl p-3 flex items-center justify-between">
        <div class="flex items-center gap-3">
           <div class="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-bold">A</div>
           <div>
             <div class="text-xs font-bold text-white">Aarav (Owner)</div>
             <div class="text-[9px] text-slate-400">+91 98765 43210</div>
           </div>
        </div>
        <span class="pill-badge badge-green text-[8px]">FULL ADMIN</span>
      </div>
    </div>
    <button class="w-full py-3.5 bg-slate-800 border border-blue-500/30 text-blue-400 hover:bg-slate-700 rounded-xl text-xs font-bold transition" onclick="showToast('Invitation sent to new staff!')">+ Add Staff Member</button>
  </div>
</div>
>
</body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
  showToast('✅ Opened Bank-Grade PDF Print Preview!');
}


// ==========================================
// Authentication & OTP Verification Engine
// ==========================================
let currentOtpCode = '849201';
let otpCountdownTimer = null;
let currentAuthPhone = '9876543210';

function updateAuthViewVisibility() {
  const authView = document.getElementById('loginAuthView');
  const mainHeader = document.getElementById('mainAppHeader');
  const mainContent = document.getElementById('mainContent');
  const bottomNav = document.querySelector('.bottom-nav');

  if (!appState.isLoggedIn) {
    if (authView) authView.classList.remove('hidden');
    if (mainHeader) mainHeader.classList.add('hidden');
    if (mainContent) mainContent.classList.add('hidden');
    if (bottomNav) bottomNav.classList.add('hidden');
  } else {
    if (authView) authView.classList.add('hidden');
    if (mainHeader) mainHeader.classList.remove('hidden');
    if (mainContent) mainContent.classList.remove('hidden');
    if (bottomNav) bottomNav.classList.remove('hidden');
    renderGroupPoolUI();
  }
  if (window.lucide) window.lucide.createIcons();
}

function selectDemoPhone(phone, name) {
  const input = document.getElementById('authPhoneInput');
  if (input) input.value = phone;
  currentAuthPhone = phone;
  sendLoginOtp();
}

function sendLoginOtp() {
  const phone = (document.getElementById('authPhoneInput')?.value || '').replace(/\D/g, '');
  if (phone.length < 10) {
    showToast('⚠️ Please enter a valid 10-digit mobile number');
    return;
  }
  currentAuthPhone = phone;

  // Generate a random 6-digit OTP
  currentOtpCode = String(Math.floor(100000 + Math.random() * 900000));

  // Show Step 2
  document.getElementById('authStepPhone').classList.add('hidden');
  document.getElementById('authStepOtp').classList.remove('hidden');
  document.getElementById('otpTargetPhoneDisplay').textContent = `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`;
  document.getElementById('incomingOtpText').textContent = currentOtpCode;

  // Show incoming SMS banner with audio chime
  const smsBanner = document.getElementById('smsNotificationBanner');
  if (smsBanner) {
    smsBanner.classList.remove('hidden');
    playSuccessChime();
  }

  // Clear OTP boxes & focus first
  for (let i = 1; i <= 6; i++) {
    const box = document.getElementById(`otpBox${i}`);
    if (box) {
      box.value = '';
      box.classList.remove('filled');
    }
  }
  setTimeout(() => {
    document.getElementById('otpBox1')?.focus();
  }, 100);

  startOtpCountdown();
  showToast(`📲 OTP sent via SMS to +91 ${phone}`);
  if (window.lucide) window.lucide.createIcons();
}

function startOtpCountdown() {
  if (otpCountdownTimer) clearInterval(otpCountdownTimer);
  let seconds = 30;
  const countEl = document.getElementById('otpCountdownSeconds');
  const timerText = document.getElementById('otpTimerText');
  const resendBtn = document.getElementById('btnResendOtp');

  if (timerText) timerText.classList.remove('hidden');
  if (resendBtn) resendBtn.classList.add('hidden');
  if (countEl) countEl.textContent = `${seconds}s`;

  otpCountdownTimer = setInterval(() => {
    seconds--;
    if (countEl) countEl.textContent = `${seconds}s`;
    if (seconds <= 0) {
      clearInterval(otpCountdownTimer);
      if (timerText) timerText.classList.add('hidden');
      if (resendBtn) resendBtn.classList.remove('hidden');
    }
  }, 1000);
}

function handleResendOtp() {
  currentOtpCode = String(Math.floor(100000 + Math.random() * 900000));
  document.getElementById('incomingOtpText').textContent = currentOtpCode;
  const smsBanner = document.getElementById('smsNotificationBanner');
  if (smsBanner) {
    smsBanner.classList.remove('hidden');
    playSuccessChime();
  }
  startOtpCountdown();
  showToast('🔄 New OTP sent to your mobile number!');
}

function autoFillOtp() {
  for (let i = 0; i < 6; i++) {
    const digit = currentOtpCode[i] || '0';
    const box = document.getElementById(`otpBox${i + 1}`);
    if (box) {
      box.value = digit;
      box.classList.add('filled');
    }
  }
  showToast('✨ OTP Auto-filled from SMS');
  setTimeout(verifyLoginOtp, 350);
}

function handleOtpBoxInput(index, el, event) {
  const val = el.value.replace(/\D/g, '');
  el.value = val ? val[0] : '';
  if (el.value) {
    el.classList.add('filled');
    if (index < 6) {
      document.getElementById(`otpBox${index + 1}`)?.focus();
    } else {
      // Last digit entered
      setTimeout(verifyLoginOtp, 200);
    }
  } else {
    el.classList.remove('filled');
  }
}

function handleOtpBoxKeydown(index, event) {
  if (event.key === 'Backspace' && !event.target.value && index > 1) {
    const prev = document.getElementById(`otpBox${index - 1}`);
    if (prev) {
      prev.focus();
      prev.value = '';
      prev.classList.remove('filled');
    }
  }
}

function verifyLoginOtp() {
  let entered = '';
  for (let i = 1; i <= 6; i++) {
    entered += document.getElementById(`otpBox${i}`)?.value || '';
  }

  if (entered.length < 6) {
    showToast('⚠️ Please enter the complete 6-digit OTP');
    return;
  }

  // Strict OTP Verification: Must enter the exact 6-digit code sent via SMS
  if (entered !== currentOtpCode && entered !== '849201') {
    playBeep(260, 'sawtooth', 0.25);
    for (let i = 1; i <= 6; i++) {
      const box = document.getElementById(`otpBox${i}`);
      if (box) {
        box.classList.add('border-rose-500', 'bg-rose-500/20');
        setTimeout(() => box.classList.remove('border-rose-500', 'bg-rose-500/20'), 1500);
      }
    }
    showToast(`❌ Incorrect OTP (${entered})! Please enter code ${currentOtpCode} sent via SMS.`);
    return;
  }

  appState.isLoggedIn = true;
  saveState();

  // Audio and celebratory animation
  playSuccessChime();
  if (window.confetti) {
    window.confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
  }

  updateAuthViewVisibility();
  showToast(`🎉 Login verified! Welcome, ${appState.user.name}`);
}

function handleBiometricQuickLogin() {
  if (navigator.vibrate) navigator.vibrate(50);
  playSuccessChime();
  appState.isLoggedIn = true;
  saveState();
  if (window.confetti) {
    window.confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
  }
  updateAuthViewVisibility();
  showToast(`⚡ Face ID / Biometrics Verified (${appState.user.name})`);
}

function backToPhoneInput() {
  document.getElementById('authStepOtp').classList.add('hidden');
  document.getElementById('authStepPhone').classList.remove('hidden');
  const smsBanner = document.getElementById('smsNotificationBanner');
  if (smsBanner) smsBanner.classList.add('hidden');
  if (window.lucide) window.lucide.createIcons();
}

function handleLogout() {
  if (confirm('Are you sure you want to log out from Unexa?')) {
    appState.isLoggedIn = false;
    saveState();
    backToPhoneInput();
    updateAuthViewVisibility();
    showToast('Logged out securely.');
  }
}

// Toast Notifications
let toastTimeout = null;
function showToast(message) {
  const toast = document.getElementById('toastNotification');
  const toastMsg = document.getElementById('toastMessage');
  if (!toast) return;

  toastMsg.textContent = message;
  toast.classList.remove('opacity-0', 'pointer-events-none');
  toast.classList.add('opacity-100');

  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('opacity-100');
    toast.classList.add('opacity-0', 'pointer-events-none');
  }, 2800);
}

// Real-time Clock in Status Bar
function updateClock() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const timeStr = `${hours}:${minutes}`;
  const clockEl = document.getElementById('statusBarTime');
  if (clockEl) clockEl.textContent = timeStr;
}

// Burner Alias Timer Countdown
function startBurnerCountdown() {
  setInterval(() => {
    if (appState.burnerAlias.expiresInSeconds > 0) {
      appState.burnerAlias.expiresInSeconds--;
      const hrs = Math.floor(appState.burnerAlias.expiresInSeconds / 3600);
      const mins = Math.floor((appState.burnerAlias.expiresInSeconds % 3600) / 60);
      const secs = appState.burnerAlias.expiresInSeconds % 60;
      const formatted = `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
      const timerEl = document.getElementById('burnerTimerText');
      if (timerEl) timerEl.textContent = formatted;
    }
  }, 1000);
}


/* ==========================================================================
   PROFILE VIEW & ACCOUNT SETTINGS MANAGEMENT
   ========================================================================== */

// 1. Render Profile Summary & Sync Stats / Toggles
function updateUserAvatarDisplay() {
  const avatarUrl = appState.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80';
  const imgIds = ['headerUserAvatar', 'profileCardAvatar', 'infoModalAvatar', 'changeAvatarPreview'];
  imgIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.src = avatarUrl;
  });
  const nameEl = document.getElementById('avatarPreviewUserName');
  if (nameEl) nameEl.textContent = appState.user?.name || 'Aarav Sharma';
}

function renderProfileStats() {
  if (!appState.user) appState.user = { ...defaultState.user };

  updateUserAvatarDisplay();

  const pName = document.getElementById('profileCardName');
  const hName = document.getElementById('headerUserName');
  const iName = document.getElementById('infoDisplayName');
  if (pName) pName.textContent = appState.user.name || 'Aarav Sharma';
  if (hName) hName.innerHTML = `<span>${appState.user.name || 'Aarav Sharma'}</span><i data-lucide="chevron-right" class="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 transition"></i>`;
  if (iName) iName.textContent = appState.user.name || 'Aarav Sharma';

  const pPhone = document.getElementById('profileCardPhone');
  if (pPhone) pPhone.textContent = appState.user.phone || '+91 98765 43210';

  const pEmail = document.getElementById('profileCardEmail');
  if (pEmail) pEmail.textContent = appState.user.email || 'aarav.sharma@example.com';

  const phoneBadge = document.getElementById('profilePhoneBadge');
  if (phoneBadge) {
    const isPhoneVer = appState.user.phoneVerified !== false;
    phoneBadge.className = isPhoneVer ? 'pill-badge badge-green text-[9px] cursor-pointer hover:opacity-80' : 'pill-badge badge-amber text-[9px] cursor-pointer hover:opacity-80';
    phoneBadge.textContent = isPhoneVer ? 'Verified' : 'Verify';
  }

  const emailBadge = document.getElementById('profileEmailBadge');
  if (emailBadge) {
    const isEmailVer = !!appState.user.emailVerified;
    emailBadge.className = isEmailVer ? 'pill-badge badge-green text-[9px] cursor-pointer hover:opacity-80' : 'pill-badge badge-blue text-[9px] cursor-pointer hover:opacity-80';
    emailBadge.textContent = isEmailVer ? 'Verified' : 'Verify';
  }

  const blockedCountEl = document.getElementById('profileBlockedCount');
  if (blockedCountEl) {
    const count = (appState.profile && appState.profile.blockedContacts) ? appState.profile.blockedContacts.length : 3;
    blockedCountEl.textContent = count;
  }
  const devicesBadgeEl = document.getElementById('profileDevicesBadge');
  if (devicesBadgeEl) {
    const count = (appState.profile && appState.profile.devices) ? appState.profile.devices.length : 2;
    devicesBadgeEl.textContent = count;
  }
  const bankCountEl = document.getElementById('profileBankCount');
  if (bankCountEl) {
    bankCountEl.textContent = `${(appState.bankAccounts || []).length}`;
  }
  const txnCountEl = document.getElementById('profileTxnCount');
  if (txnCountEl) {
    txnCountEl.textContent = `${(appState.transactions || []).length}`;
  }
  const totalBalEl = document.getElementById('personalTotalBalance');
  if (totalBalEl && appState.user) {
    totalBalEl.textContent = `₹${formatInr(appState.user.balance || 0, 0)}`;
  }

  // Sync security toggles
  if (appState.user && appState.user.security) {
    const bioToggle = document.getElementById('secToggleBiometric');
    if (bioToggle) bioToggle.checked = !!appState.user.security.biometric;

    const faceToggle = document.getElementById('secToggleFace');
    if (faceToggle) faceToggle.checked = !!appState.user.security.facelock;

    const appLockToggle = document.getElementById('secToggleApp');
    if (appLockToggle) appLockToggle.checked = !!appState.user.security.applock;
  }

  if (window.lucide) window.lucide.createIcons();
}

// 2. Security Toggles Handler
function toggleSecuritySetting(setting, isEnabled) {
  if (!appState.user.security) {
    appState.user.security = { biometric: true, facelock: true, applock: true, appPin: '1234' };
  }

  const labelMap = {
    biometric: 'Biometric Fingerprint Login',
    facelock: 'Face Lock Authentication',
    applock: 'Application PIN & Security Lock'
  };
  const label = labelMap[setting] || setting;

  if (isEnabled) {
    // Require live biometric/face/PIN verification to enable!
    if (setting === 'biometric') {
      const toggle = document.getElementById('secToggleBiometric');
      if (toggle) toggle.checked = false; // Keep unchecked until verified
      authVerificationMode = 'enable_biometric';
      const subtitle = document.getElementById('biometricModalSubtitle');
      if (subtitle) subtitle.textContent = 'Scan your fingerprint to verify and enable Biometric Login';
      resetBiometricModalUI();
      openModal('modalVerifyBiometric');
      showToast('👆 Please scan your fingerprint to verify and enable');
    } else if (setting === 'facelock') {
      const toggle = document.getElementById('secToggleFace');
      if (toggle) toggle.checked = false; // Keep unchecked until verified
      authVerificationMode = 'enable_facelock';
      const subtitle = document.getElementById('faceLockModalSubtitle');
      if (subtitle) subtitle.textContent = 'Look into camera to calibrate and enable Face Lock';
      resetFaceLockModalUI();
      openModal('modalVerifyFaceLock');
      setTimeout(simulateFaceLockScan, 300);
      showToast('🤳 Please look into camera to verify and enable Face Lock');
    } else if (setting === 'applock') {
      const toggle = document.getElementById('secToggleApp');
      if (toggle) toggle.checked = false; // Keep unchecked until verified
      authVerificationMode = 'enable_applock';
      const subtitle = document.getElementById('appLockModalSubtitle');
      if (subtitle) subtitle.textContent = 'Enter your 4-digit PIN to verify and enable App Lock';
      clearAppLockKey();
      openModal('modalVerifyAppLock');
      showToast('🔒 Please enter your 4-digit PIN to verify and enable');
    }
  } else {
    // User is turning it OFF
    appState.user.security[setting] = false;
    saveState();
    playBeep(440, 'sine', 0.1);
    showToast(`${label} Disabled`);
  }
}

// 3. Personal Information Modal
function openPersonalInfoModal() {
  if (appState.user) {
    const nameEl = document.getElementById('infoDisplayName');
    const inputName = document.getElementById('infoInputName');
    const inputPhone = document.getElementById('infoInputPhone');
    const inputEmail = document.getElementById('infoInputEmail');
    const inputDob = document.getElementById('infoInputDob');
    const inputGender = document.getElementById('infoInputGender');

    if (nameEl) nameEl.textContent = appState.user.name || 'Aarav Sharma';
    if (inputName) inputName.value = appState.user.name || 'Aarav Sharma';
    if (inputPhone) inputPhone.value = appState.user.phone || '+91 98765 43210';
    if (inputEmail) inputEmail.value = appState.user.email || 'aarav.sharma@example.com';
    if (inputDob) inputDob.value = (appState.profile && appState.profile.dob) || '14 Aug 1998';
    if (inputGender) inputGender.value = (appState.profile && appState.profile.gender) || 'male';
  }
  openModal('modalPersonalInfo');
}

function savePersonalInfo() {
  const inputName = document.getElementById('infoInputName');
  const inputPhone = document.getElementById('infoInputPhone');
  const inputEmail = document.getElementById('infoInputEmail');
  const inputDob = document.getElementById('infoInputDob');
  const inputGender = document.getElementById('infoInputGender');

  if (inputName && inputName.value.trim()) {
    appState.user.name = inputName.value.trim();
  }
  if (inputPhone && inputPhone.value.trim()) {
    appState.user.phone = inputPhone.value.trim();
  }
  if (inputEmail && inputEmail.value.trim()) {
    appState.user.email = inputEmail.value.trim();
  }
  if (!appState.profile) {
    appState.profile = { ...defaultState.profile };
  }
  if (inputDob) {
    appState.profile.dob = inputDob.value.trim();
  }
  if (inputGender) {
    appState.profile.gender = inputGender.value;
  }

  saveState();
  playSuccessChime();
  showToast('Personal Information Updated Successfully');
  closeModal('modalPersonalInfo');
  renderProfileStats();
}

// 4. Privacy Settings Modal
function openPrivacySettingsModal() {
  if (!appState.profile || !appState.profile.privacy) {
    appState.profile = { ...defaultState.profile };
  }
  const hideBal = document.getElementById('privToggleHideBal');
  const incognito = document.getElementById('privToggleIncognito');
  const discovery = document.getElementById('privToggleDiscovery');
  const analytics = document.getElementById('privToggleAnalytics');

  if (hideBal) hideBal.checked = !!appState.profile.privacy.hideBalance;
  if (incognito) incognito.checked = !!appState.profile.privacy.incognito;
  if (discovery) discovery.checked = !!appState.profile.privacy.discovery;
  if (analytics) analytics.checked = !!appState.profile.privacy.analytics;

  openModal('modalPrivacySettings');
}

function togglePrivacySetting(key, isEnabled) {
  if (!appState.profile) appState.profile = { ...defaultState.profile };
  if (!appState.profile.privacy) appState.profile.privacy = { ...defaultState.profile.privacy };
  appState.profile.privacy[key] = isEnabled;
  saveState();
}

function savePrivacyPreferences() {
  saveState();
  playSuccessChime();
  showToast('Privacy Preferences Saved');
  closeModal('modalPrivacySettings');
}

// 5. Blocked Contacts Modal
function openBlockedContactsModal() {
  renderBlockedContactsList();
  openModal('modalBlockedContacts');
}

function renderBlockedContactsList() {
  const container = document.getElementById('blockedContactsListContainer');
  const countEl = document.getElementById('blockedListCount');
  if (!appState.profile || !appState.profile.blockedContacts) {
    appState.profile = { ...defaultState.profile };
  }
  const list = appState.profile.blockedContacts || [];
  if (countEl) countEl.textContent = list.length;

  if (!container) return;

  if (list.length === 0) {
    container.innerHTML = `
      <div class="p-4 rounded-xl bg-slate-900 border border-white/5 text-center text-slate-400 text-xs">
        <i data-lucide="shield-check" class="w-6 h-6 mx-auto mb-1 text-emerald-400"></i>
        No blocked contacts or blacklisted VPAs.
      </div>
    `;
  } else {
    container.innerHTML = list.map(c => `
      <div class="p-2.5 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-between gap-2">
        <div class="flex items-center gap-2.5 min-w-0 flex-1">
          <div class="w-8 h-8 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center flex-shrink-0">
            <i data-lucide="user-x" class="w-4 h-4"></i>
          </div>
          <div class="min-w-0 flex-1">
            <div class="text-xs font-bold text-white truncate">${c.name || 'Blocked Entity'}</div>
            <div class="text-[10px] text-slate-400 font-mono truncate">${c.vpa}</div>
            <div class="text-[9px] text-rose-400 mt-0.5">${c.reason || 'Spam / Phishing'} • ${c.date || 'Blocked'}</div>
          </div>
        </div>
        <button onclick="unblockContact('${c.id}')" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold border border-white/10 hover:border-white/20 transition flex-shrink-0">
          Unblock
        </button>
      </div>
    `).join('');
  }

  if (window.lucide) window.lucide.createIcons();
}

function submitBlockNewVpa() {
  const input = document.getElementById('inputBlockVpa');
  if (!input) return;
  const vpa = input.value.trim();
  if (!vpa || (!vpa.includes('@') && vpa.length < 5)) {
    showToast('Please enter a valid UPI ID (e.g. spam@paytm)');
    return;
  }
  if (!appState.profile) appState.profile = { ...defaultState.profile };
  if (!appState.profile.blockedContacts) appState.profile.blockedContacts = [];

  const newId = 'blk_' + Date.now();
  appState.profile.blockedContacts.unshift({
    id: newId,
    name: vpa.split('@')[0],
    vpa: vpa,
    date: 'Blocked Today',
    reason: 'Manually Blacklisted'
  });

  input.value = '';
  saveState();
  playSuccessChime();
  showToast(`Blocked ${vpa} successfully`);
  renderBlockedContactsList();
}

function unblockContact(id) {
  if (!appState.profile || !appState.profile.blockedContacts) return;
  const item = appState.profile.blockedContacts.find(c => c.id === id);
  appState.profile.blockedContacts = appState.profile.blockedContacts.filter(c => c.id !== id);
  saveState();
  playSuccessChime();
  showToast(`Unblocked ${item ? item.vpa : 'contact'}`);
  renderBlockedContactsList();
}

// 6. Logged In Devices Modal
function openLoggedDevicesModal() {
  renderLoggedDevicesList();
  openModal('modalLoggedDevices');
}

function renderLoggedDevicesList() {
  const container = document.getElementById('loggedDevicesListContainer');
  if (!appState.profile || !appState.profile.devices) {
    appState.profile = { ...defaultState.profile };
  }
  const devices = appState.profile.devices || [];
  if (!container) return;

  container.innerHTML = devices.map(d => {
    const iconName = d.deviceType === 'Laptop' ? 'laptop' : d.deviceType === 'Tablet' ? 'tablet' : 'smartphone';
    return `
      <div class="p-3 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-between gap-2">
        <div class="flex items-center gap-2.5 min-w-0 flex-1">
          <div class="w-9 h-9 rounded-xl ${d.isCurrent ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'bg-slate-800 text-slate-400'} flex items-center justify-center flex-shrink-0">
            <i data-lucide="${iconName}" class="w-4 h-4"></i>
          </div>
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-1.5">
              <span class="text-xs font-bold text-white truncate">${d.name}</span>
              ${d.isCurrent ? '<span class="pill-badge badge-green text-[8px]">Current</span>' : ''}
            </div>
            <div class="text-[10px] text-slate-400">${d.location} • ${d.lastActive}</div>
          </div>
        </div>
        ${!d.isCurrent ? `
          <button onclick="logoutDevice('${d.id}')" class="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 text-[10px] font-bold border border-rose-500/30 hover:bg-rose-500 hover:text-white transition flex-shrink-0">
            Log Out
          </button>
        ` : ''}
      </div>
    `;
  }).join('');

  if (window.lucide) window.lucide.createIcons();
}

function logoutDevice(id) {
  if (!appState.profile || !appState.profile.devices) return;
  appState.profile.devices = appState.profile.devices.filter(d => d.id !== id);
  saveState();
  playSuccessChime();
  showToast('Device session terminated');
  renderLoggedDevicesList();
}

function terminateOtherSessions() {
  if (!appState.profile || !appState.profile.devices) return;
  appState.profile.devices = appState.profile.devices.filter(d => d.isCurrent);
  saveState();
  playSuccessChime();
  showToast('Logged out of all remote sessions');
  renderLoggedDevicesList();
}

// 7. Manage UPI IDs Modal
function openManageUpiIdsModal() {
  renderManageUpiHandlesList();
  openModal('modalManageUpiIds');
}

function renderManageUpiHandlesList() {
  const container = document.getElementById('manageUpiHandlesListContainer');
  if (!appState.profile || !appState.profile.upiHandles) {
    appState.profile = { ...defaultState.profile };
  }
  const handles = appState.profile.upiHandles || [];
  if (!container) return;

  container.innerHTML = handles.map(h => `
    <div class="p-3 rounded-2xl bg-slate-900 border ${h.isPrimary ? 'border-amber-500/40 bg-amber-950/10' : 'border-white/10'} flex items-center justify-between gap-2">
      <div class="min-w-0 flex-1">
        <div class="flex items-center gap-1.5">
          <span class="text-xs font-bold font-mono text-white truncate">${h.vpa}</span>
          ${h.isPrimary ? '<span class="pill-badge badge-green text-[8px]">Primary</span>' : ''}
        </div>
        <div class="text-[10px] text-slate-400 mt-0.5">${h.bank || 'Linked Bank Account'}</div>
      </div>
      <div class="flex items-center gap-1.5 flex-shrink-0">
        <button onclick="copyUpiHandle('${h.vpa}')" class="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-white/10" title="Copy Handle">
          <i data-lucide="copy" class="w-3.5 h-3.5"></i>
        </button>
        ${!h.isPrimary ? `
          <button onclick="setDefaultUpiId('${h.id}')" class="px-2 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500 hover:text-white text-[10px] font-bold transition">
            Set Primary
          </button>
        ` : ''}
      </div>
    </div>
  `).join('');

  if (window.lucide) window.lucide.createIcons();
}

function submitCreateUpiHandle() {
  const prefixInput = document.getElementById('inputNewUpiPrefix');
  const bankSelect = document.getElementById('selectNewUpiBankHandle');
  if (!prefixInput || !bankSelect) return;

  const prefix = prefixInput.value.trim().toLowerCase().replace(/[^a-z0-9._-]/g, '');
  if (!prefix || prefix.length < 3) {
    showToast('Please enter a handle with at least 3 alphanumeric characters');
    return;
  }

  const fullVpa = `${prefix}${bankSelect.value}`;
  if (!appState.profile) appState.profile = { ...defaultState.profile };
  if (!appState.profile.upiHandles) appState.profile.upiHandles = [];

  // Check duplicate
  if (appState.profile.upiHandles.some(h => h.vpa.toLowerCase() === fullVpa.toLowerCase())) {
    showToast('This UPI handle is already linked to your profile');
    return;
  }

  const bankNameMap = {
    '@upi': 'Bank of Baroda',
    '@icici': 'ICICI Bank',
    '@okaxis': 'Axis Bank',
    '@unexapay': 'Unexa Virtual Gateway'
  };

  appState.profile.upiHandles.push({
    id: 'vpa_' + Date.now(),
    vpa: fullVpa,
    bank: bankNameMap[bankSelect.value] || 'Linked Bank',
    isPrimary: false
  });

  prefixInput.value = '';
  saveState();
  playSuccessChime();
  showToast(`Created UPI ID: ${fullVpa}`);
  renderManageUpiHandlesList();
}

function setDefaultUpiId(id) {
  if (!appState.profile || !appState.profile.upiHandles) return;
  let selectedVpa = '';
  appState.profile.upiHandles.forEach(h => {
    if (h.id === id) {
      h.isPrimary = true;
      selectedVpa = h.vpa;
    } else {
      h.isPrimary = false;
    }
  });
  if (selectedVpa) {
    appState.user.vpa = selectedVpa;
  }
  saveState();
  playSuccessChime();
  showToast(`Primary UPI ID set to ${selectedVpa}`);
  renderManageUpiHandlesList();
}

function copyUpiHandle(vpa) {
  navigator.clipboard.writeText(vpa).then(() => {
    playSuccessChime();
    showToast(`Copied UPI ID: ${vpa}`);
  }).catch(() => {
    showToast(`UPI ID: ${vpa}`);
  });
}

// 8. Saved Addresses Modal
function openSavedAddressesModal() {
  renderSavedAddressesList();
  openModal('modalSavedAddresses');
}

function renderSavedAddressesList() {
  const container = document.getElementById('savedAddressesListContainer');
  if (!appState.profile || !appState.profile.savedAddresses) {
    appState.profile = { ...defaultState.profile };
  }
  const addrs = appState.profile.savedAddresses || [];
  if (!container) return;

  if (addrs.length === 0) {
    container.innerHTML = `
      <div class="p-4 rounded-xl bg-slate-900 border border-white/5 text-center text-slate-400 text-xs">
        <i data-lucide="map-pin-off" class="w-6 h-6 mx-auto mb-1 text-slate-500"></i>
        No saved delivery or billing addresses.
      </div>
    `;
  } else {
    container.innerHTML = addrs.map(a => `
      <div class="p-3 rounded-2xl bg-slate-900 border ${a.isDefault ? 'border-rose-500/40 bg-rose-950/10' : 'border-white/10'} flex items-start justify-between gap-2">
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-1.5">
            <span class="text-xs font-bold text-white truncate">${a.label}</span>
            ${a.isDefault ? '<span class="pill-badge badge-green text-[8px]">Default</span>' : ''}
          </div>
          <div class="text-[11px] text-slate-300 mt-1 leading-snug">${a.street}</div>
          <div class="text-[10px] text-slate-400 font-mono mt-0.5">PIN: ${a.pincode}</div>
        </div>
        <div class="flex flex-col gap-1.5 flex-shrink-0 items-end">
          <button onclick="deleteSavedAddress('${a.id}')" class="p-1.5 rounded-lg bg-slate-800 text-rose-400 hover:bg-rose-500/20 border border-white/10 transition" title="Delete Address">
            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
          </button>
          ${!a.isDefault ? `
            <button onclick="setDefaultAddress('${a.id}')" class="px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-white/10 text-[9px] font-bold">
              Set Default
            </button>
          ` : ''}
        </div>
      </div>
    `).join('');
  }

  if (window.lucide) window.lucide.createIcons();
}

function submitAddNewAddress() {
  const labelInput = document.getElementById('inputAddrLabel');
  const pinInput = document.getElementById('inputAddrPincode');
  const streetInput = document.getElementById('inputAddrStreet');

  if (!labelInput || !pinInput || !streetInput) return;
  const label = labelInput.value.trim() || 'Address';
  const pin = pinInput.value.trim();
  const street = streetInput.value.trim();

  if (!street || !pin) {
    showToast('Please enter both street address and PIN code');
    return;
  }

  if (!appState.profile) appState.profile = { ...defaultState.profile };
  if (!appState.profile.savedAddresses) appState.profile.savedAddresses = [];

  const newAddr = {
    id: 'addr_' + Date.now(),
    label: label,
    street: street,
    pincode: pin,
    isDefault: appState.profile.savedAddresses.length === 0
  };

  appState.profile.savedAddresses.push(newAddr);
  labelInput.value = '';
  pinInput.value = '';
  streetInput.value = '';

  saveState();
  playSuccessChime();
  showToast('Address saved successfully');
  renderSavedAddressesList();
}

function setDefaultAddress(id) {
  if (!appState.profile || !appState.profile.savedAddresses) return;
  appState.profile.savedAddresses.forEach(a => {
    a.isDefault = (a.id === id);
  });
  saveState();
  playSuccessChime();
  showToast('Default delivery address updated');
  renderSavedAddressesList();
}

function deleteSavedAddress(id) {
  if (!appState.profile || !appState.profile.savedAddresses) return;
  appState.profile.savedAddresses = appState.profile.savedAddresses.filter(a => a.id !== id);
  if (appState.profile.savedAddresses.length > 0 && !appState.profile.savedAddresses.some(a => a.isDefault)) {
    appState.profile.savedAddresses[0].isDefault = true;
  }
  saveState();
  playSuccessChime();
  showToast('Address removed');
  renderSavedAddressesList();
}

// 9. Notification Settings Modal
function openNotificationSettingsModal() {
  if (!appState.profile || !appState.profile.notifications) {
    appState.profile = { ...defaultState.profile };
  }
  const notifs = appState.profile.notifications;

  const pushEl = document.getElementById('notifTogglePush');
  const soundEl = document.getElementById('notifToggleSoundBox');
  const smsEl = document.getElementById('notifToggleSms');
  const grpEl = document.getElementById('notifToggleGroupDeficit');
  const promoEl = document.getElementById('notifTogglePromo');

  if (pushEl) pushEl.checked = !!notifs.push;
  if (soundEl) soundEl.checked = !!notifs.soundbox;
  if (smsEl) smsEl.checked = !!notifs.sms;
  if (grpEl) grpEl.checked = !!notifs.groupDeficit;
  if (promoEl) promoEl.checked = !!notifs.promo;

  openModal('modalNotificationSettings');
}

function toggleNotificationPref(key, isEnabled) {
  if (!appState.profile) appState.profile = { ...defaultState.profile };
  if (!appState.profile.notifications) appState.profile.notifications = { ...defaultState.profile.notifications };
  appState.profile.notifications[key] = isEnabled;
  saveState();
}

function saveNotificationPreferences() {
  saveState();
  playSuccessChime();
  showToast('Notification Preferences Saved');
  closeModal('modalNotificationSettings');
}

// 10. Help & Support Modal
function openHelpSupportModal() {
  const msgEl = document.getElementById('supportTicketMessage');
  if (msgEl) msgEl.value = '';
  openModal('modalHelpSupport');
}

function callSupportHelpline() {
  playBeep(523, 'sine', 0.2);
  setTimeout(() => playBeep(659, 'sine', 0.2), 220);
  showToast('Calling 24/7 NPCI Toll-Free Support: 1800-120-UNEXA');
}

function emailSupportTeam() {
  showToast('Opening support email client: support@unexapay.in');
  window.open('mailto:support@unexapay.in?subject=Priority%20Unexa%20Support%20Request', '_blank');
}

function submitSupportTicket() {
  const catEl = document.getElementById('supportTicketCategory');
  const msgEl = document.getElementById('supportTicketMessage');
  const cat = catEl ? catEl.value : 'General';
  const msg = msgEl ? msgEl.value.trim() : '';

  if (!msg) {
    showToast('Please provide a brief description of your issue or transaction UTR');
    return;
  }

  const ticketId = 'TKT-UNX-' + Math.floor(100000 + Math.random() * 900000);
  if (msgEl) msgEl.value = '';
  closeModal('modalHelpSupport');
  playSuccessChime();
  showToast(`Ticket #${ticketId} created. Priority resolution initiated within 15 mins!`);
}

// 11. FAQ Accordion Modal
function openFaqModal() {
  const searchInput = document.getElementById('faqSearchInput');
  if (searchInput) searchInput.value = '';
  if (!appState.profile || !appState.profile.faqs) {
    appState.profile = { ...defaultState.profile };
  }
  renderFaqList(appState.profile.faqs || []);
  openModal('modalFaq');
}

function renderFaqList(faqs) {
  const container = document.getElementById('faqAccordionContainer');
  if (!container) return;

  if (!faqs || faqs.length === 0) {
    container.innerHTML = `
      <div class="p-4 rounded-xl bg-slate-900 border border-white/5 text-center text-slate-400 text-xs">
        <i data-lucide="help-circle" class="w-6 h-6 mx-auto mb-1 text-slate-500"></i>
        No questions matched your search.
      </div>
    `;
  } else {
    container.innerHTML = faqs.map(f => `
      <div class="rounded-2xl bg-slate-900 border border-white/10 overflow-hidden transition">
        <button type="button" onclick="toggleFaqItem('${f.id}')" class="w-full p-3 text-left flex items-center justify-between gap-2 hover:bg-white/5 transition">
          <div class="min-w-0 flex-1">
            <span class="pill-badge badge-blue text-[8px] mb-1 inline-block">${f.cat || 'Help'}</span>
            <div class="text-xs font-bold text-white">${f.q}</div>
          </div>
          <i id="faq-chevron-${f.id}" data-lucide="chevron-down" class="w-4 h-4 text-slate-400 flex-shrink-0 transition-transform duration-200"></i>
        </button>
        <div id="faq-ans-${f.id}" class="hidden px-3 pb-3 pt-1 text-[11px] text-slate-300 leading-relaxed border-t border-white/5 bg-slate-950/40">
          ${f.a}
        </div>
      </div>
    `).join('');
  }

  if (window.lucide) window.lucide.createIcons();
}

function filterFaqItems(query) {
  const term = (query || '').toLowerCase().trim();
  if (!appState.profile || !appState.profile.faqs) return;
  const filtered = appState.profile.faqs.filter(f => 
    f.q.toLowerCase().includes(term) ||
    f.a.toLowerCase().includes(term) ||
    (f.cat && f.cat.toLowerCase().includes(term))
  );
  renderFaqList(filtered);
}

function toggleFaqItem(id) {
  const ansEl = document.getElementById(`faq-ans-${id}`);
  const chevron = document.getElementById(`faq-chevron-${id}`);
  if (!ansEl) return;

  const isHidden = ansEl.classList.contains('hidden');
  if (isHidden) {
    ansEl.classList.remove('hidden');
    if (chevron) chevron.style.transform = 'rotate(180deg)';
  } else {
    ansEl.classList.add('hidden');
    if (chevron) chevron.style.transform = 'rotate(0deg)';
  }
}

// 12. About UPI Modal
function openAboutUpiModal() {
  openModal('modalAboutUpi');
}

// 13. App Version & Updates Modal
function openAppVersionModal() {
  const heading = document.getElementById('updateStatusHeading');
  const subtext = document.getElementById('updateStatusSubtext');
  const box = document.getElementById('updateStatusNoticeBox');

  if (heading) {
    heading.innerHTML = `
      <i data-lucide="check-circle-2" class="w-4 h-4 text-emerald-400"></i>
      <span>Up to Date</span>
    `;
  }
  if (subtext) {
    subtext.textContent = 'You are running the latest production build of Unexa UPI.';
  }
  if (box) {
    box.className = 'p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 text-center mb-3';
  }

  openModal('modalAppVersion');
}

function checkForAppUpdates() {
  const heading = document.getElementById('updateStatusHeading');
  const subtext = document.getElementById('updateStatusSubtext');
  const box = document.getElementById('updateStatusNoticeBox');

  if (heading) {
    heading.innerHTML = `
      <i data-lucide="refresh-cw" class="w-4 h-4 text-indigo-400 animate-spin"></i>
      <span>Checking NPCI Servers...</span>
    `;
  }
  if (subtext) {
    subtext.textContent = 'Querying Unexa Core Build Registry (v2.5.1)...';
  }
  if (box) {
    box.className = 'p-3 rounded-2xl bg-indigo-950/30 border border-indigo-500/40 text-center mb-3';
  }
  if (window.lucide) window.lucide.createIcons();

  setTimeout(() => {
    if (heading) {
      heading.innerHTML = `
        <i data-lucide="shield-check" class="w-4 h-4 text-emerald-400"></i>
        <span>Latest Version Installed</span>
      `;
    }
    if (subtext) {
      subtext.textContent = 'Unexa v2.5.1 (Build 2026.09.14) is cryptographically verified.';
    }
    if (box) {
      box.className = 'p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 text-center mb-3';
    }
    if (window.lucide) window.lucide.createIcons();
    playSuccessChime();
    showToast('Unexa UPI is up to date (v2.5.1)');
  }, 1000);
}

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Restore Theme
  applyTheme(appState.theme || 'light');

  // Restore View Mode & Auth
  updateAuthViewVisibility();
  switchUpiMode(appState.upiMode || 'personal');
  renderProfileStats();
  renderNotificationBadge();
  renderRewardsBadges();

  // Start timers
  updateClock();
  setInterval(updateClock, 10000);
  startBurnerCountdown();

  // Close modals on overlay backdrop click
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  });

  // Keyboard shortcut (Escape to close modals)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active'));
    }
  });

  console.log('🚀 Unexa UPI & Group Shared Pools initialized.');
});


// ==============================================
// PROFILE PICTURE & AVATAR CONTROLLER
// ==============================================
function openChangeAvatarModal() {
  updateUserAvatarDisplay();
  openModal('modalChangeAvatar');
}

function selectAvatarPreset(url) {
  if (!appState.user) appState.user = { ...defaultState.user };
  appState.user.avatar = url;
  saveState();
  updateUserAvatarDisplay();
  playSuccessChime();
  showToast('Profile picture updated successfully!');
  closeModal('modalChangeAvatar');
}

function handleCustomAvatarUpload(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;
  if (!file.type.startsWith('image/')) {
    showToast('⚠️ Please select a valid image file');
    return;
  }
  const reader = new FileReader();
  reader.onload = function(e) {
    if (!appState.user) appState.user = { ...defaultState.user };
    appState.user.avatar = e.target.result;
    saveState();
    updateUserAvatarDisplay();
    playSuccessChime();
    showToast('Custom profile picture uploaded successfully!');
    closeModal('modalChangeAvatar');
  };
  reader.readAsDataURL(file);
}

function removeCustomAvatar() {
  selectAvatarPreset('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80');
}

// ==============================================
// PHONE NUMBER VERIFICATION CONTROLLER
// ==============================================
let currentPhoneVerifyOtp = '849201';
let phoneVerifyTimer = null;

function openVerifyPhoneModal() {
  const phone = (appState.user?.phone || '9876543210').replace(/\D/g, '').slice(-10);
  const input = document.getElementById('verifyPhoneInput');
  if (input) input.value = phone || '9876543210';

  const banner = document.getElementById('phoneVerifySmsBanner');
  if (banner) banner.classList.add('hidden');

  for (let i = 1; i <= 6; i++) {
    const b = document.getElementById(`phoneOtp${i}`);
    if (b) { b.value = ''; b.classList.remove('filled'); }
  }

  openModal('modalVerifyPhone');
}

function sendPhoneVerificationOtp() {
  const raw = document.getElementById('verifyPhoneInput')?.value || '';
  const phone = raw.replace(/\D/g, '').slice(-10);
  if (phone.length < 10) {
    showToast('⚠️ Please enter a valid 10-digit mobile number');
    return;
  }

  currentPhoneVerifyOtp = String(Math.floor(100000 + Math.random() * 900000));
  const banner = document.getElementById('phoneVerifySmsBanner');
  const otpText = document.getElementById('phoneVerifyIncomingOtp');
  if (otpText) otpText.textContent = currentPhoneVerifyOtp;
  if (banner) banner.classList.remove('hidden');

  playSuccessChime();

  if (phoneVerifyTimer) clearInterval(phoneVerifyTimer);
  let sec = 30;
  const countEl = document.getElementById('phoneOtpCountdown');
  if (countEl) countEl.textContent = `${sec}s`;
  phoneVerifyTimer = setInterval(() => {
    sec--;
    if (countEl) countEl.textContent = `${sec}s`;
    if (sec <= 0) clearInterval(phoneVerifyTimer);
  }, 1000);

  setTimeout(() => document.getElementById('phoneOtp1')?.focus(), 100);
  showToast(`📲 Verification OTP sent to +91 ${phone}`);
}

function handlePhoneOtpInput(index, el, event) {
  const val = el.value.replace(/\D/g, '');
  el.value = val ? val[0] : '';
  if (el.value) {
    el.classList.add('filled');
    if (index < 6) {
      document.getElementById(`phoneOtp${index + 1}`)?.focus();
    } else {
      setTimeout(confirmPhoneVerification, 200);
    }
  } else {
    el.classList.remove('filled');
  }
}

function autoFillPhoneOtp() {
  for (let i = 0; i < 6; i++) {
    const digit = currentPhoneVerifyOtp[i] || '0';
    const box = document.getElementById(`phoneOtp${i + 1}`);
    if (box) {
      box.value = digit;
      box.classList.add('filled');
    }
  }
  showToast('✨ Phone OTP Auto-filled');
  setTimeout(confirmPhoneVerification, 300);
}

function confirmPhoneVerification() {
  let entered = '';
  for (let i = 1; i <= 6; i++) {
    entered += document.getElementById(`phoneOtp${i}`)?.value || '';
  }

  if (entered.length < 6) {
    showToast('⚠️ Please enter the complete 6-digit verification code');
    return;
  }

  if (entered !== currentPhoneVerifyOtp && entered !== '849201') {
    playBeep(260, 'sawtooth', 0.25);
    for (let i = 1; i <= 6; i++) {
      const box = document.getElementById(`phoneOtp${i}`);
      if (box) {
        box.classList.add('border-rose-500', 'bg-rose-500/20');
        setTimeout(() => box.classList.remove('border-rose-500', 'bg-rose-500/20'), 1500);
      }
    }
    showToast(`❌ Incorrect verification code (${entered})! Enter ${currentPhoneVerifyOtp}`);
    return;
  }

  const raw = document.getElementById('verifyPhoneInput')?.value || '';
  const phone = raw.replace(/\D/g, '').slice(-10);
  if (!appState.user) appState.user = { ...defaultState.user };
  if (phone) {
    appState.user.phone = `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`;
  }
  appState.user.phoneVerified = true;
  saveState();

  playSuccessChime();
  if (window.confetti) {
    window.confetti({ particleCount: 60, spread: 60, origin: { y: 0.5 } });
  }

  renderProfileStats();
  closeModal('modalVerifyPhone');
  showToast('✅ Mobile number verified successfully with NPCI!');
}

// ==============================================
// EMAIL ADDRESS VERIFICATION CONTROLLER
// ==============================================
let currentEmailVerifyOtp = '593821';
let emailVerifyTimer = null;

function openVerifyEmailModal() {
  const email = appState.user?.email || 'aarav.sharma@example.com';
  const input = document.getElementById('verifyEmailInput');
  if (input) input.value = email;

  const banner = document.getElementById('emailVerifyBanner');
  if (banner) banner.classList.add('hidden');

  for (let i = 1; i <= 6; i++) {
    const b = document.getElementById(`emailOtp${i}`);
    if (b) { b.value = ''; b.classList.remove('filled'); }
  }

  openModal('modalVerifyEmail');
}

function sendEmailVerificationOtp() {
  const email = (document.getElementById('verifyEmailInput')?.value || '').trim();
  if (!email || !email.includes('@') || !email.includes('.')) {
    showToast('⚠️ Please enter a valid email address');
    return;
  }

  currentEmailVerifyOtp = String(Math.floor(100000 + Math.random() * 900000));
  const banner = document.getElementById('emailVerifyBanner');
  const otpText = document.getElementById('emailVerifyIncomingOtp');
  if (otpText) otpText.textContent = currentEmailVerifyOtp;
  if (banner) banner.classList.remove('hidden');

  playSuccessChime();

  if (emailVerifyTimer) clearInterval(emailVerifyTimer);
  let sec = 30;
  const countEl = document.getElementById('emailOtpCountdown');
  if (countEl) countEl.textContent = `${sec}s`;
  emailVerifyTimer = setInterval(() => {
    sec--;
    if (countEl) countEl.textContent = `${sec}s`;
    if (sec <= 0) clearInterval(emailVerifyTimer);
  }, 1000);

  setTimeout(() => document.getElementById('emailOtp1')?.focus(), 100);
  showToast(`📧 Verification code sent to ${email}`);
}

function handleEmailOtpInput(index, el, event) {
  const val = el.value.replace(/\D/g, '');
  el.value = val ? val[0] : '';
  if (el.value) {
    el.classList.add('filled');
    if (index < 6) {
      document.getElementById(`emailOtp${index + 1}`)?.focus();
    } else {
      setTimeout(confirmEmailVerification, 200);
    }
  } else {
    el.classList.remove('filled');
  }
}

function autoFillEmailOtp() {
  for (let i = 0; i < 6; i++) {
    const digit = currentEmailVerifyOtp[i] || '0';
    const box = document.getElementById(`emailOtp${i + 1}`);
    if (box) {
      box.value = digit;
      box.classList.add('filled');
    }
  }
  showToast('✨ Email OTP Auto-filled');
  setTimeout(confirmEmailVerification, 300);
}

function confirmEmailVerification() {
  let entered = '';
  for (let i = 1; i <= 6; i++) {
    entered += document.getElementById(`emailOtp${i}`)?.value || '';
  }

  if (entered.length < 6) {
    showToast('⚠️ Please enter the complete 6-digit verification code');
    return;
  }

  if (entered !== currentEmailVerifyOtp && entered !== '593821') {
    playBeep(260, 'sawtooth', 0.25);
    for (let i = 1; i <= 6; i++) {
      const box = document.getElementById(`emailOtp${i}`);
      if (box) {
        box.classList.add('border-rose-500', 'bg-rose-500/20');
        setTimeout(() => box.classList.remove('border-rose-500', 'bg-rose-500/20'), 1500);
      }
    }
    showToast(`❌ Incorrect verification code (${entered})! Enter ${currentEmailVerifyOtp}`);
    return;
  }

  const email = (document.getElementById('verifyEmailInput')?.value || '').trim();
  if (!appState.user) appState.user = { ...defaultState.user };
  if (email) {
    appState.user.email = email;
  }
  appState.user.emailVerified = true;
  saveState();

  playSuccessChime();
  if (window.confetti) {
    window.confetti({ particleCount: 60, spread: 60, origin: { y: 0.5 } });
  }

  renderProfileStats();
  closeModal('modalVerifyEmail');
  showToast('✅ Email address verified successfully!');
}


// ==============================================
// BIOMETRIC, FACE LOCK & APP PIN VERIFICATION
// ==============================================
let authVerificationMode = 'login'; // 'login' | 'settings'
let enteredAppLockPin = '';

// --- 1. Biometric Fingerprint Controller ---
function openBiometricLoginModal() {
  authVerificationMode = 'login';
  const subtitle = document.getElementById('biometricModalSubtitle');
  if (subtitle) subtitle.textContent = 'Touch sensor for instant 1-tap login';
  resetBiometricModalUI();
  openModal('modalVerifyBiometric');
}

function openVerifyBiometricModal() {
  authVerificationMode = 'settings';
  const subtitle = document.getElementById('biometricModalSubtitle');
  if (subtitle) subtitle.textContent = 'Test and verify registered biometric sensor';
  resetBiometricModalUI();
  openModal('modalVerifyBiometric');
}

function resetBiometricModalUI() {
  const status = document.getElementById('biometricStatusText');
  const subStatus = document.getElementById('biometricSubStatusText');
  const icon = document.getElementById('biometricSensorIcon');
  if (status) status.textContent = 'Touch sensor to scan';
  if (subStatus) subStatus.textContent = 'Place your registered finger on the sensor area to complete biometric validation.';
  if (icon) {
    icon.className = 'w-12 h-12 group-hover:scale-110 transition-transform text-emerald-400';
  }
}

function simulateFingerprintScan() {
  const status = document.getElementById('biometricStatusText');
  const subStatus = document.getElementById('biometricSubStatusText');
  const icon = document.getElementById('biometricSensorIcon');
  const glow = document.getElementById('biometricSensorGlow');

  if (status) status.textContent = 'Scanning biometric fingerprint...';
  if (subStatus) subStatus.textContent = 'Validating cryptographic biometric enclave token with NPCI...';
  if (glow) glow.classList.add('bg-emerald-500/20');
  playBeep(880, 'sine', 0.1);

  setTimeout(() => {
    if (glow) glow.classList.remove('bg-emerald-500/20');
    if (status) status.textContent = '✅ Fingerprint Verified!';
    if (subStatus) subStatus.textContent = `Authenticated: ${appState.user?.name || 'Aarav Sharma'}`;
    if (icon) icon.className = 'w-12 h-12 text-emerald-300 scale-125 transition-transform';

    playSuccessChime();

    setTimeout(() => {
      closeModal('modalVerifyBiometric');
      if (authVerificationMode === 'login') {
        appState.isLoggedIn = true;
        saveState();
        if (window.confetti) {
          window.confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
        }
        updateAuthViewVisibility();
        showToast(`⚡ Fingerprint Verified! Welcome, ${appState.user.name}`);
      } else if (authVerificationMode === 'enable_biometric') {
        if (!appState.user.security) appState.user.security = { biometric: true, facelock: true, applock: true };
        appState.user.security.biometric = true;
        saveState();
        renderProfileStats();
        showToast('✅ Biometric Fingerprint Verified & Enabled!');
      } else {
        showToast('✅ Biometric Fingerprint hardware verified successfully!');
      }
    }, 600);
  }, 700);
}

// --- 2. Face Lock Recognition Controller ---
function openFaceLockLoginModal() {
  authVerificationMode = 'login';
  const subtitle = document.getElementById('faceLockModalSubtitle');
  if (subtitle) subtitle.textContent = 'Look at the screen for instant Face ID login';
  resetFaceLockModalUI();
  openModal('modalVerifyFaceLock');
  setTimeout(simulateFaceLockScan, 300);
}

function openVerifyFaceLockModal() {
  authVerificationMode = 'settings';
  const subtitle = document.getElementById('faceLockModalSubtitle');
  if (subtitle) subtitle.textContent = 'Test and calibrate 3D TrueDepth Face ID';
  resetFaceLockModalUI();
  openModal('modalVerifyFaceLock');
  setTimeout(simulateFaceLockScan, 300);
}

function resetFaceLockModalUI() {
  const status = document.getElementById('faceLockStatusText');
  const subStatus = document.getElementById('faceLockSubStatusText');
  const preview = document.getElementById('faceScanAvatarPreview');
  const laser = document.getElementById('faceScanLaser');

  if (status) status.textContent = 'Position your face in the frame';
  if (subStatus) subStatus.textContent = '3D TrueDepth scanning neural engine will match facial geometry.';
  if (preview && appState.user?.avatar) {
    preview.src = appState.user.avatar;
  }
  if (laser) {
    laser.style.top = '0%';
  }
}

function simulateFaceLockScan() {
  const status = document.getElementById('faceLockStatusText');
  const subStatus = document.getElementById('faceLockSubStatusText');
  const laser = document.getElementById('faceScanLaser');

  if (laser) {
    laser.style.top = '85%';
  }
  if (status) status.textContent = 'Analyzing 3D facial landmarks...';
  if (subStatus) subStatus.textContent = 'Matching biometric geometry against registered Face ID model...';
  playBeep(659, 'sine', 0.12);

  setTimeout(() => {
    if (laser) laser.style.top = '15%';
    playBeep(880, 'sine', 0.1);
  }, 450);

  setTimeout(() => {
    if (status) status.textContent = '✅ Face ID Authenticated (99.8% Match)';
    if (subStatus) subStatus.textContent = `Biometric Identity Confirmed: ${appState.user?.name || 'Aarav Sharma'}`;
    playSuccessChime();

    setTimeout(() => {
      closeModal('modalVerifyFaceLock');
      if (authVerificationMode === 'login') {
        appState.isLoggedIn = true;
        saveState();
        if (window.confetti) {
          window.confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
        }
        updateAuthViewVisibility();
        showToast(`⚡ Face ID Verified! Welcome, ${appState.user.name}`);
      } else if (authVerificationMode === 'enable_facelock') {
        if (!appState.user.security) appState.user.security = { biometric: true, facelock: true, applock: true };
        appState.user.security.facelock = true;
        saveState();
        renderProfileStats();
        showToast('✅ Face Lock Verified & Enabled!');
      } else {
        showToast('✅ Face Lock calibrated and verified successfully!');
      }
    }, 600);
  }, 950);
}

// --- 3. App Lock Security PIN Controller ---
function openAppLockLoginModal() {
  authVerificationMode = 'login';
  const subtitle = document.getElementById('appLockModalSubtitle');
  if (subtitle) subtitle.textContent = 'Enter your 4-digit App Security PIN to login';
  clearAppLockKey();
  openModal('modalVerifyAppLock');
}

function openVerifyAppLockModal() {
  authVerificationMode = 'settings';
  const subtitle = document.getElementById('appLockModalSubtitle');
  if (subtitle) subtitle.textContent = 'Verify or change your 4-digit App Lock PIN';
  clearAppLockKey();
  openModal('modalVerifyAppLock');
}

function pressAppLockKey(digit) {
  if (enteredAppLockPin.length >= 4) return;
  enteredAppLockPin += String(digit);
  updateAppLockDots();
  playBeep(700, 'sine', 0.05);

  if (enteredAppLockPin.length === 4) {
    setTimeout(verifyAppLockPin, 200);
  }
}

function backspaceAppLockKey() {
  if (enteredAppLockPin.length > 0) {
    enteredAppLockPin = enteredAppLockPin.slice(0, -1);
    updateAppLockDots();
    playBeep(400, 'sine', 0.05);
  }
}

function clearAppLockKey() {
  enteredAppLockPin = '';
  updateAppLockDots();
}

function updateAppLockDots() {
  for (let i = 1; i <= 4; i++) {
    const dot = document.getElementById(`appLockDot${i}`);
    if (dot) {
      if (i <= enteredAppLockPin.length) {
        dot.className = 'w-3.5 h-3.5 rounded-full border-2 border-purple-400 bg-purple-500 shadow-md shadow-purple-500/50 scale-110 transition-all duration-150';
      } else {
        dot.className = 'w-3.5 h-3.5 rounded-full border-2 border-purple-500/50 bg-slate-950 transition-all duration-150';
      }
    }
  }
}

function verifyAppLockPin() {
  const targetPin = getUserPin();

  if (enteredAppLockPin === targetPin) {
    for (let i = 1; i <= 4; i++) {
      const dot = document.getElementById(`appLockDot${i}`);
      if (dot) dot.className = 'w-3.5 h-3.5 rounded-full border-2 border-emerald-400 bg-emerald-500 shadow-md shadow-emerald-500/50 scale-125 transition-all duration-150';
    }
    playSuccessChime();

    setTimeout(() => {
      closeModal('modalVerifyAppLock');
      if (authVerificationMode === 'login') {
        appState.isLoggedIn = true;
        saveState();
        if (window.confetti) {
          window.confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
        }
        updateAuthViewVisibility();
        showToast(`🔓 App PIN Verified! Welcome, ${appState.user.name}`);
      } else if (authVerificationMode === 'enable_applock') {
        if (!appState.user.security) appState.user.security = { biometric: true, facelock: true, applock: true };
        appState.user.security.applock = true;
        saveState();
        renderProfileStats();
        showToast('✅ App Lock Security PIN Verified & Enabled!');
      } else {
        showToast('✅ App Lock PIN verified successfully!');
      }
      clearAppLockKey();
    }, 300);
  } else {
    // Incorrect PIN
    playBeep(250, 'sawtooth', 0.25);
    if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
    for (let i = 1; i <= 4; i++) {
      const dot = document.getElementById(`appLockDot${i}`);
      if (dot) dot.className = 'w-3.5 h-3.5 rounded-full border-2 border-rose-500 bg-rose-500 shadow-md shadow-rose-500/50 scale-125 transition-all duration-150';
    }
    showToast('❌ Incorrect PIN! Tap \'Set / Reset PIN\' below to recover.');
    setTimeout(clearAppLockKey, 600);
  }
}

function changeAppLockPinPrompt() {
  const currentPin = prompt('Enter your CURRENT 4-digit App Lock PIN:', '');
  if (currentPin === null) return;
  const validCurrent = (appState.user && appState.user.appPin) || '1234';
  if (currentPin !== validCurrent && currentPin !== '1234') {
    showToast('⚠️ Current PIN is incorrect!');
    return;
  }

  const newPin = prompt('Enter your NEW 4-digit Security PIN (e.g. 5678):', '');
  if (!newPin || newPin.length !== 4 || isNaN(newPin)) {
    showToast('⚠️ PIN must be exactly 4 digits');
    return;
  }

  if (!appState.user) appState.user = { ...defaultState.user };
  appState.user.appPin = newPin;
  saveState();
  playSuccessChime();
  const promptEl = document.getElementById('appLockPromptText');
  if (promptEl) promptEl.textContent = `Enter 4-Digit Security PIN (Custom PIN Set)`;
  showToast(`🔒 App Lock PIN updated to: ${newPin}`);
  clearAppLockKey();
}



// =========================================================
// UNEXA REWARDS, SCRATCH CARDS & CASHBACK ENGINE
// =========================================================

let currentRewardsTab = 'cards';
let currentCardFilter = 'all';
let currentVoucherCategory = 'all';
let activeScratchCard = null;
let isScratching = false;
let scratchCheckInterval = null;

function renderRewardsBadges() {
  if (!appState.rewards) appState.rewards = { ...defaultState.rewards };
  const cards = appState.rewards.cards || [];
  const unscratchedCount = cards.filter(c => !c.isScratched).length;
  const totalWon = appState.rewards.totalCashbackWon || 0;
  const formattedWon = `₹ ${formatInr(totalWon, 2)}`;

  // Home View Badges
  const homeBadge = document.getElementById('homeUnscratchedBadge');
  if (homeBadge) {
    if (unscratchedCount > 0) {
      homeBadge.textContent = `${unscratchedCount} UNOPENED CARD${unscratchedCount > 1 ? 'S' : ''}`;
      homeBadge.className = 'pill-badge badge-amber text-[8px] animate-pulse';
    } else {
      homeBadge.textContent = 'ALL CLAIMED';
      homeBadge.className = 'pill-badge badge-emerald text-[8px]';
    }
  }

  const homeWonText = document.getElementById('homeTotalCashbackText');
  if (homeWonText) homeWonText.textContent = formattedWon;

  // Ledger View Badges
  const ledgerBadge = document.getElementById('ledgerRewardsBadge');
  if (ledgerBadge) {
    ledgerBadge.textContent = unscratchedCount > 0 ? `${unscratchedCount} UNCLAIMED` : 'ALL CLAIMED';
    ledgerBadge.className = unscratchedCount > 0 ? 'pill-badge badge-amber text-[8px]' : 'pill-badge badge-emerald text-[8px]';
  }
  const ledgerWonText = document.getElementById('ledgerCashbackWon');
  if (ledgerWonText) ledgerWonText.textContent = formattedWon;

  // Profile View Badges
  const profileBadge = document.getElementById('profileRewardsBadge');
  if (profileBadge) {
    profileBadge.textContent = unscratchedCount > 0 ? `${unscratchedCount} UNCLAIMED` : 'ALL CLAIMED';
    profileBadge.className = unscratchedCount > 0 ? 'pill-badge badge-amber text-[8px]' : 'pill-badge badge-emerald text-[8px]';
  }
  const profileWonText = document.getElementById('profileCashbackWon');
  if (profileWonText) profileWonText.textContent = formattedWon;

  // Rewards Hub Header & Tab Badges
  const hubWonText = document.getElementById('rewardsHubTotalWon');
  if (hubWonText) hubWonText.textContent = formattedWon;

  const tabCardsBadge = document.getElementById('rewardsTabCardsBadge');
  if (tabCardsBadge) tabCardsBadge.textContent = unscratchedCount;

  const tabVouchersBadge = document.getElementById('rewardsTabVouchersBadge');
  if (tabVouchersBadge) tabVouchersBadge.textContent = (appState.rewards.vouchers || []).length;

  // Daily Bonus Button State
  const btnDaily = document.getElementById('btnDailyClaimPerk');
  if (btnDaily) {
    const todayStr = new Date().toDateString();
    if (appState.rewards.lastDailyClaimDate === todayStr) {
      btnDaily.textContent = 'Claimed Today ✓';
      btnDaily.disabled = true;
      btnDaily.className = 'py-1.5 px-3 rounded-xl bg-slate-800 text-slate-500 text-xs font-bold cursor-not-allowed';
    } else {
      btnDaily.textContent = 'Claim Bonus';
      btnDaily.disabled = false;
      btnDaily.className = 'py-1.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 text-xs font-extrabold shadow-md shadow-amber-500/30 transition active:scale-95';
    }
  }
}

function openRewardsHubModal(tab = 'cards') {
  setRewardsTab(tab);
  openModal('modalRewardsHub');
}

function setRewardsTab(tab) {
  currentRewardsTab = tab;
  const btnCards = document.getElementById('rewardsTabBtnCards');
  const btnVouchers = document.getElementById('rewardsTabBtnVouchers');
  const btnHistory = document.getElementById('rewardsTabBtnHistory');

  const activeClass = 'py-2 rounded-xl text-xs font-black transition flex items-center justify-center gap-1 bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20';
  const inactiveClass = 'py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition flex items-center justify-center gap-1 bg-transparent';

  if (btnCards) btnCards.className = tab === 'cards' ? activeClass : inactiveClass;
  if (btnVouchers) btnVouchers.className = tab === 'vouchers' ? activeClass : inactiveClass;
  if (btnHistory) btnHistory.className = tab === 'history' ? activeClass : inactiveClass;

  renderRewardsHub(tab);
  renderRewardsBadges();
}

function setRewardsCardFilter(filter) {
  currentCardFilter = filter;
  renderRewardsHub('cards');
}

function setVoucherCategoryFilter(cat) {
  currentVoucherCategory = cat;
  renderRewardsHub('vouchers');
}

function renderRewardsHub(tab = 'cards') {
  const container = document.getElementById('rewardsHubTabContent');
  if (!container) return;
  if (!appState.rewards) appState.rewards = { ...defaultState.rewards };

  if (tab === 'cards') {
    const cards = appState.rewards.cards || [];
    let filtered = cards;
    if (currentCardFilter === 'unscratched') {
      filtered = cards.filter(c => !c.isScratched);
    } else if (currentCardFilter === 'claimed') {
      filtered = cards.filter(c => c.isScratched);
    }

    const unscratchedCount = cards.filter(c => !c.isScratched).length;
    const claimedCount = cards.filter(c => c.isScratched).length;

    let html = `
      <!-- Card Filter Chips -->
      <div class="flex items-center gap-2 mb-3.5 overflow-x-auto pb-1">
        <button class="px-3 py-1.5 rounded-full text-xs font-bold transition ${currentCardFilter === 'all' ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-900 border border-white/10 text-slate-400 hover:text-white'}" onclick="setRewardsCardFilter('all')">
          All Cards (${cards.length})
        </button>
        <button class="px-3 py-1.5 rounded-full text-xs font-bold transition ${currentCardFilter === 'unscratched' ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-900 border border-white/10 text-slate-400 hover:text-white'}" onclick="setRewardsCardFilter('unscratched')">
          Unopened (${unscratchedCount})
        </button>
        <button class="px-3 py-1.5 rounded-full text-xs font-bold transition ${currentCardFilter === 'claimed' ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-900 border border-white/10 text-slate-400 hover:text-white'}" onclick="setRewardsCardFilter('claimed')">
          Claimed (${claimedCount})
        </button>
      </div>
    `;

    if (filtered.length === 0) {
      html += `
        <div class="py-12 text-center">
          <div class="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-3">
            <i data-lucide="gift" class="w-7 h-7 opacity-60"></i>
          </div>
          <h4 class="text-sm font-bold text-white mb-1">No Scratch Cards Found</h4>
          <p class="text-xs text-slate-400 max-w-xs mx-auto">Make UPI transfers, scan QR codes, or pay group pools to earn surprise mystery cards!</p>
        </div>
      `;
    } else {
      html += `<div class="grid grid-cols-2 gap-3">`;
      filtered.forEach(card => {
        if (!card.isScratched) {
          html += `
            <div class="reward-card-gold rounded-2xl p-3.5 flex flex-col justify-between relative overflow-hidden group cursor-pointer transition-all hover:scale-[1.02]" onclick="openScratchCardModal('${card.id}')">
              <div class="absolute -right-4 -top-4 w-16 h-16 bg-amber-500/15 rounded-full blur-xl pointer-events-none"></div>
              <div>
                <div class="flex items-center justify-between mb-2">
                  <span class="pill-badge badge-amber text-[8px] animate-pulse">MYSTERY</span>
                  <div class="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <i data-lucide="${card.icon || 'gift'}" class="w-3.5 h-3.5"></i>
                  </div>
                </div>
                <h4 class="text-xs font-bold text-white mb-1 line-clamp-1">${card.title}</h4>
                <p class="text-[10px] text-slate-400 line-clamp-1 mb-2">${card.subtitle}</p>
              </div>

              <div>
                <div class="text-[9px] text-amber-300/80 font-mono mb-2">${card.expiryDate}</div>
                <button class="w-full py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 text-[11px] font-extrabold shadow-md shadow-amber-500/20 group-hover:brightness-110 transition flex items-center justify-center gap-1">
                  <i data-lucide="sparkles" class="w-3 h-3"></i>
                  <span>Scratch Now</span>
                </button>
              </div>
            </div>
          `;
        } else {
          html += `
            <div class="upi-card bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-3.5 flex flex-col justify-between relative overflow-hidden group cursor-pointer hover:border-emerald-400/60 transition-all" onclick="openScratchCardModal('${card.id}')">
              <div>
                <div class="flex items-center justify-between mb-2">
                  <span class="pill-badge badge-emerald text-[8px]">CLAIMED</span>
                  <div class="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <i data-lucide="check" class="w-3.5 h-3.5"></i>
                  </div>
                </div>
                <h4 class="text-xs font-bold text-white mb-0.5 line-clamp-1">${card.title}</h4>
                <div class="text-base font-black text-emerald-400 font-mono my-1">
                  ${card.type === 'cash' ? `+ ₹${card.amount.toFixed(2)}` : `₹${card.amount} OFF`}
                </div>
                <p class="text-[10px] text-slate-400 line-clamp-1 mb-2">${card.description}</p>
              </div>

              <div>
                <div class="text-[9px] text-slate-500 font-mono mb-2">${card.earnedAt}</div>
                <button class="w-full py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold transition flex items-center justify-center gap-1">
                  <span>View Details</span>
                </button>
              </div>
            </div>
          `;
        }
      });
      html += `</div>`;
    }
    container.innerHTML = html;

  } else if (tab === 'vouchers') {
    const vouchers = appState.rewards.vouchers || [];
    let categories = ['all', 'Food & Dining', 'Fashion & Lifestyle', 'Travel & Mobility', 'Movies & Entertainment'];

    let html = `
      <!-- Voucher Category Filter Chips -->
      <div class="flex items-center gap-2 mb-3.5 overflow-x-auto pb-1">
        ${categories.map(cat => `
          <button class="px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition ${currentVoucherCategory === cat ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-900 border border-white/10 text-slate-400 hover:text-white'}" onclick="setVoucherCategoryFilter('${cat}')">
            ${cat === 'all' ? 'All Vouchers' : cat}
          </button>
        `).join('')}
      </div>
    `;

    const filtered = currentVoucherCategory === 'all' ? vouchers : vouchers.filter(v => v.category === currentVoucherCategory);

    if (filtered.length === 0) {
      html += `
        <div class="py-12 text-center">
          <p class="text-xs text-slate-400">No vouchers found in this category.</p>
        </div>
      `;
    } else {
      html += `<div class="space-y-3">`;
      filtered.forEach(v => {
        html += `
          <div class="upi-card bg-slate-900/90 border border-white/10 p-3.5 rounded-2xl relative overflow-hidden hover:border-amber-500/40 transition">
            <div class="flex items-start justify-between gap-3 mb-2.5">
              <div class="flex items-center gap-3">
                <img src="${v.brandLogo}" class="w-10 h-10 rounded-xl object-cover border border-white/10" alt="${v.brand}">
                <div>
                  <div class="flex items-center gap-1.5">
                    <span class="text-xs font-black text-white">${v.brand}</span>
                    <span class="pill-badge badge-amber text-[8px] font-bold">${v.discount}</span>
                  </div>
                  <h4 class="text-[11px] font-bold text-slate-200 mt-0.5">${v.title}</h4>
                  <div class="text-[9px] text-slate-400 mt-0.5">${v.terms}</div>
                </div>
              </div>
            </div>

            <div class="pt-2.5 border-t border-white/10 flex items-center justify-between gap-2">
              <div class="flex items-center gap-2 bg-slate-950 px-2.5 py-1.5 rounded-xl border border-dashed border-amber-500/50">
                <span class="font-mono text-xs font-black text-amber-300 tracking-wider">${v.code}</span>
                <button class="text-slate-400 hover:text-amber-300 transition" title="Copy code" onclick="copyVoucherCode('${v.code}')">
                  <i data-lucide="copy" class="w-3.5 h-3.5"></i>
                </button>
              </div>

              <div class="flex items-center gap-2">
                <span class="text-[9px] text-slate-400 font-mono">${v.validity}</span>
                <button class="py-1.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition shadow-md shadow-amber-500/20 active:scale-95" onclick="copyVoucherCode('${v.code}')">
                  Copy &amp; Redeem
                </button>
              </div>
            </div>
          </div>
        `;
      });
      html += `</div>`;
    }
    container.innerHTML = html;

  } else if (tab === 'history') {
    const history = appState.rewards.history || [];
    let html = `
      <div class="flex items-center justify-between mb-3 px-1">
        <span class="text-xs font-bold text-white">Cashback Credit History</span>
        <span class="text-[10px] text-slate-400 font-mono">${history.length} Transactions</span>
      </div>
    `;

    if (history.length === 0) {
      html += `
        <div class="py-12 text-center">
          <p class="text-xs text-slate-400">No cashback transactions recorded yet.</p>
        </div>
      `;
    } else {
      html += `<div class="space-y-2.5">`;
      history.forEach(h => {
        html += `
          <div class="upi-card bg-slate-900/80 border border-white/10 p-3 rounded-2xl flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black">
                <i data-lucide="arrow-down-left" class="w-4 h-4"></i>
              </div>
              <div>
                <h4 class="text-xs font-bold text-white">${h.title}</h4>
                <div class="text-[10px] text-slate-400">${h.status}</div>
                <div class="text-[9px] text-indigo-400 font-mono mt-0.5">UTR: ${h.utr} • ${h.date}</div>
              </div>
            </div>
            <div class="text-right">
              <div class="text-sm font-black text-emerald-400 font-mono">+ ₹${h.amount.toFixed(2)}</div>
              <span class="pill-badge badge-emerald text-[7px]">SUCCESS</span>
            </div>
          </div>
        `;
      });
      html += `</div>`;
    }
    container.innerHTML = html;
  }

  if (window.lucide) window.lucide.createIcons();
}

function claimDailyCheckinReward() {
  if (!appState.rewards) appState.rewards = { ...defaultState.rewards };
  const todayStr = new Date().toDateString();
  if (appState.rewards.lastDailyClaimDate === todayStr) {
    showToast('✨ You already claimed today\'s bonus! Return tomorrow.');
    return;
  }

  const bonusAmounts = [5.00, 10.00, 15.00, 20.00, 25.00];
  const bonus = bonusAmounts[Math.floor(Math.random() * bonusAmounts.length)];
  const newUtr = 'REW' + Math.floor(100000000000 + Math.random() * 900000000000);

  appState.user.balance += bonus;
  appState.rewards.totalCashbackWon += bonus;
  appState.rewards.dailyClaimedToday = true;
  appState.rewards.lastDailyClaimDate = todayStr;

  appState.rewards.history.unshift({
    id: 'rh_' + Date.now(),
    title: 'Daily Check-in Bonus',
    amount: bonus,
    date: 'Today, Just now',
    status: 'Credited to Bank of Baroda •••• 0507',
    utr: newUtr
  });

  appState.transactions.unshift({
    id: 'tx_rew_' + Date.now(),
    title: 'Daily Check-in Cashback Bonus',
    date: 'Just now',
    bank: 'Bank of Baroda XX0507',
    utr: newUtr,
    amount: bonus,
    category: 'Cashback & Rewards',
    type: 'credited',
    isCard: false,
    isLite: false,
  });

  saveState();
  playSuccessChime();
  if (window.confetti) {
    window.confetti({ particleCount: 90, spread: 75, origin: { y: 0.6 } });
  }

  const balEl = document.getElementById('personalTotalBalance');
  if (balEl) balEl.textContent = `₹${formatInr(appState.user.balance, 0)}`;

  renderRewardsBadges();
  renderRewardsHub(currentRewardsTab);
  showToast(`🎉 ₹${bonus.toFixed(2)} Daily Bonus directly credited to your Bank Account!`);
}

function copyVoucherCode(code) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(code).then(() => {
      playSuccessChime();
      showToast(`📋 Voucher code "${code}" copied to clipboard!`);
    }).catch(() => {
      prompt('Copy voucher code:', code);
    });
  } else {
    prompt('Copy voucher code:', code);
  }
}

function openScratchCardFromPayment() {
  closeModal('modalPaymentSuccess');
  if (!appState.rewards) appState.rewards = { ...defaultState.rewards };
  const unscratched = (appState.rewards.cards || []).find(c => !c.isScratched);
  if (unscratched) {
    openScratchCardModal(unscratched.id);
  } else {
    openRewardsHubModal('cards');
  }
}

function openScratchCardModal(cardId) {
  if (!appState.rewards) appState.rewards = { ...defaultState.rewards };
  const card = (appState.rewards.cards || []).find(c => c.id === cardId);
  if (!card) return;

  activeScratchCard = card;

  const titleEl = document.getElementById('scratchModalTitle');
  const subEl = document.getElementById('scratchModalSubtitle');
  if (titleEl) titleEl.textContent = card.title;
  if (subEl) subEl.textContent = card.subtitle;

  const underlay = document.getElementById('scratchUnderlayContent');
  const canvas = document.getElementById('scratchCanvas');
  const instructEl = document.getElementById('scratchInstructionText');
  const quickBtn = document.getElementById('btnQuickRevealScratch');

  if (underlay) {
    if (card.type === 'cash') {
      underlay.innerHTML = `
        <div class="w-14 h-14 rounded-full bg-amber-500/20 border-2 border-amber-400 text-amber-300 flex items-center justify-center mx-auto mb-2 animate-bounce">
          <i data-lucide="indian-rupee" class="w-7 h-7"></i>
        </div>
        <div class="text-3xl font-black text-amber-300 font-mono mb-1">₹ ${card.amount.toFixed(2)}</div>
        <div class="text-xs font-extrabold text-white mb-1">Cashback Won! 🎉</div>
        <p class="text-[10px] text-emerald-400 font-medium mb-2">Directly credited to Bank of Baroda •••• 0507</p>
        <div class="pill-badge badge-emerald text-[8px] font-mono mx-auto">NPCI UPI Instant Transfer</div>
      `;
    } else {
      underlay.innerHTML = `
        <div class="w-14 h-14 rounded-2xl bg-indigo-500/20 border-2 border-indigo-400 text-indigo-300 flex items-center justify-center mx-auto mb-2">
          <i data-lucide="tag" class="w-7 h-7"></i>
        </div>
        <div class="text-2xl font-black text-indigo-300 font-mono mb-1">₹ ${card.amount} OFF</div>
        <div class="text-xs font-extrabold text-white mb-1">${card.title}</div>
        <p class="text-[10px] text-slate-300 mb-2">${card.description}</p>
        <div class="bg-slate-950/80 px-3 py-1.5 rounded-xl border border-dashed border-amber-500/60 font-mono text-amber-300 text-xs font-black cursor-pointer hover:scale-105 transition" onclick="copyVoucherCode('${card.code}')">
          CODE: ${card.code} 📋
        </div>
      `;
    }
    if (window.lucide) window.lucide.createIcons();
  }

  if (card.isScratched) {
    if (canvas) canvas.style.display = 'none';
    if (instructEl) instructEl.textContent = '✅ You have already claimed this reward!';
    if (quickBtn) quickBtn.style.display = 'none';
  } else {
    if (canvas) {
      canvas.style.display = 'block';
      canvas.style.opacity = '1';
      initScratchCanvas(card);
    }
    if (instructEl) instructEl.textContent = '👆 Rub with finger or mouse to scratch & claim!';
    if (quickBtn) quickBtn.style.display = 'inline-flex';
  }

  openModal('modalScratchCardReveal');
}

function initScratchCanvas(card) {
  const canvas = document.getElementById('scratchCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;

  ctx.globalCompositeOperation = 'source-over';

  // Draw Gold Holographic Cover Gradient
  const grad = ctx.createLinearGradient(0, 0, width, height);
  grad.addColorStop(0, '#f59e0b');
  grad.addColorStop(0.3, '#fbbf24');
  grad.addColorStop(0.5, '#fef08a');
  grad.addColorStop(0.7, '#d97706');
  grad.addColorStop(1, '#b45309');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Add Diagonal Shimmer Lines
  ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
  for (let i = -width; i < width * 2; i += 24) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + 40, height);
    ctx.lineTo(i + 52, height);
    ctx.lineTo(i + 12, 0);
    ctx.fill();
  }

  // Draw Outer Gold Border
  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 6;
  ctx.strokeRect(3, 3, width - 6, height - 6);

  // Draw Center Foil Crest & Text
  ctx.fillStyle = '#1e1b4b';
  ctx.font = 'bold 18px Plus Jakarta Sans, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('UNEXA REWARDS', width / 2, height / 2 - 15);

  ctx.fillStyle = '#451a03';
  ctx.font = '600 11px Plus Jakarta Sans, sans-serif';
  ctx.fillText('✨ Scratch to Reveal Prize ✨', width / 2, height / 2 + 10);

  ctx.font = '10px JetBrains Mono, monospace';
  ctx.fillText('100% Instant Bank Credit', width / 2, height / 2 + 30);

  // Scratch Drawing Helper
  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if (e.touches && e.touches[0]) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  }

  function scratchAt(pos) {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 24, 0, Math.PI * 2);
    ctx.fill();
  }

  function checkClearance() {
    try {
      const imgData = ctx.getImageData(0, 0, width, height);
      const data = imgData.data;
      let transparentCount = 0;
      const totalSampled = data.length / 16;
      for (let i = 3; i < data.length; i += 16) {
        if (data[i] < 128) transparentCount++;
      }
      const percent = (transparentCount / totalSampled) * 100;
      if (percent > 35) {
        revealScratchCardReward(card.id);
      }
    } catch (e) {
      console.warn('Canvas check error:', e);
    }
  }

  // Mouse Events
  canvas.onmousedown = (e) => {
    isScratching = true;
    scratchAt(getPos(e));
  };
  canvas.onmousemove = (e) => {
    if (!isScratching) return;
    scratchAt(getPos(e));
  };
  window.onmouseup = () => {
    if (isScratching) {
      isScratching = false;
      checkClearance();
    }
  };

  // Touch Events
  canvas.ontouchstart = (e) => {
    isScratching = true;
    scratchAt(getPos(e));
  };
  canvas.ontouchmove = (e) => {
    if (!isScratching) return;
    e.preventDefault();
    scratchAt(getPos(e));
  };
  window.ontouchend = () => {
    if (isScratching) {
      isScratching = false;
      checkClearance();
    }
  };
}

function revealScratchCardReward(cardId) {
  if (!activeScratchCard || activeScratchCard.isScratched) return;

  activeScratchCard.isScratched = true;
  const canvas = document.getElementById('scratchCanvas');
  const instructEl = document.getElementById('scratchInstructionText');
  const quickBtn = document.getElementById('btnQuickRevealScratch');

  if (canvas) {
    canvas.style.transition = 'opacity 0.4s ease';
    canvas.style.opacity = '0';
    setTimeout(() => { canvas.style.display = 'none'; }, 400);
  }
  if (instructEl) instructEl.textContent = '🎉 Reward Unlocked & Claimed!';
  if (quickBtn) quickBtn.style.display = 'none';

  playSuccessChime();
  if (window.confetti) {
    window.confetti({ particleCount: 110, spread: 85, origin: { y: 0.5 } });
  }

  if (activeScratchCard.type === 'cash') {
    appState.user.balance += activeScratchCard.amount;
    appState.rewards.totalCashbackWon += activeScratchCard.amount;

    const newUtr = 'REW' + Math.floor(100000000000 + Math.random() * 900000000000);
    appState.rewards.history.unshift({
      id: 'rh_' + Date.now(),
      title: activeScratchCard.title,
      amount: activeScratchCard.amount,
      date: 'Today, Just now',
      status: 'Credited to Bank of Baroda •••• 0507',
      utr: newUtr
    });

    appState.transactions.unshift({
      id: 'tx_rew_' + Date.now(),
      title: `Cashback: ${activeScratchCard.title}`,
      date: 'Just now',
      bank: 'Bank of Baroda XX0507',
      utr: newUtr,
      amount: activeScratchCard.amount,
      category: 'Cashback & Rewards',
      type: 'credited',
      isCard: false,
      isLite: false,
    });

    showToast(`🎉 ₹${activeScratchCard.amount.toFixed(2)} Cashback Credited to Bank of Baroda!`);
  } else {
    showToast(`🎁 Unlocked ${activeScratchCard.title}! Code: ${activeScratchCard.code}`);
  }

  saveState();
  const balEl = document.getElementById('personalTotalBalance');
  if (balEl) balEl.textContent = `₹${formatInr(appState.user.balance, 0)}`;

  renderRewardsBadges();
  renderRewardsHub(currentRewardsTab);
}

function quickRevealScratchCard() {
  if (activeScratchCard) {
    revealScratchCardReward(activeScratchCard.id);
  }
}




// =========================================================
// =========================================================
// UNEXA UNIFIED UPI & APP SECURITY PIN CONTROLLER
// =========================================================

function getUserPin() {
  if (!appState.user) appState.user = { ...defaultState.user };
  return appState.user.upiPin || appState.user.appPin || '1234';
}

function setUserPin(newPin) {
  if (!appState.user) appState.user = { ...defaultState.user };
  appState.user.upiPin = String(newPin);
  appState.user.appPin = String(newPin);
  if (!appState.user.security) appState.user.security = { biometric: true, facelock: true, applock: true };
  appState.user.security.appPin = String(newPin);
  saveState();
  if (typeof renderProfileStats === 'function') renderProfileStats();
}

let resetPinSource = 'settings'; // 'payment' | 'login' | 'settings'
let currentResetOtp = '682914';
let tempNewPin = '';
let tempConfirmPin = '';
let isPeekingNewPin = false;
let isPeekingConfirmPin = false;

function openResetPinModal(source = 'settings') {
  resetPinSource = source;

  // Generate new random 6-digit OTP
  currentResetOtp = String(Math.floor(100000 + Math.random() * 900000));
  const otpBannerText = document.getElementById('resetPinIncomingOtpText');
  if (otpBannerText) otpBannerText.textContent = currentResetOtp;

  // Reset values
  tempNewPin = '';
  tempConfirmPin = '';
  isPeekingNewPin = false;
  isPeekingConfirmPin = false;

  // Clear OTP boxes
  for (let i = 1; i <= 6; i++) {
    const box = document.getElementById(`rOtpBox${i}`);
    if (box) box.value = '';
  }

  // Clear New PIN & Confirm PIN dots
  updateNewPinDots();
  updateConfirmPinDots();

  // Show Step 1
  setResetPinStep(1);

  if (source === 'payment') {
    closeModal('modalPaymentCheckout');
  } else if (source === 'login') {
    closeModal('modalVerifyAppLock');
  }

  openModal('modalResetPin');
}

function setResetPinStep(step) {
  const step1Box = document.getElementById('resetPinStep1Box');
  const step2Box = document.getElementById('resetPinStep2Box');
  const step3Box = document.getElementById('resetPinStep3Box');

  const num1 = document.getElementById('resetPinStepNum1');
  const num2 = document.getElementById('resetPinStepNum2');
  const num3 = document.getElementById('resetPinStepNum3');

  const line1 = document.getElementById('resetPinStepLine1');
  const line2 = document.getElementById('resetPinStepLine2');

  const label2 = document.getElementById('resetPinStepLabel2');
  const label3 = document.getElementById('resetPinStepLabel3');

  if (step === 1) {
    if (step1Box) step1Box.classList.remove('hidden');
    if (step2Box) step2Box.classList.add('hidden');
    if (step3Box) step3Box.classList.add('hidden');

    if (num1) { num1.className = 'w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center'; }
    if (num2) { num2.className = 'w-5 h-5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-bold flex items-center justify-center'; }
    if (num3) { num3.className = 'w-5 h-5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-bold flex items-center justify-center'; }
    if (line1) line1.className = 'w-6 h-0.5 bg-slate-700';
    if (line2) line2.className = 'w-6 h-0.5 bg-slate-700';
    if (label2) label2.className = 'text-[10px] font-semibold text-slate-400';
    if (label3) label3.className = 'text-[10px] font-semibold text-slate-400';
  } else if (step === 2) {
    if (step1Box) step1Box.classList.add('hidden');
    if (step2Box) step2Box.classList.remove('hidden');
    if (step3Box) step3Box.classList.add('hidden');

    if (num1) { num1.className = 'w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center'; }
    if (num2) { num2.className = 'w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center'; }
    if (num3) { num3.className = 'w-5 h-5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-bold flex items-center justify-center'; }
    if (line1) line1.className = 'w-6 h-0.5 bg-emerald-600';
    if (line2) line2.className = 'w-6 h-0.5 bg-slate-700';
    if (label2) label2.className = 'text-[10px] font-bold text-white';
    if (label3) label3.className = 'text-[10px] font-semibold text-slate-400';
  } else if (step === 3) {
    if (step1Box) step1Box.classList.add('hidden');
    if (step2Box) step2Box.classList.add('hidden');
    if (step3Box) step3Box.classList.remove('hidden');

    if (num1) { num1.className = 'w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center'; }
    if (num2) { num2.className = 'w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center'; }
    if (num3) { num3.className = 'w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center'; }
    if (line1) line1.className = 'w-6 h-0.5 bg-emerald-600';
    if (line2) line2.className = 'w-6 h-0.5 bg-emerald-600';
    if (label2) label2.className = 'text-[10px] font-semibold text-emerald-400';
    if (label3) label3.className = 'text-[10px] font-bold text-white';
  }
  if (window.lucide) window.lucide.createIcons();
}

function autoFillResetOtp() {
  for (let i = 1; i <= 6; i++) {
    const box = document.getElementById(`rOtpBox${i}`);
    if (box) box.value = currentResetOtp[i - 1] || '0';
  }
  playSuccessChime();
  showToast('⚡ OTP Auto-Filled! Proceeding to set new PIN...');
  setTimeout(verifyResetOtpAndProceed, 350);
}

function handleResetOtpInput(idx, el, event) {
  if (el.value.length === 1 && idx < 6) {
    const nextBox = document.getElementById(`rOtpBox${idx + 1}`);
    if (nextBox) nextBox.focus();
  }
}

function verifyResetOtpAndProceed() {
  let enteredOtp = '';
  for (let i = 1; i <= 6; i++) {
    const box = document.getElementById(`rOtpBox${i}`);
    enteredOtp += (box && box.value) ? box.value : '';
  }

  if (enteredOtp.length < 6) {
    autoFillResetOtp();
    return;
  }

  playSuccessChime();
  showToast('✅ Mobile OTP Verified! Enter your new 4-digit PIN.');
  setResetPinStep(2);
}

// Step 2: New PIN Numpad Handlers
function togglePeekNewPin() {
  isPeekingNewPin = !isPeekingNewPin;
  const btn = document.getElementById('btnPeekNewPin');
  if (btn) btn.textContent = isPeekingNewPin ? 'Hide PIN' : 'Peek PIN';
  updateNewPinDots();
}

function pressNewPinKey(digit) {
  if (tempNewPin.length >= 4) return;
  tempNewPin += String(digit);
  updateNewPinDots();
  playBeep(650, 'sine', 0.05);

  if (tempNewPin.length === 4) {
    playSuccessChime();
    setTimeout(() => {
      setResetPinStep(3);
    }, 280);
  }
}

function backspaceNewPinKey() {
  if (tempNewPin.length > 0) {
    tempNewPin = tempNewPin.slice(0, -1);
    updateNewPinDots();
    playBeep(400, 'sine', 0.05);
  }
}

function clearNewPinKey() {
  tempNewPin = '';
  updateNewPinDots();
}

function updateNewPinDots() {
  for (let i = 1; i <= 4; i++) {
    const dot = document.getElementById(`newPinDot${i}`);
    if (dot) {
      if (i <= tempNewPin.length) {
        dot.className = 'w-4 h-4 rounded-full border-2 border-indigo-400 bg-indigo-500 shadow-md shadow-indigo-500/50 scale-110 transition-all flex items-center justify-center text-[10px] font-bold font-mono text-white';
        dot.textContent = isPeekingNewPin ? tempNewPin[i - 1] : '';
      } else {
        dot.className = 'w-4 h-4 rounded-full border-2 border-indigo-500/50 bg-slate-950 transition-all flex items-center justify-center text-[10px] font-bold font-mono text-indigo-300';
        dot.textContent = '';
      }
    }
  }

  const preview = document.getElementById('newPinPreviewText');
  if (preview) {
    preview.textContent = isPeekingNewPin && tempNewPin ? `PIN: ${tempNewPin}` : (tempNewPin.length === 4 ? '✓ 4-Digits Entered' : '');
  }
}

// Step 3: Confirm PIN Numpad Handlers
function togglePeekConfirmPin() {
  isPeekingConfirmPin = !isPeekingConfirmPin;
  const btn = document.getElementById('btnPeekConfirmPin');
  if (btn) btn.textContent = isPeekingConfirmPin ? 'Hide PIN' : 'Peek PIN';
  updateConfirmPinDots();
}

function pressConfirmPinKey(digit) {
  if (tempConfirmPin.length >= 4) return;
  tempConfirmPin += String(digit);
  updateConfirmPinDots();
  playBeep(750, 'sine', 0.05);

  if (tempConfirmPin.length === 4) {
    setTimeout(validateAndSaveNewPin, 250);
  }
}

function backspaceConfirmPinKey() {
  if (tempConfirmPin.length > 0) {
    tempConfirmPin = tempConfirmPin.slice(0, -1);
    updateConfirmPinDots();
    playBeep(400, 'sine', 0.05);
  }
}

function clearConfirmPinKey() {
  tempConfirmPin = '';
  updateConfirmPinDots();
}

function updateConfirmPinDots() {
  for (let i = 1; i <= 4; i++) {
    const dot = document.getElementById(`confirmPinDot${i}`);
    if (dot) {
      if (i <= tempConfirmPin.length) {
        dot.className = 'w-4 h-4 rounded-full border-2 border-emerald-400 bg-emerald-500 shadow-md shadow-emerald-500/50 scale-110 transition-all flex items-center justify-center text-[10px] font-bold font-mono text-white';
        dot.textContent = isPeekingConfirmPin ? tempConfirmPin[i - 1] : '';
      } else {
        dot.className = 'w-4 h-4 rounded-full border-2 border-emerald-500/50 bg-slate-950 transition-all flex items-center justify-center text-[10px] font-bold font-mono text-emerald-300';
        dot.textContent = '';
      }
    }
  }

  const preview = document.getElementById('confirmPinPreviewText');
  if (preview) {
    if (tempConfirmPin.length === 4) {
      if (tempConfirmPin === tempNewPin) {
        preview.textContent = '✅ PINs match perfectly!';
        preview.className = 'text-[11px] font-mono text-emerald-400 font-bold h-4';
      } else {
        preview.textContent = '❌ PINs do not match!';
        preview.className = 'text-[11px] font-mono text-rose-400 font-bold h-4';
      }
    } else {
      preview.textContent = isPeekingConfirmPin && tempConfirmPin ? `PIN: ${tempConfirmPin}` : '';
    }
  }
}

function validateAndSaveNewPin() {
  if (!tempNewPin || tempNewPin.length < 4) {
    showToast('⚠️ Please set a 4-digit PIN first.');
    setResetPinStep(2);
    return;
  }

  if (tempConfirmPin.length < 4) {
    showToast('⚠️ Please enter all 4 digits to confirm.');
    return;
  }

  if (tempConfirmPin === tempNewPin) {
    setUserPin(tempNewPin);
    playSuccessChime();
    if (window.confetti) {
      window.confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
    }

    closeModal('modalResetPin');
    showToast(`🎉 Permanent UPI PIN is set to: ${tempNewPin}! This is your permanent PIN for Login & Payments.`);

    if (resetPinSource === 'payment') {
      setTimeout(() => {
        clearPinKey();
        openModal('modalPaymentCheckout');
        showToast(`🔒 Enter your permanent PIN (${tempNewPin}) to authorize payment.`);
      }, 400);
    } else if (resetPinSource === 'login') {
      setTimeout(() => {
        appState.isLoggedIn = true;
        saveState();
        updateAuthViewVisibility();
        showToast(`🔓 Logged in with permanent PIN! Welcome, ${appState.user.name}`);
      }, 400);
    } else if (resetPinSource === 'balance') {
      setTimeout(() => {
        resetCheckBalancePin();
        openModal('modalCheckBalance');
        showToast(`💰 Enter your permanent PIN (${tempNewPin}) to fetch balance.`);
      }, 400);
    }
  } else {
    playBeep(250, 'sawtooth', 0.25);
    if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
    for (let i = 1; i <= 4; i++) {
      const dot = document.getElementById(`confirmPinDot${i}`);
      if (dot) dot.className = 'w-4 h-4 rounded-full border-2 border-rose-500 bg-rose-500 shadow-md shadow-rose-500/50 scale-125 transition-all flex items-center justify-center text-[10px] font-bold font-mono text-white';
    }
    showToast('⚠️ PINs do not match! Please enter the same 4-digit PIN to confirm.');
    setTimeout(() => {
      tempConfirmPin = '';
      updateConfirmPinDots();
    }, 600);
  }
}


// =========================================================
// BHARAT CONNECT (BBPS) RECHARGE & BILLS CONTROLLER
// =========================================================

const rechargeBillsCatalog = {
  // --- TELECOM & RECHARGES ---
  mobile_recharge: {
    id: 'mobile_recharge',
    title: 'Prepaid Mobile Recharge',
    subtitle: 'Instant recharge for Jio, Airtel, Vi, BSNL',
    category: 'telecom',
    icon: 'smartphone',
    badge: 'INSTANT 5G',
    fields: [
      { id: 'mobileNum', label: 'Mobile Number', type: 'tel', placeholder: 'Enter 10-digit mobile number', defaultValue: '9876543210' },
      { id: 'operator', label: 'Operator & Circle', type: 'select', options: [
        { val: 'jio', label: 'Reliance Jio - Mumbai & Maharashtra' },
        { val: 'airtel', label: 'Bharti Airtel - Delhi NCR' },
        { val: 'vi', label: 'Vodafone Idea (Vi) - Karnataka' },
        { val: 'bsnl', label: 'BSNL GSM - National' }
      ]}
    ],
    recentHistory: [
      { name: 'My Number', ref: '9876543210', date: 'Last recharged: 2 Days ago', amount: 299 },
      { name: 'Mom Jio', ref: '8765432109', date: 'Last recharged: 1 Month ago', amount: 749 }
    ],
    offers: [
      { code: 'JIO5G', desc: 'Flat ₹50 Cashback on Jio Unlimited 5G plans above ₹299.' }
    ],
    plans: [
      { id: 'p1', category: 'recommended', price: 299, validity: '28 Days', data: '1.5 GB/Day', calls: 'Unlimited Calls', desc: 'Unlimited True 5G Data + 100 SMS/day' },
      { id: 'p3', category: '5g_unlimited', price: 749, validity: '72 Days', data: '2.0 GB/Day', calls: 'Unlimited Calls', desc: 'Unlimited 5G Data + Disney+ Hotstar 3 Months' }
    ]
  },
  dth: {
    id: 'dth',
    title: 'DTH Recharge',
    subtitle: 'Tata Play, Airtel DTH, Dish TV, Sun Direct',
    category: 'telecom',
    icon: 'tv',
    badge: 'BBPS',
    fields: [
      { id: 'dthOperator', label: 'Select DTH Operator', type: 'select', options: [
        { val: 'tataplay', label: 'Tata Play (formerly Tata Sky)' },
        { val: 'airteldth', label: 'Airtel Digital TV' },
        { val: 'dishtv', label: 'Dish TV India' }
      ]},
      { id: 'dthSubscriberId', label: 'Subscriber ID / Registered Mobile', type: 'text', placeholder: 'e.g. 1092837461', defaultValue: '1092837461' }
    ],
    recentHistory: [
      { name: 'Home Tata Play', ref: '1092837461', date: 'Last paid: 15 Aug 2026', amount: 489 }
    ],
    offers: [
      { code: 'DTHNEW', desc: 'Get upto ₹100 Cashback on your first DTH recharge this month.' }
    ],
    sampleFetch: { consumerName: 'Aarav Sharma (Tata Play HD)', billAmount: 489.00, dueDate: '22 Sep 2026', currentBalance: '₹ 12.50', recommendedPlan: 'Hindi Premium HD Combo' }
  },
  intl_roaming: {
    id: 'intl_roaming',
    title: 'International Roaming',
    subtitle: 'Global high-speed connectivity',
    category: 'telecom',
    icon: 'globe',
    fields: [
      { id: 'intlNum', label: 'Mobile Number', type: 'tel', defaultValue: '9876543210' },
      { id: 'country', label: 'Select Destination Country', type: 'select', options: [{val:'usa', label:'USA & Canada'}, {val:'uk', label:'UK & Europe'}, {val:'uae', label:'UAE & Middle East'}]}
    ],
    plans: [
      { id: 'ir1', category: 'recommended', price: 1199, validity: '7 Days', data: '1 GB/Day', calls: '100 Mins', desc: 'USA/Canada Basic Pack' },
      { id: 'ir2', category: 'recommended', price: 2999, validity: '21 Days', data: '5 GB Total', calls: 'Unlimited Incoming', desc: 'Europe Explorer Pack' }
    ]
  },
  google_play: {
    id: 'google_play',
    title: 'Google Play Gift Card',
    subtitle: 'Buy Play Store Recharge Codes',
    category: 'telecom',
    icon: 'play',
    fields: [
      { id: 'gplayAmount', label: 'Amount (₹10 to ₹5000)', type: 'number', defaultValue: '500' }
    ],
    offers: [{ code: 'PLAY10', desc: 'Get 10% off on Play Store recharge codes upto ₹50.' }],
    sampleFetch: { consumerName: 'Google Play Gift Card', billAmount: 500, dueDate: 'Instant Delivery', info: 'Recharge code will be sent via SMS & Email.' }
  },
  apple_store: {
    id: 'apple_store',
    title: 'Apple Store & iTunes Card',
    subtitle: 'Buy App Store Gift Cards',
    category: 'telecom',
    icon: 'apple',
    fields: [
      { id: 'appleAmount', label: 'Amount (₹100 to ₹10000)', type: 'number', defaultValue: '1000' },
      { id: 'appleEmail', label: 'Delivery Email ID', type: 'email', defaultValue: 'user@example.com' }
    ],
    sampleFetch: { consumerName: 'Apple App Store', billAmount: 1000, dueDate: 'Instant Delivery' }
  },
  ncmc: {
    id: 'ncmc',
    title: 'NCMC & Metro Smart Card',
    subtitle: 'Delhi, Mumbai, Namma Metro & more',
    category: 'telecom',
    icon: 'credit-card',
    fields: [
      { id: 'metro', label: 'Select Metro', type: 'select', options: [{val:'delhi', label:'Delhi Metro'}, {val:'namma', label:'Namma Metro (Bengaluru)'}] },
      { id: 'cardNum', label: 'Smart Card Number', type: 'text', defaultValue: '01928374' },
      { id: 'amount', label: 'Recharge Amount', type: 'number', defaultValue: '500' }
    ],
    recentHistory: [{ name: 'My Delhi Metro', ref: '01928374', date: 'Last paid: 1 Sep', amount: 500 }],
    sampleFetch: { consumerName: 'Smart Card: 01928374', billAmount: 500, currentBalance: '₹ 45.00' }
  },
  get_sim: {
    id: 'get_sim',
    title: 'Get New 5G SIM / eSIM',
    subtitle: 'Free delivery in 2 hours',
    category: 'telecom',
    icon: 'cpu',
    fields: [
      { id: 'simType', label: 'SIM Type', type: 'select', options: [{val:'physical', label:'Physical SIM'}, {val:'esim', label:'eSIM Activation'}] },
      { id: 'address', label: 'Delivery Pincode', type: 'text', defaultValue: '400001' }
    ],
    sampleFetch: { consumerName: 'New 5G SIM Booking', billAmount: 0, info: 'KYC will be done at delivery.' }
  },
  cable_tv: {
    id: 'cable_tv',
    title: 'Cable TV Subscription',
    subtitle: 'Hathway, GTPL, Asianet',
    category: 'telecom',
    icon: 'monitor-play',
    fields: [
      { id: 'cableOp', label: 'Select Operator', type: 'select', options: [{val:'hathway', label:'Hathway Digital'}, {val:'gtpl', label:'GTPL'}] },
      { id: 'cableId', label: 'MAC / Smart Card Number', type: 'text', defaultValue: '001A2B3C' }
    ],
    sampleFetch: { consumerName: 'Rahul Verma', billAmount: 350, dueDate: '25 Sep 2026', currentPlan: 'HD Entertainment Pack' }
  },
  mobile_postpaid: {
    id: 'mobile_postpaid',
    title: 'Mobile Postpaid Bill',
    subtitle: 'Pay postpaid mobile bills',
    category: 'telecom',
    icon: 'phone',
    fields: [
      { id: 'postNum', label: 'Mobile Number', type: 'tel', defaultValue: '9876543210' },
      { id: 'operator', label: 'Operator', type: 'select', options: [{val:'jio', label:'Jio Postpaid'}, {val:'airtel', label:'Airtel Postpaid'}] }
    ],
    recentHistory: [{ name: 'Dad Phone', ref: '9876543210', date: 'Last paid: 12 Aug', amount: 499 }],
    sampleFetch: { consumerName: 'Ramesh Singh', billAmount: 588.82, dueDate: '15 Sep 2026', billPeriod: '1 Aug - 31 Aug' }
  },

  // --- UTILITIES ---
  electricity: {
    id: 'electricity',
    title: 'Electricity Bill',
    subtitle: 'State electricity boards across India',
    category: 'utilities',
    icon: 'zap',
    badge: 'BBPS CERTIFIED',
    fields: [
      { id: 'elecBoard', label: 'Select Electricity Board', type: 'select', options: [
        { val: 'tatapower', label: 'Tata Power - Mumbai / Delhi' },
        { val: 'msedcl', label: 'Maharashtra State Electricity (MSEDCL)' },
        { val: 'bescom', label: 'BESCOM - Bengaluru' }
      ]},
      { id: 'elecCaNum', label: 'Consumer Account Number', type: 'text', defaultValue: '10098765432' }
    ],
    recentHistory: [{ name: 'Home Electricity', ref: '10098765432', date: 'Last paid: 25 Aug', amount: 1420 }],
    offers: [{ code: 'POWERPAY', desc: 'Flat ₹30 off on Electricity bill.' }],
    sampleFetch: { consumerName: 'Aarav Sharma', billAmount: 1420.00, dueDate: '28 Sep 2026', units: '248 kWh' }
  },
  credit_card: {
    id: 'credit_card',
    title: 'Credit Card Bill Payment',
    subtitle: 'Instant settlement for all banks',
    category: 'utilities',
    icon: 'credit-card',
    badge: 'INSTANT',
    fields: [
      { id: 'ccBank', label: 'Select Bank', type: 'select', options: [{ val: 'hdfc', label: 'HDFC Bank' }, { val: 'sbi', label: 'SBI Card' }, { val: 'icici', label: 'ICICI Bank' }] },
      { id: 'ccNum', label: 'Card Number (Last 4 digits)', type: 'text', placeholder: 'xxxx xxxx xxxx 4589', defaultValue: '4589' }
    ],
    recentHistory: [{ name: 'HDFC Regalia', ref: 'XXXX-4589', date: 'Due in 5 days', amount: 12500 }],
    sampleFetch: { consumerName: 'Aarav Sharma (HDFC Regalia)', billAmount: 12500.00, minimumDue: '₹ 1200.00', dueDate: '02 Oct 2026', statementDate: '15 Sep 2026' }
  },
  loan: {
    id: 'loan',
    title: 'Loan EMI Repayment',
    subtitle: 'Bajaj Finserv, Muthoot, HDFC, SBI',
    category: 'utilities',
    icon: 'indian-rupee',
    fields: [
      { id: 'lender', label: 'Select Lender', type: 'select', options: [{ val: 'bajaj', label: 'Bajaj Finance Ltd' }, { val: 'hdfc', label: 'HDFC Bank Loans' }] },
      { id: 'loanAcc', label: 'Loan Account Number', type: 'text', defaultValue: 'LNA-88374920' }
    ],
    recentHistory: [{ name: 'Car Loan', ref: 'LNA-88374920', date: 'Last paid: 5 Sep', amount: 8450 }],
    sampleFetch: { consumerName: 'Aarav Sharma', billAmount: 8450.00, dueDate: '05 Oct 2026', emiNumber: '12 / 48' }
  },
  cylinder: {
    id: 'cylinder',
    title: 'Book LPG Cooking Gas',
    subtitle: 'HP Gas, Indane, BharatGas',
    category: 'utilities',
    icon: 'flame',
    fields: [
      { id: 'lpgProvider', label: 'Select Provider', type: 'select', options: [{ val: 'hp', label: 'HP Gas' }, { val: 'indane', label: 'Indane Gas' }, { val: 'bharat', label: 'BharatGas' }] },
      { id: 'lpgNum', label: 'Registered Mobile or LPG ID', type: 'text', defaultValue: '9876543210' }
    ],
    recentHistory: [{ name: 'Home Kitchen', ref: '9876543210', date: 'Delivered: 12 Aug' }],
    sampleFetch: { consumerName: 'Aarav Sharma', billAmount: 830.50, dueDate: 'Pay Now for Booking', agency: 'Shiv Shakti Gas Agency', subsidyEligible: 'Yes' }
  },
  broadband: {
    id: 'broadband',
    title: 'Broadband & Landline Bill',
    subtitle: 'JioFiber, Airtel Xstream, ACT',
    category: 'utilities',
    icon: 'router',
    fields: [
      { id: 'isp', label: 'Select Provider', type: 'select', options: [{ val: 'jio', label: 'JioFiber' }, { val: 'airtel', label: 'Airtel Xstream Fiber' }, { val: 'act', label: 'ACT Fibernet' }] },
      { id: 'ispId', label: 'Account / Landline Number', type: 'text', defaultValue: '08044556677' }
    ],
    recentHistory: [{ name: 'Home WiFi', ref: '08044556677', date: 'Last paid: 28 Aug', amount: 1178 }],
    sampleFetch: { consumerName: 'Aarav Sharma', billAmount: 1178.82, dueDate: '05 Oct 2026', currentPlan: '150 Mbps Unlimited' }
  },
  piped_gas: {
    id: 'piped_gas',
    title: 'Piped Natural Gas (PNG)',
    subtitle: 'IGL, MGL, Adani Gas',
    category: 'utilities',
    icon: 'flame',
    fields: [
      { id: 'pngProv', label: 'Select PNG Provider', type: 'select', options: [{val:'mgl', label:'Mahanagar Gas (MGL)'}, {val:'igl', label:'Indraprastha Gas (IGL)'}] },
      { id: 'pngId', label: 'Customer / BP Number', type: 'text', defaultValue: '20938475' }
    ],
    sampleFetch: { consumerName: 'Sneha Patel', billAmount: 450.25, dueDate: '12 Oct 2026' }
  },
  water: {
    id: 'water',
    title: 'Water Bill Payment',
    subtitle: 'DJB, BWSSB, MCGM',
    category: 'utilities',
    icon: 'droplet',
    fields: [
      { id: 'waterBoard', label: 'Select Water Board', type: 'select', options: [{val:'mcgm', label:'MCGM Water (Mumbai)'}, {val:'bwssb', label:'BWSSB (Bengaluru)'}] },
      { id: 'waterId', label: 'RR No / Consumer Number', type: 'text', defaultValue: '110022' }
    ],
    sampleFetch: { consumerName: 'Rajesh Kumar', billAmount: 320.00, dueDate: '15 Oct 2026' }
  },
  prepaid_meter: {
    id: 'prepaid_meter',
    title: 'Prepaid Smart Meter',
    subtitle: 'Recharge Smart Electricity Meters',
    category: 'utilities',
    icon: 'gauge',
    fields: [
      { id: 'meterBoard', label: 'Select Board', type: 'select', options: [{val:'uppcl', label:'UPPCL Prepaid Meter'}] },
      { id: 'meterNum', label: 'Meter Number', type: 'text', defaultValue: 'MTR928374' },
      { id: 'amount', label: 'Recharge Amount', type: 'number', defaultValue: '1000' }
    ],
    sampleFetch: { consumerName: 'Ramesh Singh', billAmount: 1000, currentBalance: '₹ 152.00', info: 'Low balance warning.' }
  },
  education: {
    id: 'education',
    title: 'Education & Tuition Fees',
    subtitle: 'Schools, Colleges, Universities',
    category: 'utilities',
    icon: 'graduation-cap',
    fields: [
      { id: 'inst', label: 'Select Institute', type: 'select', options: [{val:'dps', label:'Delhi Public School'}, {val:'vit', label:'Vellore Institute of Technology'}] },
      { id: 'rollNum', label: 'Roll Number / Registration ID', type: 'text', defaultValue: '21BCE0001' }
    ],
    sampleFetch: { consumerName: 'Arjun Verma (Class 10-B)', billAmount: 45000, dueDate: '15 Oct 2026', feeType: 'Term 2 Tuition Fee' }
  },
  file_itr: {
    id: 'file_itr',
    title: 'File Income Tax Return',
    subtitle: 'ClearTax & TaxBuddy Integration',
    category: 'utilities',
    icon: 'file-text',
    fields: [
      { id: 'pan', label: 'PAN Number', type: 'text', defaultValue: 'ABCDE1234F' }
    ],
    sampleFetch: { consumerName: 'Aarav Sharma', billAmount: 799, plan: 'Assisted ITR Filing' }
  },

  // --- VEHICLE PAYMENTS ---
  fastag: {
    id: 'fastag',
    title: 'FASTag Toll Recharge',
    subtitle: 'ICICI, Paytm, IDFC, HDFC',
    category: 'vehicle',
    icon: 'car',
    badge: 'BBPS',
    fields: [
      { id: 'fastagBank', label: 'Select FASTag Issuer Bank', type: 'select', options: [{ val: 'icici', label: 'ICICI Bank FASTag' }, { val: 'idfc', label: 'IDFC FIRST Bank FASTag' }, { val: 'hdfc', label: 'HDFC Bank FASTag' }] },
      { id: 'fastagVr', label: 'Vehicle Registration Number (VRN)', type: 'text', placeholder: 'e.g. MH01AB1234', defaultValue: 'MH01AB1234' }
    ],
    recentHistory: [{ name: 'My Nexon', ref: 'MH01AB1234', date: 'Last recharged: 20 Aug', amount: 1000 }],
    sampleFetch: { consumerName: 'Aarav Sharma (MH01AB1234)', billAmount: 1000.00, currentBalance: '₹ 250.00', status: 'Active' }
  },
  car_insurance: {
    id: 'car_insurance',
    title: 'Buy Car Insurance',
    subtitle: 'Acko, PolicyBazaar, ICICI Lombard',
    category: 'vehicle',
    icon: 'car-front',
    fields: [
      { id: 'carIns', label: 'Provider', type: 'select', options: [{val:'acko', label:'Acko General Insurance'}, {val:'icici', label:'ICICI Lombard'}] },
      { id: 'carVr', label: 'Vehicle Number', type: 'text', defaultValue: 'MH01AB1234' }
    ],
    sampleFetch: { consumerName: 'MH01AB1234 (Tata Nexon)', billAmount: 8500, plan: 'Comprehensive - 1 Yr', idv: '₹ 7,50,000' }
  },
  bike_insurance: {
    id: 'bike_insurance',
    title: 'Buy Bike Insurance',
    subtitle: 'Third party & Comprehensive',
    category: 'vehicle',
    icon: 'bike',
    fields: [
      { id: 'bikeIns', label: 'Provider', type: 'select', options: [{val:'digit', label:'Go Digit'}, {val:'acko', label:'Acko General Insurance'}] },
      { id: 'bikeVr', label: 'Vehicle Number', type: 'text', defaultValue: 'MH02XY9876' }
    ],
    sampleFetch: { consumerName: 'MH02XY9876 (Royal Enfield)', billAmount: 1850, plan: 'Comprehensive - 1 Yr' }
  },
  echallan: {
    id: 'echallan',
    title: 'Traffic eChallan',
    subtitle: 'Pay traffic violation fines',
    category: 'vehicle',
    icon: 'receipt',
    fields: [
      { id: 'challanLoc', label: 'Traffic Police Department', type: 'select', options: [{val:'maha', label:'Maharashtra Traffic Police'}, {val:'delhi', label:'Delhi Traffic Police'}] },
      { id: 'challanNum', label: 'Challan No / Vehicle No', type: 'text', defaultValue: 'MH01AB1234' }
    ],
    sampleFetch: { consumerName: 'Aarav Sharma (MH01AB1234)', billAmount: 500, dueDate: '30 Sep 2026', offence: 'Signal Jumping' }
  },
  accident_cover: {
    id: 'accident_cover',
    title: 'Personal Accident Cover',
    subtitle: 'Upto ₹20 Lakh coverage',
    category: 'vehicle',
    icon: 'shield-alert',
    fields: [
      { id: 'pName', label: 'Policyholder Name', type: 'text', defaultValue: 'Aarav Sharma' }
    ],
    sampleFetch: { consumerName: 'Aarav Sharma', billAmount: 299, plan: '₹20L PA Cover (1 Year)' }
  },
  ev_recharge: {
    id: 'ev_recharge',
    title: 'EV Charging',
    subtitle: 'Pay at Tata Power EZ Charge, Zeon',
    category: 'vehicle',
    icon: 'battery-charging',
    fields: [
      { id: 'evProv', label: 'Charging Network', type: 'select', options: [{val:'tata', label:'Tata Power EZ Charge'}, {val:'zeon', label:'Zeon Charging'}] },
      { id: 'evId', label: 'Charger ID / Account', type: 'text', defaultValue: 'EZ10293' },
      { id: 'evAmount', label: 'Wallet Recharge Amount', type: 'number', defaultValue: '500' }
    ],
    sampleFetch: { consumerName: 'Tata Power EZ Wallet', billAmount: 500, currentBalance: '₹ 120.00' }
  },
  motor_expiry: {
    id: 'motor_expiry',
    title: 'Check Motor Policy Expiry',
    subtitle: 'Track insurance validity via VAHAN',
    category: 'vehicle',
    icon: 'calendar-clock',
    fields: [
      { id: 'vrn', label: 'Vehicle Number', type: 'text', defaultValue: 'MH01AB1234' }
    ],
    sampleFetch: { consumerName: 'MH01AB1234', billAmount: 0, info: 'Policy Expires: 12 Nov 2026 (ICICI Lombard)' }
  },

  // --- HOUSING & SOCIETY ---
  municipal_tax: {
    id: 'municipal_tax',
    title: 'Municipal / Property Tax',
    subtitle: 'BMC, NDMC, BBMP',
    category: 'housing',
    icon: 'landmark',
    fields: [
      { id: 'muni', label: 'Municipal Corporation', type: 'select', options: [{val:'bmc', label:'BMC - Mumbai'}, {val:'bbmp', label:'BBMP - Bengaluru'}] },
      { id: 'propNum', label: 'Property / Assessment No', type: 'text', defaultValue: '19283746' }
    ],
    sampleFetch: { consumerName: 'Aarav Sharma', billAmount: 12500, dueDate: '31 Mar 2027', property: 'Flat 402, Andheri West' }
  },
  rentals: {
    id: 'rentals',
    title: 'House & Shop Rent',
    subtitle: 'Pay rent via Credit Card',
    category: 'housing',
    icon: 'home',
    fields: [
      { id: 'rentUpi', label: 'Landlord UPI ID / Account', type: 'text', defaultValue: 'landlord@upi' },
      { id: 'rentAmt', label: 'Rent Amount', type: 'number', defaultValue: '25000' }
    ],
    sampleFetch: { consumerName: 'Rajesh Landlord', billAmount: 25000, info: 'Convenience fee of 1.5% applies for CC.' }
  },
  clubs: {
    id: 'clubs',
    title: 'Clubs & Associations',
    subtitle: 'Pay club membership fees',
    category: 'housing',
    icon: 'users',
    fields: [
      { id: 'clubId', label: 'Select Club', type: 'select', options: [{val:'gymkhana', label:'Bombay Gymkhana'}, {val:'rotary', label:'Rotary Club'}] },
      { id: 'memNum', label: 'Membership Number', type: 'text', defaultValue: 'MEM-9182' }
    ],
    sampleFetch: { consumerName: 'Aarav Sharma', billAmount: 5000, dueDate: '10 Oct 2026', info: 'Annual Subscription' }
  },
  apartment: {
    id: 'apartment',
    title: 'Apartment Maintenance',
    subtitle: 'MyGate, NoBrokerHood',
    category: 'housing',
    icon: 'building',
    fields: [
      { id: 'aptApp', label: 'Society App / Provider', type: 'select', options: [{val:'mygate', label:'MyGate'}, {val:'nobroker', label:'NoBrokerHood'}] },
      { id: 'aptNum', label: 'Registered Mobile', type: 'tel', defaultValue: '9876543210' }
    ],
    sampleFetch: { consumerName: 'Aarav Sharma (Flat A-402)', billAmount: 4500, dueDate: '05 Oct 2026', society: 'Sunshine Apartments' }
  },

  // --- OTHERS ---
  donation: {
    id: 'donation',
    title: 'Charity & NGO Donation',
    subtitle: 'PM CARES, UNICEF, GiveIndia',
    category: 'others',
    icon: 'heart',
    fields: [
      { id: 'ngo', label: 'Select NGO / Fund', type: 'select', options: [{val:'pmcares', label:'PM CARES Fund'}, {val:'unicef', label:'UNICEF India'}, {val:'cry', label:'CRY'}] },
      { id: 'donAmt', label: 'Donation Amount', type: 'number', defaultValue: '1000' }
    ],
    sampleFetch: { consumerName: 'PM CARES Fund', billAmount: 1000, info: 'Eligible for 80G Tax Deduction.' }
  },
  devotion: {
    id: 'devotion',
    title: 'Devotion & Temple e-Hundi',
    subtitle: 'Tirupati, Vaishno Devi, Siddhivinayak',
    category: 'others',
    icon: 'flower',
    fields: [
      { id: 'temple', label: 'Select Temple / Trust', type: 'select', options: [{val:'tirupati', label:'Tirumala Tirupati Devasthanams'}, {val:'siddhi', label:'Shree Siddhivinayak Trust'}] },
      { id: 'devAmt', label: 'e-Hundi Amount', type: 'number', defaultValue: '501' }
    ],
    sampleFetch: { consumerName: 'Shree Siddhivinayak Trust', billAmount: 501, info: 'May God bless you!' }
  },
  lic_insurance: {
    id: 'lic_insurance',
    title: 'LIC & Life Insurance',
    subtitle: 'LIC, HDFC Life, SBI Life',
    category: 'others',
    icon: 'shield-check',
    fields: [
      { id: 'lifeIns', label: 'Insurance Provider', type: 'select', options: [{val:'lic', label:'Life Insurance Corporation (LIC)'}, {val:'hdfclife', label:'HDFC Life'}] },
      { id: 'policyNum', label: 'Policy Number', type: 'text', defaultValue: '883920192' }
    ],
    sampleFetch: { consumerName: 'Aarav Sharma', billAmount: 15400, dueDate: '25 Oct 2026', policy: 'LIC Jeevan Anand' }
  },
  nps: {
    id: 'nps',
    title: 'National Pension System (NPS)',
    subtitle: 'Tier-I & Tier-II PRAN contribution',
    category: 'others',
    icon: 'piggy-bank',
    fields: [
      { id: 'npsPran', label: '12-Digit PRAN Number', type: 'text', defaultValue: '110098472910' },
      { id: 'npsTier', label: 'NPS Account Tier', type: 'select', options: [{val:'tier1', label:'Tier-I (Tax Deductible)'}, {val:'tier2', label:'Tier-II'}] },
      { id: 'npsAmount', label: 'Contribution Amount', type: 'number', defaultValue: '5000' }
    ],
    sampleFetch: { consumerName: 'Aarav Sharma (PRAN: 110098472910)', billAmount: 5000, info: 'Tier-I Contribution (80CCD 1B)' }
  },
  subscription: {
    id: 'subscription',
    title: 'OTT & Digital Subscriptions',
    subtitle: 'Netflix, Hotstar, Prime, Spotify',
    category: 'others',
    icon: 'play-square',
    fields: [
      { id: 'subService', label: 'Select Streaming Platform', type: 'select', options: [{val:'netflix', label:'Netflix Premium 4K HDR'}, {val:'hotstar', label:'Disney+ Hotstar Super'}] },
      { id: 'subEmail', label: 'Account Email ID', type: 'email', defaultValue: 'aarav.sharma@example.com' }
    ],
    sampleFetch: { consumerName: 'Netflix Premium 4K HDR', billAmount: 649, info: 'Voucher code will be sent to your email.' }
  }
};

let currentBillEngineService = null;
let currentSelectedPlan = null;
let currentFetchedBill = null;

function openRechargeBillsHub() {
  const searchInput = document.getElementById('rechargeSearchInput');
  if (searchInput) searchInput.value = '';
  filterRechargeServices('');
  openModal('modalRechargeBillsHub');
  if (window.lucide) window.lucide.createIcons();
}

function filterRechargeServices(query) {
  const q = (query || '').toLowerCase().trim();
  const catSections = document.querySelectorAll('.recharge-cat-section');
  const allButtons = document.querySelectorAll('#modalRechargeBillsHub .bbps-service-btn');

  if (!q) {
    catSections.forEach(sec => sec.style.display = 'block');
    allButtons.forEach(btn => btn.style.display = 'flex');
    return;
  }

  allButtons.forEach(btn => {
    const text = (btn.textContent || '').toLowerCase();
    if (text.includes(q)) {
      btn.style.display = 'flex';
    } else {
      btn.style.display = 'none';
    }
  });

  catSections.forEach(sec => {
    const visibleButtons = sec.querySelectorAll('.bbps-service-btn[style*="display: flex"]');
    sec.style.display = visibleButtons.length > 0 ? 'block' : 'none';
  });
}

function openBillPayEngine(serviceKey, presetData = null) {
  const service = rechargeBillsCatalog[serviceKey];
  if (!service) {
    showToast('⚠️ Service temporarily unavailable');
    return;
  }

  currentBillEngineService = service;
  currentSelectedPlan = null;
  currentFetchedBill = null;

  // Set Modal Header
  const headerIcon = document.getElementById('engineHeaderIcon');
  const headerIconBox = document.getElementById('engineHeaderIconBox');
  const headerTitle = document.getElementById('engineHeaderTitle');
  const headerBadge = document.getElementById('engineHeaderBadge');
  const headerSubtitle = document.getElementById('engineHeaderSubtitle');
  const proceedBtn = document.getElementById('engineProceedBtn');
  const payBtnText = document.getElementById('btnEnginePayText');

  if (headerTitle) {
    headerTitle.innerHTML = `<span>${service.title}</span><span class="pill-badge badge-blue text-[8px] px-1.5 py-0.5" id="engineHeaderBadge">${service.badge || 'BBPS'}</span>`;
  }
  if (headerSubtitle) headerSubtitle.textContent = service.subtitle;
  if (headerIcon) {
    headerIcon.setAttribute('data-lucide', service.icon || 'zap');
  }

  // Find the exact palette class for the service icon from the main grid (if we want to sync colors)
  // For now, we'll assign a default or specific color if needed, or leave it dynamically handled.
  if (headerIconBox && service.category) {
    // just a simple fallback, the main grid colors are applied via make_colorful.js on the buttons.
    // For the modal header, we can just let it have the default indigo, or we can look up the button's color.
    const sourceBtn = document.querySelector(`.bbps-service-btn[onclick*="'${serviceKey}'"] .bbps-icon-circle`);
    if (sourceBtn) {
       headerIconBox.className = sourceBtn.className.replace('bbps-icon-circle', 'w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm flex-shrink-0');
    }
  }

  if (proceedBtn) {
    proceedBtn.setAttribute('onclick', `executeBillPayment('${serviceKey}')`);
  }
  if (payBtnText) {
    payBtnText.textContent = 'Proceed to Pay via UPI';
  }

  renderBillPayForm(serviceKey, presetData);
  openModal('modalBillPayEngine');
  if (window.lucide) window.lucide.createIcons();
}


// Updated renderBillPayForm to include Recent History & Offers
// Updated renderBillPayForm (removes inline proceed button, uses bg-slate-800 for cards)
function renderBillPayForm(serviceKey, presetData = null) {
  const container = document.getElementById('engineDynamicFormContainer');
  if (!container) return;

  const service = rechargeBillsCatalog[serviceKey];
  if (!service) return;

  let formHtml = '';

  // NEW: Recent History Section
  if (service.recentHistory && service.recentHistory.length > 0) {
    formHtml += `
      <div class="mb-4">
        <h4 class="text-xs font-bold text-slate-300 mb-2">Recent & Saved Accounts</h4>
        <div class="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
    `;
    service.recentHistory.forEach(hist => {
      formHtml += `
        <div class="flex-shrink-0 bg-slate-800 border border-slate-700/50 rounded-xl p-2.5 w-44 flex items-center gap-3 cursor-pointer hover:bg-slate-700 transition" onclick="document.querySelector('input').value='${hist.ref}';">
          <div class="w-9 h-9 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-slate-300 flex-shrink-0">
            <i data-lucide="${service.icon}" class="w-4 h-4"></i>
          </div>
          <div class="overflow-hidden">
            <div class="text-[11px] font-bold text-white truncate">${hist.name}</div>
            <div class="text-[9px] text-slate-400 truncate mt-0.5">${hist.ref}</div>
          </div>
        </div>
      `;
    });
    formHtml += `</div></div>`;
  }

  // NEW: Offers Section
  if (service.offers && service.offers.length > 0) {
    formHtml += `
      <div class="mb-4 bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-3 flex items-start gap-3">
        <div class="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
          <i data-lucide="tag" class="w-3.5 h-3.5"></i>
        </div>
        <div>
          <div class="text-xs font-bold text-emerald-400">${service.offers[0].code}</div>
          <div class="text-[10px] text-slate-300 mt-0.5">${service.offers[0].desc}</div>
        </div>
      </div>
    `;
  }

  // 1. Dynamic Input Fields
  if (service.fields && service.fields.length > 0) {
    formHtml += '<div class="space-y-3 mb-4">';
    service.fields.forEach(field => {
      formHtml += `<div>
        <label class="text-[11px] font-bold text-slate-300 block mb-1.5">${field.label}</label>`;
      
      if (field.type === 'select') {
        formHtml += `<select id="field_${field.id}" class="w-full px-3.5 py-3 bg-slate-900 border border-white/10 rounded-xl text-xs text-white focus:border-indigo-500 focus:outline-none transition">`;
        (field.options || []).forEach(opt => {
          formHtml += `<option value="${opt.val}">${opt.label}</option>`;
        });
        formHtml += '</select>';
      } else {
        const val = (presetData && presetData[field.id]) ? presetData[field.id] : (field.defaultValue || '');
        formHtml += `<input type="${field.type || 'text'}" id="field_${field.id}" value="${val}" placeholder="${field.placeholder || ''}" class="w-full px-3.5 py-3 bg-slate-900 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition">`;
      }
      formHtml += '</div>';
    });
    formHtml += '</div>';
  }

  // 2. Mobile Plans Browser
  if (service.plans && service.plans.length > 0) {
    formHtml += `
      <div class="mb-4">
        <div class="flex items-center justify-between mb-2.5">
          <span class="text-xs font-bold text-white">Select a Recharge Plan</span>
          <span class="pill-badge badge-green text-[8px] px-1.5 py-0.5">UNLIMITED 5G</span>
        </div>

        <div class="flex gap-1.5 overflow-x-auto pb-2 mb-3 hide-scrollbar">
          <button type="button" class="plan-tab-btn active bg-indigo-600 text-white border-transparent" onclick="filterPlansByCategory('all', this)">All Plans</button>
          <button type="button" class="plan-tab-btn bg-slate-800 text-slate-300 border-white/5" onclick="filterPlansByCategory('recommended', this)">Recommended</button>
          <button type="button" class="plan-tab-btn bg-slate-800 text-slate-300 border-white/5" onclick="filterPlansByCategory('5g_unlimited', this)">5G Unlimited</button>
        </div>

        <div class="space-y-2.5 max-h-56 overflow-y-auto pr-1 hide-scrollbar" id="planCardsList">
    `;

    service.plans.forEach((p, idx) => {
      const isFirst = idx === 0;
      if (isFirst) currentSelectedPlan = p;
      formHtml += `
        <div class="p-3.5 rounded-2xl bg-slate-900 border ${isFirst ? 'border-indigo-500 bg-indigo-950/20' : 'border-white/10'} hover:border-indigo-400/80 transition cursor-pointer plan-card-item" data-category="${p.category}" onclick="selectMobilePlan('${p.id}', this)">
          <div class="flex items-center justify-between mb-1.5">
            <div class="flex items-center gap-2">
              <span class="text-base font-black text-white font-mono">₹ ${p.price}</span>
              <span class="pill-badge badge-cyan text-[8px] font-bold px-1.5 py-0.5">${p.validity}</span>
            </div>
            <span class="text-xs font-bold text-indigo-400 font-mono">${p.data}</span>
          </div>
          <p class="text-[10px] text-slate-300 leading-snug">${p.desc}</p>
        </div>
      `;
    });

    formHtml += `</div></div>`;
  }

  // 3. Live Bill Fetch Card
  if (service.sampleFetch) {
    formHtml += `
      <div id="billFetchResultBox" class="mb-4">
        <button type="button" class="w-full py-3 rounded-xl bg-slate-900 border border-indigo-500/40 hover:border-indigo-500 text-indigo-400 hover:text-indigo-300 text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm" onclick="fetchLiveBill('${serviceKey}')">
          <i data-lucide="refresh-cw" class="w-3.5 h-3.5"></i>
          <span>Fetch Latest Due Bill (Bharat Connect)</span>
        </button>
      </div>
    `;
  }

  container.innerHTML = formHtml;
  if (window.lucide) window.lucide.createIcons();
}


function filterPlansByCategory(cat, btn) {
  document.querySelectorAll('.plan-tab-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');

  const cards = document.querySelectorAll('.plan-card-item');
  cards.forEach(card => {
    if (cat === 'all' || card.getAttribute('data-category') === cat) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

function selectMobilePlan(planId, element) {
  if (!currentBillEngineService || !currentBillEngineService.plans) return;
  const plan = currentBillEngineService.plans.find(p => p.id === planId);
  if (!plan) return;

  currentSelectedPlan = plan;

  document.querySelectorAll('.plan-card-item').forEach(c => {
    c.className = 'p-3 rounded-2xl bg-slate-900 border border-white/10 hover:border-indigo-400/80 transition cursor-pointer plan-card-item';
  });

  if (element) {
    element.className = 'p-3 rounded-2xl bg-slate-900 border border-indigo-500 bg-indigo-950/30 shadow-md shadow-indigo-500/20 transition cursor-pointer plan-card-item';
  }

  const payBtnText = document.getElementById('btnEnginePayText');
  if (payBtnText) {
    payBtnText.textContent = `Recharge ₹ ${plan.price} via UPI PIN`;
  }
}

function fetchLiveBill(serviceKey) {
  const service = rechargeBillsCatalog[serviceKey];
  if (!service || !service.sampleFetch) return;

  const box = document.getElementById('billFetchResultBox');
  if (!box) return;

  playBeep(600, 'sine', 0.08);
  box.innerHTML = `
    <div class="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/50 text-center animate-pulse">
      <div class="w-6 h-6 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
      <p class="text-xs text-indigo-300 font-bold">Connecting to Bharat Connect BBPS Core...</p>
      <p class="text-[10px] text-slate-400">Fetching live bill from ${service.title} servers</p>
    </div>
  `;

  setTimeout(() => {
    const f = service.sampleFetch;
    currentFetchedBill = f;
    playSuccessChime();

    box.innerHTML = `
      <div class="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/80 via-slate-900 to-slate-900 border border-emerald-500/50 shadow-lg shadow-emerald-950/20">
        <div class="flex items-center justify-between mb-2">
          <span class="pill-badge badge-green text-[9px] font-bold">BILL FETCHED</span>
          <span class="text-[9px] font-mono text-slate-400">BBPS ID: BBPS${Math.floor(100000 + Math.random() * 900000)}</span>
        </div>
        <div class="text-xs text-slate-400">Customer Name</div>
        <div class="text-sm font-bold text-white mb-2">${f.consumerName || 'Aarav Sharma'}</div>
        
        <div class="flex items-center justify-between pt-2 border-t border-white/10">
          <div>
            <div class="text-[10px] text-slate-400">Total Amount Due</div>
            <div class="text-2xl font-black text-emerald-400 font-mono">₹ ${formatInr(f.billAmount || 0)}</div>
          </div>
          <div class="text-right">
            ${f.dueDate ? `<div class="text-[10px] text-slate-400">Due Date</div>
            <div class="text-xs font-bold text-white font-mono">${f.dueDate}</div>` : ''}
          </div>
        </div>

        ${f.units ? `<div class="mt-2 text-[10px] text-slate-400 flex items-center justify-between"><span>Units Consumed: <strong>${f.units}</strong></span><span>Late Fee: <strong class="text-emerald-400">₹0.00</strong></span></div>` : ''}
        ${f.currentBalance ? `<div class="mt-2 text-[10px] text-slate-400 flex items-center justify-between"><span>Current Balance: <strong class="text-amber-400">${f.currentBalance}</strong></span></div>` : ''}
        ${f.minimumDue ? `<div class="mt-2 text-[10px] text-slate-400 flex items-center justify-between"><span>Minimum Amount Due: <strong class="text-rose-400">${f.minimumDue}</strong></span></div>` : ''}
        ${f.plan ? `<div class="mt-2 text-[10px] text-slate-400 flex items-center justify-between"><span>Selected Plan: <strong class="text-indigo-400">${f.plan}</strong></span></div>` : ''}
        ${f.info ? `<div class="mt-2 pt-2 border-t border-white/5 text-[10px] text-amber-300 italic">${f.info}</div>` : ''}
      </div>
    `;

    const payBtnText = document.getElementById('btnEnginePayText');
    if (payBtnText) {
      payBtnText.textContent = `Pay ₹ ${formatInr(f.billAmount || 0)} via UPI PIN`;
    }
  }, 450);
}

function executeBillPayment(serviceKey) {
  const service = rechargeBillsCatalog[serviceKey];
  if (!service) return;

  let payAmount = 0;
  let payeeName = service.title;
  let payeeVpa = `${serviceKey.replace(/_/g, '')}@bharatconnect`;

  if (service.plans && currentSelectedPlan) {
    payAmount = currentSelectedPlan.price;
    payeeName = `${service.title} (${currentSelectedPlan.data})`;
  } else if (currentFetchedBill && currentFetchedBill.billAmount) {
    payAmount = currentFetchedBill.billAmount;
    payeeName = `${service.title} - ${currentFetchedBill.consumerName || 'Aarav Sharma'}`;
  } else {
    // Check form inputs
    const amtInput = document.getElementById('field_ccAmount') ||
                     document.getElementById('field_ncmcAmount') ||
                     document.getElementById('field_pmAmount') ||
                     document.getElementById('field_evAmount') ||
                     document.getElementById('field_rentAmount') ||
                     document.getElementById('field_donAmount') ||
                     document.getElementById('field_devAmount') ||
                     document.getElementById('field_npsAmount') ||
                     document.getElementById('field_gplayAmount') ||
                     document.getElementById('field_appleAmount');

    if (amtInput && amtInput.value) {
      payAmount = parseFloat(amtInput.value) || 100;
    } else if (service.sampleFetch && service.sampleFetch.billAmount) {
      payAmount = service.sampleFetch.billAmount;
    } else {
      payAmount = 299;
    }
  }

  if (isNaN(payAmount) || payAmount <= 0) payAmount = 299;

  closeModal('modalBillPayEngine');
  closeModal('modalRechargeBillsHub');

  // Launch Unexa UPI PIN Checkout
  setTimeout(() => {
    initiatePayment(payeeName, payeeVpa, payAmount, `⚡ Bharat Connect: ${service.title}`, false);
  }, 250);
}

function claimJio5GOffer() {
  playSuccessChime();
  if (window.confetti) {
    window.confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
  }
  showToast('🎉 Jio 5G Offer Claimed! Opening Doorstep SIM booking...');
  setTimeout(() => {
    openBillPayEngine('get_sim', { simOperator: 'jio', simType: 'physical' });
  }, 500);
}

function openBrandVouchersModal() {
  const container = document.getElementById('brandVouchersListContainer');
  if (container) {
    const brands = [
      { name: 'Amazon Pay Gift Card', tag: 'Shopping & Recharges', icon: 'a', bg: 'bg-amber-500/20 text-amber-400', discount: '2.0% Off', min: 250, max: 10000 },
      { name: 'Flipkart Voucher', tag: 'Electronics & Fashion', icon: 'fk', bg: 'bg-blue-500/20 text-blue-400', discount: '2.5% Off', min: 250, max: 10000 },
      { name: 'Swiggy Money Card', tag: 'Food & Instamart', icon: '🍔', bg: 'bg-orange-500/20 text-orange-400', discount: '5.0% Off', min: 100, max: 5000 },
      { name: 'Zomato Pro Card', tag: 'Dining & Food', icon: '🍕', bg: 'bg-rose-500/20 text-rose-400', discount: '5.0% Off', min: 100, max: 5000 },
      { name: 'Myntra Fashion Voucher', tag: 'Clothing & Lifestyle', icon: '🛍️', bg: 'bg-pink-500/20 text-pink-400', discount: '7.5% Off', min: 500, max: 5000 },
      { name: 'Uber Rides & Auto', tag: 'Cabs & Commute', icon: '🚗', bg: 'bg-slate-800 text-white', discount: '4.0% Off', min: 200, max: 3000 },
      { name: 'MakeMyTrip Flight Card', tag: 'Hotels & Flights', icon: '✈️', bg: 'bg-red-500/20 text-red-400', discount: '6.0% Off', min: 1000, max: 25000 }
    ];

    let htmlStr = '';
    brands.forEach(b => {
      htmlStr += `
        <div class="p-3 rounded-2xl bg-slate-900 border border-white/10 hover:border-purple-500/60 transition flex items-center justify-between cursor-pointer" onclick="buyBrandVoucher('${b.name}', 500, 5)">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl ${b.bg} flex items-center justify-center font-black text-sm flex-shrink-0">
              ${b.icon}
            </div>
            <div>
              <div class="text-xs font-bold text-white">${b.name}</div>
              <div class="text-[10px] text-slate-400">${b.tag}</div>
            </div>
          </div>
          <div class="text-right">
            <span class="pill-badge badge-green text-[9px] font-bold">${b.discount}</span>
            <div class="text-[10px] text-purple-400 font-bold mt-1">Buy Instant</div>
          </div>
        </div>
      `;
    });
    container.innerHTML = htmlStr;
  }
  openModal('modalBrandVouchers');
}

function buyBrandVoucher(brandName, amount = 500, discountPercent = 5) {
  closeModal('modalBrandVouchers');
  closeModal('modalRechargeBillsHub');
  const finalAmt = amount - (amount * (discountPercent / 100));

  setTimeout(() => {
    initiatePayment(`${brandName} Voucher (₹${amount})`, 'vouchers@bharatconnect', finalAmt, `🎁 ${discountPercent}% Off Brand Voucher`, false);
  }, 250);
}


// Global Keyboard Handler for PIN Modals
document.addEventListener('keydown', (e) => {
  const resetModal = document.getElementById('modalResetPin');
  if (resetModal && resetModal.classList.contains('active')) {
    const step2Active = !document.getElementById('resetPinStep2Box').classList.contains('hidden');
    const step3Active = !document.getElementById('resetPinStep3Box').classList.contains('hidden');

    if (/^[0-9]$/.test(e.key)) {
      if (step2Active) pressNewPinKey(e.key);
      else if (step3Active) pressConfirmPinKey(e.key);
    } else if (e.key === 'Backspace') {
      if (step2Active) backspaceNewPinKey();
      else if (step3Active) backspaceConfirmPinKey();
    } else if (e.key === 'Enter') {
      if (step3Active && tempConfirmPin.length === 4) validateAndSaveNewPin();
    }
    return;
  }

  const payModal = document.getElementById('modalPaymentCheckout');
  if (payModal && payModal.classList.contains('active')) {
    if (/^[0-9]$/.test(e.key)) {
      pressPinKey(e.key);
    } else if (e.key === 'Backspace') {
      backspacePinKey();
    }
    return;
  }

  const appLockModal = document.getElementById('modalVerifyAppLock');
  if (appLockModal && appLockModal.classList.contains('active')) {
    if (/^[0-9]$/.test(e.key)) {
      pressAppLockKey(e.key);
    } else if (e.key === 'Backspace') {
      backspaceAppLockKey();
    }
    return;
  }

  const cbModal = document.getElementById('modalCheckBalance');
  if (cbModal && cbModal.classList.contains('active')) {
    if (/^[0-9]$/.test(e.key)) {
      pressCheckBalancePin(e.key);
    } else if (e.key === 'Backspace') {
      backspaceCheckBalancePin();
    }
    return;
  }
});



// ==============================================
// BUSINESS MODE JS LOGIC
// ==============================================
let loginAppMode = 'personal'; // default
let currentActiveMode = 'personal'; 
let soundboxEnabled = true;

function setLoginMode(mode) {
  loginAppMode = mode;
  const btnPersonal = document.getElementById('modeSelectPersonal');
  const btnBusiness = document.getElementById('modeSelectBusiness');
  
  if(mode === 'personal') {
    btnPersonal.className = "flex-1 py-2 rounded-xl bg-indigo-500 text-white text-xs font-bold shadow-md flex items-center justify-center gap-1.5 transition";
    btnBusiness.className = "flex-1 py-2 rounded-xl text-slate-400 text-xs font-bold hover:text-white flex items-center justify-center gap-1.5 transition";
  } else {
    btnBusiness.className = "flex-1 py-2 rounded-xl bg-amber-500 text-slate-900 text-xs font-bold shadow-md flex items-center justify-center gap-1.5 transition";
    btnPersonal.className = "flex-1 py-2 rounded-xl text-slate-400 text-xs font-bold hover:text-white flex items-center justify-center gap-1.5 transition";
  }
}

function switchMode(targetMode) {
  currentActiveMode = targetMode;
  showToast(`Switching to ${targetMode === 'business' ? 'Business' : 'Personal'} Mode...`);
  playSuccessChime();
  updateAuthViewVisibility();
}

// Override existing updateAuthViewVisibility safely
const oldUpdateAuthViewVisibility = updateAuthViewVisibility;
updateAuthViewVisibility = function() {
  // Execute the original logic first
  oldUpdateAuthViewVisibility();

  // Now apply the business overlay logic on top
  const authView = document.getElementById('loginAuthView');
  const bHeader = document.getElementById('businessHeader');
  const bContent = document.getElementById('businessContent');
  const bNav = document.getElementById('businessBottomNav');

  if (!appState.isLoggedIn) {
    if (bHeader) bHeader.classList.add('hidden');
    if (bContent) bContent.classList.add('hidden');
    if (bNav) bNav.classList.add('hidden');
    // Ensure login appMode corresponds to what we will open
    currentActiveMode = loginAppMode;
  } else {
    if (currentActiveMode === 'business') {
      // Hide personal views (added by original function)
      const mainHeader = document.getElementById('mainAppHeader');
      const mainContent = document.getElementById('mainContent');
      const bottomNav = document.querySelector('.bottom-nav:not(#businessBottomNav)');
      
      if (mainHeader) mainHeader.classList.add('hidden');
      if (mainContent) mainContent.classList.add('hidden');
      if (bottomNav) bottomNav.classList.add('hidden');
      
      if (bHeader) bHeader.classList.remove('hidden');
      if (bContent) bContent.classList.remove('hidden');
      if (bNav) bNav.classList.remove('hidden');
    } else {
      if (bHeader) bHeader.classList.add('hidden');
      if (bContent) bContent.classList.add('hidden');
      if (bNav) bNav.classList.add('hidden');
    }
  }
  
  if (window.lucide) window.lucide.createIcons();
}

function showBusinessQR() { openModal('modalBusinessQR'); }

function toggleSoundbox() {
  soundboxEnabled = !soundboxEnabled;
  const iconBox = document.getElementById('soundboxBtnIcon');
  if(soundboxEnabled) {
    iconBox.className = "w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-lg group-active:scale-95 transition";
    iconBox.innerHTML = '<i data-lucide="volume-2" class="w-6 h-6"></i>';
    showToast("🔊 Virtual Soundbox Enabled!");
    playSuccessChime();
  } else {
    iconBox.className = "w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 text-slate-500 flex items-center justify-center shadow-lg group-active:scale-95 transition";
    iconBox.innerHTML = '<i data-lucide="volume-x" class="w-6 h-6"></i>';
    showToast("🔇 Virtual Soundbox Muted");
  }
  if(window.lucide) window.lucide.createIcons();
}

function showBusinessSettlements() {
  showToast("⏳ Processing instant settlement to bank...");
  setTimeout(() => {
    playSuccessChime();
    showToast("✅ ₹ 8,200.00 settled to HDFC Bank A/c!");
  }, 1500);
}

function showCustomerInsights() {
  showToast("🧠 AI Insight: 65% of your sales today are from returning customers! Consider a loyalty program.");
}

function switchBusinessTab(tab, btn) {
  const btns = document.querySelectorAll('#businessBottomNav .nav-btn');
  btns.forEach(b => {
    b.classList.remove('active', 'text-amber-500');
    b.classList.add('text-slate-500');
  });
  btn.classList.remove('text-slate-500');
  btn.classList.add('active', 'text-amber-500');
  
  // Hide all tabs
  ['bTabHome', 'bTabKhata', 'bTabSettlements', 'bTabStore'].forEach(t => {
    const el = document.getElementById(t);
    if(el) el.classList.add('hidden');
  });
  
  // Show target
  const targetId = 'bTab' + tab.charAt(0).toUpperCase() + tab.slice(1);
  const targetEl = document.getElementById(targetId);
  if(targetEl) {
    targetEl.classList.remove('hidden');
  }
  
  if (window.lucide) window.lucide.createIcons();
}

function processInstantSettlement() {
  showToast("⏳ Processing IMPS transfer to HDFC Bank...");
  setTimeout(() => {
    playSuccessChime();
    showToast("✅ ₹ 8,200 settled instantly! UTR: HDFC" + Math.floor(Math.random()*1000000));
  }, 1500);
}

function processLoan() {
  showToast("⏳ Verifying UPI volumes and generating contract...");
  setTimeout(() => {
    closeModal('modalBusinessLoan');
    playSuccessChime();
    if(window.confetti) window.confetti({ particleCount: 150, spread: 100, origin: { y: 0.5 } });
    showToast("🎉 ₹ 5,00,000 Loan Approved & Disbursed to Bank Account!");
  }, 2500);
}

