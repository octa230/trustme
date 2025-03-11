import mongoose from "mongoose";


const itemSchema = {
    category: {type: String},
    name: {type: String },
    unit: {type: String},
    code: {type: String},
    vat: {type: Number, default: 0},
    brand: {type: String},
    model: {type: String},
    barcode: {type: String},
    total: {type: Number},
    purchasePrice: {type: Number},
    salePrice: {type: Number},
    costAmount: {type: Number, default: 0},
    photo: {type: String},
    description: {type: String},
    note: {type: String}
}


const deliverySchema = new mongoose.Schema({
    createdBy: {type: String},
    noteNo: {type: String},
    invoiceNo: {type: String},
    date: {type: Date},
    controlId: {type: String},
    itemsTotal: {type: Number, default: 0},
    createdBy: {type: String},
    status: {type: Boolean, default: true},
    expiryDate: {type: Date},
    description: {type: String},
    customer: {type: mongoose.Types.ObjectId, ref: 'customer'},
    customerId: {type: String},
    customerName: {type: String},
    items: [itemSchema],
    totalWithoutVat: {type: Number, default: 0},
    vatAmount:{type: Number, default: 0},
    vatRate:{type: Number, default: 0},
    totalWithVat:{type: Number, default: 0},
    discountAmount: {type: Number, default: 0},
    totalAfterDiscount: {type: Number, default: 0},
    paidAmount: {type: Number, default: 0},
    cashAmount: {type: Number, default: 0},
    bankAmount: {type: Number, default: 0},
    cardAmount: {type: Number, default: 0},
    advanceAmount: {type: Number, default: 0},
    pendingAmount: {type: Number, default: 0},
    amountInWords: {type: String}, 
    paidBy: {type: String},
    paidFrom: {type: String},
},
{
    timestamps: true
}
)

const DeliveryNote = mongoose.model('DeliveryNote', deliverySchema)
export default DeliveryNote