
export const accountTypesToSeed = [
    { name: 'Asset', description: 'Resources owned by the business.' },
    { name: 'Liability', description: 'Obligations owed by the business.' },
    { name: 'Revenue', description: 'Income generated from sales.' },
    { name: 'Expense', description: 'Costs incurred by the business.' },
    { name: 'Equity', description: 'Owner’s interest in the business.' },
];

export const accountGroupsToSeed = [
    { name: 'Current Assets', accountType: 'Asset', description: 'Short-term assets.' },
    { name: 'Current Liabilities', accountType: 'Liability', description: 'Short-term obligations.' },
    { name: 'Sales Revenue', accountType: 'Revenue', description: 'Revenue from sales.' },
    { name: 'Sales Returns', accountType: 'Revenue', description: 'Returns or refunds on sales.' },
    { name: 'Cost of Goods Sold', accountType: 'Expense', description: 'Direct costs of producing goods.' },
    { name: 'Purchase Returns', accountType: 'Expense', description: 'Returns or refunds on purchases.' },
    { name: 'VAT Receivable', accountType: 'Asset', description: 'VAT recoverable from the government.' },
    { name: 'VAT Payable', accountType: 'Liability', description: 'VAT owed to the government.' },
    { name: 'Retained Earnings', accountType: 'Equity', description: 'Accumulated profits.' },
    { name: 'Inventory', accountType: 'Asset', description: 'Goods held for sale.' },
];
