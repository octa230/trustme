import mongoose from "mongoose"

const userSchema = mongoose.Schema({
    firstname: {type: String},
    lastname: {type: String},
    username: {type: String},
    isAdmin: {type: Boolean, default: false},
    password: {type: String},
    email: {type: String},
    phone: {type: String},

})

const User = mongoose.model('User', userSchema)
export default User