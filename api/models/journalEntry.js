import mongoose from 'mongoose';


const journalEntrySchema = new mongoose.Schema({
    date: {type: Date, default: Date.now},
    referenceType:{type: String, Enumerator:['sale', 'purchase','return', 'payment', 'reciept', 'adjustment']},
    referenceId: {type: mongoose.Types.ObjectId, refPath: 'referenceType'},
    controlNo: {type: String},
    referenceNumber: {type: String},
    description: {type: String},
    postingStatus: {type: String, Enumerator:['draft', 'posted'], default: 'draft'},
    createdBy: {type: String},
    entries:[{
        account: {type: mongoose.Types.ObjectId, ref: 'Account'},
        accountId: {type: String },
        description: {type: String},
        debit: {type: Number},
        credit: {type: Number},
    }],
    totalDebit: {type: Number},
    totalCredit: {type: Number}
}, {timestamps: true})

const JournalEntry = mongoose.model('JournalEntry', journalEntrySchema)
export default JournalEntry 