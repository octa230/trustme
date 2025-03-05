import {Router} from 'express'
import Sale from '../../models/sale.js'
import asyncHandler from 'express-async-handler'
import { generateId, generatePDF, sendPDF, toWords } from '../../utils.js';
import Transaction from '../../models/transaction.js';


const salesRouter = Router();


class SalesClass{
    static async newSale(data){
        const docsCount = await Sale.countDocuments()
        const invoiceNo = isNaN(docsCount) ? 1 : docsCount + 1


        const sale = new Sale({
            invoiceNo: invoiceNo,
            controlId: await generateId(),
            createdBy: data.employee.name,
            expiryDate: data.expiryDate,
            description: data.description,
            customer: data.customer._id,
            customerId: data.customer.controlId,
            totalWithoutVat: data.totalWithoutVat,
            vatAmount: data.vatAmount,
            totalWithVat: data.totalWithVatTotal,
            discountAmount: data.discountAmount,
            paidAmount: data.paidAmount,
            advanceAmount: data.advanceAmount, 
            pendingAmount: data.pendingAmount,
            paidBy: data.paidBy,
            paidFrom: data.paidFrom,
            chequeId: data.chequeId,
            vatRate: data.vatRate,
            amountInWords: await toWords(data.totalAfterDiscount)

        })

        await sale.save()

        const transaction = new Transaction({
            type: 'SALE',
            items: data.items.map(item =>(
                {
                    item: item.name,
                    code: item.code,
                    qty: item.qty
                }
            )),
            totalAmount: sale.totalWithVat,
            vatAmount: sale.vatAmount,
            controlId: sale.controlId
        })

        await transaction.save()

    }
} 




///SAVE SALE
salesRouter.post('/save', asyncHandler(async(req, res)=>{
    const {data} = req.body
    if(!data || !data.customer || !data.items || data.items.length === 0){
        return res.status(400).send({message: "Incomplete Data"})
    }
    try{
        await SalesClass.newSale(data)
        res.status(200).send({message: "sale completed Successfuly"})
    }catch(error){
        res.status(500).send({message: "failed to save sale"})
        console.log(error)
    }
}))


///SAVE & PRINT SALE
salesRouter.post('/', asyncHandler(async(req, res)=>{
    const {data} = req.body

    const totalString = await toWords(data?.totalAfterDiscount)
    const usableData = {...data, totalString}


    if(!data || !data.customer || !data.items || data.items.length === 0){
        return res.status(400).send({message: "Incomplete data"})
    }

    try{
        await SalesClass.newSale(data)

        const pdfBuffer = await generatePDF('INVOICE', usableData)
        if(pdfBuffer){
            const filename = 'invoice.pdf'
            sendPDF(pdfBuffer, filename)(req, res)
        }else{
            res.status(400).send('Invalid Pdf type or failed to generate PDF')
        }
    }catch(error){
        console.error('error in save & print action:', error)
        res.status(500).send('Internal server Error')
    }
}))




export default salesRouter



