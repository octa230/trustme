import mongoose from "mongoose";


const unitSchema = mongoose.Schema({
    name: {type: String, required: true, unique: true},
    code: {type: String, required: true, unique: true},
})

const Unit = mongoose.model('Unit', unitSchema)
export default Unit