const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', defaultViewport: { width: 1200, height: 900 } });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
  
  await page.goto('http://localhost:3000');
  await new Promise(r => setTimeout(r, 1000));
  
  // Log in as personal first (or demo phone)
  await page.evaluate(() => {
    selectDemoPhone('9876543210', 'Aarav Sharma');
  });
  await new Promise(r => setTimeout(r, 500));
  
  // Enter OTP
  await page.evaluate(() => {
    autoFillOtp();
    verifyLoginOtp();
  });
  await new Promise(r => setTimeout(r, 1500));
  
  console.log('Logged in. Current active mode:', await page.evaluate(() => window.currentActiveMode));
  console.log('appState.isLoggedIn:', await page.evaluate(() => window.appState.isLoggedIn));
  
  // Now call switchMode('business')
  console.log('Calling switchMode("business")...');
  await page.evaluate(() => {
    switchMode('business');
  });
  await new Promise(r => setTimeout(r, 1000));
  
  // Check elements visibility and positions
  const info = await page.evaluate(() => {
    const bHeader = document.getElementById('businessHeader');
    const bContent = document.getElementById('businessContent');
    const bNav = document.getElementById('businessBottomNav');
    const appViewport = document.getElementById('appViewport');
    
    function getBox(el) {
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      return {
        id: el.id,
        classList: Array.from(el.classList),
        display: style.display,
        visibility: style.visibility,
        opacity: style.opacity,
        zIndex: style.zIndex,
        position: style.position,
        rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height }
      };
    }
    
    return {
      bHeader: getBox(bHeader),
      bContent: getBox(bContent),
      bNav: getBox(bNav),
      appViewport: getBox(appViewport)
    };
  });
  
  console.log('Element info:', JSON.stringify(info, null, 2));
  
  await page.screenshot({ path: 'debug_switch_business.png' });
  await browser.close();
  console.log('Screenshot saved to debug_switch_business.png');
})();
