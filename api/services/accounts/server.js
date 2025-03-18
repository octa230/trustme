import { Router } from 'express'
import { AccountingService } from './accountservice.js'
import Account from '../../models/account.js'
import asyncHandler from 'express-async-handler'
import { generateId } from '../../utils.js'

const accountsRouter = Router()


///GET ACCOUNTS
accountsRouter.get('/', asyncHandler(async(req, res)=> {
    const accounts = await Account.find().sort({code: 1})
    res.send(accounts)
}))



////CREATE ACCOUNT
accountsRouter.post('/', asyncHandler(async(req, res)=> {

    const acctsLen = await Account.countDocuments()
    const accNo = acctsLen > 0 ? acctsLen + 1 : 1

    const newAccount = new Account({
        name: req.body.name,
        controlId: await generateId(),
        code: accNo.toString().padStart(4, '0'),
        type: req.body.type,
    })

    await newAccount.save()
    res.send(newAccount)
    
}))


export default accountsRouter