import {Router} from 'express'
import { generateId, generatePDF, sendPDF } from '../../utils.js'
import asyncHandler from 'express-async-handler'
import Purchase from '../../models/purchase.js'

import Transaction from '../../models/transaction.js'


const purchaseRouter = Router()


class PurchaseClass{
    static async newPurchase(data){
        
        const docsCount = await Purchase.countDocuments()
        const purhcaseNo = isNaN(docsCount) ? 1 : docsCount + 1;


        const purchase = new Purchase({
            purchaseNo: purhcaseNo,
            controlId: await generateId(),
            supplier: data.supplier._id,
            supplierId: data.supplier.controlId,
            description: data.description,
            invoiceNo: data.invoiceNo,
            advanceTotal: data.advanceTotal,
            paidAmount: data.paidAmount,
            cashAmount: data.cashAmount,
            bankAmount: data.bankAmount,
            advanceAmount: data.advanceAmount,
            vatAmount: data.vatAmount

        })

        await purchase.save()

        const transaction = new Transaction({
            type: 'PURCHASE',
            items: data.items.map(item =>(
                {
                    item: item.name,
                    code: item.code,
                    qty: item.qty
                }
            )), 
            totalAmount: purchase.totalWithVat,
            vatAmount: purchase.vatAmount,
            controlId: purchase.controlId,
        })

        await transaction.save()
    }
}



///ONLY SAVE ACTION
purchaseRouter.post('/save', asyncHandler(async(req, res)=>{
    const {data} = req.body
    if(!data || !data.supplier || !data.items || data.items.length === 0){
        return res.status(400).send({message: "Incomplete data"})
    }
    try{
        await PurchaseClass.newPurchase(data)
        res.status(200).send({ message: 'Purchase saved successfully'});
    }catch(error){
        res.status(500).send({message: "Failed to save Purchase"})
        console.log(error)
    }
    
}))



///SAVE & PRINT ACTION
purchaseRouter.post('/', asyncHandler(async(req, res, next)=>{
    const { data } = req.body


    if(!data || !data.supplier || !data.items || data.items.length === 0){
        res.status(400).send({message: "Incomplete data"})
    }

    try{
        await PurchaseClass.newPurchase(data)
        res.status(200).send({ message: 'Purchase saved successfully'});

        const PdfBuffer = await generatePDF('PURCHASE', data)

        if(PdfBuffer){
            const filename = 'purchase.pdf'
            sendPDF(PdfBuffer, filename)(req, res)
        }else{
            res.status(400).send('Invalid PDF type or failed to generate PDF');
        }
        
    }catch(error){
        console.error('Error in save & print action:', error);
        res.status(500).send('Internal server error');
    }

}))



export default purchaseRouter