import mongoose from "mongoose"


const addressSchema = new mongoose.Schema({
    street: {type: String},
    city: {type: String},
    state: {type: String},
    zipcode: {type: String},
    country: {type: String},
    location: {String}
})

const Address = mongoose.model('Address', addressSchema)
export default Address