// excelGenerator.js
const ExcelJS = require('exceljs');

exports.generateExcel = async (analyzed) => {
  const workbook = new ExcelJS.Workbook();

  // Summary Sheet
  const summary = workbook.addWorksheet('Summary');
  summary.addRows([
    ['Total Credit', analyzed.totalCredit],
    ['Total Debit', analyzed.totalDebit],
    ['Recurring Categories', analyzed.recurringCategories.join(', ')],
    [],
    ['Month', 'Credit', 'Debit'],
    ...Object.entries(analyzed.monthly).map(([month, data]) => [
      month,
      data.credit,
      data.debit,
    ]),
  ]);

  // By Category Sheet
  const catSheet = workbook.addWorksheet('Category Breakdown');
  catSheet.addRow(['Category', 'Count', 'Total Amount']);
  Object.entries(analyzed.byCategory).forEach(([category, txns]) => {
    catSheet.addRow([
      category,
      txns.length,
      txns.reduce((sum, tx) => sum + (tx.debit || tx.credit || 0), 0),
    ]);
  });

  // Raw Data Sheet
  const rawSheet = workbook.addWorksheet('Raw Transactions');
  rawSheet.addRow(['Date', 'Description', 'Debit', 'Credit', 'Balance', 'Category']);
  analyzed.transactions.forEach((tx) => {
    rawSheet.addRow([
      tx.date,
      tx.description,
      tx.debit,
      tx.credit,
      tx.balance,
      tx.category,
    ]);
  });

  return await workbook.xlsx.writeBuffer();
};
