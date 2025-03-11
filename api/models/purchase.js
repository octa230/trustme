import mongoose from "mongoose";


const purchaseSchema = new mongoose.Schema({
    purchaseNo: {type: Number, default: 0},
    controlId: {type: String},
    date: {type: Date},
    supplier: {type: mongoose.Types.ObjectId, ref:'Supplier'},
    supplierId: {type: String},
    supplierName: {type: String},
    status: {type: Boolean},
    description: {type: String},
    invoiceDate: {type: String},
    invoiceNo: {type: String},
    amountInWords: {type: String},
    status: {type: Boolean, default: false},
    items:[{
        name: {type: String},
        qty: {type: Number}
    }],
    itemsTotal: {type: Number, default: 0},
    totalWithoutVat: {type: Number, default: 0},
    totalAfterDiscount: {type: Number, default: 0},
    vatAmount: {type: Number, default: 0},
    vatRate: {type: Number, default: 0},
    totalWithVat: {type: Number, default: 0},
    discountAmount: {type: Number, default: 0},
    paidAmount: {type: Number, default: 0},
    paidBy: {type: String},
    paidFrom: {type: String},
    advanceAmount: {type: Number, default: 0},
    paidAmount: {type: Number, default: 0},
    cashAmount: {type: Number, default: 0},
    cardAmount: {type: Number, default: 0},
    bankAmount: {type: Number, default: 0},
    advanceAmount: {type: Number, default: 0},
    pendingAmount: {type: Number, default: 0}
},
{
    timestamps: true
})

const Purchase = mongoose.model('Purchase', purchaseSchema)
export default Purchase