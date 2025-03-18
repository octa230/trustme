import mongoose from "mongoose";

// Payment schema to track cash flow
const paymentSchema = new mongoose.Schema({
    paymentNo: { type: String, required: true, unique: true },
    controlId: {type: String},
    date: { type: Date, required: true, default: Date.now },
    paymentType: { type: String, required: true, enum: ['customer', 'supplier'] },



    // For customer payments
    customer: { type: mongoose.Types.ObjectId, ref: 'Customer' },
    customerId: { type: String },
    customerName: { type: String },



    // For supplier payments
    supplier: { type: mongoose.Types.ObjectId, ref: 'Supplier' },
    supplierId: { type: String },
    supplierName: { type: String },


    amount: { type: Number, required: true, default: 0 },
    paymentMethod: { type: String, enum: ['cash', 'bank', 'card'] },
    reference: { type: String },
    description: { type: String },
    status: { type: String, enum: ['draft', 'confirmed', 'void'], default: 'draft' },
    relatedDocuments: [{
      documentType: { type: String, enum: ['sale', 'purchase', 'return'] },
      documentId: { type: mongoose.Types.ObjectId, refPath: 'relatedDocuments.documentType' },
      documentNo: { type: String },
      documentId: {type: String},
      amount: { type: Number, default: 0 }
    }],
    createdBy: { type: mongoose.Types.ObjectId, ref: 'User' }
  }, { timestamps: true });

  const Payment = mongoose.model('Payment', paymentSchema)
  export default Payment