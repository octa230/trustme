import mongoose from 'mongoose';
import Payment from '../../models/payment.js';
import { Account } from '../../models/account.js';
import JournalEntry from '../../models/journalEntry.js';
import Sale from '../../models/sale.js';
import Purchase from '../../models/purchase.js';
import Customer from '../../models/customer.js';

export class AccountingService {
  
  
    /**
     * Create a new journal entry.
     * @param {Object} journalData - Journal entry data.
     * @returns {Object} - Created journal entry.
     */
    static async createJournalEntry(journalData, session) {
        try {
            // Validate journal data
            let totalDebit = 0;
            let totalCredit = 0;
    
            journalData.entries.forEach(entry => {
                totalDebit += entry.debit || 0;
                totalCredit += entry.credit || 0;
            });
    
            if (Math.abs(totalDebit - totalCredit) > 0.01) {
                throw new Error('Journal entries must balance. Total debits must equal total credits.');
            }
    
            // Create journal entry
            const newJournalEntry = new JournalEntry({
                date: journalData.date,
                referenceType: journalData.referenceType,
                referenceId: journalData.referenceId,
                referenceNumber: journalData.referenceNumber,
                description: journalData.description,
                entries: journalData.entries,
                totalDebit,
                totalCredit,
                postingStatus: 'posted',
            });
    
            await newJournalEntry.save({ session });
    
            // Update account balances
            for (const entry of journalData.entries) {
                const account = await Account.findById(entry.account).session(session);
                if (!account) {
                    throw new Error(`Account with ID ${entry.account} not found`);
                }
    
                if (entry.debit) {
                    account.balance += entry.debit; // Debit increases asset/expense
                }
    
                if (entry.credit) {
                    account.balance -= entry.credit; // Credit decreases asset/expense
                }
    
                await account.save({ session });
            }
    
            return newJournalEntry;
        } catch (error) {
            console.error('Error creating journal entry:', error);
            throw error;
        }
    }


    /**
     * Create a new sale entry.
     * @param {Object} saleData - Sale data.
     * @returns {Object} - Created sale.
     */
    static async createSale(journalData, session) {
        try {
            // Validate journal data
            let totalDebit = 0;
            let totalCredit = 0;
    
            journalData.entries.forEach(entry => {
                totalDebit += entry.debit || 0;
                totalCredit += entry.credit || 0;
            });
    
            if (Math.abs(totalDebit - totalCredit) > 0.01) {
                throw new Error('Journal entries must balance. Total debits must equal total credits.');
            }
    
            // Create journal entry
            const newJournalEntry = new JournalEntry({
                date: journalData.date,
                referenceType: journalData.referenceType,
                referenceId: journalData.referenceId,
                referenceNumber: journalData.referenceNumber,
                description: journalData.description,
                entries: journalData.entries,
                totalDebit,
                totalCredit,
                postingStatus: 'posted',
            });
    
            await newJournalEntry.save({ session });
    
            // Update account balances
            for (const entry of journalData.entries) {
                const account = await Account.findById(entry.account).session(session);
                if (!account) {
                    throw new Error(`Account with ID ${entry.account} not found`);
                }
    
                if (entry.debit) {
                    account.balance += entry.debit; // Debit increases asset/expense
                }
    
                if (entry.credit) {
                    account.balance -= entry.credit; // Credit decreases asset/expense
                }
    
                await account.save({ session });
            }
    
            return newJournalEntry;
        } catch (error) {
            console.error('Error creating journal entry:', error);
            throw error;
        }
    }

