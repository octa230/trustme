import mongoose from "mongoose";


const itemSchema = {
    category: {type: String},
    item: {type: String},
    description: {type: String},
    purchasePrice: {type: Number},
    sellingPrice: {type: Number},
    quantity: {type: Number},
    inStock: {type: Number},
    vat: {type: Number},
    netAmount: {type: Number}
}


const saleSchema = new mongoose.Schema({
    createdBy: {type: String},
    invoiceNo: {type: String},
    controlId: {type: String},
    createdBy: {type: String},
    expiryDate: {type: Date},
    description: {type: String},
    customer: {type: mongoose.Types.ObjectId, ref: 'customer'},
    items: [itemSchema],
    totalWithoutVat: {type: Number, default: 0},
    vatAmount:{type: Number, default: 0},
    totalWithVat:{type: Number, default: 0},
    discountAmount: {type: Number, default: 0},
    paidAmount: {type: Number, default: 0},
    advanceAmount: {type: Number, default: 0},
    pendingAmount: {type: Number, default: 0},
    amountInWords: {type: String}, 
    paidBy: {type: String},
    paidFrom: {type: String},

})

const Sale = mongoose.model('Sale', saleSchema)
export default Sale