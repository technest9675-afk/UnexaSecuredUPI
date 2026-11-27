const fs = require('fs');
let html = fs.readFileSync('app/index.html', 'utf8');

// 1. Tag dynamic names in the Business UI
html = html.replace(/Fresh Mart Superstore/g, '<span class="b-dynamic-name">Fresh Mart Superstore</span>');
html = html.replace(/Grocery \/ Retail/g, '<span class="b-dynamic-cat">Grocery / Retail</span>');

// 2. Inject the Business Registration Step into loginAuthView
const signupHtml = `
      <!-- AUTH STEP 3: BUSINESS REGISTRATION -->
      <div id="authStepBusinessSignup" class="hidden flex-1 flex flex-col justify-between animate-fade-in pb-4">
        <div>
          <div class="text-center mb-6">
            <div class="w-16 h-16 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-3 border border-amber-500/20 shadow-lg shadow-amber-500/10">
              <i data-lucide="store" class="w-8 h-8"></i>
            </div>
            <h2 class="text-xl font-black text-white tracking-wide">Create Business Account</h2>
            <p class="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">Join 5M+ merchants growing with Unexa</p>
          </div>

          <div class="space-y-4">
            <div>
              <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Business Name</label>
              <input type="text" id="regBusinessName" placeholder="e.g. Fresh Mart Superstore" class="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-bold focus:border-amber-500 focus:outline-none">
            </div>
            <div>
              <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Business Category</label>
              <select id="regBusinessCategory" class="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-bold focus:border-amber-500 focus:outline-none appearance-none">
                <option>Grocery & Retail</option>
                <option>Food & Restaurants</option>
                <option>Professional Services</option>
                <option>Electronics & IT</option>
                <option>Fashion & Apparel</option>
              </select>
            </div>
            <div>
              <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Bank A/C for Settlements</label>
              <input type="tel" id="regBusinessBank" placeholder="Account Number" class="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-amber-500 focus:outline-none font-mono tracking-wider">
            </div>
          </div>
        </div>

        <div class="mt-8 space-y-3">
          <button class="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-900 font-extrabold text-xs tracking-wide shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 active:scale-95 transition" onclick="completeBusinessSignup()">
            Open Business Account <i data-lucide="arrow-right" class="w-4 h-4"></i>
          </button>
          <button class="w-full py-3 rounded-xl bg-slate-900 border border-white/10 text-slate-300 font-bold text-xs tracking-wide flex items-center justify-center gap-2 active:scale-95 transition" onclick="cancelBusinessSignup()">
            Cancel & Go Back
          </button>
        </div>
      </div>
`;

// Insert it right before the closing div of loginAuthView.
// To find it safely, we look for authStepOtp ending.
const otpEndIdx = html.indexOf('</div>', html.indexOf('id="authStepOtp"'));
// Actually, it's safer to find id="authStepOtp", count its divs or just insert it right after the outermost </div> of authStepOtp.
const authStepOtpStr = '<div id="authStepOtp" class="hidden flex-1 flex flex-col justify-between">';
const otpBlockEnd = html.indexOf('</div>\n    </div>', html.indexOf(authStepOtpStr));

if (otpBlockEnd > -1) {
    html = html.substring(0, otpBlockEnd + 6) + '\n' + signupHtml + html.substring(otpBlockEnd + 6);
} else {
    // fallback, insert before the modeSelectPersonal button logic ? 
    // Wait, the auth container closes eventually. Let's just do replace.
    const hook = 'onclick="verifyLoginOtp()">\n            Verify OTP &amp; Login\n          </button>\n        </div>\n      </div>';
    html = html.replace(hook, hook + '\n' + signupHtml);
}


// 3. Inject JS Logic
const jsLogic = `
const oldVerifyLoginOtp = verifyLoginOtp;
verifyLoginOtp = function() {
  const otpInput = document.getElementById('authOtpInput');
  if (!otpInput) return;
  const otp = otpInput.value;
  
  if (otp.length === 6) {
    if (typeof loginAppMode !== 'undefined' && loginAppMode === 'business') {
      showToast('Phone verified! Please setup your business.');
      document.getElementById('authStepOtp').classList.add('hidden');
      document.getElementById('authStepBusinessSignup').classList.remove('hidden');
      if (window.lucide) window.lucide.createIcons();
    } else {
      // Personal mode proceeds as normal
      oldVerifyLoginOtp();
    }
  } else {
    showToast('Please enter a valid 6-digit OTP');
  }
};

function completeBusinessSignup() {
   const bName = document.getElementById('regBusinessName').value || 'My Business';
   const bCat = document.getElementById('regBusinessCategory').value || 'Retail';
   
   // Update profile elements
   document.querySelectorAll('.b-dynamic-name').forEach(el => el.innerText = bName);
   document.querySelectorAll('.b-dynamic-cat').forEach(el => el.innerText = bCat);

   showToast('Business Account Created Successfully!');
   playSuccessChime();
   
   appState.isLoggedIn = true;
   saveState();
   
   // Force dark theme for business
   document.body.classList.remove('theme-light');
   
   updateAuthViewVisibility();
   
   // Reset UI for next logout
   setTimeout(() => {
      document.getElementById('authStepBusinessSignup').classList.add('hidden');
      document.getElementById('authStepPhone').classList.remove('hidden');
      document.getElementById('regBusinessName').value = '';
      document.getElementById('regBusinessBank').value = '';
   }, 1000);
}

function cancelBusinessSignup() {
  document.getElementById('authStepBusinessSignup').classList.add('hidden');
  document.getElementById('authStepPhone').classList.remove('hidden');
  appState.isLoggedIn = false;
  loginAppMode = 'personal';
  setLoginMode('personal');
}
`;

html = html.replace('</script>\n</body>', jsLogic + '\n</script>\n</body>');

fs.writeFileSync('app/index.html', html);
console.log('Business Registration injected successfully!');
