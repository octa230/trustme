import { Router } from "express";
import asyncHandler from 'express-async-handler'
import Expense from "../../models/expense.js";
import { Account } from "../../models/account.js";
import { AccountingService } from "../accounts/accountservice.js";



const expenseRouter = Router()

expenseRouter.get('/', asyncHandler(async(req, res)=>{

    console.log('expenses triggered')
    const exps = await Expense.find({})
    res.send(exps)
}))



expenseRouter.post('/', asyncHandler(async(req, res)=>{
    
}))

expenseRouter.post('/', asyncHandler(async(req, res)=> {
   const{
    date,
    paymentMethod,
    recieptNumber,
    account,
    amount,
    vat,
    bankName,
    totalAmount,
    cardAmount,
    bankAmount,
    cashAmount,
    billFile,
    notes 
} = req.body

    const dbAccount = await Account.findById(account)

    const expense = new Expense({
        date,
        account,
        amount,
        name: dbAccount.name,
        recieptNumber,
        amount,
        vat,
        totalAmount,
        cardAmount,
        bankAmount,
        cashAmount,
        paymentMethod,
        billFile,
        bankName,
        notes,
    })

    const dbExpense = await expense.save()
    console.log(dbExpense)

    await AccountingService.createExpense(dbExpense)
    res.status(200).send(expense)
}))

/* expenseRouter.post('/:id', asyncHandler(async(req, res)=>{
    
    const {date, recieptNumber, expenseName, expenseAmount, expenseVat, totalExpense, paymentMethod, billFile, bankName, notes} = req.body 

    const expense = await Expense.findById(req.params.id)

    if(!expense) return res.status(204).send({message: "user not found"}) 

        if(date) expense.date = date
        if(recieptNumber) expense.recieptNumber = recieptNumber
        if(expenseName) expense.expenseName = expenseName
        if(expenseAmount) expense.expenseAmount = expenseAmount
        if(expenseVat) expense.expenseVat = expenseVat
        if(totalExpense) expense.totalExpense = totalExpense
        if(paymentMethod) expense.paymentMethod = paymentMethod
        if(billFile) expense.billFile = billFile
        if(bankName) expense.bankName = bankName
        if(notes) expense.notes = notes

    await expense.save()
    res.send(expense)
})) */


export default expenseRouter