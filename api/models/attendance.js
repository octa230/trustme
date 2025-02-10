import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
    employee: {type: String},
    startTime: {type: Number},
    endTime: {type: Number},
    totalTime: {type: Number},
    overTimeStart: {type: Number},
    overTimeEnd: {type: Number},
    overTimeHours: {type: Number},
    attended: {type: Boolean, default: false}
})

const Attendance = mongoose.model('Attendance', attendanceSchema)
export default Attendance