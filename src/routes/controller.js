const { parseCsvFile } = require('../utils/parseCsv');
const { parsePdfFile } = require('../utils/parsePdf');
const { categorizeTransactions } = require('../utils/categorize');
const { generateExcel } = require('../utils/excelGenerator');

// Example (CSV):
const transactions = await parseCsvFile(pathToCsv);

// Example (PDF):
const transactionsPdf = await parsePdfFile(pathToPdf);

// Analyze:
const insights = categorizeTransactions(transactions);

// Excel:
const excelBuffer = await generateExcel(insights);
