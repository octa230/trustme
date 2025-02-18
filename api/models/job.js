import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    name: {type: String},
    description: {type: String},
    salaryComment: {type: String},
    salary: {type: Number},
    occupied: {type: Boolean, default: false},
    employee: {type: String},
    department: {type: String}
})

const Job = mongoose.model('Job', jobSchema)
export default Job