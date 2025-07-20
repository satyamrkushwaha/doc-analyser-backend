// categorize.js
const CATEGORY_RULES = [
  { keyword: /uber|ola|cab|taxi/i, category: 'Transport' },
  { keyword: /zomato|swiggy|restaurant|eat|coffee|cafe/i, category: 'Food & Dining' },
  { keyword: /rent|lease/i, category: 'Rent' },
  { keyword: /credit card/i, category: 'Bills & EMIs' },
  { keyword: /flipkart|amazon|shopping|store/i, category: 'Shopping' },
  { keyword: /electricity|water|bill/i, category: 'Utilities' },
  { keyword: /salary|payroll|credit/i, category: 'Income' },
];

function getCategory(desc) {
  for (const rule of CATEGORY_RULES) {
    if (rule.keyword.test(desc)) return rule.category;
  }
  return 'Other';
}

exports.categorizeTransactions = (transactions) => {
  let totalCredit = 0, totalDebit = 0;
  let byCategory = {};
  let monthly = {};

  transactions.forEach(txn => {
    txn.amount = parseFloat(txn.debit || txn.credit || 0);
    txn.debit = parseFloat(txn.debit || 0);
    txn.credit = parseFloat(txn.credit || 0);

    const category = getCategory(txn.description || '');
    txn.category = category;

    if (txn.credit > 0) totalCredit += txn.credit;
    if (txn.debit > 0) totalDebit += txn.debit;

    if (!byCategory[category]) byCategory[category] = [];
    byCategory[category].push(txn);

    if (txn.date) {
      const month = (txn.date + '').slice(0, 7);
      if (!monthly[month]) monthly[month] = { credit: 0, debit: 0 };
      monthly[month].credit += txn.credit || 0;
      monthly[month].debit += txn.debit || 0;
    }
  });

  let recurring = Object.entries(byCategory)
    .filter(([cat, txns]) => txns.length > 3)
    .map(([cat]) => cat);

  return {
    totalCredit, totalDebit,
    byCategory,
    monthly,
    recurringCategories: recurring,
    transactions
  };
};
