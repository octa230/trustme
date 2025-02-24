import mongoose from "mongoose";



const transactionSchema = new mongoose.Schema({
    type: {type: String},
    item: {type: String},
    quantity: {type: Number},
    controlId: {type: String}
})


const Transaction = mongoose.model("Transacrion", transactionSchema)
export default Transaction