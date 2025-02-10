import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
    date: {type: Date},
    recieptNumber: {type: Number},
    expenseName: {type: String, required: true},
    expenseAmount: {type: Number},
    expenseVat: {type: Number},
    totalExpense: {type: Number},
    paymentMethod: {type: String},
    billFile: {type: String, required: true},
    bankName: {type: String},
    notes: {type: String}
})

const Expense = mongoose.model('Expense', expenseSchema)
export default Expense