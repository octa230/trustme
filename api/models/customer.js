import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
    name: {type: String},
    controlId: {type: String},
    mobile: {type: String},
    phone: {type: String},
    email: {type: String},
    region: {type: String},
    location: {type: String},
    trn: {type: String}
})


const Customer = mongoose.model('Customer', customerSchema)
export default Customer