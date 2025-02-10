import mongoose from "mongoose";
import Address from "./address.js";
import User from "./user.js";


const employeeSchema = new mongoose.Schema({
    controlId: {type: String},
    details: User,
    address: Address,
    joiningDate: {type: Date},
    leaveDate: {type: Date},
    employeeId: {type: String},
    maritalStatus: {type: String},
    department: {type: String},
    shift: {type: String},
    weeklyHoliday: {type: String},
    bloodGroup: {type: String}
})

const Employee = mongoose.model("Employee", employeeSchema)
export default Employee