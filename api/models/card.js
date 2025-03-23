import mongoose from 'mongoose';

const cardSchema = new mongoose.Schema({
    cardName: {
        type: String,
        required: true,
        unique: true
    },
    cardNumber: {
        type: String,
        //required: true,
        //unique: true
    },
    cardType: {
        type: String,
        required: true,
        enum: ['credit', 'debit']
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

const Card = mongoose.model('Card', cardSchema);
export default Card;