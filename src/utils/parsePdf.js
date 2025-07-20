// parsePdf.js
const fs = require('fs');
const pdfParse = require('pdf-parse');

exports.parsePdfFile = async (filePath) => {
  const dataBuffer = fs.readFileSync(filePath);
  const pdfData = await pdfParse(dataBuffer);
  const lines = pdfData.text.split('\n').map(l => l.trim());
  const transactions = [];
  for (const line of lines) {
    // Adjust this regex for your bank statement format
    const m = line.match(/^(\d{2}\/\d{2}\/\d{4}) (.+?) (-?\d+[.,]\d{2}) (\d+[.,]\d{2})$/);
    if (m) {
      const [, date, description, debitOrCredit, balance] = m;
      let debit = parseFloat(debitOrCredit) < 0 ? Math.abs(parseFloat(debitOrCredit)) : 0;
      let credit = parseFloat(debitOrCredit) > 0 ? parseFloat(debitOrCredit) : 0;
      transactions.push({ date, description, debit, credit, balance: parseFloat(balance) });
    }
  }
  return transactions;
};
