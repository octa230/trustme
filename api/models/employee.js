import mongoose from "mongoose";


const employeeSchema = new mongoose.Schema({
    controlId: {type: String},
    userDetails: {
        id: {type: mongoose.Types.ObjectId, ref: "User"},
        username: {type: String}
    },
    address: {type: mongoose.Types.ObjectId, ref: "Address"},
    joiningDate: {type: Date},
    leaveDate: {type: Date},
    employeeId: {type: String},
    maritalStatus: {type: String},
    department: {type: String},
    shift: {type: String},
    weeklyHoliday: {type: String},
    bloodGroup: {type: String},
    salary: {type: Number}
})

const Employee = mongoose.model("Employee", employeeSchema)
export default Employee