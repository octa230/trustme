import mongoose from "mongoose";


const returnSchema = new mongoose.Schema({
    returnNo: {type: String, required: true},
    controlId: {type: String, required: true, unique: true},
    date: {type: Date, default: Date.now},
    returnType:{type: String, Enumerator:['customer', 'supplier']},


    // For customer returns
    customer: { type: mongoose.Types.ObjectId, ref: 'Customer' },
    customerId: { type: String },
    customerName: { type: String },

    // For supplier returns
    supplier: { type: mongoose.Types.ObjectId, ref: 'Supplier' },
    supplierId: { type: String },
    supplierName: { type: String },

    //ORIGINAL DOCUMENT INFORMATION
    originalDocumentType: { type: String, enum: ['sale', 'purchase'] },
    originalDocumentId: { type: mongoose.Types.ObjectId, refPath: 'originalDocumentType' },
    originalDocumentNo: { type: String },
    status: { 
      type: String, 
      enum: ['draft', 'confirmed', 'refunded', 'credited', 'void'], 
      default: 'draft' 
    },
    description: { type: String },


    // Financial calculations  
    itemsTotal: { type: Number, default: 0 },
    totalWithoutVat: { type: Number, default: 0 },
    vatAmount: { type: Number, default: 0 },
    vatRate: { type: Number, default: 0 },
    totalWithVat: { type: Number, default: 0 },


    // Refund tracking
    refundAmount: { type: Number, default: 0 },
    refundMethod: { type: String, enum: ['cash', 'bank', 'card', 'credit'] },
    refundReference: { type: String },
    createdBy: { type: mongoose.Types.ObjectId, ref: 'User' }
})


const Return = mongoose.model('Return', returnSchema)
export default Return

















































/* import mongoose from "mongoose";

// Base Return Schema
const baseReturnSchema = new mongoose.Schema({
    controlId: { type: String, unique: true }, // RETURN TXN UUID
    type: { type: String, enum: ['SALE', 'PURCHASE'], required: true }, // Corrected enum
    transactionId: { type: String }, // Corrected typo (was "transctionId")
    returnedTo: { type: String },
    returnedFrom: { type: String },
    totalAmount: { type: Number },
    vatAmount: { type: Number },
    amountInWords: { type: String },
}, {
    discriminatorKey: 'type',
    timestamps: true
});

// Create the Base Model
const Return = mongoose.model('Return', baseReturnSchema);

// Returned Sale Schema
const saleReturnSchema = new mongoose.Schema({
    customer: { type: mongoose.Types.ObjectId, ref: "Customer" },
    customerId: { type: String },
    transactionId: { type: String },
    invoiceNo: { type: Number },
    returnReason: { type: String },
}, { timestamps: true });

// Returned Purchase Schema
const purchaseReturnSchema = new mongoose.Schema({
    supplier: { type: mongoose.Types.ObjectId, ref: "Supplier" },
    supplierId: { type: String },
    transactionId: { type: String },
    invoiceNo: { type: Number },
    purchaseNo: { type: Number },
    purchaseOrderNumber: { type: Number },
    returnReason: { type: String },
}, { timestamps: true });

// Define Discriminators Correctly
const SaleReturn = Return.discriminator('SALE', saleReturnSchema);
const PurchaseReturn = Return.discriminator('PURCHASE', purchaseReturnSchema);

export { Return, SaleReturn, PurchaseReturn };
 */