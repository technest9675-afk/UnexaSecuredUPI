const fs = require('fs');
let html = fs.readFileSync('app/index.html', 'utf8');

const target = `  <button class="nav-item text-slate-400 hover:text-slate-200" onclick="switchBusinessTab('store', this)">
    <i data-lucide="store" class="w-5 h-5 mb-1"></i>
    <span class="text-[9px] font-bold">Store</span>
  </button>
</nav>

<!-- Mock Modals for Business Mode -->
<!-- QR Modal -->`;

const replacement = `  <button class="nav-item text-slate-400 hover:text-slate-200" onclick="switchBusinessTab('store', this)">
    <i data-lucide="store" class="w-5 h-5 mb-1"></i>
    <span class="text-[9px] font-bold">Store</span>
  </button>
</div>`;

if (html.includes(target)) {
  html = html.replace(target, replacement);
  fs.writeFileSync('app/index.html', html);
  console.log('Fixed businessBottomNav closing tag from </nav> to </div>');
} else {
  console.log('Target string not found');
}
