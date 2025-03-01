import {Router} from 'express'
import { generatePDF, sendPDF } from '../../utils.js'
import asyncHandler from 'express-async-handler'
import Purchase from '../../models/purchase.js'


const purchaseRouter = Router()

purchaseRouter.post('/', asyncHandler(async(req, res, next)=>{
    const {data, supplier } = req.body
    const PdfBuffer = await generatePDF('PURCHASE', data)

    if(PdfBuffer){
        const filename = 'purchase.pdf'
        sendPDF(PdfBuffer, filename)(req, res)
    }else{
        res.status(400).send('Invalid PDF type or failed to generate PDF');
    }
}))



export default purchaseRouter