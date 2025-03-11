import mongoose from "mongoose";


const customerSchema = new mongoose.Schema({
    name: {type: String, required: true, set: value => value.toLowerCase},
    controlId: {type: String},
    mobile: {type: String},
    phone: {type: String},
    email: {type: String},
    region: {type: String},
    location: {type: String},
    trn: {type: String},
    pendingAmount: {type: Number, default: 0}
})


customerSchema.index({name: 1}, {unique: true, collation: {locale:"en", strength: 2}})
//customerSchema.index({controlId: 1}, {unique: true, collation: {locale:"en", strength: 2}})

const Customer = mongoose.model('Customer', customerSchema)
export default Customer