const fs = require('fs');
let html = fs.readFileSync('app/index.html', 'utf8');

const startContent = html.indexOf('<main id="businessContent"');
const endContent = html.indexOf('</main>', startContent) + 7;
let currentContent = html.substring(startContent, endContent);

const innerStart = currentContent.indexOf('>') + 1;
const innerEnd = currentContent.lastIndexOf('</main>');
let homeInnerHtml = currentContent.substring(innerStart, innerEnd).trim();

const newMainContent = `
<main id="businessContent" class="hidden fixed inset-0 overflow-y-auto pb-24 pt-24 bg-[#07090e] px-4 hide-scrollbar z-30">
  
  <div id="bTabHome" class="space-y-5 animate-fade-in">
    ${homeInnerHtml}
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
`;

html = html.replace(currentContent, newMainContent);

const modalsHtml = `
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
`;

const qrEnd = html.indexOf('</div>\n</div>\n</body>');
if (qrEnd > -1) {
  html = html.substring(0, qrEnd + 12) + '\n' + modalsHtml + html.substring(qrEnd + 12);
}

const oldJsFunc = `function switchBusinessTab(tab, btn) {
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
}`;

const newJsFunc = `function switchBusinessTab(tab, btn) {
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
}`;

html = html.replace(oldJsFunc, newJsFunc);

fs.writeFileSync('app/index.html', html);
console.log('Successfully enhanced Business Mode features!');
