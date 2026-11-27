const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const html = fs.readFileSync('app/index.html', 'utf8');
const dom = new JSDOM(html, { runScripts: "dangerously", resources: "usable" });

setTimeout(() => {
  const window = dom.window;
  const document = window.document;

  console.log("Before login - appState.isLoggedIn:", window.appState.isLoggedIn);
  console.log("Before login - currentActiveMode:", window.currentActiveMode);
  console.log("Before login - businessContent hidden:", document.getElementById('businessContent').classList.contains('hidden'));

  // Click business mode button
  document.getElementById('modeSelectBusiness').click();
  console.log("After mode select - loginAppMode:", window.loginAppMode);

  // Type phone and login
  document.getElementById('loginPhoneInput').value = '9876543210';
  window.submitLogin();
  
  console.log("After login - appState.isLoggedIn:", window.appState.isLoggedIn);
  console.log("After login - currentActiveMode:", window.currentActiveMode);
  console.log("After login - businessContent hidden:", document.getElementById('businessContent').classList.contains('hidden'));
  console.log("After login - bTabHome hidden:", document.getElementById('bTabHome').classList.contains('hidden'));
  console.log("After login - mainContent hidden:", document.getElementById('mainContent').classList.contains('hidden'));

  // Are there any errors in the JSDOM window?
}, 1000);
