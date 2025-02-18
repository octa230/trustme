import Bank from "../../models/bank.js";
import { Router } from "express";
import asyncHandler from "express-async-handler";


const bankRouter = Router()


///CREATE BANK
bankRouter.post('/', asyncHandler (async(req, res)=>{
    const {name, code} = req.body

    const exists = await Bank.findOne({name: name})
    if(exists){
        res.status(403).send({message: "bank already exists"})
        return
    }

    const bank = new Bank({
        name: name,
        code: code
    })

    await bank.save()
    res.status(200).send(bank)
}))


///DELETE BANK
bankRouter.delete('/:id', asyncHandler(async(req, res)=>{
    const bank = await Bank.findById(req.params.id)
    if(bank){
        await bank.deleteOne()
    }

    res.status(200).send({message: "Bank deleted"})
}))



///EDIT BANK
bankRouter.put('/:id', asyncHandler(async(req, res)=>{
    const {name, code} = req.body
    const bank = await Bank.findById(req.params.id)
    if(bank){
        bank.name = name,
        bank.code = code
        
    }
    await bank.save()
    res.status(200).send(bank)

}))



//GET ALL BANKS
bankRouter.get('/', asyncHandler(async(req, res)=> {
    const banks = await Bank.find()
    res.send(banks)
}))



export default bankRouter