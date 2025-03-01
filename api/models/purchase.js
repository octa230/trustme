import mongoose from "mongoose";


const purchaseSchema = new mongoose.Schema({
    purchaseNo: {type: Number},
    supplier: {type: mongoose.Types.ObjectId, ref:'Supplier'},
    supplierId: {type: String},
    description: {type: String},
    invoiceNo: {type: String},
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