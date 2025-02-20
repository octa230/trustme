import {Router} from "express";
import Customer from "../../models/customer.js";
import asyncHandler from "express-async-handler";
import { generateId } from "../../utils.js";




const customerRouter = Router()


customerRouter.post('/', asyncHandler(async(req, res)=>{
    
    const {name, mobile, phone, email, region, address, trn} = req.body

    const customer = new Customer({
        name, 
        controlId: await generateId(),
        mobile, 
        phone, 
        email, 
        region, 
        address, 
        trn
    })

    await customer.save()
    res.status(200).send(customer)
}))

customerRouter.delete('/:id', asyncHandler(async(req, res)=>{
    const customer = await Customer.findByIdAndDelete(req.params.id)
    if(!customer){
        res.status(404).send({message: "customer not found"})
    }
    res.status(200).send({message: "Customer deleted"})
}))


customerRouter.put('/:id', asyncHandler(async(req, res)=> {
    const {name, mobile, phone, email, region, address, trn} = req.body

    const customer = await Customer.findById(req.params.id)
    
    if(!customer){
        res.status(404).send({message: "customer not found"})
        return
    }

    if (name) customer.name = name;
    if (mobile) customer.mobile = mobile;
    if (phone) customer.phone = phone;
    if (email) customer.email = email;
    if (region) customer.region = region;
    if (address) customer.address = address;
    if (trn) customer.trn = trn;

    await customer.save()
    res.status(200).send(customer) 
})) 


customerRouter.get('/', asyncHandler(async(req, res)=>{
    const customers = await Customer.find()

    res.status(200).send(customers)
}))

export default customerRouter