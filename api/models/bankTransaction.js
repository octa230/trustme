import mongoose from "mongoose";


const bankTxnSchema = new mongoose.Schema({
    date: {type: Date, default: Date.now},
    type: {type: String, Enumerator:['DEPOSIT', 'WITHDRAW, CHEQUE']},
    amount: {type: Number, default: 0}
})

const BankTransaction = mongoose.model('BankTransaction', bankTxnSchema)
export default BankTransaction