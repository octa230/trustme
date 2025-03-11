import mongoose from "mongoose";


const bankSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    controlId: {type: String, required: true, trim: true}
})

const Bank = mongoose.model('Bank', bankSchema)
export default Bank