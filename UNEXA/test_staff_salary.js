/**
 * UNEXA BUSINESS MODE — STAFF SALARY MANAGEMENT & PAYROLL SYSTEM TEST SUITE
 * 
 * Verifies:
 * 1. Business Mode exclusivity (present in bTabStore and bTabHome, absent in Personal Mode).
 * 2. Dashboard metrics calculations (Total Staff, Monthly Payroll, Paid, Pending, Next Pay Date).
 * 3. Search and department / status filtering.
 * 4. Add new employee with auto-generated ID, validation, and duplicate prevention.
 * 5. Employee profile inspection, editing, deactivation/reactivation, and removal.
 * 6. Individual salary payment flow with confirmation, PIN 9675 authorization, and invalid PIN rejection.
 * 7. Bulk salary payment flow with multi-selection, total payroll summary, and duplicate prevention.
 * 8. Salary disbursement history and professional receipt display.
 * 9. Security isolation: In Live Mode, fixed PIN 9675 is strictly blocked as a backdoor.
 */

const fs = require('fs');
const assert = require('assert');
const path = require('path');
const { JSDOM } = require('jsdom');

let passedTests = 0;
let totalTests = 0;

function it(desc, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✅ ${desc}`);
    passedTests++;
  } catch (err) {
    console.error(`  ❌ ${desc}`);
    console.error(`     Error: ${err.message}`);
    throw err;
  }
}

async function runTests() {
  console.log('\n======================================================');
  console.log('🧪 UNEXA BUSINESS MODE — STAFF SALARY & PAYROLL SUITE');
  console.log('======================================================\n');

  const rawHtml = fs.readFileSync('app/index.html', 'utf8');

  // 1. Static HTML & Business Exclusivity Verification
  console.log('--- 1. Structure & Business Exclusivity Verification ---');

  it('Staff Salary menu item exists in bTabStore with payroll badge', () => {
    assert(rawHtml.includes('STAFF SALARY'), 'bTabStore must contain "STAFF SALARY" text');
    assert(rawHtml.includes('PAYROLL SYSTEM'), 'bTabStore item must include "PAYROLL SYSTEM" badge');
    assert(rawHtml.includes('UnexaPayroll.openDashboard()') || rawHtml.includes('openStaffSalaryDashboard()'), 'Must wire click to openStaffSalaryDashboard');
  });

  it('Staff Salary quick action tool exists in bTabHome under Growth Suite', () => {
    const bTabHomeIdx = rawHtml.indexOf('id="bTabHome"');
    const bTabKhataIdx = rawHtml.indexOf('id="bTabKhata"');
    assert(bTabHomeIdx !== -1 && bTabKhataIdx !== -1, 'bTabHome must exist');
    const bTabHomeHtml = rawHtml.substring(bTabHomeIdx, bTabKhataIdx);
    assert(bTabHomeHtml.includes('Staff Salary'), 'bTabHome must feature "Staff Salary" tool card');
    assert(bTabHomeHtml.includes('openStaffSalaryDashboard()') || bTabHomeHtml.includes('UnexaPayroll.openDashboard()'), 'Tool card must trigger openStaffSalaryDashboard or UnexaPayroll.openDashboard');
  });

  it('Staff Salary feature is exclusive to Business Mode and absent in Personal Mode', () => {
    const personalUpiViewIdx = rawHtml.indexOf('id="personalUpiView"');
    const businessContentIdx = rawHtml.indexOf('id="businessContent"');
    assert(personalUpiViewIdx !== -1 && businessContentIdx !== -1, 'Both personal and business views must exist');
    const personalViewHtml = rawHtml.substring(personalUpiViewIdx, businessContentIdx);
    assert(!personalViewHtml.includes('STAFF SALARY'), 'Personal Mode view must NOT have "STAFF SALARY" menu item');
  });

  it('All required Staff Salary modals exist with correct IDs', () => {
    const requiredModals = [
      'modalStaffSalary',
      'modalAddEmployee',
      'modalEmployeeProfile',
      'modalPaySalary',
      'modalBulkSalaryPay',
      'modalSalaryReceipt'
    ];
    requiredModals.forEach(id => {
      assert(rawHtml.includes(`id="${id}"`), `Modal #${id} must exist in DOM`);
    });
  });

  it('Database DDL includes merchant_employees, salary_payments, and payroll_batches with RLS', () => {
    const schemaSql = fs.readFileSync('supabase/schema.sql', 'utf8');
    assert(schemaSql.includes('merchant_employees'), 'Schema must define merchant_employees');
    assert(schemaSql.includes('salary_payments'), 'Schema must define salary_payments');
    assert(schemaSql.includes('payroll_batches'), 'Schema must define payroll_batches');
    assert(schemaSql.includes('ENABLE ROW LEVEL SECURITY'), 'Tables must have RLS enabled');
  });

  // 2. DOM & Controller Functional Verification
  console.log('\n--- 2. Functional & Controller Verification ---');

  const dom = new JSDOM(rawHtml, { runScripts: 'outside-only' });
  const { window } = dom;
  const { document } = window;

  // Provide mock browser APIs
  window.requestAnimationFrame = (cb) => setTimeout(cb, 0);
  window.cancelAnimationFrame = (id) => clearTimeout(id);
  window.tailwind = { config: {} };
  window.lucide = { createIcons: () => {} };
  window.confetti = () => {};
  window.playBeep = () => {};
  window.playSuccessChime = () => {};
  window.playSoundboxVoice = () => {};
  window.showToast = () => {};
  window.alert = () => {};
  window.confirm = () => true;
  window.formatInr = (n, d = 2) => Number(n).toLocaleString('en-IN', { minimumFractionDigits: d, maximumFractionDigits: d });

  if (!window.navigator.clipboard) {
    window.navigator.clipboard = {
      writeText: async () => Promise.resolve()
    };
  }

  // Evaluate internal inline scripts into window context
  const inlineScripts = rawHtml.match(/<script(?![^>]*src=)>([\s\S]*?)<\/script>/gi) || [];
  inlineScripts.forEach(s => {
    const code = s.replace(/<\/?script[^>]*>/gi, '');
    try {
      window.eval(code);
    } catch (e) {}
  });

  it('UnexaPayroll controller is defined and initialized on window', () => {
    assert(window.UnexaPayroll, 'window.UnexaPayroll must be defined');
    assert(typeof window.openStaffSalaryDashboard === 'function', 'window.openStaffSalaryDashboard must be a function');
  });

  it('Preloaded demo employees exist in Demo Mode', () => {
    window.appState.isDemoMode = true;
    const payroll = window.UnexaPayroll.getPayrollState();
    assert(payroll, 'Payroll state must exist');
    assert(payroll.employees && payroll.employees.length >= 4, 'Must have at least 4 demo employees');
    
    const emp1 = payroll.employees.find(e => e.id === 'EMP-1001');
    assert(emp1, 'EMP-1001 must exist');
    assert.strictEqual(emp1.name, 'Aarav Sharma');
    assert.strictEqual(emp1.salary, 38000);
    assert.strictEqual(emp1.department, 'Operations');
  });

  it('Dashboard renders correct metric calculations', () => {
    window.UnexaPayroll.openDashboard();
    
    const elTotalStaff = document.getElementById('salaryTotalEmployees');
    const elMonthly = document.getElementById('salaryMonthlyPayroll');
    const elPaid = document.getElementById('salaryPaidAmount');
    const elPending = document.getElementById('salaryPendingAmount');
    const elNextDate = document.getElementById('salaryNextPaymentDate');

    assert(elTotalStaff, 'salaryTotalEmployees element must exist');
    assert(elMonthly, 'salaryMonthlyPayroll element must exist');
    assert(elPaid, 'salaryPaidAmount element must exist');
    assert(elPending, 'salaryPendingAmount element must exist');
    assert(elNextDate, 'salaryNextPaymentDate element must exist');

    assert.strictEqual(elTotalStaff.innerText, '4', 'Total staff count should be 4');
    assert(elMonthly.innerText.includes('1,05,000'), 'Monthly payroll should be ₹1,05,000');
    assert.strictEqual(elNextDate.innerText, '01 Dec 2026', 'Next payment date should be 01 Dec 2026');
  });

  it('Search filters roster dynamically by name, ID, and department', () => {
    window.UnexaPayroll.searchStaff('Priya');
    const listEl = document.getElementById('salaryEmployeesListContainer');
    assert(listEl.innerHTML.includes('Priya Patel'), 'Search for Priya should find Priya Patel');
    assert(!listEl.innerHTML.includes('Rohan Verma'), 'Search for Priya should not show Rohan');

    window.UnexaPayroll.searchStaff('EMP-1003');
    assert(listEl.innerHTML.includes('Rohan Verma'), 'Search for EMP-1003 should find Rohan');
    assert(!listEl.innerHTML.includes('Aarav Sharma'), 'Search for EMP-1003 should not show Aarav');

    // Reset search
    window.UnexaPayroll.searchStaff('');
    assert(listEl.innerHTML.includes('Aarav Sharma') && listEl.innerHTML.includes('Rohan Verma'), 'Cleared search restores all staff');
  });

  it('Department pill filter works correctly', () => {
    window.UnexaPayroll.filterDepartment('Accounts');
    const listEl = document.getElementById('salaryEmployeesListContainer');
    assert(listEl.innerHTML.includes('Priya Patel'), 'Accounts filter must include Priya');
    assert(!listEl.innerHTML.includes('Aarav Sharma'), 'Accounts filter must not include Operations');

    // Reset filter
    window.UnexaPayroll.filterDepartment('ALL');
    assert(listEl.innerHTML.includes('Aarav Sharma'), 'Reset filter shows all departments');
  });

  it('Add employee validation blocks invalid inputs', () => {
    window.UnexaPayroll.openAddEmployee();
    const idEl = document.getElementById('addEmpCode');
    assert(idEl && idEl.value.startsWith('EMP-'), 'Next EMP ID must be auto-generated');

    // Missing fields should trigger error
    document.getElementById('addEmpName').value = '';
    window.UnexaPayroll.handleSaveEmployee();
    const err = document.getElementById('addEmpErrorBanner');
    assert(err && !err.classList.contains('hidden'), 'Error must be displayed when name is missing');

    // Duplicate phone prevention
    document.getElementById('addEmpName').value = 'Test Duplicate';
    document.getElementById('addEmpPhone').value = '+91 98765 01001'; // Aarav's phone
    document.getElementById('addEmpDesignation').value = 'Lead';
    document.getElementById('addEmpSalary').value = '25000';
    document.getElementById('addEmpUpi').value = 'newtest@upi';
    window.UnexaPayroll.handleSaveEmployee();
    assert(err.innerText.includes('already exists'), 'Duplicate phone must be rejected');

    // Duplicate UPI prevention
    document.getElementById('addEmpPhone').value = '+91 99999 88888';
    document.getElementById('addEmpUpi').value = 'aarav.manager@upi'; // Aarav's UPI
    window.UnexaPayroll.handleSaveEmployee();
    assert(err.innerText.includes('already exists'), 'Duplicate UPI must be rejected');
  });

  it('Add employee successfully adds new staff member to roster', () => {
    const payroll = window.UnexaPayroll.getPayrollState();
    const countBefore = payroll.employees.length;

    document.getElementById('addEmpName').value = 'Ananya Sen';
    document.getElementById('addEmpPhone').value = '+91 98765 01005';
    document.getElementById('addEmpDesignation').value = 'Senior Designer';
    document.getElementById('addEmpDept').value = 'Design';
    document.getElementById('addEmpSalary').value = '42000';
    document.getElementById('addEmpUpi').value = 'ananya.design@upi';
    document.getElementById('addEmpJoiningDate').value = '2026-11-01';

    window.UnexaPayroll.handleSaveEmployee();

    assert.strictEqual(payroll.employees.length, countBefore + 1, 'Employee count should increase by 1');
    const newEmp = payroll.employees.find(e => e.name === 'Ananya Sen');
    assert(newEmp, 'New employee Ananya Sen must exist in payroll');
    assert.strictEqual(newEmp.salary, 42000);
    assert.strictEqual(newEmp.status, 'active');
  });

  it('Employee profile allows viewing, editing, deactivation, and reactivation', () => {
    window.UnexaPayroll.openEmployeeProfile('EMP-1002'); // Priya Patel
    
    assert.strictEqual(document.getElementById('empProfileName').innerText, 'Priya Patel');
    assert.strictEqual(document.getElementById('empProfileId').innerText, 'EMP-1002');

    // Edit employee
    document.getElementById('empEditSalary').value = '35000';
    window.UnexaPayroll.handleUpdateEmployee();
    const emp = window.UnexaPayroll.getPayrollState().employees.find(e => e.id === 'EMP-1002');
    assert.strictEqual(emp.salary, 35000, 'Salary should update to 35000');

    // Deactivate employee
    window.UnexaPayroll.toggleActiveStatus();
    assert.strictEqual(emp.status, 'deactivated', 'Status should be deactivated');
    assert.strictEqual(document.getElementById('empProfileStatusBadge').innerText, 'Deactivated');

    // Reactivate employee
    window.UnexaPayroll.toggleActiveStatus();
    assert.strictEqual(emp.status, 'active', 'Status should return to active');
    assert.strictEqual(document.getElementById('empProfileStatusBadge').innerText, 'Active');
  });

  it('Individual salary pay requires PIN 9675 in Demo Mode and rejects wrong PIN', () => {
    window.appState.isDemoMode = true;
    window.UnexaPayroll.openPayIndividual('EMP-1003'); // Rohan Verma

    assert.strictEqual(document.getElementById('payEmpNameDisplay').innerText, 'Rohan Verma');
    
    // Advance to confirmation step
    window.UnexaPayroll.advanceToConfirm();
    assert(!document.getElementById('salaryPayStepConfirm').classList.contains('hidden'), 'Step 2 confirmation should be visible');

    // Advance to PIN step
    window.UnexaPayroll.advanceToPin();
    assert(!document.getElementById('salaryPayStepPin').classList.contains('hidden'), 'Step 3 PIN authorization should be visible');

    // Enter wrong PIN 1234
    window.UnexaPayroll.pressPinKey('1');
    window.UnexaPayroll.pressPinKey('2');
    window.UnexaPayroll.pressPinKey('3');
    window.UnexaPayroll.pressPinKey('4');
    
    window.UnexaPayroll.verifyPinAndPay();
    const pinErr = document.getElementById('salaryPinError');
    assert(pinErr && !pinErr.classList.contains('hidden'), 'Wrong PIN must show error message');
    assert(pinErr.innerText.includes('9675'), 'Error message must remind user to use fixed PIN 9675 in Demo Mode');

    // Enter correct PIN 9675
    window.UnexaPayroll.clearPin();
    window.UnexaPayroll.pressPinKey('9');
    window.UnexaPayroll.pressPinKey('6');
    window.UnexaPayroll.pressPinKey('7');
    window.UnexaPayroll.pressPinKey('5');
    window.UnexaPayroll.verifyPinAndPay();

    // Check payment history
    const payroll = window.UnexaPayroll.getPayrollState();
    const curMonth = window.UnexaPayroll.getCurrentMonth();
    const paidRecord = payroll.history.find(h => h.empId === 'EMP-1003' && h.month === curMonth);
    assert(paidRecord, 'Rohan Verma must have a Paid record for current month');
    assert.strictEqual(paidRecord.amount, 20000);
    assert.strictEqual(paidRecord.status, 'Paid');

    // Employee status for current month must now be Paid
    assert(window.UnexaPayroll.isEmployeePaidForMonth('EMP-1003', curMonth), 'isEmployeePaidForMonth must return true');
  });

  it('Bulk salary payment calculates totals and pays multiple employees with PIN 9675', () => {
    window.appState.isDemoMode = true;
    window.UnexaPayroll.openBulkPay();

    const pendingEmployees = window.UnexaPayroll.getPayrollState().employees.filter(
      e => e.status === 'active' && !window.UnexaPayroll.isEmployeePaidForMonth(e.id, window.UnexaPayroll.getCurrentMonth())
    );

    assert(pendingEmployees.length > 0, 'There should be pending employees to pay');

    // Advance to PIN
    window.UnexaPayroll.advanceBulkToPin();
    assert(!document.getElementById('bulkPayStepPin').classList.contains('hidden'), 'Bulk Step 2 PIN should be visible');

    // Enter Demo PIN 9675
    window.UnexaPayroll.clearBulkPin();
    window.UnexaPayroll.pressBulkPinKey('9');
    window.UnexaPayroll.pressBulkPinKey('6');
    window.UnexaPayroll.pressBulkPinKey('7');
    window.UnexaPayroll.pressBulkPinKey('5');
    window.UnexaPayroll.verifyPinAndBulkPay();

    const curMonth = window.UnexaPayroll.getCurrentMonth();
    pendingEmployees.forEach(emp => {
      assert(window.UnexaPayroll.isEmployeePaidForMonth(emp.id, curMonth), `${emp.name} must now be marked as Paid`);
    });
  });

  it('Professional salary receipt displays all required metadata', () => {
    const payroll = window.UnexaPayroll.getPayrollState();
    const firstRecord = payroll.history[0];
    assert(firstRecord, 'A salary history record must exist');

    window.UnexaPayroll.openReceipt(firstRecord.id);

    assert.strictEqual(document.getElementById('receiptUtr').innerText, firstRecord.id);
    assert.strictEqual(document.getElementById('receiptEmpName').innerText, firstRecord.empName);
    assert.strictEqual(document.getElementById('receiptEmpId').innerText, firstRecord.empId);
    assert.strictEqual(document.getElementById('receiptSalaryMonth').innerText, firstRecord.month);
    assert(document.getElementById('receiptSalaryAmount').innerText.includes((parseFloat(firstRecord.amount)).toLocaleString('en-IN')));
  });

  it('Live Mode strictly rejects Demo PIN 9675 as a backdoor', () => {
    window.appState.isDemoMode = false; // Switch to Live Mode
    window.UnexaPayroll.openPayIndividual('EMP-1001');
    window.UnexaPayroll.advanceToConfirm();
    window.UnexaPayroll.advanceToPin();

    window.UnexaPayroll.clearPin();
    window.UnexaPayroll.pressPinKey('9');
    window.UnexaPayroll.pressPinKey('6');
    window.UnexaPayroll.pressPinKey('7');
    window.UnexaPayroll.pressPinKey('5');
    window.UnexaPayroll.verifyPinAndPay();

    const pinErr = document.getElementById('salaryPinError');
    assert(pinErr && !pinErr.classList.contains('hidden'), 'Error must be shown');
    assert(pinErr.innerText.includes('disabled in Live Mode'), 'Live Mode must explicitly reject demo PIN 9675');
  });

  console.log(`\n🎉 ALL ${passedTests}/${totalTests} TESTS PASSED!`);
  process.exit(0);
}

runTests().catch(err => {
  console.error('\n❌ Test suite failed:', err);
  process.exit(1);
});
