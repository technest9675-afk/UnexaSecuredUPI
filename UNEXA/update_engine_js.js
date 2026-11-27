const fs = require('fs');

const updatedJS = `
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
    headerTitle.innerHTML = \`<span>\${service.title}</span><span class="pill-badge badge-blue text-[8px] px-1.5 py-0.5" id="engineHeaderBadge">\${service.badge || 'BBPS'}</span>\`;
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
    const sourceBtn = document.querySelector(\`.bbps-service-btn[onclick*="'\${serviceKey}'"] .bbps-icon-circle\`);
    if (sourceBtn) {
       headerIconBox.className = sourceBtn.className.replace('bbps-icon-circle', 'w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm flex-shrink-0');
    }
  }

  if (proceedBtn) {
    proceedBtn.setAttribute('onclick', \`executeBillPayment('\${serviceKey}')\`);
  }
  if (payBtnText) {
    payBtnText.textContent = 'Proceed to Pay via UPI';
  }

  renderBillPayForm(serviceKey, presetData);
  openModal('modalBillPayEngine');
  if (window.lucide) window.lucide.createIcons();
}

// Updated renderBillPayForm (removes inline proceed button, uses bg-slate-800 for cards)
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
        <div class="flex-shrink-0 bg-slate-800 border border-slate-700/50 rounded-xl p-2.5 w-44 flex items-center gap-3 cursor-pointer hover:bg-slate-700 transition" onclick="document.querySelector('input').value='\${hist.ref}';">
          <div class="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 flex-shrink-0">
            <i data-lucide="\${service.icon}" class="w-4 h-4"></i>
          </div>
          <div class="overflow-hidden">
            <div class="text-[11px] font-bold text-white truncate">\${hist.name}</div>
            <div class="text-[9px] text-slate-400 truncate mt-0.5">\${hist.ref}</div>
          </div>
        </div>
      \`;
    });
    formHtml += \`</div></div>\`;
  }

  // NEW: Offers Section
  if (service.offers && service.offers.length > 0) {
    formHtml += \`
      <div class="mb-4 bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-3 flex items-start gap-3">
        <div class="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
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
        <label class="text-[11px] font-bold text-slate-300 block mb-1.5">\${field.label}</label>\`;
      
      if (field.type === 'select') {
        formHtml += \`<select id="field_\${field.id}" class="w-full px-3.5 py-3 bg-slate-900 border border-white/10 rounded-xl text-xs text-white focus:border-indigo-500 focus:outline-none transition">\`;
        (field.options || []).forEach(opt => {
          formHtml += \`<option value="\${opt.val}">\${opt.label}</option>\`;
        });
        formHtml += '</select>';
      } else {
        const val = (presetData && presetData[field.id]) ? presetData[field.id] : (field.defaultValue || '');
        formHtml += \`<input type="\${field.type || 'text'}" id="field_\${field.id}" value="\${val}" placeholder="\${field.placeholder || ''}" class="w-full px-3.5 py-3 bg-slate-900 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition">\`;
      }
      formHtml += '</div>';
    });
    formHtml += '</div>';
  }

  // 2. Mobile Plans Browser
  if (service.plans && service.plans.length > 0) {
    formHtml += \`
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
    \`;

    service.plans.forEach((p, idx) => {
      const isFirst = idx === 0;
      if (isFirst) currentSelectedPlan = p;
      formHtml += \`
        <div class="p-3.5 rounded-2xl bg-slate-900 border \${isFirst ? 'border-indigo-500 bg-indigo-950/20' : 'border-white/10'} hover:border-indigo-400/80 transition cursor-pointer plan-card-item" data-category="\${p.category}" onclick="selectMobilePlan('\${p.id}', this)">
          <div class="flex items-center justify-between mb-1.5">
            <div class="flex items-center gap-2">
              <span class="text-base font-black text-white font-mono">₹ \${p.price}</span>
              <span class="pill-badge badge-cyan text-[8px] font-bold px-1.5 py-0.5">\${p.validity}</span>
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
        <button type="button" class="w-full py-3 rounded-xl bg-slate-900 border border-indigo-500/40 hover:border-indigo-500 text-indigo-400 hover:text-indigo-300 text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm" onclick="fetchLiveBill('\${serviceKey}')">
          <i data-lucide="refresh-cw" class="w-3.5 h-3.5"></i>
          <span>Fetch Latest Due Bill (Bharat Connect)</span>
        </button>
      </div>
    \`;
  }

  container.innerHTML = formHtml;
  if (window.lucide) window.lucide.createIcons();
}
`;

let html = fs.readFileSync('app/index.html', 'utf8');

// We will replace openBillPayEngine and renderBillPayForm manually
let lines = html.split('\n');

function replaceFunc(funcName, newCodeLines) {
  let s = -1, e = -1;
  let depth = 0;
  for (let i = 0; i < lines.length; i++) {
    if (s === -1 && lines[i].includes('function ' + funcName + '(')) s = i;
    if (s !== -1) {
      if (lines[i].includes('{')) depth += (lines[i].match(/\{/g) || []).length;
      if (lines[i].includes('}')) depth -= (lines[i].match(/\}/g) || []).length;
      if (depth === 0 && i > s) { e = i; break; }
    }
  }
  if (s !== -1 && e !== -1) {
    lines.splice(s, e - s + 1, ...newCodeLines);
  }
}

const newParts = updatedJS.trim().split('\n\n// Updated renderBillPayForm');
replaceFunc('openBillPayEngine', newParts[0].split('\n'));
replaceFunc('renderBillPayForm', ('// Updated renderBillPayForm' + newParts[1]).split('\n'));

fs.writeFileSync('app/index.html', lines.join('\n'));
console.log('Successfully updated JS functions');