    /**
     * Get customer ledger.
     * @param {string} controlId - Customer control ID.
     * @param {Date} startDate - Start date for filtering.
     * @param {Date} endDate - End date for filtering.
     * @returns {Object} - Customer ledger.
     */
    static async getCustomerLedger(controlId, startDate, endDate) {
        try {
            const customer = await Customer.findOne({ controlId });
            if (!customer) {
                throw new Error('Customer not found');
            }

            // Find the Accounts Receivable account
            const arAccount = await Account.findOne({ type: 'asset', name: { $regex: /receivable/i } });
            if (!arAccount) {
                throw new Error('Accounts Receivable account not found');
            }

            // Prepare date filters
            const dateFilter = {};
            if (startDate) dateFilter['$gte'] = startDate;
            if (endDate) dateFilter['$lte'] = endDate;

            // Construct query
            const query = {
                'entries.account': arAccount._id,
                postingStatus: 'posted',
            };

            if (Object.keys(dateFilter).length > 0) {
                query.date = dateFilter;
            }

            // Get journal entries
            const journalEntries = await JournalEntry.aggregate([
                { $match: query },
                { $unwind: '$entries' },
                { $match: { 'entries.account': arAccount._id } },
                {
                    $lookup: {
                        from: 'sales',
                        localField: 'referenceId',
                        foreignField: '_id',
                        as: 'saleDoc',
                    },
                },
                {
                    $lookup: {
                        from: 'payments',
                        localField: 'referenceId',
                        foreignField: '_id',
                        as: 'paymentDoc',
                    },
                },
                {
                    $lookup: {
                        from: 'returns',
                        localField: 'referenceId',
                        foreignField: '_id',
                        as: 'returnDoc',
                    },
                },
                { $sort: { date: 1 } },
            ]);

            // Filter customer-specific entries
            const customerEntries = journalEntries.filter(entry => {
                if (entry.saleDoc && entry.saleDoc.length > 0) {
                    return entry.saleDoc[0].customer.controlId === controlId;
                }
                if (entry.paymentDoc && entry.paymentDoc.length > 0) {
                    return entry.paymentDoc[0].customer.controlId === controlId;
                }
                if (entry.returnDoc && entry.returnDoc.length > 0) {
                    return entry.returnDoc[0].customer.controlId === controlId;
                }
                return false;
            });

            // Format ledger entries
            let balance = 0;
            const entries = customerEntries.map(entry => {
                balance += entry.entries.debit - entry.entries.credit;
                return {
                    date: entry.date,
                    description: entry.description,
                    referenceType: entry.referenceType,
                    referenceNumber: entry.referenceNumber,
                    debit: entry.entries.debit,
                    credit: entry.entries.credit,
                    balance,
                };
            });

            // Calculate totals
            const totalDebit = entries.reduce((sum, entry) => sum + entry.debit, 0);
            const totalCredit = entries.reduce((sum, entry) => sum + entry.credit, 0);

            return {
                accountId: arAccount._id,
                accountName: arAccount.name,
                customerId: customer._id,
                customerName: customer.name,
                entries,
                totalDebit,
                totalCredit,
                balance,
            };
        } catch (error) {
            console.error('Error fetching customer ledger:', error);
            throw error;
        }
    }

    static async createExpense(expenseData) {
        const session = await mongoose.startSession();
        session.startTransaction();
    
        try {
            // Fetch required accounts
            const expenseAccount = await Account.findOne({ name: expenseData.expenseType }).session(session);
            const cashAccount = await Account.findOne({ name: 'Cash' }).session(session);
    
            if (!expenseAccount || !cashAccount) {
                throw new Error('Required accounts not found');
            }
    
            // Prepare journal entry data
            const journalData = {
                date: new Date(),
                referenceType: 'expense',
                referenceId: expenseData._id,
                referenceNumber: expenseData.expenseNo,
                description: `Expense ${expenseData.expenseNo} for ${expenseData.description}`,
                entries: [
                    {
                        account: expenseAccount._id, // Debit Expense Account
                        description: `Expense ${expenseData.expenseNo}`,
                        debit: expenseData.amount,
                        credit: 0,
                    },
                    {
                        account: cashAccount._id, // Credit Cash Account
                        description: `Expense ${expenseData.expenseNo}`,
                        debit: 0,
                        credit: expenseData.amount,
                    },
                ],
            };
    
            // Create journal entry
            await this.createJournalEntry(journalData, session);
    
            // Commit the transaction
            await session.commitTransaction();
            console.log('Expense recorded successfully.');
        } catch (error) {
            // Rollback the transaction in case of error
            await session.abortTransaction();
            console.error('Error recording expense:', error);
            throw error;
        } finally {
            // End the session
            session.endSession();
        }
    }


