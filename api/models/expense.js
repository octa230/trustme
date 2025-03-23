import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
    date: {type: Date},
    account: {type: mongoose.Types.ObjectId, ref:'Account' },
    name: {type: String, required: true},
    recieptNumber: {type: String},
    amount: {type: Number},
    vat: {type: Number, min: 0},
    totalAmount: {type: Number, min: 0},
    paymentMethod: {type: String},
    cardAmount: {type: Number, default: 0},
    cashAmount: {type: Number, default: 0},
    bankAmount: {type: Number, default: 0},
    bankName: {type: String},
    billFile: {type: String, required: true},
    description: {type: String},
    notes: {type: String}
}, 
{
    timestamps: true
})

const Expense = mongoose.model('Expense', expenseSchema)
export default Expense