import { Router } from "express";
import Bank from "../../models/bank.js";
import asyncHandler from "express-async-handler";
import BankTxn from "../../models/card.js";


const txnsRouter = Router()


txnsRouter.post('/', asyncHandler(async(req, res)=> {
    const txn = new BankTxn(req.body)

    await txn.save()

    const bank = await Bank.findOne({name: req.body.bankName})
    bank.balance = txn.amount
    res.send(txn)
}))



export default txnsRouter