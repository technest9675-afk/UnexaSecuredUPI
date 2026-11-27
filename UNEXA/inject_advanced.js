const fs = require('fs');

const catalogCode = `const rechargeBillsCatalog = {
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
};`;

const renderUpdate = `
// Updated renderBillPayForm to include Recent History & Offers
function renderBillPayForm(serviceKey, presetData = null) {
  const container = document.getElementById('engineDynamicFormContainer');
  if (!container) return;

  const service = rechargeBillsCatalog[serviceKey];
  if (!service) return;

  let formHtml = '';

  // NEW: Recent History Section
  if (service.recentHistory && service.recentHistory.length > 0) {
    formHtml += \`
      <div class="mb-4">
        <h4 class="text-xs font-bold text-slate-300 mb-2">Recent & Saved Accounts</h4>
        <div class="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
    \`;
    service.recentHistory.forEach(hist => {
      formHtml += \`
        <div class="flex-shrink-0 bg-slate-800/50 border border-slate-700/50 rounded-xl p-2.5 w-40 flex items-center gap-3 cursor-pointer hover:bg-slate-800 transition" onclick="document.querySelector('input').value='\${hist.ref}';">
          <div class="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 flex-shrink-0">
            <i data-lucide="\${service.icon}" class="w-4 h-4"></i>
          </div>
          <div class="overflow-hidden">
            <div class="text-[11px] font-bold text-white truncate">\${hist.name}</div>
            <div class="text-[9px] text-slate-400 truncate">\${hist.ref}</div>
          </div>
        </div>
      \`;
    });
    formHtml += \`</div></div>\`;
  }

  // NEW: Offers Section
  if (service.offers && service.offers.length > 0) {
    formHtml += \`
      <div class="mb-4 bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-3 flex items-start gap-3">
        <div class="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
          <i data-lucide="tag" class="w-3.5 h-3.5"></i>
        </div>
        <div>
          <div class="text-xs font-bold text-emerald-400">\${service.offers[0].code}</div>
          <div class="text-[10px] text-slate-300 mt-0.5">\${service.offers[0].desc}</div>
        </div>
      </div>
    \`;
  }

  // 1. Dynamic Input Fields
  if (service.fields && service.fields.length > 0) {
    formHtml += '<div class="space-y-3 mb-4">';
    service.fields.forEach(field => {
      formHtml += \`<div>
        <label class="text-xs font-semibold text-slate-300 block mb-1">\${field.label}</label>\`;
      
      if (field.type === 'select') {
        formHtml += \`<select id="field_\${field.id}" class="w-full px-3 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-xs text-white focus:border-indigo-500 focus:outline-none">\`;
        (field.options || []).forEach(opt => {
          formHtml += \`<option value="\${opt.val}">\${opt.label}</option>\`;
        });
        formHtml += '</select>';
      } else {
        const val = (presetData && presetData[field.id]) ? presetData[field.id] : (field.defaultValue || '');
        formHtml += \`<input type="\${field.type || 'text'}" id="field_\${field.id}" value="\${val}" placeholder="\${field.placeholder || ''}" class="w-full px-3 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none">\`;
      }
      formHtml += '</div>';
    });
    formHtml += '</div>';
  }

  // 2. Mobile Plans Browser
  if (service.plans && service.plans.length > 0) {
    formHtml += \`
      <div class="mb-4">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-bold text-white">Select a Recharge Plan</span>
          <span class="pill-badge badge-green text-[8px]">UNLIMITED 5G</span>
        </div>

        <div class="flex gap-1.5 overflow-x-auto pb-2 mb-3">
          <button type="button" class="plan-tab-btn active" onclick="filterPlansByCategory('all', this)">All Plans</button>
          <button type="button" class="plan-tab-btn" onclick="filterPlansByCategory('recommended', this)">Recommended</button>
          <button type="button" class="plan-tab-btn" onclick="filterPlansByCategory('5g_unlimited', this)">5G Unlimited</button>
        </div>

        <div class="space-y-2 max-h-56 overflow-y-auto pr-1" id="planCardsList">
    \`;

    service.plans.forEach((p, idx) => {
      const isFirst = idx === 0;
      if (isFirst) currentSelectedPlan = p;
      formHtml += \`
        <div class="p-3 rounded-2xl bg-slate-900 border \${isFirst ? 'border-indigo-500 bg-indigo-950/20' : 'border-white/10'} hover:border-indigo-400/80 transition cursor-pointer plan-card-item" data-category="\${p.category}" onclick="selectMobilePlan('\${p.id}', this)">
          <div class="flex items-center justify-between mb-1">
            <div class="flex items-center gap-2">
              <span class="text-base font-black text-white font-mono">₹ \${p.price}</span>
              <span class="pill-badge badge-cyan text-[8px] font-bold">\${p.validity}</span>
            </div>
            <span class="text-xs font-bold text-indigo-400 font-mono">\${p.data}</span>
          </div>
          <p class="text-[10px] text-slate-300 leading-snug">\${p.desc}</p>
        </div>
      \`;
    });

    formHtml += \`</div></div>\`;
  }

  // 3. Live Bill Fetch Card
  if (service.sampleFetch) {
    formHtml += \`
      <div id="billFetchResultBox" class="mb-4">
        <button type="button" class="w-full py-2.5 rounded-xl bg-slate-900 border border-indigo-500/40 hover:border-indigo-500 text-indigo-300 hover:text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md" onclick="fetchLiveBill('\${serviceKey}')">
          <i data-lucide="refresh-cw" class="w-3.5 h-3.5"></i>
          <span>Fetch Latest Due Bill (Bharat Connect)</span>
        </button>
      </div>
    \`;
  }

  // 5. Pay / Proceed Button
  formHtml += \`
    <button type="button" class="w-full py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition active:scale-95 flex items-center justify-center gap-2 mt-2" onclick="executeBillPayment('\${serviceKey}')">
      <i data-lucide="shield-check" class="w-4 h-4"></i>
      <span id="btnEnginePayText">Proceed to Pay via UPI</span>
    </button>
  \`;

  container.innerHTML = formHtml;
  if (window.lucide) window.lucide.createIcons();
}
`;

