import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
    name: {type: String},
    code: {type: String},
    type: {type: String, 
        enum:['Asset', 'Liability', 'Equity', 'Income', 'Expense'], required: true
    },
    balance: {type: Number, default: 0},
    controlId: {type: String},
}, 
{
    timestamps: true
})

const Account = mongoose.model('Account', accountSchema)
export default Account