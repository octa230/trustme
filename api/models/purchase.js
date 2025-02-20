import mongoose from "mongoose";


const purchaseSchema = new mongoose.Schema({
    purchaseNo: {type: Number},
    customer: {type: String, required: true},
    invoice: {type: String},
    items:[{
        name: {type: String},
        qty: {type: Number}
    }],
    totalExVat: {type: Number},
    vatAmount: {type: Number},
    totalIncVat: {type: Number},
    discount: {type: Number},
    dicountTotal: {type: Number},
    paidBy: {type: String},
    paidFrom: {type: String}
})

const Purchase = mongoose.model('Purchase', purchaseSchema)
export default Purchase