import mongoose from "mongoose";


const transactionSchema = new mongoose.Schema({
    type: { type: String, required: true },
    controlId: { type: String },
    totalAmount: { type: Number },
    vatAmount: { type: Number },
    paymentType: { type: String, enum: ['cash', 'card', 'bank'] },
    items: [
        {
            category: { type: String },
            name: { type: String },
            qty: { type: Number, default: 0 },
            returned: { type: Number, default: 0 },
            vat: { type: Number, default: 0 },
            unit: { type: String },
            total: { type: Number, default: 0 },
            code: { type: String },
            brand: { type: String },
            model: { type: String },
            barcode: { type: String },
            purchasePrice: { type: Number, default: 0 },
            salePrice: { type: Number, default: 0 },
            costAmount: { type: Number, default: 0 },
            photo: { type: String },
            description: { type: String },
            note: { type: String }
        }
    ],
}, { timestamps: true });

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;