import mongoose from 'mongoose';

const cashSchema = new mongoose.Schema({
    accountName: {
        type: String,
        required: true,
        unique: true,
        default: 'Cash Account'
    },
    balance: {
        type: Number,
        required: true,
        default: 0
    },
    currency: {
        type: String,
        required: true,
        default: 'AED'
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

const Cash = mongoose.model('Cash', cashSchema);
export default Cash;













/* import mongoose from "mongoose";


const cashSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    controlId: {type: String, required: true, trim: true},
    balance: {type: Number, default: 0},
})

const CashAccount = mongoose.model('Cash', cashSchema)
export default CashAccount */