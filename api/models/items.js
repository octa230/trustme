import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
    category: {type: String},
    name: {type: String },
    inStock: {type: Number, default: 0},
    unit: {type: String},
    code: {type: String},
    brand: {type: String},
    purchased: {type: Number, default: 0},
    sold: {type: Number, default: 0},
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