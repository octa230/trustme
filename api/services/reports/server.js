import { Router } from "express";
import asyncHandler from 'express-async-handler'
import { AccountingService } from "../accounts/accountservice.js";

const reportsRouter = Router()

reportsRouter.get('/customer-ledger-general', asyncHandler(async(req, res)=>{
    console.log('request fired')
    try{
        const {account, entityType, startDate, endDate} = req.query

        const data = await AccountingService.getGeneralCustomerLedger(startDate, endDate)
        if(data){
            res.send(data)
        } 
    }catch(error){
        console.error('Error in customer-ledger-general:', error);
        res.status(500).send({ error: 'Failed to fetch general customer ledger' });
    }
}))

reportsRouter.get('/supplier-ledger-general', asyncHandler(async(req, res)=>{
    console.log('request fired')
    try{
        const {account, entityType, startDate, endDate} = req.query

        const data = await AccountingService.getGeneralSupplierLedger(startDate, endDate)
        if(data){
            res.send(data)
        } 
    }catch(error){
        console.error('Error in customer-ledger-general:', error);
        res.status(500).send({ error: 'Failed to fetch general customer ledger' });
    }
}))


reportsRouter.get('/trial-balance', asyncHandler(async(req, res)=> {
    try{
        const {date} = req.query
        const trialBalance = await AccountingService.generateTrialBalance(
        date ? new Date(date) : new Date()
    )
    res.status(200).send(trialBalance)
    }catch(error){
        console.log(error)
    }
}))

export default reportsRouter

