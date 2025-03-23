import { Router } from "express";
import asyncHandler from 'express-async-handler'
import { AccountingService } from "../accounts/accountservice.js";

const reportsRouter = Router()

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

