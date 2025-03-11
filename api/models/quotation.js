import mongoose from "mongoose";


const quotationSchema = new mongoose.Schema({
    quotationNo: {type: Number},
    controlId: {type: String},
    customer: {type: mongoose.Types.ObjectId, ref:'Customer'},
    customerId: {type: String},
    customerName: {type: String},
    approved: {type: Boolean, default: false},
    description: {type: String},
    items:[{
        name: {type: String},
        description:{type: String},
        qty: {type: Number},
        price: {type: Number},
        total: {type: Number}
    }],
    totalWithoutVat: {type: Number},
    itemsTotal: {ype: Number},
    vatAmount: {type: Number},
    vatRate: {type: Number},
    totalWithVat: {type: Number},
    totalAfterDiscount: {type: Number},
    discountAmount: {type: Number},
    preparedBy: {type: String},
    amountInWords: {type: String}
})

const Quotation = mongoose.model('Quotation', quotationSchema)
export default Quotation