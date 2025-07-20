// parseCsv.js
const fs = require('fs');
const Papa = require('papaparse');

exports.parseCsvFile = (csvPath) => {
  const csvStr = fs.readFileSync(csvPath, 'utf8');
  return new Promise((resolve, reject) => {
    Papa.parse(csvStr, {
      header: true,
      complete: results => resolve(results.data),
      error: err => reject(err),
    });
  });
};
