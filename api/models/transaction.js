import mongoose from "mongoose";



const transactionSchema = new mongoose.Schema({
    type: {type: String, Enumerator:['SALE', 'PURCHASE', 'REFUND']},
    controlId: {type: String},
    totalAmount: {type: Number},
    type: {String},
    bankName: {String},
    items:[
        {
            item: {type: String},
            code: {type: String},
            qty: {type: Number},
        }
    ],
    
})


const Transaction = mongoose.model("Transaction", transactionSchema)
export default Transaction