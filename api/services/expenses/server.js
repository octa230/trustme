import { Router } from "express";
import asyncHandler from 'express'
import Expense from "../../models/expense.js";



const expenseRouter = Router()

expenseRouter.post('/', asyncHandler(async(req, res)=> {
    const {date, recieptNumber, expenseName, expenseAmount, expenseVat, totalExpense, paymentMethod, billFile, bankName, notes} = req.body 

    const expense = new Expense({
        date,
        recieptNumber,
        expenseName,
        expenseAmount,
        expenseVat,
        totalExpense,
        paymentMethod,
        billFile,
        bankName,
        notes,
    })

    await expense.save()
    res.status(200).send(expense)
}))

expenseRouter.post('/', asyncHandler(async(req, res)=>{
    
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
}))


export default expenseRouter