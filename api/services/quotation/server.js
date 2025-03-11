import asyncHandler from 'express-async-handler'
import {Router} from 'express'
import Quotation from '../../models/quotation.js'
import { generateId, generatePDF, sendPDF, toWords } from '../../utils.js'
import Transaction from '../../models/transaction.js'
import Customer from '../../models/customer.js'
import Company from '../../models/company.js'


const quotationRouter = Router()



class QuotationClass{
    static async newQuotation(data){
        console.log(data)


        const qutoesCount = await Quotation.countDocuments()
        const quotationNo = isNaN(qutoesCount) ? 1 : qutoesCount + 1;

        const status = parseInt(data.status)

        const quotation = new Quotation({
            quotationNo: quotationNo,
            controlId: await generateId(),
            customer: data.customer._id,
            customerId: data.customer.controlId,
            customerName: data.customer.name,
            description: data.description,
            approved: false,
            totalWithoutVat: data.totalWithoutVat,
            itemsTotal: data.itemsTotal,
            vatAmount: data.vatAmount,
            vatRate: data.vatRate,
            totalWithVat: data.itemsWithVatTotal,
            totalAfterDiscount: data.totalAfterDiscount,
            discountAmount: data.discountAmount,
            preparedBy: data.employee.username,
            amountInWords: await toWords(data.totalAfterDiscount)
            
        })

        const newQuotation = await quotation.save()

        const transaction = new Transaction({
            type: 'QUOTATION',
            items: data.items.map(item => (
                {
                    name: item.name,
                    code: item.code,
                    qty: item.qty,
                    unit: item.unit,
                    vat: item.vat,
                    brand: item.brand,
                    purchasePrice: item.purchasePrice ,
                    salePrice: item.salePrice ,
                    total: item.total
                }
            )),
            totalAmount: quotation.totalWithVat,
            vatAmount: quotation.vatAmount,
            controlId: quotation.controlId
        })

        await transaction.save()

        return{
            quotationNo: newQuotation.quotationNo,
            controlId: newQuotation.controlId,
            customerId: newQuotation.customerId
        }
    }


    static async getPrintableQuote (quotationNo, controlId, customerId){
        console.log('Looking For:', quotationNo, controlId, customerId)

        const quotationDoc = await Quotation.findOne({quotationNo, controlId})
        if(!quotationDoc) throw new Error('Quotation Data Not Found')


        const customerDoc = await Customer.findOne({controlId: customerId})
        if(!customerDoc) throw new Error('Quotation Data Not Found')
        
        const transactionDoc = await Transaction.findOne({controlId})
        if(!transactionDoc) throw new Error('Quotation Data Not Found')


        const companyDoc = await Company.findOne({})
        if(!companyDoc) throw new Error('Quotation Data Not Found')


        const printableData = {
            quotation: quotationDoc.toObject ? quotationDoc.toObject()
                : JSON.parse(JSON.stringify(quotationDoc)) ,
            customer: customerDoc.toObject ? customerDoc.toObject()
                : JSON.parse(JSON.stringify(customerDoc)) ,
            transaction: transactionDoc.toObject ? transactionDoc.toObject()
                : JSON.parse(JSON.stringify(transactionDoc)) ,
            company: companyDoc ? (companyDoc.toObject ? companyDoc.toObject()
                : JSON.parse(JSON.stringify(companyDoc)))
                : null 
        }

        return printableData

    }
}




quotationRouter.post('/save', asyncHandler(async(req, res)=>{
    const { data } = req.body

    if(!data || !data.customer || !data.items || data.items.length === 0){
        return res.status(400).send({message: 'Incomplete data'})
    }

    try{
        await QuotationClass.newQuotation(data)
        res.status(200).send({message: 'Quotation data saved!'})
    }catch(error){
        res.status(500).send({message: "Failed to save Quotation Data"})
        console.log(error)
    }
}))

quotationRouter.post('/', asyncHandler(async(req, res)=> {
    const {data} = req.body

    if(!data || !data.customer || !data.items || data.items.length === 0){
        res.status(400).send({message: "Incomplete data"})
    }

    const {quotationNo, controlId, customerId} = await QuotationClass.newQuotation(data)
    const pdfData = await QuotationClass.getPrintableQuote(quotationNo, controlId, customerId)
    
    console.log(pdfData)
    const PdfBuffer = await generatePDF('QUOTATION', pdfData)
    if(PdfBuffer){
        const filename = `Quotation.pdf`
        sendPDF(PdfBuffer, filename)(req, res)
    }else{
        res.status(400).send('Invalid PDF type or system Faliure')
    }
}))


export default quotationRouter


