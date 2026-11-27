const fs = require('fs');
let html = fs.readFileSync('app/index.html', 'utf8');

const updatedFetchLiveBill = `function fetchLiveBill(serviceKey) {
  const service = rechargeBillsCatalog[serviceKey];
  if (!service || !service.sampleFetch) return;

  const box = document.getElementById('billFetchResultBox');
  if (!box) return;

  playBeep(600, 'sine', 0.08);
  box.innerHTML = \`
    <div class="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/50 text-center animate-pulse">
      <div class="w-6 h-6 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
      <p class="text-xs text-indigo-300 font-bold">Connecting to Bharat Connect BBPS Core...</p>
      <p class="text-[10px] text-slate-400">Fetching live bill from \${service.title} servers</p>
    </div>
  \`;

  setTimeout(() => {
    const f = service.sampleFetch;
    currentFetchedBill = f;
    playSuccessChime();

    box.innerHTML = \`
      <div class="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/80 via-slate-900 to-slate-900 border border-emerald-500/50 shadow-lg shadow-emerald-950/20">
        <div class="flex items-center justify-between mb-2">
          <span class="pill-badge badge-green text-[9px] font-bold">BILL FETCHED</span>
          <span class="text-[9px] font-mono text-slate-400">BBPS ID: BBPS\${Math.floor(100000 + Math.random() * 900000)}</span>
        </div>
        <div class="text-xs text-slate-400">Customer Name</div>
        <div class="text-sm font-bold text-white mb-2">\${f.consumerName || 'Aarav Sharma'}</div>
        
        <div class="flex items-center justify-between pt-2 border-t border-white/10">
          <div>
            <div class="text-[10px] text-slate-400">Total Amount Due</div>
            <div class="text-2xl font-black text-emerald-400 font-mono">₹ \${formatInr(f.billAmount || 0)}</div>
          </div>
          <div class="text-right">
            \${f.dueDate ? \`<div class="text-[10px] text-slate-400">Due Date</div>
            <div class="text-xs font-bold text-white font-mono">\${f.dueDate}</div>\` : ''}
          </div>
        </div>

        \${f.units ? \`<div class="mt-2 text-[10px] text-slate-400 flex items-center justify-between"><span>Units Consumed: <strong>\${f.units}</strong></span><span>Late Fee: <strong class="text-emerald-400">₹0.00</strong></span></div>\` : ''}
        \${f.currentBalance ? \`<div class="mt-2 text-[10px] text-slate-400 flex items-center justify-between"><span>Current Balance: <strong class="text-amber-400">\${f.currentBalance}</strong></span></div>\` : ''}
        \${f.minimumDue ? \`<div class="mt-2 text-[10px] text-slate-400 flex items-center justify-between"><span>Minimum Amount Due: <strong class="text-rose-400">\${f.minimumDue}</strong></span></div>\` : ''}
        \${f.plan ? \`<div class="mt-2 text-[10px] text-slate-400 flex items-center justify-between"><span>Selected Plan: <strong class="text-indigo-400">\${f.plan}</strong></span></div>\` : ''}
        \${f.info ? \`<div class="mt-2 pt-2 border-t border-white/5 text-[10px] text-amber-300 italic">\${f.info}</div>\` : ''}
      </div>
    \`;

    const payBtnText = document.getElementById('btnEnginePayText');
    if (payBtnText) {
      payBtnText.textContent = \`Pay ₹ \${formatInr(f.billAmount || 0)} via UPI PIN\`;
    }
  }, 450);
}`;

const lines = html.split('\n');
let rStart = -1, rEnd = -1;
let depth = 0;
for (let i = 0; i < lines.length; i++) {
  if (rStart === -1 && lines[i].includes('function fetchLiveBill(serviceKey')) rStart = i;
  if (rStart !== -1) {
    if (lines[i].includes('{')) depth += (lines[i].match(/\{/g) || []).length;
    if (lines[i].includes('}')) depth -= (lines[i].match(/\}/g) || []).length;
    if (depth === 0 && i > rStart) { rEnd = i; break; }
  }
}

if (rStart !== -1 && rEnd !== -1) {
  lines.splice(rStart, rEnd - rStart + 1, updatedFetchLiveBill);
}

fs.writeFileSync('app/index.html', lines.join('\n'));
console.log('Updated fetchLiveBill');
