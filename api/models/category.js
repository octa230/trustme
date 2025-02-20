import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: {type: String, required: true },
    code: {type: String, required: true, trim: true},
    file: {type: String}
})

const Category = mongoose.model('Category', categorySchema)
export default Category