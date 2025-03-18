import {Router} from 'express'
import { generateId, generatePDF, sendPDF, toWords } from '../../utils.js'
import asyncHandler from 'express-async-handler'
import Purchase from '../../models/purchase.js'

import Transaction from '../../models/transaction.js'
import Company from '../../models/company.js'
import Supplier from '../../models/supplier.js'


const purchaseRouter = Router()


class PurchaseClass{
    static async newPurchase(data){
        
        console.log(data)

        const docsCount = await Purchase.countDocuments()
        const purhcaseNo = isNaN(docsCount) ? 1 : docsCount + 1;


        const status = parseInt(data.pendingAmount) == 0 ?
        false : true;


        const purchase = new Purchase({
            purchaseNo: purhcaseNo,
            controlId: await generateId(),
            supplier: data.supplier._id,
            supplierId: data.supplier.controlId,
            purchaseInvoiceNo: data.purchaseInvoiceNo,
            supplierName: data.supplier.name,
            description: data.description,
            status: status,
            totalWithoutVat: data.totalWithoutVat,
            itemsTotal: data.itemsTotal,
            vatAmount: data.vatAmount,
            vatRate: data.vatRate,
            totalWithVat: data.itemsWithVatTotal,
            totalAfterDiscount: data.totalAfterDiscount,
            discountAmount: data.discountAmount,
            pendingAmount: data.pendingAmount,
            paidAmount: data.paidAmount,
            invoiceDate: data.invoiceDate,
            paidAmount: data.paidAmount,
            cashAmount: data.cashAmount,
            cardAmount: data.cardAmount,
            bankAmount: data.bankAmount,
            advanceAmount: data.advanceAmount,
            amountInWords: await toWords(data.totalAfterDiscount)
            

        })

        const newPurchase = await purchase.save()

        const transaction = new Transaction({
            type: 'PURCHASE',
            items: data.items.map(item =>(
                {
                    name: item.name,
                    code: item.code,
                    qty: item.qty,
                    unit: item.unit,
                    vat: item.vat,
                    brand: item.brand,
                    purchasePrice: item.purchasePrice ,
                    salePrice: item.salePrice,
                    costAmount: item.unitCost,
                    total: item.total
                }
            )), 
            totalAmount: purchase.totalWithVat,
            vatAmount: purchase.vatAmount,
            controlId: purchase.controlId,
        })

        await transaction.save()


        return{
            purchaseNo: newPurchase.purchaseNo,
            controlId: newPurchase.controlId,
            supplierId: newPurchase.supplierId
        }
    }




    static async getPrintablePurchase (purchaseNo, controlId, supplierId){
        console.log('Looking For:', purchaseNo, controlId, supplierId)


        const purchaseDoc = await Purchase.findOne({purchaseNo, controlId})
        if(!purchaseDoc) throw new Error('purchase Not Found')

        const supplierDoc = await Supplier.findOne({controlId: supplierId})
        if(!supplierDoc) throw new Error('Supplier not found')

        const transactionDoc = await Transaction.findOne({controlId})
        if(!transactionDoc) throw new Error('Transaction not found')

        const companyDoc = await Company.findOne()


        const printableData = {
            purchase: purchaseDoc.toObject ? purchaseDoc.toObject() 
                : JSON.parse(JSON.stringify(purchaseDoc)),
            supplier: supplierDoc.toObject ? supplierDoc.toObject() 
                : JSON.parse(JSON.stringify(supplierDoc)),
            transaction: transactionDoc.toObject ? transactionDoc.toObject() 
                : JSON.parse(JSON.stringify(transactionDoc)),
            company: companyDoc ? (companyDoc.toObject ? companyDoc.toObject() 
                : JSON.parse(JSON.stringify(companyDoc))) 
                : null
        };

        return printableData
       
    }
}





purchaseRouter.get('/', asyncHandler(async(req, res)=>{
    const purchases = await Purchase.find({}).sort({createdAt: -1})
    res.status(200).send(purchases)

}))




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



///SAVE & PRINT PURCHASE ACTION 
purchaseRouter.post('/', asyncHandler(async(req, res, next)=>{
    const { data } = req.body


    if(!data || !data.supplier || !data.items || data.items.length === 0){
        res.status(400).send({message: "Incomplete data"})
    }

    try{
        const {purchaseNo, controlId, supplierId } = await PurchaseClass.newPurchase(data)

        const pdfData = await PurchaseClass.getPrintablePurchase(purchaseNo, controlId, supplierId)
        
        const PdfBuffer = await generatePDF('PURCHASE', pdfData)

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


purchaseRouter.get('/search', asyncHandler(async(req, res)=>{
    
    const { searchKey } = req.query

    if (!searchKey) {
        return res.status(400).send({ message: "Search key is required." });
    }

    const purchase = await Purchase.findOne({
        $or:[
            { controlId: searchKey },
            { purchaseNo: searchKey }
        ]
    })

    if(!purchase){
        return res.status(404).send({message: 'Purchase not found'})
    }

    const transaction = await Transaction.findOne({type:'PURCHASE', controlId: purchase.controlId})

    if(!transaction){
        return res.status(404).send({message: 'Items for this Purchase not found'})
    }

    purchase.items = [...transaction.items]
    res.status(200).send(purchase)
}))



export default purchaseRouter