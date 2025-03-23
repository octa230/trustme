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


const saleSchema = new mongoose.Schema({
    createdByName: {type: String},
    invoiceNo: {type: String, required: true, unique: true},
    date: {type: Date},
    controlId: {type: String, unique: true},
    itemsTotal: {type: Number, default: 0},
    createdBy: {type: String},
    status: {type: String, Enumerator:['draft', 'confirmed', 'paid', 'partially_paid', 'void']},
    expiryDate: {type: Date},
    description: {type: String},
    customer: {type: mongoose.Types.ObjectId, ref: 'customer'},
    customerId: {type: String},
    customerName: {type: String},
    items: [itemSchema],


    //FINANCIAL CALCULATIONS VALUES
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
    
    //PAYMENT METHODS
    paidBy: {type: String},

    ///PAYMENT METHODS
  /*   paymentMethods: [{
        method: {type: String, Enumerator:['cash', 'bank', 'card', 'credit']},
        amount: {type: Number, default: 0},
        transactionId: {type: String},
        reference: {type: String},
        account: {type: mongoose.Types.ObjectId, ref: "Account"},
        accountId: {type: String}
    }], */
    createdBy: {type: mongoose.Types.ObjectId, ref: 'Employee'},
    transactionId: {type: mongoose.Types.ObjectId, ref: "Transaction"}
},
{
    timestamps: true
}
)

const Sale = mongoose.model('Sale', saleSchema)
export default Sale