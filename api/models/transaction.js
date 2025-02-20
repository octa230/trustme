import mongoose from "mongoose";



const transactionSchema = new mongoose.Schema({
    type: {type: String},
    item: {type: String},
    quantity: {type: Number}
})


const Transaction = mongoose.model("Transacrion", transactionSchema)
export default Transaction