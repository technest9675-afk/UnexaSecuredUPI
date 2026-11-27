const fs = require('fs');
let html = fs.readFileSync('app/index.html', 'utf8');

// 1. Inject Login Screen Toggle
const loginTarget = '<p class="text-xs text-slate-300 max-w-[280px] mx-auto">Next-gen Personal UPI &amp; Shared Group Pools in one unified experience.</p>';
const loginReplacement = `
<p class="text-xs text-slate-300 max-w-[280px] mx-auto mb-4">Select your account type to proceed.</p>
<div class="flex gap-2 justify-center max-w-[280px] mx-auto mb-4 bg-slate-900 p-1.5 rounded-2xl border border-white/5 shadow-inner">
  <button id="modeSelectPersonal" class="flex-1 py-2 rounded-xl bg-indigo-500 text-white text-xs font-bold shadow-md flex items-center justify-center gap-1.5 transition" onclick="setLoginMode('personal')">
    <i data-lucide="user" class="w-4 h-4"></i> Personal
  </button>
  <button id="modeSelectBusiness" class="flex-1 py-2 rounded-xl text-slate-400 text-xs font-bold hover:text-white flex items-center justify-center gap-1.5 transition" onclick="setLoginMode('business')">
    <i data-lucide="briefcase" class="w-4 h-4"></i> Business
  </button>
</div>`;
html = html.replace(loginTarget, loginReplacement);

// 2. Inject "Switch to Business Mode" button in Profile View
const profileQrBtnCode = `<i data-lucide="qr-code" class="w-4 h-4 text-indigo-400"></i>
            <span>View &amp; Share My QR Code</span>
          </button>
        </div>`;
const profileSwitchCode = `<i data-lucide="qr-code" class="w-4 h-4 text-indigo-400"></i>
            <span>View &amp; Share My QR Code</span>
          </button>
          
          <button class="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-900 text-xs font-bold hover:from-amber-400 hover:to-yellow-300 transition mt-2 w-full justify-center shadow-lg shadow-amber-500/20" onclick="switchMode('business')">
            <i data-lucide="briefcase" class="w-4 h-4"></i>
            <span>Switch to Business Mode</span>
          </button>
        </div>`;
html = html.replace(profileQrBtnCode, profileSwitchCode);

// 3. Inject Business View HTML and Modals before </body>
const businessHtml = `
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

<main id="businessContent" class="hidden fixed inset-0 overflow-y-auto pb-24 pt-24 bg-[#07090e] px-4 space-y-5 hide-scrollbar z-30">
  
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
<div class="modal-overlay hidden" id="modalBusinessQR" style="z-index: 60;">
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
</div>
</body>`;

html = html.replace('</body>', businessHtml);

// 4. Inject JS logic for Business Mode
const businessJs = `
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
  showToast(\`Switching to \${targetMode === 'business' ? 'Business' : 'Personal'} Mode...\`);
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

function showBusinessQR() {
  const modal = document.getElementById('modalBusinessQR');
  if(modal) {
    modal.classList.remove('hidden');
    setTimeout(() => {
      modal.querySelector('.modal-bottom-sheet').style.transform = 'translateY(0)';
    }, 10);
  }
}

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
  
  if(tab !== 'home') {
    showToast(\`Navigating to \${tab.charAt(0).toUpperCase() + tab.slice(1)}...\`);
  }
}
</script>
</body>`;

html = html.replace('</script>\n  </body>', businessJs);
html = html.replace('</script>\n</body>', businessJs);

fs.writeFileSync('app/index.html', html);
console.log('Business mode injected successfully!');
