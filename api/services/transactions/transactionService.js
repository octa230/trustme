import Payment from "../../models/payment.js";
import { Account } from "../../models/account.js";
import Transaction from "../../models/transaction.js";

export class TransactionService {
    static async create(type, data) {

        const paymentAccount = await Account.find()
        // Create the transaction
        const newTxn = new Transaction({
            date: data.date,
            controlId: data.controlId,
            referenceType: type, // Default to 'expense' if not provided
            referenceId: data.referenceId,
            referenceNumber: data.referenceNumber || `TXN-${Date.now()}`, // Auto-generate if not provided
            description: data.description || `Transaction for ${expenseAccount.name}`,
            amount: data.amount,
            paymentType: data.paymentType || 'cash', // Default to 'cash' if not provided
            paymentAccountId: data.paymentAccountId,
            paymentAccountName: paymentAccount.name,
            expenseAccountId: data.expenseAccountId,
            expenseAccountName: expenseAccount.name,
            status: data.status || 'pending', // Default to 'pending' if not provided
            items: data.items || [] // Default to empty array if not provided
        });

        // Save the transaction
        await newTxn.save();

        // Update account balances (if applicable)
        if (newTxn.status === 'completed') {
            expenseAccount.balance += newTxn.amount; // Debit expense account
            paymentAccount.balance -= newTxn.amount; // Credit payment account

            await Promise.all([
                expenseAccount.save(),
                paymentAccount.save()
            ]);
        }

        return newTxn;
    }
}