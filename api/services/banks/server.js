import { generateId } from "../../utils.js";
import BankAccount from "../../models/bank.js";
import { Router } from "express";
import asyncHandler from "express-async-handler";


const bankRouter = Router()

//GET ALL BANKS
bankRouter.get('/', asyncHandler(async(req, res)=> {
    const banks = await BankAccount.find({})
    res.send(banks)
}))


///CREATE BANK
bankRouter.post('/', asyncHandler (async(req, res)=>{
    const { bankName, accountName, swift, IbanNumber, accountNumber, balance } = req.body
    console.log(req.body)

    const exists = await BankAccount.findOne({bankName: bankName})
    if(exists){
        res.status(403).send({message: "bank already exists"})
        return
    }

    const bank = new BankAccount({
        bankName: bankName,
        swift,
        accountName,
        IbanNumber,
        accountNumber,
        balance,
        controlId: await generateId()
    })

    await bank.save()
    res.status(200).send(bank)
}))


///DELETE BANK
bankRouter.delete('/:id', asyncHandler(async(req, res)=>{
    const bankAcc = await BankAccount.findById(req.params.id)
    if(bank){
        await bankAcc.deleteOne()
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






export default bankRouter