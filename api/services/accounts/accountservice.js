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

    static async getGeneralSupplierLedger(startDate, endDate) {
        try {
            // Find the Payables account using exact controlId or name
            const payablesAccount = await Account.findOne({ 
                $or: [
                    { controlId: 'ACC-PAYABLES' },
                    { name: 'Payables' }
                ]
            });
    
            if (!payablesAccount) {
                throw new Error('Payables account not found');
            }
    
            // Prepare date filters
            const dateFilter = {};
            if (startDate) dateFilter['$gte'] = new Date(startDate);
            if (endDate) dateFilter['$lte'] = new Date(endDate);
    
            // Construct base query
            const query = {
                'entries.account': payablesAccount._id,
                postingStatus: 'posted'
            };
    
            // Add date filter if dates provided
            if (Object.keys(dateFilter).length > 0) {
                query.date = dateFilter;
            }
    
            // Get journal entries with supplier information
            const journalEntries = await JournalEntry.aggregate([
                { $match: query },
                { $unwind: '$entries' },
                { $match: { 'entries.account': payablesAccount._id } },
                {
                    $lookup: {
                        from: 'purchases',
                        localField: 'referenceId',
                        foreignField: '_id',
                        as: 'purchase'
                    }
                },
                { $unwind: { path: '$purchase', preserveNullAndEmptyArrays: true } },
                {
                    $lookup: {
                        from: 'payments',
                        localField: 'referenceId',
                        foreignField: '_id',
                        as: 'payment'
                    }
                },
                { $unwind: { path: '$payment', preserveNullAndEmptyArrays: true } },
                {
                    $lookup: {
                        from: 'returns',
                        localField: 'referenceId',
                        foreignField: '_id',
                        as: 'return'
                    }
                },
                { $unwind: { path: '$return', preserveNullAndEmptyArrays: true } },
                {
                    $project: {
                        date: 1,
                        description: 1,
                        referenceType: 1,
                        referenceNumber: 1,
                        debit: '$entries.debit',
                        credit: '$entries.credit',
                        supplier: {
                            $cond: {
                                if: { $ifNull: ['$purchase.supplier', false] },
                                then: '$purchase.supplier',
                                else: {
                                    $cond: {
                                        if: { $ifNull: ['$payment.supplier', false] },
                                        then: '$payment.supplier',
                                        else: '$return.supplier'
                                    }
                                }
                            }
                        },
                        docType: {
                            $cond: {
                                if: { $ifNull: ['$purchase', false] },
                                then: 'Purchase',
                                else: {
                                    $cond: {
                                        if: { $ifNull: ['$payment', false] },
                                        then: 'Payment',
                                        else: 'Return'
                                    }
                                }
                            }
                        },
                        docNumber: {
                            $cond: {
                                if: { $ifNull: ['$purchase.invoiceNumber', false] },
                                then: '$purchase.invoiceNumber',
                                else: {
                                    $cond: {
                                        if: { $ifNull: ['$payment.paymentNumber', false] },
                                        then: '$payment.paymentNumber',
                                        else: '$return.returnNumber'
                                    }
                                }
                            }
                        }
                    }
                },
                { $match: { supplier: { $exists: true, $ne: null } } },
                { $sort: { date: 1 } }
            ]);
    
            // Calculate running balance
            let balance = 0;
            const entries = journalEntries.map(entry => {
                const amount = entry.debit - entry.credit;
                balance += amount;
                
                return {
                    date: entry.date,
                    name: entry.supplier.name,
                    particulars: entry.description,
                    docVoucherNo: entry.docNumber,
                    docVoucherType: entry.docType,
                    debit: entry.debit,
                    credit: entry.credit,
                    balance: balance
                };
            });
    
            // Calculate totals
            const totalDebit = entries.reduce((sum, entry) => sum + entry.debit, 0);
            const totalCredit = entries.reduce((sum, entry) => sum + entry.credit, 0);
    
            return {
                accountId: payablesAccount._id,
                accountName: payablesAccount.name,
                entries,
                totalDebit,
                totalCredit,
                balance
            };
        } catch (error) {
            console.error('Error in getGeneralSupplierLedger:', error);
            throw new Error('Failed to fetch general supplier ledger: ' + error.message);
        }
    }
    
    // Specific Supplier Ledger
    static async getSupplierLedger(controlId, startDate, endDate) {
        try {
            const supplier = await Supplier.findOne({ controlId });
            if (!supplier) throw new Error('Supplier not found');
    
            const payablesAccount = await Account.findOne({ 
                $or: [
                    { controlId: 'ACC-PAYABLES' },
                    { name: 'Payables' }
                ]
            });
            if (!payablesAccount) throw new Error('Payables account not found');
    
            // Prepare date filters
            const dateFilter = {};
            if (startDate) dateFilter['$gte'] = new Date(startDate);
            if (endDate) dateFilter['$lte'] = new Date(endDate);
    
            // Get all relevant journal entries
            const journalEntries = await JournalEntry.aggregate([
                { 
                    $match: { 
                        'entries.account': payablesAccount._id,
                        postingStatus: 'posted',
                        ...(Object.keys(dateFilter).length > 0 && { date: dateFilter })
                    } 
                },
                { $unwind: '$entries' },
                { $match: { 'entries.account': payablesAccount._id } },
                {
                    $lookup: {
                        from: 'purchases',
                        let: { refId: '$referenceId' },
                        pipeline: [
                            { 
                                $match: { 
                                    $expr: { $eq: ['$_id', '$$refId'] },
                                    'supplier.controlId': controlId
                                } 
                            }
                        ],
                        as: 'purchase'
                    }
                },
                { $unwind: { path: '$purchase', preserveNullAndEmptyArrays: true } },
                {
                    $lookup: {
                        from: 'payments',
                        let: { refId: '$referenceId' },
                        pipeline: [
                            { 
                                $match: { 
                                    $expr: { $eq: ['$_id', '$$refId'] },
                                    'supplier.controlId': controlId
                                } 
                            }
                        ],
                        as: 'payment'
                    }
                },
                { $unwind: { path: '$payment', preserveNullAndEmptyArrays: true } },
                {
                    $lookup: {
                        from: 'returns',
                        let: { refId: '$referenceId' },
                        pipeline: [
                            { 
                                $match: { 
                                    $expr: { $eq: ['$_id', '$$refId'] },
                                    'supplier.controlId': controlId
                                } 
                            }
                        ],
                        as: 'return'
                    }
                },
                { $unwind: { path: '$return', preserveNullAndEmptyArrays: true } },
                { $match: { 
                    $or: [
                        { 'purchase': { $exists: true, $ne: null } },
                        { 'payment': { $exists: true, $ne: null } },
                        { 'return': { $exists: true, $ne: null } }
                    ]
                }},
                { $sort: { date: 1 } }
            ]);
    
            // Process entries
            let balance = 0;
            const entries = journalEntries.map(entry => {
                balance += entry.entries.debit - entry.entries.credit;
                
                const docType = entry.purchase ? 'Purchase' : 
                              entry.payment ? 'Payment' : 'Return';
                
                const docNumber = entry.purchase?.invoiceNumber || 
                                entry.payment?.paymentNumber || 
                                entry.return?.returnNumber;
    
                return {
                    date: entry.date,
                    particulars: entry.description,
                    docVoucherNo: docNumber,
                    docVoucherType: docType,
                    debit: entry.entries.debit,
                    credit: entry.entries.credit,
                    balance: balance
                };
            });
    
            // Calculate totals
            const totalDebit = entries.reduce((sum, e) => sum + e.debit, 0);
            const totalCredit = entries.reduce((sum, e) => sum + e.credit, 0);
    
            return {
                accountId: payablesAccount._id,
                accountName: payablesAccount.name,
                supplierId: supplier._id,
                supplierName: supplier.name,
                entries,
                totalDebit,
                totalCredit,
                balance
            };
        } catch (error) {
            console.error('Error in getSupplierLedger:', error);
            throw new Error('Failed to fetch supplier ledger: ' + error.message);
        }
    }



    
    static async getGeneralCustomerLedger(startDate, endDate) {
        try {
            // Find the Receivables account using the exact controlId or name
            const receivablesAccount = await Account.findOne({ 
                $or: [
                    { controlId: 'ACC-RECEIVABLES' },  // Match by exact controlId
                    { name: 'Receivables' }           // Or by exact name
                ]
            });
    
            if (!receivablesAccount) {
                throw new Error('Receivables account not found');
            }
    
            // Prepare date filters
            const dateFilter = {};
            if (startDate) dateFilter['$gte'] = new Date(startDate);
            if (endDate) dateFilter['$lte'] = new Date(endDate);
    
            // Construct base query
            const query = {
                'entries.account': receivablesAccount._id,
                postingStatus: 'posted'
            };
    
            // Add date filter if dates provided
            if (Object.keys(dateFilter).length > 0) {
                query.date = dateFilter;
            }
    
            // Get journal entries with customer information
            const journalEntries = await JournalEntry.aggregate([
                { $match: query },
                { $unwind: '$entries' },
                { $match: { 'entries.account': receivablesAccount._id } },
                {
                    $lookup: {
                        from: 'sales',
                        localField: 'referenceId',
                        foreignField: '_id',
                        as: 'sale'
                    }
                },
                { $unwind: { path: '$sale', preserveNullAndEmptyArrays: true } },
                {
                    $lookup: {
                        from: 'payments',
                        localField: 'referenceId',
                        foreignField: '_id',
                        as: 'payment'
                    }
                },
                { $unwind: { path: '$payment', preserveNullAndEmptyArrays: true } },
                {
                    $lookup: {
                        from: 'returns',
                        localField: 'referenceId',
                        foreignField: '_id',
                        as: 'return'
                    }
                },
                { $unwind: { path: '$return', preserveNullAndEmptyArrays: true } },
                {
                    $project: {
                        date: 1,
                        description: 1,
                        referenceType: 1,
                        referenceNumber: 1,
                        debit: '$entries.debit',
                        credit: '$entries.credit',
                        customer: {
                            $cond: {
                                if: { $ifNull: ['$sale.customer', false] },
                                then: '$sale.customer',
                                else: {
                                    $cond: {
                                        if: { $ifNull: ['$payment.customer', false] },
                                        then: '$payment.customer',
                                        else: '$return.customer'
                                    }
                                }
                            }
                        },
                        docType: {
                            $cond: {
                                if: { $ifNull: ['$sale', false] },
                                then: 'Sale',
                                else: {
                                    $cond: {
                                        if: { $ifNull: ['$payment', false] },
                                        then: 'Payment',
                                        else: 'Return'
                                    }
                                }
                            }
                        },
                        docNumber: {
                            $cond: {
                                if: { $ifNull: ['$sale.invoiceNumber', false] },
                                then: '$sale.invoiceNumber',
                                else: {
                                    $cond: {
                                        if: { $ifNull: ['$payment.paymentNumber', false] },
                                        then: '$payment.paymentNumber',
                                        else: '$return.returnNumber'
                                    }
                                }
                            }
                        }
                    }
                },
                { $match: { customer: { $exists: true, $ne: null } } },
                { $sort: { date: 1 } }
            ]);
    
            // Calculate running balance
            let balance = 0;
            const entries = journalEntries.map(entry => {
                const amount = entry.debit - entry.credit;
                balance += amount;
                
                return {
                    date: entry.date,
                    name: entry.customer.name,
                    particulars: entry.description,
                    docVoucherNo: entry.docNumber,
                    docVoucherType: entry.docType,
                    debit: entry.debit,
                    credit: entry.credit,
                    balance: balance
                };
            });
    
            // Calculate totals
            const totalDebit = entries.reduce((sum, entry) => sum + entry.debit, 0);
            const totalCredit = entries.reduce((sum, entry) => sum + entry.credit, 0);
    
            return {
                accountId: receivablesAccount._id,
                accountName: receivablesAccount.name,
                entries,
                totalDebit,
                totalCredit,
                balance
            };
        } catch (error) {
            console.error('Error in getGeneralCustomerLedger:', error);
            throw new Error('Failed to fetch general customer ledger: ' + error.message);
        }
    }
    

    static async getCustomerLedger(controlId, startDate, endDate) {
        try {
            // 1. Validate the customer exists
            const customer = await Customer.findOne({ controlId });
            if (!customer) {
                throw new Error(`Customer with controlId ${controlId} not found`);
            }
    
            // 2. Find the Receivables account
            const receivablesAccount = await Account.findOne({ 
                $or: [
                    { controlId: 'ACC-RECEIVABLES' },
                    { name: 'Receivables' }
                ]
            });
            if (!receivablesAccount) {
                throw new Error('Receivables account not found');
            }
    
            // 3. Prepare date filters
            const dateFilter = {};
            if (startDate) dateFilter.$gte = new Date(startDate);
            if (endDate) dateFilter.$lte = new Date(endDate);
    
            // 4. Build the aggregation pipeline
            const pipeline = [
                // Match base journal entries
                { 
                    $match: { 
                        'entries.account': receivablesAccount._id,
                        postingStatus: 'posted',
                        ...(Object.keys(dateFilter).length > 0 && { date: dateFilter })
                    } 
                },
                { $unwind: '$entries' },
                { $match: { 'entries.account': receivablesAccount._id } },
                
                // Lookup related documents with customer filtering
                {
                    $lookup: {
                        from: 'sales',
                        let: { refId: '$referenceId' },
                        pipeline: [
                            { 
                                $match: { 
                                    $expr: { $eq: ['$_id', '$$refId'] },
                                    'customer.controlId': controlId
                                } 
                            }
                        ],
                        as: 'sale'
                    }
                },
                { $unwind: { path: '$sale', preserveNullAndEmptyArrays: true } },
                {
                    $lookup: {
                        from: 'payments',
                        let: { refId: '$referenceId' },
                        pipeline: [
                            { 
                                $match: { 
                                    $expr: { $eq: ['$_id', '$$refId'] },
                                    'customer.controlId': controlId
                                } 
                            }
                        ],
                        as: 'payment'
                    }
                },
                { $unwind: { path: '$payment', preserveNullAndEmptyArrays: true } },
                {
                    $lookup: {
                        from: 'returns',
                        let: { refId: '$referenceId' },
                        pipeline: [
                            { 
                                $match: { 
                                    $expr: { $eq: ['$_id', '$$refId'] },
                                    'customer.controlId': controlId
                                } 
                            }
                        ],
                        as: 'return'
                    }
                },
                { $unwind: { path: '$return', preserveNullAndEmptyArrays: true } },
                
                // Filter to only include entries for this customer
                { $match: { 
                    $or: [
                        { 'sale': { $exists: true, $ne: null } },
                        { 'payment': { $exists: true, $ne: null } },
                        { 'return': { $exists: true, $ne: null } }
                    ]
                }},
                
                // Sort chronologically
                { $sort: { date: 1 } },
                
                // Project the final fields
                { 
                    $project: {
                        date: 1,
                        description: 1,
                        referenceType: 1,
                        referenceNumber: 1,
                        debit: '$entries.debit',
                        credit: '$entries.credit',
                        docType: {
                            $cond: {
                                if: { $ifNull: ['$sale', false] },
                                then: 'Sale',
                                else: {
                                    $cond: {
                                        if: { $ifNull: ['$payment', false] },
                                        then: 'Payment',
                                        else: 'Return'
                                    }
                                }
                            }
                        },
                        docNumber: {
                            $cond: {
                                if: { $ifNull: ['$sale.invoiceNumber', false] },
                                then: '$sale.invoiceNumber',
                                else: {
                                    $cond: {
                                        if: { $ifNull: ['$payment.paymentNumber', false] },
                                        then: '$payment.paymentNumber',
                                        else: '$return.returnNumber'
                                    }
                                }
                            }
                        }
                    }
                }
            ];
    
            // 5. Execute the aggregation
            const journalEntries = await JournalEntry.aggregate(pipeline);
    
            // 6. Calculate running balance
            let balance = 0;
            const entries = journalEntries.map(entry => {
                const amount = entry.debit - entry.credit;
                balance += amount;
                
                return {
                    date: entry.date,
                    particulars: entry.description,
                    docVoucherNo: entry.docNumber,
                    docVoucherType: entry.docType,
                    debit: entry.debit,
                    credit: entry.credit,
                    balance: balance
                };
            });
    
            // 7. Calculate totals
            const totalDebit = entries.reduce((sum, entry) => sum + entry.debit, 0);
            const totalCredit = entries.reduce((sum, entry) => sum + entry.credit, 0);
    
            // 8. Return the formatted response
            return {
                accountId: receivablesAccount._id,
                accountName: receivablesAccount.name,
                customerId: customer._id,
                customerName: customer.name,
                customerControlId: customer.controlId,
                entries,
                totalDebit,
                totalCredit,
                balance,
                asOfDate: new Date().toISOString()
            };
        } catch (error) {
            console.error(`Error in getCustomerLedger for ${controlId}:`, error);
            throw new Error(`Failed to fetch ledger for customer ${controlId}: ${error.message}`);
        }
    }

    
    static async getGeneralLedger(account, entityType, startDate, endDate) {
        // Prepare date filters
        const dateFilter = {};
        if (startDate) dateFilter['$gte'] = new Date(startDate);
        if (endDate) dateFilter['$lte'] = new Date(endDate);
    
        // Construct query
        const query = {
            'entries.account': account._id,
            postingStatus: 'posted',
        };
    
        if (Object.keys(dateFilter).length > 0) {
            query.date = dateFilter;
        }
    
        // Get journal entries
        const journalEntries = await JournalEntry.aggregate([
            { $match: query },
            { $unwind: '$entries' },
            { $match: { 'entries.account': account._id } },
            {
                $lookup: {
                    from: `${entityType === 'customer' ? 'sales' : 'purchases'}`,
                    localField: 'referenceId',
                    foreignField: '_id',
                    as: 'document',
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
    
        // Process entries
        const processedEntries = [];
        let runningBalance = 0;
    
        for (const entry of journalEntries) {
            // Determine the customer/supplier and document details
            let entity = null;
            let docNumber = '';
            let docType = '';
            
            if (entry.document && entry.document.length > 0) {
                entity = entry.document[0][entityType];
                docNumber = entry.document[0].invoiceNumber || entry.document[0].referenceNumber || '';
                docType = entityType === 'customer' ? 'Sale' : 'Purchase';
            } else if (entry.paymentDoc && entry.paymentDoc.length > 0) {
                entity = entry.paymentDoc[0][entityType];
                docNumber = entry.paymentDoc[0].paymentNumber || '';
                docType = 'Payment';
            } else if (entry.returnDoc && entry.returnDoc.length > 0) {
                entity = entry.returnDoc[0][entityType];
                docNumber = entry.returnDoc[0].returnNumber || '';
                docType = 'Return';
            }
    
            if (!entity) continue;
    
            // Calculate balance
            const amount = entry.entries.debit - entry.entries.credit;
            runningBalance += amount;
    
            processedEntries.push({
                date: entry.date,
                name: entity.name,
                particulars: entry.description,
                docVoucherNo: docNumber,
                docVoucherType: docType,
                debit: entry.entries.debit,
                credit: entry.entries.credit,
                balance: runningBalance
            });
        }
    
        // Calculate totals
        const totalDebit = processedEntries.reduce((sum, entry) => sum + entry.debit, 0);
        const totalCredit = processedEntries.reduce((sum, entry) => sum + entry.credit, 0);
    
        return {
            accountId: account._id,
            accountName: account.name,
            entries: processedEntries,
            totalDebit,
            totalCredit,
            balance: runningBalance,
        };
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


    static async createPurchase(purchaseData, session) {
        try {
            // Fetch required accounts using the exact names/controlIds from your database
            const inventoryAccount = await Account.findOne({ 
                $or: [
                    { controlId: 'ACC-OPENING STOCK' }, // or use 'ACC-PURCHASE' if that's more appropriate
                    { name: 'Opening Stock' }
                ]
            }).session(session);
    
            const payablesAccount = await Account.findOne({
                $or: [
                    { controlId: 'ACC-PAYABLES' },
                    { name: 'Payables' }
                ]
            }).session(session);
    
            const inputVatAccount = await Account.findOne({
                $or: [
                    { controlId: 'ACC-INPUT VAT (PURCHASE)' },
                    { name: 'Input VAT (Purchase)' }
                ]
            }).session(session);
    
            if (!inventoryAccount || !payablesAccount || !inputVatAccount) {
                const missingAccounts = [];
                if (!inventoryAccount) missingAccounts.push('Inventory/Opening Stock');
                if (!payablesAccount) missingAccounts.push('Payables');
                if (!inputVatAccount) missingAccounts.push('Input VAT');
                throw new Error(`Required accounts not found: ${missingAccounts.join(', ')}`);
            }
    
            // Prepare journal entry data
            const journalData = {
                date: new Date(purchaseData.invoiceDate || Date.now()),
                referenceType: 'purchase',
                referenceId: purchaseData._id,
                referenceNumber: purchaseData.purchaseNo,
                description: `Purchase ${purchaseData.purchaseNo} from ${purchaseData.supplierName}`,
                entries: [
                    // Debit Inventory (net amount without VAT)
                    {
                        account: inventoryAccount._id,
                        description: `Purchase ${purchaseData.purchaseNo}`,
                        debit: purchaseData.totalAmount - (purchaseData.vatAmount || 0),
                        credit: 0,
                    },
                    // Debit Input VAT (if VAT exists)
                    ...((purchaseData.vatAmount && purchaseData.vatAmount > 0) ? [{
                        account: inputVatAccount._id,
                        description: `Input VAT for Purchase ${purchaseData.purchaseNo}`,
                        debit: purchaseData.vatAmount,
                        credit: 0,
                    }] : []),
                    // Credit Accounts Payable (total amount)
                    {
                        account: payablesAccount._id,
                        description: `Purchase ${purchaseData.purchaseNo}`,
                        debit: 0,
                        credit: purchaseData.totalAmount,
                    }
                ],
            };
    
            // Create journal entry
            await this.createJournalEntry(journalData, session);
            console.log('Purchase accounting entries recorded successfully.');
        } catch (error) {
            console.error('Error recording purchase accounting entries:', error);
            throw error;
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


