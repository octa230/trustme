import mongoose from "mongoose";


const purchaseSchema = new mongoose.Schema({
    purchaseNo: {type: Number},
    controlId: {type: String},
    date: {type: Date},
    supplier: {type: mongoose.Types.ObjectId, ref:'Supplier'},
    supplierId: {type: String},
    description: {type: String},
    invoiceNo: {type: String},
    amountInWords: {type: String},
    status: {type: Boolean, default: false},
    items:[{
        name: {type: String},
        qty: {type: Number}
    }],
    totalWithoutVat: {type: Number, default: 0},
    vatAmount: {type: Number, default: 0},
    totalWithVat: {type: Number, default: 0},
    discountAmount: {type: Number, default: 0},
    paidAmount: {type: Number, default: 0},
    paidBy: {type: String},
    paidFrom: {type: String}
},
{
    timestamps: true
})

const Purchase = mongoose.model('Purchase', purchaseSchema)
export default Purchase