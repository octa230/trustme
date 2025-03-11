import mongoose from "mongoose";


const returnSchema = new mongoose.Schema({
    controlId: {type: String},
    type: {type: String, Enumerator:['SALE', 'PURCHASE'], required: true },
    transactionId: {type: String},
    returnedTo: {type: String},
    returnedFrom: {type: String},

    //DYNAMIC OBJECTS DEPENDING ON TYPE
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', 
        required: function() { return this.type === 'SALE'; } },
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', 
        required: function() { return this.type === 'PURCHASE'; } },

    totalAmount: {type: Number},
    totalWithoutVat: {type: Number},
    itemsTotal: {type: Number},
    vatAmount: {type: Number},
    vatRate: {type: Number},
    totalWithVat: {type: Number},
    totalAfterDiscount: {type: Number},
    discountAmount: {type: Number},
    preparedBy: {type: Number},
    amountInWords: {type: String},



})