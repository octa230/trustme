import mongoose from "mongoose";

const stockSnapshotSchema = new mongoose.Schema({
    date: { type: Date, required: true, default: Date.now },
    products: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        purchasePrice: { type: Number, required: true },
    }],
}, { timestamps: true });

const StockSnapshot = mongoose.model('StockSnapshot', stockSnapshotSchema);
export default StockSnapshot;