    static async createPurchase(purchaseData) {
        const session = await mongoose.startSession();
        session.startTransaction();
    
        try {
            // Fetch required accounts
            const inventory = await Account.findOne({ name: 'Inventory' }).session(session);
            const accountsPayable = await Account.findOne({ name: 'Accounts Payable' }).session(session);
    
            if (!inventory || !accountsPayable) {
                throw new Error('Required accounts not found');
            }
    
            // Prepare journal entry data
            const journalData = {
                date: new Date(),
                referenceType: 'purchase',
                referenceId: purchaseData._id,
                referenceNumber: purchaseData.purchaseNo,
                description: `Purchase ${purchaseData.purchaseNo} from ${purchaseData.supplierName}`,
                entries: [
                    {
                        account: inventory._id, // Debit Inventory
                        description: `Purchase ${purchaseData.purchaseNo}`,
                        debit: purchaseData.totalAmount,
                        credit: 0,
                    },
                    {
                        account: accountsPayable._id, // Credit Accounts Payable
                        description: `Purchase ${purchaseData.purchaseNo}`,
                        debit: 0,
                        credit: purchaseData.totalAmount,
                    },
                ],
            };
    
            // Create journal entry
            await this.createJournalEntry(journalData, session);
    
            // Commit the transaction
            await session.commitTransaction();
            console.log('Purchase recorded successfully.');
        } catch (error) {
            // Rollback the transaction in case of error
            await session.abortTransaction();
            console.error('Error recording purchase:', error);
            throw error;
        } finally {
            // End the session
            session.endSession();
        }
    }


    static async createPurchaseReturn(returnData) {
        const session = await mongoose.startSession();
        session.startTransaction();
    
        try {
            // Fetch required accounts
            const accountsPayable = await Account.findOne({ name: 'Accounts Payable' }).session(session);
            const inventory = await Account.findOne({ name: 'Inventory' }).session(session);
    
            if (!accountsPayable || !inventory) {
                throw new Error('Required accounts not found');
            }
    
            // Prepare journal entry data
            const journalData = {
                date: new Date(),
                referenceType: 'purchase-return',
                referenceId: returnData._id,
                referenceNumber: returnData.returnNo,
                description: `Purchase return ${returnData.returnNo} to ${returnData.supplierName}`,
                entries: [
                    {
                        account: accountsPayable._id, // Debit Accounts Payable
                        description: `Return ${returnData.returnNo}`,
                        debit: returnData.totalAmount,
                        credit: 0,
                    },
                    {
                        account: inventory._id, // Credit Inventory
                        description: `Return ${returnData.returnNo}`,
                        debit: 0,
                        credit: returnData.totalAmount,
                    },
                ],
            };
    
            // Create journal entry
            await this.createJournalEntry(journalData, session);
    
            // Commit the transaction
            await session.commitTransaction();
            console.log('Purchase return recorded successfully.');
        } catch (error) {
            // Rollback the transaction in case of error
            await session.abortTransaction();
            console.error('Error recording purchase return:', error);
            throw error;
        } finally {
            // End the session
            session.endSession();
        }
    }

    
    static async createCustomerReturn(returnData) {
        const session = await mongoose.startSession();
        session.startTransaction();
    
        try {
            // Fetch required accounts
            const salesReturns = await Account.findOne({ name: 'Sales Returns' }).session(session);
            const accountsReceivable = await Account.findOne({ name: 'Accounts Receivable' }).session(session);
    
            if (!salesReturns || !accountsReceivable) {
                throw new Error('Required accounts not found');
            }
    
            // Prepare journal entry data
            const journalData = {
                date: new Date(),
                referenceType: 'customer-return',
                referenceId: returnData._id,
                referenceNumber: returnData.returnNo,
                description: `Customer return ${returnData.returnNo} from ${returnData.customerName}`,
                entries: [
                    {
                        account: salesReturns._id, // Debit Sales Returns
                        description: `Return ${returnData.returnNo}`,
                        debit: returnData.totalAmount,
                        credit: 0,
                    },
                    {
                        account: accountsReceivable._id, // Credit Accounts Receivable
                        description: `Return ${returnData.returnNo}`,
                        debit: 0,
                        credit: returnData.totalAmount,
                    },
                ],
            };
    
            // Create journal entry
            await this.createJournalEntry(journalData, session);
    
            // Commit the transaction
            await session.commitTransaction();
            console.log('Customer return recorded successfully.');
        } catch (error) {
            // Rollback the transaction in case of error
            await session.abortTransaction();
            console.error('Error recording customer return:', error);
            throw error;
        } finally {
            // End the session
            session.endSession();
        }
    }
}


