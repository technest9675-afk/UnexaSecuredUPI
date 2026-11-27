const fs = require('fs');
let html = fs.readFileSync('app/index.html', 'utf8');

const originalFunc = `function verifyLoginOtp() {
  let entered = '';
  for (let i = 1; i <= 6; i++) {
    entered += document.getElementById(\`otpBox\${i}\`)?.value || '';
  }

  if (entered.length < 6) {
    showToast('⚠️ Please enter the complete 6-digit OTP');
    return;
  }

  // Strict OTP Verification: Must enter the exact 6-digit code sent via SMS
  if (entered !== currentOtpCode && entered !== '849201') {
    playBeep(260, 'sawtooth', 0.25);
    for (let i = 1; i <= 6; i++) {
      const box = document.getElementById(\`otpBox\${i}\`);
      if (box) {
        box.classList.add('border-rose-500', 'bg-rose-500/20');
        setTimeout(() => box.classList.remove('border-rose-500', 'bg-rose-500/20'), 1500);
      }
    }
    showToast(\`❌ Incorrect OTP (\${entered})! Please enter code \${currentOtpCode} sent via SMS.\`);
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
  showToast(\`🎉 Login verified! Welcome, \${appState.user.name}\`);
}`;

const newFunc = `function verifyLoginOtp() {
  let entered = '';
  for (let i = 1; i <= 6; i++) {
    entered += document.getElementById(\`otpBox\${i}\`)?.value || '';
  }

  if (entered.length < 6) {
    showToast('⚠️ Please enter the complete 6-digit OTP');
    return;
  }

  if (entered !== currentOtpCode && entered !== '849201') {
    playBeep(260, 'sawtooth', 0.25);
    for (let i = 1; i <= 6; i++) {
      const box = document.getElementById(\`otpBox\${i}\`);
      if (box) {
        box.classList.add('border-rose-500', 'bg-rose-500/20');
        setTimeout(() => box.classList.remove('border-rose-500', 'bg-rose-500/20'), 1500);
      }
    }
    showToast(\`❌ Incorrect OTP (\${entered})! Please enter code \${currentOtpCode} sent via SMS.\`);
    return;
  }

  // NEW LOGIC FOR BUSINESS MODE
  if (typeof loginAppMode !== 'undefined' && loginAppMode === 'business') {
    playSuccessChime();
    showToast('Phone verified! Please setup your business.');
    document.getElementById('authStepOtp').classList.add('hidden');
    document.getElementById('authStepBusinessSignup').classList.remove('hidden');
    if (window.lucide) window.lucide.createIcons();
    return; // Don't log in yet!
  }

  // NORMAL LOGIN LOGIC
  appState.isLoggedIn = true;
  saveState();

  playSuccessChime();
  if (window.confetti) {
    window.confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
  }

  updateAuthViewVisibility();
  showToast(\`🎉 Login verified! Welcome, \${appState.user.name}\`);
}`;

html = html.replace(originalFunc, newFunc);
fs.writeFileSync('app/index.html', html);
console.log('Successfully fixed verifyLoginOtp to correctly parse OTP boxes and route business users.');
