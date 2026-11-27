const fs = require('fs');

const replacement = `function exportStatement(type = 'pdf') {
  showToast('🔄 Generating official Bank-Grade PDF Statement...');
  playSuccessChime();

  const user = appState.user || defaultState.user;
  const data = generate3MonthLedgerData(user.balance, appState.transactions || []);
  const stmtRef = 'UNX-STM-' + Math.floor(100000 + Math.random() * 900000);
  const genDate = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

  // If jsPDF is available in window
  if (window.jspdf && window.jspdf.jsPDF) {
    try {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // --- BANK LOGO / HEADER ---
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.setTextColor(0, 51, 102); // Dark official bank blue
      doc.text('UNEXA PAYMENTS BANK LTD.', 14, 20);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(50, 50, 50);
      doc.text('Branch: Powai Commercial Hub, Mumbai, MH - 400076', 14, 25);
      doc.text('IFSC Code: UNEX0000123 | MICR Code: 400123456', 14, 29);
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text('STATEMENT OF ACCOUNT', 105, 38, { align: 'center' });

      doc.setDrawColor(0, 51, 102);
      doc.setLineWidth(0.5);
      doc.line(14, 42, 196, 42);

      // --- CUSTOMER & ACCOUNT DETAILS ---
      // Left Column: Customer
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text(user.name, 14, 50);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.text('Flat 402, Sunshine Apartments,', 14, 54);
      doc.text('Andheri West, Mumbai,', 14, 58);
      doc.text('Maharashtra - 400053', 14, 62);
      doc.text(\`Mobile: +91 \${user.phone}\`, 14, 68);
      doc.text(\`Email: \${user.email}\`, 14, 72);

      // Right Column: Account Info
      doc.setFont('helvetica', 'bold');
      doc.text('Account No:', 120, 50);
      doc.text('Account Type:', 120, 54);
      doc.text('Customer CIF ID:', 120, 58);
      doc.text('Statement Period:', 120, 64);
      doc.text('Statement Date:', 120, 68);
      doc.text('Statement Ref:', 120, 72);

      doc.setFont('helvetica', 'normal');
      doc.text('0000 0000 1234 0507', 150, 50);
      doc.text('SAVINGS ACCOUNT', 150, 54);
      doc.text('883920192', 150, 58);
      doc.text(\`\${data.period.startDate} to \${data.period.endDate}\`, 150, 64);
      doc.text(\`\${genDate.split(',')[0]}\`, 150, 68);
      doc.text(\`\${stmtRef}\`, 150, 72);

      // --- ACCOUNT SUMMARY ---
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text('ACCOUNT SUMMARY', 14, 82);
      
      doc.autoTable({
        startY: 85,
        head: [['Opening Balance', 'Total Debits (-)', 'Total Credits (+)', 'Closing Balance']],
        body: [[
          formatInr(data.summary.openingBalance, 2),
          formatInr(data.summary.totalDebits, 2),
          formatInr(data.summary.totalCredits, 2),
          formatInr(data.summary.closingBalance, 2)
        ]],
        theme: 'grid',
        headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold', halign: 'center', fontSize: 8 },
        bodyStyles: { halign: 'center', fontSize: 8, textColor: [0, 0, 0] },
        margin: { left: 14, right: 14 }
      });

      // --- TRANSACTIONS ---
      doc.setFont('helvetica', 'bold');
      doc.text('TRANSACTION DETAILS', 14, doc.lastAutoTable.finalY + 10);

      const tableRows = data.transactions.map((t) => [
        t.date.split(',')[0],
        t.date.split(',')[1] ? t.date.split(',')[1].trim() : '',
        t.title + '\\nUPI/' + t.utr,
        t.debit > 0 ? formatInr(t.debit, 2) : '',
        t.credit > 0 ? formatInr(t.credit, 2) : '',
        formatInr(t.balance, 2)
      ]);

      doc.autoTable({
        startY: doc.lastAutoTable.finalY + 13,
        head: [['Date', 'Time', 'Narration / Description', 'Withdrawal (Dr)', 'Deposit (Cr)', 'Balance (INR)']],
        body: tableRows,
        theme: 'grid',
        headStyles: { fillColor: [0, 51, 102], textColor: [255, 255, 255], fontSize: 8, fontStyle: 'bold', halign: 'left' },
        bodyStyles: { fontSize: 7, textColor: [0, 0, 0], cellPadding: 2 },
        columnStyles: {
          0: { cellWidth: 18 },
          1: { cellWidth: 15 },
          2: { cellWidth: 'auto' },
          3: { cellWidth: 22, halign: 'right' },
          4: { cellWidth: 22, halign: 'right' },
          5: { cellWidth: 22, halign: 'right', fontStyle: 'bold' }
        },
        didDrawPage: (pageData) => {
          const pageCount = doc.internal.getNumberOfPages();
          const pageCurrent = doc.internal.getCurrentPageInfo().pageNumber;
          
          doc.setFontSize(7);
          doc.setTextColor(100, 100, 100);
          doc.setFont('helvetica', 'normal');
          doc.text('This is a computer generated statement and does not require a signature.', 14, 285);
          doc.text('For any discrepancies, contact customer support at 1800-890-UNEXA within 7 days.', 14, 289);
          doc.text(\`Page \${pageCurrent} of \${pageCount}\`, 196, 289, { align: 'right' });
        },
        margin: { top: 30, left: 14, right: 14, bottom: 20 }
      });

      doc.save(\`Bank_Statement_\${user.name.replace(/\\s+/g, '_')}_\${stmtRef}.pdf\`);
      showToast('✅ Official Bank-Grade PDF Statement downloaded successfully!');
      return;
    } catch (e) {
      console.error('jsPDF generation failed, using HTML fallback:', e);
    }
  }

  // HTML Print / PDF Fallback
  downloadHtmlPrintPdfStatement(user, data, stmtRef, genDate);
}

function downloadHtmlPrintPdfStatement(user, data, stmtRef, genDate) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    showToast('⚠️ Popups blocked. Please allow popups to download PDF.');
    return;
  }

  const html = \`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Statement of Account - \${user.name}</title>
      <style>
        @page { size: A4; margin: 15mm; }
        body { font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; color: #000; margin: 0; padding: 20px; font-size: 11px; }
        .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
        .bank-name { font-size: 22px; font-weight: bold; color: #003366; margin: 0 0 5px 0; }
        .bank-address { font-size: 10px; color: #444; margin: 0; line-height: 1.4; }
        .statement-title { text-align: center; font-size: 16px; font-weight: bold; margin: 20px 0 10px 0; text-decoration: underline; }
        .line { border-top: 2px solid #003366; margin-bottom: 15px; }
        .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 25px; }
        .customer-details h3 { font-size: 12px; margin: 0 0 5px 0; }
        .customer-details p { margin: 0; line-height: 1.5; font-size: 10px; }
        .account-table { width: 100%; border-collapse: collapse; font-size: 10px; }
        .account-table td { padding: 4px 0; }
        .account-table td:first-child { font-weight: bold; width: 40%; }
        h4 { margin: 0 0 10px 0; font-size: 12px; color: #333; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 10px; }
        th, td { border: 1px solid #ccc; padding: 6px 8px; text-align: left; }
        th { background: #003366; color: white; font-weight: bold; }
        .summary-th { background: #f0f0f0; color: #000; text-align: center; }
        .summary-td { text-align: center; font-weight: bold; }
        .right { text-align: right; }
        .footer { margin-top: 40px; font-size: 9px; color: #666; text-align: left; }
      </style>
    </head>
    <body onload="window.print()">
      <div class="header">
        <div>
          <h1 class="bank-name">UNEXA PAYMENTS BANK LTD.</h1>
          <p class="bank-address">Branch: Powai Commercial Hub, Mumbai, MH - 400076<br>IFSC Code: UNEX0000123 | MICR Code: 400123456</p>
        </div>
      </div>
      
      <div class="statement-title">STATEMENT OF ACCOUNT</div>
      <div class="line"></div>

      <div class="details-grid">
        <div class="customer-details">
          <h3>\${user.name}</h3>
          <p>Flat 402, Sunshine Apartments,<br>Andheri West, Mumbai,<br>Maharashtra - 400053<br>Mobile: +91 \${user.phone}<br>Email: \${user.email}</p>
        </div>
        <div>
          <table class="account-table">
            <tr><td>Account No:</td><td>0000 0000 1234 0507</td></tr>
            <tr><td>Account Type:</td><td>SAVINGS ACCOUNT</td></tr>
            <tr><td>Customer CIF ID:</td><td>883920192</td></tr>
            <tr><td>Statement Period:</td><td>\${data.period.startDate} to \${data.period.endDate}</td></tr>
            <tr><td>Statement Date:</td><td>\${genDate.split(',')[0]}</td></tr>
            <tr><td>Statement Ref:</td><td>\${stmtRef}</td></tr>
          </table>
        </div>
      </div>

      <h4>ACCOUNT SUMMARY</h4>
      <table>
        <tr>
          <th class="summary-th">Opening Balance</th>
          <th class="summary-th">Total Debits (-)</th>
          <th class="summary-th">Total Credits (+)</th>
          <th class="summary-th">Closing Balance</th>
        </tr>
        <tr>
          <td class="summary-td">\${formatInr(data.summary.openingBalance, 2)}</td>
          <td class="summary-td">\${formatInr(data.summary.totalDebits, 2)}</td>
          <td class="summary-td">\${formatInr(data.summary.totalCredits, 2)}</td>
          <td class="summary-td">\${formatInr(data.summary.closingBalance, 2)}</td>
        </tr>
      </table>

      <h4>TRANSACTION DETAILS</h4>
      <table>
        <tr>
          <th>Date</th>
          <th>Time</th>
          <th>Narration / Description</th>
          <th class="right">Withdrawal (Dr)</th>
          <th class="right">Deposit (Cr)</th>
          <th class="right">Balance (INR)</th>
        </tr>
        \${data.transactions.map(t => \`
          <tr>
            <td>\${t.date.split(',')[0]}</td>
            <td>\${t.date.split(',')[1] ? t.date.split(',')[1].trim() : ''}</td>
            <td>\${t.title}<br>UPI/\${t.utr}</td>
            <td class="right">\${t.debit > 0 ? formatInr(t.debit, 2) : ''}</td>
            <td class="right">\${t.credit > 0 ? formatInr(t.credit, 2) : ''}</td>
            <td class="right"><strong>\${formatInr(t.balance, 2)}</strong></td>
          </tr>
        \`).join('')}
      </table>

      <div class="footer">
        <p>This is a computer generated statement and does not require a signature.<br>For any discrepancies, contact customer support at 1800-890-UNEXA within 7 days.</p>
      </div>
    </body>
    </html>
  \`;

  printWindow.document.write(html);
  printWindow.document.close();
  showToast('✅ Opened Bank-Grade PDF Print Preview!');
}`;

const lines = fs.readFileSync('app/index.html', 'utf8').split('\n');
let s1 = -1, e2 = -1;
for(let i=0; i<lines.length; i++) {
  if (s1 === -1 && lines[i].includes('function exportStatement')) s1 = i;
  if (s1 !== -1 && lines[i].includes('function downloadHtmlPrintPdfStatement')) {
    let depth = 0;
    for (let j = i; j < lines.length; j++) {
      if (lines[j].includes('{')) depth += (lines[j].match(/\{/g) || []).length;
      if (lines[j].includes('}')) depth -= (lines[j].match(/\}/g) || []).length;
      if (depth === 0) { e2 = j; break; }
    }
    break;
  }
}

if(s1 !== -1 && e2 !== -1) {
  lines.splice(s1, e2 - s1 + 1, replacement);
  fs.writeFileSync('app/index.html', lines.join('\n'));
  console.log('Successfully replaced statement generator');
} else {
  console.log('Failed to locate block');
}
