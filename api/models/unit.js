import mongoose from "mongoose";

const unitSchema = mongoose.Schema({
    name: {type: String, required: true},
    code: {type: String, required: true},
})

const Unit = mongoose.model('Unit', unitSchema)
export default Unit