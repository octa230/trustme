import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
    category: {type: String},
    name: {type: String },
    unit: {type: String},
    brand: {type: String},
    model: {type: String},
    barcode: {type: String},
    purchasePrice: {type: Number},
    salePrice: {type: Number},
    photo: {type: String},
    description: {type: String},
    note: {type: String}
})

const Item = mongoose.model("Item", itemSchema)
export default Item