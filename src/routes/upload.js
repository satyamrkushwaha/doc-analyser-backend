const express = require('express');
const multer = require('multer');
const { parseCsvFile } = require('../utils/parseCsv');
const { parsePdfFile } = require('../utils/parsePdf');
const { categorizeTransactions } = require('../utils/categorize');
const { generateExcel } = require('../utils/excelGenerator');
const fs = require('fs');
const router = express.Router();
const upload = multer({ dest: '/tmp/' });

router.post('/', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  let transactions;
  try {
    if (req.file.originalname.endsWith('.csv')) {
      transactions = await parseCsvFile(req.file.path);
    } else if (req.file.originalname.endsWith('.pdf')) {
      transactions = await parsePdfFile(req.file.path);
    } else {
      throw new Error('Unsupported file type');
    }
    fs.unlinkSync(req.file.path);
  } catch (e) {
    return res.status(500).json({ error: 'Parse error', details: e.message });
  }
  const analyzed = categorizeTransactions(transactions);
  const excelBuffer = await generateExcel(analyzed);
  const excelBase64 = excelBuffer.toString('base64');
  const excelFileUrl = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${excelBase64}`;
  res.json({ insights: analyzed, excelFileUrl });
});

module.exports = router;
