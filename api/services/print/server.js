import asynchHandler from "express-async-handler";
import { Router } from "express";
import { generatePDF } from "../../utils.js";

const printRouter = Router()


printRouter.post('/', asynchHandler(async(req, res)=>{
    console.log(type)
    //generatePDF()
}))



export default printRouter