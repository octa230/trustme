import mongoose from "mongoose";

const departmentSchema = mongoose.Schema({
    name: {type: String},
    controlId: {type: String}
})