let html = fs.readFileSync('app/index.html', 'utf8');

const regexCatalog = /const rechargeBillsCatalog = \{[\s\S]*?\n  \};\n/;
html = html.replace(regexCatalog, catalogCode + '\n');

// In my previous test, the regex was slightly different, so I'll just use manual slice to be safe.
const lines = html.split('\n');
let catStart = -1, catEnd = -1;
let depth = 0;
for (let i = 0; i < lines.length; i++) {
  if (catStart === -1 && lines[i].includes('const rechargeBillsCatalog = {')) catStart = i;
  if (catStart !== -1) {
    if (lines[i].includes('{')) depth += (lines[i].match(/\{/g) || []).length;
    if (lines[i].includes('}')) depth -= (lines[i].match(/\}/g) || []).length;
    if (depth === 0 && i > catStart) { catEnd = i; break; }
  }
}

if (catStart !== -1 && catEnd !== -1) {
  lines.splice(catStart, catEnd - catStart + 1, catalogCode);
}
html = lines.join('\n');

// Now for renderBillPayForm
let rStart = -1, rEnd = -1;
depth = 0;
const newLines = html.split('\n');
for (let i = 0; i < newLines.length; i++) {
  if (rStart === -1 && newLines[i].includes('function renderBillPayForm(serviceKey')) rStart = i;
  if (rStart !== -1) {
    if (newLines[i].includes('{')) depth += (newLines[i].match(/\{/g) || []).length;
    if (newLines[i].includes('}')) depth -= (newLines[i].match(/\}/g) || []).length;
    if (depth === 0 && i > rStart) { rEnd = i; break; }
  }
}

if (rStart !== -1 && rEnd !== -1) {
  newLines.splice(rStart, rEnd - rStart + 1, renderUpdate);
}

fs.writeFileSync('app/index.html', newLines.join('\n'));
console.log('Successfully injected advanced catalog and UI');
