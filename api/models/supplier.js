import mongoose from "mongoose";
import Address from "./address";

const supplierSchema = new mongoose.Schema({
    name: {type: String},
    mobile: {type: String},
    phone: {type: String},
    email: {type: String},
    address: Address,
    trn: {type: String}
})

const Supplier = mongoose.model('Supplier', supplierSchema)
export default Supplier