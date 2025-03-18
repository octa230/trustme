import mongoose from "mongoose";



const purchaseSchema = new mongoose.Schema({
    purchaseNo: {type: String, required: true, unique: true},
    controlId: {type: String, required: true, unique: true},
    date: {type: Date, default: Date.now},
    supplier: {type: mongoose.Types.ObjectId, ref:'Supplier', required: true},
    supplierId: {type: String},
    supplierName: {type: String},
    status: {type: String, Enumerator:['draft', 'confirmed', 'paid', 'partially_paid', 'void'], default: 'draft'},
    description: {type: String},
    invoiceDate: {type: Date},
    invoiceNo: {type: String},
    items:[{
        name: {type: String},
        qty: {type: Number}
    }],


    ///FINANCIAL CALCULATIONS
    itemsTotal: {type: Number, default: 0},
    totalWithoutVat: {type: Number, default: 0},
    totalAfterDiscount: {type: Number, default: 0},
    vatAmount: {type: Number, default: 0},
    vatRate: {type: Number, default: 0},
    totalWithVat: {type: Number, default: 0},
    discountAmount: {type: Number, default: 0},

    ///PAYMENT TRACKING
    paidAmount: {type: Number, default: 0},
    paidBy: {type: String},
    paidFrom: {type: String},
    advanceAmount: {type: Number, default: 0},
    paidAmount: {type: Number, default: 0},
    cashAmount: {type: Number, default: 0},
    cardAmount: {type: Number, default: 0},
    bankAmount: {type: Number, default: 0},
    advanceAmount: {type: Number, default: 0},
    pendingAmount: {type: Number, default: 0},
    amountInWords: {type: String},


    ///PAYMENT METHODS
        paymentMethods: [{
            method: {type: String, Enumerator:['cash', 'bank', 'card', 'credit']},
            amount: {type: Number, default: 0},
            transactionId: {type: String},
            reference: {type: String},
            account: {type: mongoose.Types.ObjectId, ref: "Account"},
            accountId: {type: String}
        }],
        createdBy: {type: mongoose.Types.ObjectId, ref: 'Employee'},
},
{
    timestamps: true
})

const Purchase = mongoose.model('Purchase', purchaseSchema)
export default Purchase