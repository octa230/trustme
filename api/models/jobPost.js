import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    name: {type: String},
    description: {type: String},
    salary: {type: Number},
    occupied: {type: Boolean, default: false}
})

const Job = mongoose.model('Job', jobSchema)
export default Job