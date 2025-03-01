import asyncHandler from 'express-async-handler'
import {Router} from 'express'
import Quotation from '../../models/quotation.js'
import { generatePDF, sendPDF } from '../../utils.js'


const quotationRouter = Router()

quotationRouter.post('/', asyncHandler(async(req, res)=>{
    const {data, customer} = req.body
    
    const PdfBuffer = await generatePDF('QUOTE', data)
    
    if(PdfBuffer){
        const filename = 'quotation.pdf'
        sendPDF(PdfBuffer, filename)(req, res)
    }else{
        res.status(400).send('Invalid PDF type or failed to generate PDF')
    }
    
}))


export default quotationRouter


