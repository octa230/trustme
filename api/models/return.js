import mongoose from "mongoose";

const returnSchema = new mongoose.Schema({
    // Document Identification
    returnNo: { type: String, required: true, unique: true },
    controlId: { type: String, required: true, unique: true },
    date: { type: Date, default: Date.now },
    status: { 
        type: String, 
        enum: ['draft', 'confirmed', 'processed', 'void'], 
        default: 'draft' 
    },
    
    // Return Classification
    returnType: { 
        type: String, 
        enum: ['customer', 'supplier'], 
        required: true 
    },
    returnReason: { type: String },
    description: { type: String },

    // Original Document Reference
    originalDocument: {
        type: { type: String, enum: ['sale', 'purchase'], required: true },
        documentId: { 
            type: mongoose.Schema.Types.ObjectId, 
            refPath: 'originalDocument.type',
            required: true 
        },
        documentNo: { type: String, required: true }
    },

    // Party Information (customer or supplier)
    party: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'partyType',
        required: true
    },
    partyType: {
        type: String,
        enum: ['Customer', 'Supplier'],
        required: true
    },
    partyId: { type: String, required: true },
    partyName: { type: String, required: true },

    // Financial Information
    items: [{
        //product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        productCode: { type: String, required: true },
        productName: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        unitPrice: { type: Number, required: true, min: 0 },
        vatRate: { type: Number, default: 0 },
        total: { type: Number, required: true, min: 0 }
    }],
    
    subtotal: { type: Number, default: 0 },
    vatAmount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    amountInWords: { type: String },

    // Processing Information
    refundDetails: {
        method: { type: String, enum: ['cash', 'bank', 'card', 'credit'] },
        amount: { type: Number, default: 0 },
        reference: { type: String },
        processedDate: { type: Date }
    },
    
    // System Information
    createdBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    processedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    notes: { type: String }

}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for return type display
returnSchema.virtual('displayType').get(function() {
    return this.returnType === 'customer' ? 'Customer Return' : 'Supplier Return';
});

// Pre-save hook to calculate totals
returnSchema.pre('save', function(next) {
    if (this.isModified('items')) {
        this.subtotal = this.items.reduce((sum, item) => sum + item.total, 0);
        this.vatAmount = this.items.reduce((sum, item) => sum + (item.total * item.vatRate), 0);
        this.totalAmount = this.subtotal + this.vatAmount;
    }
    next();
});

// Indexes for better query performance
returnSchema.index({ returnNo: 1 });
returnSchema.index({ controlId: 1 });
returnSchema.index({ 'originalDocument.documentId': 1 });
returnSchema.index({ party: 1 });
returnSchema.index({ status: 1 });
returnSchema.index({ date: 1 });

const Return = mongoose.model('Return', returnSchema);
export default Return;