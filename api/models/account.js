import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
    controlId: {type: String, unique: true},
    name: {type: String}, //ACCOUNT NAME LIKE CASH ACCOUNTS_RECIEVABLE
    code: {type: String},
    type: {type: String, 
        enum:['asset', 'liability', 'equity', 'revenue', 'expense'], required: true
    },
    isActive: {type: Boolean, default: true},
    balance: {type: Number, default: 0}
}, 
{
    timestamps: true
})

const Account = mongoose.model('Account', accountSchema)
export default Account