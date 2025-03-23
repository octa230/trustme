import mongoose from 'mongoose';

// Account Type Schema
const accountTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
});

// Account Group Schema
const accountGroupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    accountType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AccountType',
        required: true,
    },
    description: {
        type: String,
        trim: true,
    },
});

// Account Schema
const accountSchema = new mongoose.Schema({
    controlId: { type: String, unique: true },
    serialNumber: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    accountType: { type: mongoose.Schema.Types.ObjectId, ref: 'AccountType', required: true },
    accountGroup: { type: mongoose.Schema.Types.ObjectId, ref: 'AccountGroup', required: true },
    isActive: { type: Boolean, default: true },
    balance: { type: Number, default: 0 },
}, { timestamps: true });

// Predefined accounts mapping (reusable for seeding or validation)
accountSchema.statics.predefinedAccountsMapping = {
    'Receivables': { accountType: 'Asset', accountGroup: 'Current Assets' },
    'Payables': { accountType: 'Liability', accountGroup: 'Current Liabilities' },
    'Sales': { accountType: 'Revenue', accountGroup: 'Sales Revenue' },
    'Sales Return': { accountType: 'Revenue', accountGroup: 'Sales Returns' },
    'Purchase': { accountType: 'Expense', accountGroup: 'Cost of Goods Sold' },
    'Purchase Return': { accountType: 'Expense', accountGroup: 'Purchase Returns' },
    'Input VAT (Purchase)': { accountType: 'Asset', accountGroup: 'VAT Receivable' },
    'Output VAT (Sales)': { accountType: 'Liability', accountGroup: 'VAT Payable' },
    'Undistributed Income': { accountType: 'Equity', accountGroup: 'Retained Earnings' },
    'Opening Stock': { accountType: 'Asset', accountGroup: 'Inventory' },
};

/**
 * Match a predefined account by name.
 * @param {string} accountName - The name of the account to match.
 * @returns {Object|null} - Matched account type and group, or null if not found.
 */
accountSchema.statics.matchPredefinedAccount = async function(accountName) {
    const normalizedName = accountName.trim().toLowerCase();
    for (const [key, value] of Object.entries(this.predefinedAccountsMapping)) {
        if (normalizedName.includes(key.toLowerCase())) {
            const accountType = await AccountType.findOne({ name: value.accountType });
            const accountGroup = await AccountGroup.findOne({ name: value.accountGroup });
            return { accountType, accountGroup };
        }
    }
    return null; // No match found
};

// Middleware to populate accountType from accountGroup
accountSchema.pre('save', async function(next) {
    if (this.isNew || this.isModified('accountGroup')) {
        const group = await AccountGroup.findById(this.accountGroup);
        if (!group) {
            throw new Error('Invalid account group');
        }
        this.accountType = group.accountType;
    }
    next();
});

// Models
const AccountType = mongoose.model('AccountType', accountTypeSchema);
const AccountGroup = mongoose.model('AccountGroup', accountGroupSchema);
const Account = mongoose.model('Account', accountSchema);

export { Account, AccountGroup, AccountType };