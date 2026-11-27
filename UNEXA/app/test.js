const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new", defaultViewport: { width: 375, height: 812 } });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000');
  await new Promise(r => setTimeout(r, 1000));
  
  // click business mode
  await page.evaluate(() => document.getElementById('modeSelectBusiness').click());
  await new Promise(r => setTimeout(r, 500));
  
  // type phone and send otp
  await page.evaluate(() => {
      document.getElementById('authPhoneInput').value = '9876543210';
      sendLoginOtp();
  });
  
  await new Promise(r => setTimeout(r, 1000));
  
  // verify otp
  await page.evaluate(() => {
      document.getElementById('otpInput').value = '123456';
      verifyLoginOtp();
  });
  
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: 'after_login.png' });
  
  await page.evaluate(() => {
      switchBusinessTab('khata', document.querySelectorAll('#businessBottomNav .nav-btn')[1]);
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'tab_khata.png' });
  
  await browser.close();
  console.log('Complete. Screenshots saved.');
})();
