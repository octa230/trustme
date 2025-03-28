import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import Sale from '../../models/sale.js';
import Transaction from '../../models/transaction.js';
import { Account } from '../../models/account.js';
import Company from '../../models/company.js';
import Customer from '../../models/customer.js';
import { AccountingService } from '../accounts/accountservice.js';
import { generateId, generatePDF, generateStatus, sendPDF, toWords } from '../../utils.js';
import { StockService } from '../items/StockService.js';

const salesRouter = Router();

class SalesClass {


    static async getAccountId(accountName) {
        const account = await Account.findOne({ name: accountName });
        if (!account) {
            throw new Error(`Account ${accountName} not found`);
        }
        return account._id;
    }

    /**
     * Create a new sale and associated transaction.
     * @param {Object} data - Sale data.
     * @returns {Object} - Invoice details.
     */
    static async newSale(data) {
        const session = await mongoose.startSession();
        session.startTransaction();
    
        try {
            //console.log('Creating new sale:', data);
    
            // Generate invoice number and status
            const docsCount = await Sale.countDocuments();
            const invoiceNo = isNaN(docsCount) ? 1 : docsCount + 1;
            const status = await generateStatus(data.pendingAmount);

            // Create the sale
            const sale = new Sale({
                invoiceNo,
                controlId: await generateId(),
                createdByName: data.employee.username,
                createdBy: data.employee._id,
                expiryDate: data.expiryDate,
                description: data.description,
                customer: data.customer._id,
                customerId: data.customer.controlId,
                customerName: data.customer.name,
                status,
                deliveryNote: data.deliveryNote,
                totalWithoutVat: data.totalWithoutVat,
                itemsTotal: data.itemsWithVatTotal,
                vatAmount: data.vatAmount,
                totalWithVat: data.totalWithVatTotal,
                discountAmount: data.discountAmount,
                paidAmount: data.paidAmount,
                advanceAmount: data.advanceAmount,
                totalAfterDiscount: data.totalAfterDiscount,
                pendingAmount: data.pendingAmount,
                cardAmount: data.cardAmount,
                bankAmount: data.bankAmount,
                cashAmount: data.cashAmount,
                paidBy: data.paidBy,
                paidFrom: data.paidFrom,
                chequeId: data.chequeId,
                vatRate: data.vatRate,
                amountInWords: await toWords(data.totalAfterDiscount),
            });
    
            const newSale = await sale.save({ session });

            await StockService.UpdateOnSale(data.items) ////STOCK UPDATER METHOD

            if (status === 'partially_paid' || status === "pending") {
                const customer = await Customer.findById(data.customer._id).session(session);
                customer.pendingAmount += data.pendingAmount;
    
                // Save the customer document within the transaction
                await customer.save({ session });
            }


            //console.log('Sale saved:', newSale);

    
            // Create accounting entry
            const journalData = {
                date: new Date(), // Use current date
                referenceType: 'sale',
                paymentType: data.paymentMethod, // Corrected spelling
                referenceId: newSale._id,
                referenceNumber: newSale.invoiceNo,
                description: `Sale invoice ${newSale.invoiceNo} for ${newSale.customerName}`,
                entries: [
                    {
                        account: await this.getAccountId('Receivables'), // Debit Accounts Receivable
                        description: `Invoice ${newSale.invoiceNo}`,
                        debit: newSale.totalAfterDiscount, // Use totalAfterDiscount
                        credit: 0,
                    },
                    {
                        account: await this.getAccountId('Sales'), // Credit Sales
                        description: `Invoice ${newSale.invoiceNo}`,
                        debit: 0,
                        credit: newSale.totalWithoutVat, // Use totalWithoutVat
                    },
                    {
                        account: await this.getAccountId('Output VAT (Sales)'), // Credit VAT Payable
                        description: `VAT on invoice ${newSale.invoiceNo}`,
                        debit: 0,
                        credit: newSale.vatAmount, // Use vatAmount
                    },
                ],
            };
    
            await AccountingService.createSale(journalData, session);
    
            // Create transaction
            const transaction = new Transaction({
                type: 'SALE',
                paymentType: data.paymentMethod,
                items: data.items.map(item => ({
                    name: item.name,
                    code: item.code,
                    qty: item.qty,
                    unit: item.unit,
                    vat: item.vat,
                    brand: item.brand,
                    purchasePrice: item.purchasePrice,
                    salePrice: item.salePrice,
                    costAmount: item.unitCost,
                    total: item.total,
                })),
                totalAmount: newSale.totalWithVat,
                vatAmount: newSale.vatAmount,
                controlId: newSale.controlId,
            });
    
            await transaction.save({ session });
            console.log('Transaction saved:', transaction);
    
            // Commit the transaction
            await session.commitTransaction();
    
            return {
                invoiceNo: newSale.invoiceNo,
                controlId: newSale.controlId,
                customerId: newSale.customerId,
            };
        } catch (error) {
            // Rollback the transaction in case of error
            await session.abortTransaction();
            console.error('Error creating sale:', error);
            throw error;
        } finally {
            // End the session
            session.endSession();
        }
    }
    
