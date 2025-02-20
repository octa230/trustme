import mongoose from "mongoose";


const supplierSchema = new mongoose.Schema({
    name: {type: String},
    mobile: {type: String},
    phone: {type: String},
    email: {type: String},
    address: {type: String},
    trn: {type: String}
})

const Supplier = mongoose.model('Supplier', supplierSchema)
export default Supplier