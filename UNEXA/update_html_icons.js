const fs = require('fs');
let html = fs.readFileSync('app/index.html', 'utf8');

const mapping = {
  mobile_recharge: 'smartphone',
  electricity: 'zap',
  dth: 'tv',
  fastag: 'car',
  credit_card: 'credit-card',
  cylinder: 'flame',
  loan: 'indian-rupee',
  broadband: 'router',
  
  intl_roaming: 'globe',
  google_play: 'play',
  apple_store: 'apple',
  ncmc: 'credit-card',
  get_sim: 'sim-card',
  cable_tv: 'monitor-play',
  mobile_postpaid: 'phone',
  piped_gas: 'flame',
  water: 'droplet',
  prepaid_meter: 'gauge',
  education: 'graduation-cap',
  file_itr: 'file-text',
  car_insurance: 'car-front',
  bike_insurance: 'bike',
  echallan: 'receipt',
  accident_cover: 'shield-alert',
  ev_recharge: 'battery-charging',
  motor_expiry: 'calendar-clock',
  municipal_tax: 'landmark',
  rentals: 'home',
  clubs: 'users',
  apartment: 'building',
  donation: 'heart',
  devotion: 'flower',
  lic_insurance: 'shield-check',
  nps: 'piggy-bank',
  subscription: 'play-square'
};

let replaced = 0;
for (const [id, icon] of Object.entries(mapping)) {
  const regex = new RegExp(`onclick="openBillPayEngine\\('${id}'\\)"[^>]*>[\\s\\S]*?<i data-lucide="[^"]*"`, 'g');
  html = html.replace(regex, (match) => {
    replaced++;
    return match.replace(/<i data-lucide="[^"]*"/, `<i data-lucide="${icon}"`);
  });
}

fs.writeFileSync('app/index.html', html);
console.log('Replaced ' + replaced + ' HTML icons');