    /**
     * Retrieve sale data for printing.
     * @param {string} invoiceNo - Invoice number.
     * @param {string} controlId - Control ID.
     * @param {string} customerId - Customer ID.
     * @returns {Object} - Printable data.
     */
    static async getPrintableSale(invoiceNo, controlId, customerId) {
        console.log('Retrieving printable sale:', { invoiceNo, controlId, customerId });

        // Fetch sale, customer, transaction, and company data
        const [saleDoc, customerDoc, transactionDoc, companyDoc] = await Promise.all([
            Sale.findOne({ invoiceNo, controlId }),
            Customer.findOne({ controlId: customerId.toString() }),
            Transaction.findOne({ controlId }),
            Company.findOne(),
        ]);

        if (!saleDoc) throw new Error('Sale not found');
        if (!customerDoc) throw new Error('Customer not found');
        if (!transactionDoc) throw new Error('Transaction not found');

        // Prepare printable data
        const printableData = {
            sale: saleDoc.toObject(),
            customer: customerDoc.toObject(),
            transaction: transactionDoc.toObject(),
            company: companyDoc ? companyDoc.toObject() : null,
        };

        return printableData;
    }
}

// Save sale
salesRouter.post('/save', asyncHandler(async (req, res) => {
    const { data } = req.body;

    if (!data || !data.customer || !data.items || data.items.length === 0) {
        return res.status(400).send({ message: 'Incomplete data' });
    }

    try {
        await SalesClass.newSale(data);
        res.status(200).send({ message: 'Sale completed successfully' });
    } catch (error) {
        console.error('Failed to save sale:', error);
        res.status(500).send({ message: 'Failed to save sale' });
    }
}));

// Save and print sale
salesRouter.post('/', asyncHandler(async (req, res) => {
    const { data } = req.body;

    if (!data || !data.customer || !data.items || data.items.length === 0) {
        return res.status(400).send({ message: 'Incomplete data' });
    }

    try {
        const { invoiceNo, controlId, customerId } = await SalesClass.newSale(data);
        const pdfData = await SalesClass.getPrintableSale(invoiceNo, controlId, customerId);
        const pdfBuffer = await generatePDF('INVOICE', pdfData);

        if (pdfBuffer) {
            const filename = 'invoice.pdf';
            sendPDF(pdfBuffer, filename)(req, res);
        } else {
            res.status(400).send('Invalid PDF type or failed to generate PDF');
        }
    } catch (error) {
        console.error('Error in save & print action:', error);
        res.status(500).send('Internal server error');
    }
}));

// Search for an invoice
salesRouter.get('/invoice/search', asyncHandler(async (req, res) => {
    const { searchKey } = req.query;

    if (!searchKey) {
        return res.status(400).send({ message: 'Search key is required' });
    }

    try {
        const sale = await Sale.findOne({
            $or: [
                { controlId: searchKey },
                { invoiceNo: searchKey },
            ],
        });

        if (!sale) {
            return res.status(404).send({ message: 'Sale not found' });
        }

        const transaction = await Transaction.findOne({ type: 'SALE', controlId: sale.controlId });

        if (!transaction) {
            return res.status(404).send({ message: 'Items for this sale not found' });
        }

        sale.items = [...transaction.items];
        res.status(200).send(sale);
    } catch (error) {
        console.error('Error searching for invoice:', error);
        res.status(500).send({ message: 'Internal server error' });
    }
}));

// Get all sales
salesRouter.get('/', asyncHandler(async (req, res) => {
    try {
        const sales = await Sale.find({}).sort({ createdAt: -1 });
        res.status(200).send(sales);
    } catch (error) {
        console.error('Error fetching sales:', error);
        res.status(500).send({ message: 'Internal server error' });
    }
}));

export default salesRouter;