import {Router} from "express"
import asyncHandler from 'express-async-handler'
import Supplier from "../../models/supplier.js"

const supplierRouter = Router()

supplierRouter.post('/', asyncHandler(async(req, res)=>{
    const {name, mobile, phone, email, address, trn} = req.body
    const supplier = new Supplier({
        name, 
        mobile, 
        phone, 
        email, 
        address, 
        trn
    })
    await supplier.save()
    res.status(200).send(supplier)
}))


supplierRouter.delete('/:id', asyncHandler(async(req, res)=> {
    const supplier = await Supplier.findByIdAndDelete(req.params.id)

    if(!supplier) return res.status(404).send({message: "supplier not found"})

    res.status(200).send({message: "Supplier deleted"})
}))


supplierRouter.put('/:id', asyncHandler(async(req, res)=> {
    
    const {name, mobile, phone, email, address, trn} = req.body

    const supplier = await Supplier.findById(req.params.id)

    if(!supplier){
        res.status(404).send({message: "supplier not found"})
        return
    }

    if(name) supplier.name = name
    if(mobile) supplier.mobile = mobile
    if(phone) supplier.phone = phone
    if(email) supplier.email = email
    if(address) supplier.address = address
    if(trn) supplier.trn = trn

    await supplier.save()
    res.status(200).send(supplier)
}))


supplierRouter.get('/', asyncHandler(async(req, res)=>{
    const suppliers = await Supplier.find()
    res.status(200).send(suppliers)
}))








export default supplierRouter