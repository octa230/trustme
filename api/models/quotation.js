import mongoose from "mongoose";


const quotationSchema = new mongoose.Schema({
    QuotationNo: {type: Number},
    company: {type: mongoose.Types.ObjectId, ref:'Company'},
    controlId: {type: String},
    description: {type: String},
    items:[{
        name: {type: String},
        description:{type: String},
        qty: {type: Number},
        price: {type: Number},
        total: {type: Number}
    }],
    totalExVat: {type: Number},
    vatAmount: {type: Number},
    totalIncVat: {type: Number},
    discount: {type: Number},
    dicountTotal: {type: Number},
    paidBy: {type: String},
    paidFrom: {type: String}
})

const Quotation = mongoose.model('Quotation', quotationSchema)
export default Quotation