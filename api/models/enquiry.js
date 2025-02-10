import mongoose from "mongoose";

itemSchema = mongoose.model({
    category: {type: String},
    item: {type: String},
    description: {type: String},
    purchasePrice: {type: Number},
    sellingPrice: {type: Number},
    quantity: {type: Number},
    inStock: {type: Number},
    vat: {type: Number},
    netAmount: {type: Number}
})

const enquirySchema = mongoose.Schema({
    enquiryNumber: {type: Number},
    controlId: {type: String},
    createdBy: {type: String},
    expiryDate: {type: Date},
    description: {type: String},
    customer: {type: mongoose.Types.ObjectId, ref: 'customer'},
    items: [itemSchema],
    subTotal: {type: Number},
    vat: {type: Number},
    fullTotal: {type: Number}

})

const Enquiry = mongoose.model('Enquiry', enquirySchema)
export default Enquiry