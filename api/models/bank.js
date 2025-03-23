import mongoose from 'mongoose';

const bankAccountSchema = new mongoose.Schema({
    accountName: {
        type: String,
        //required: true,
        //unique: true
    },
    swift:{
        type: String
    },
    IbanNumber:{
        type: String
    },

    controlId:{
        type: String,
        required: true
    },
    bankName: {
        type: String,
        //«required: true
    },
    accountNumber: {
        type: String,
        //required: true,
        //unique: true
    },
    balance: {
        type: Number,
        required: true,
        default: 0
    },
    currency: {
        type: String,
        //required: true,
        default: 'AED'
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

const BankAccount = mongoose.model('BankAccount', bankAccountSchema);
export default BankAccount;

















/* import mongoose from "mongoose";



const bankSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    controlId: {type: String, required: true, trim: true},
    balance: {type: Number, default: 0},
})

const Bank = mongoose.model('Bank', bankSchema)
export default Bank */