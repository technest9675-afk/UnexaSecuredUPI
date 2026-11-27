const fs = require('fs');
let html = fs.readFileSync('app/index.html', 'utf8');

const newModal = `<!-- ========================================================= -->
      <!-- MODAL: DYNAMIC BILL PAY & RECHARGE ENGINE                   -->
      <!-- ========================================================= -->
      <div class="modal-overlay" id="modalBillPayEngine">
        <div class="modal-bottom-sheet flex flex-col h-auto max-h-[96vh] rounded-t-3xl overflow-hidden p-0">
          
          <!-- Fixed Header -->
          <div class="flex-shrink-0 pt-3 pb-3 px-4 border-b border-white/5 relative z-10 bg-slate-950">
            <div class="modal-handle mx-auto mb-4 w-12 h-1.5 bg-slate-700 rounded-full"></div>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-2xl border flex items-center justify-center shadow-sm flex-shrink-0" id="engineHeaderIconBox">
                  <i data-lucide="zap" class="w-5 h-5" id="engineHeaderIcon"></i>
                </div>
                <div>
                  <h3 class="text-sm font-bold text-white flex items-center gap-1.5 leading-tight" id="engineHeaderTitle">
                    <span>Title</span>
                    <span class="pill-badge badge-blue text-[8px] px-1.5 py-0.5" id="engineHeaderBadge">BBPS</span>
                  </h3>
                  <p class="text-[10px] text-slate-400 mt-0.5" id="engineHeaderSubtitle">Subtitle</p>
                </div>
              </div>
              <button onclick="closeModal('modalBillPayEngine')" class="w-7 h-7 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center hover:text-white flex-shrink-0">
                <i data-lucide="x" class="w-4 h-4"></i>
              </button>
            </div>
          </div>
  
          <!-- Scrollable Form Container -->
          <div id="engineDynamicFormContainer" class="flex-1 overflow-y-auto px-4 py-4 hide-scrollbar bg-slate-950">
            <!-- Populated dynamically by renderBillPayForm(serviceKey) -->
          </div>
  
          <!-- Fixed Footer (Proceed to Pay) -->
          <div class="flex-shrink-0 p-4 border-t border-white/5 bg-slate-950 pb-safe z-10">
             <button id="engineProceedBtn" type="button" class="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition active:scale-95 flex items-center justify-center gap-2">
               <i data-lucide="shield-check" class="w-4 h-4"></i>
               <span id="btnEnginePayText">Proceed to Pay via UPI</span>
             </button>
          </div>
  
        </div>
      </div>`;

const lines = html.split('\n');
let s = -1, e = -1;
for(let i=0; i<lines.length; i++) {
  if (lines[i].includes('MODAL: DYNAMIC BILL PAY & RECHARGE ENGINE')) s = i - 1;
  if (s !== -1 && lines[i].includes('MODAL: BRAND VOUCHERS CATALOG')) { e = i - 2; break; }
}

if (s !== -1 && e !== -1) {
  lines.splice(s, e - s + 1, newModal);
  fs.writeFileSync('app/index.html', lines.join('\n'));
  console.log('Successfully updated modal HTML structure.');
} else {
  console.log('Failed to find modal markers.');
}
