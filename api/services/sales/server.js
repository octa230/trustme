import {Router} from 'express'
import Sale from '../../models/sale.js'
import asyncHandler from 'express-async-handler'
import { generateId, generatePDF, sendPDF, toWords } from '../../utils.js';
import Transaction from '../../models/transaction.js';
import Company from '../../models/company.js';
import Customer from '../../models/customer.js';


const salesRouter = Router();


class SalesClass{
    static async newSale(data){


        const docsCount = await Sale.countDocuments()
        const invoiceNo = isNaN(docsCount) ? 1 : docsCount + 1

        const status = parseInt(data.pendingAmount) == 0 ?
        false : true;


        const sale = new Sale({
            invoiceNo: invoiceNo,
            controlId: await generateId(),
            createdBy: data.employee.username,
            expiryDate: data.expiryDate,
            description: data.description,
            customer: data.customer._id,
            customerId: data.customer.controlId,
            customerName: data.customer.name,
            status: status, 
            totalWithoutVat: data.totalWithoutVat,
            itemsTotal: data.itemsWithVatTotal,
            vatAmount: data.vatAmount,
            totalWithVat: data.totalWithVatTotal,
            discountAmount: data.discountAmount,
            paidAmount: data.paidAmount,
            advanceAmount: data.advanceAmount, 
            totalAfterDiscount: data.totalAfterDiscount,
            pendingAmount: data.pendingAmount,
            cardAmount: data.cardAmount,
            bankAmount: data.bankAmount,
            cashAmount: data.cashAmount,
            paidBy: data.paidBy,
            paidFrom: data.paidFrom,
            chequeId: data.chequeId,
            vatRate: data.vatRate,
            amountInWords: await toWords(data.totalAfterDiscount)

        })

        const newSale = await sale.save()

        const transaction = new Transaction({
            type: 'SALE',
            items: data.items.map(item =>(
                {
                    name: item.name,
                    code: item.code,
                    qty: item.qty,
                    unit: item.unit,
                    vat: item.vat,
                    brand: item.brand,
                    purchasePrice: item.purchasePrice ,
                    salePrice: item.salePrice ,
                    netAmount: item.total
                }
            )),
            totalAmount: newSale?.totalWithVat,
            vatAmount: newSale?.vatAmount,
            controlId: newSale?.controlId
        })

        await transaction.save()

        return{
            invoiceNo: newSale.invoiceNo,
            controlId: newSale.controlId,
            customerId: newSale.customerId
        }

    }


    //retrieve saved sale by invoiceNo and controlId
    static async getPrintableSale(invoiceNo, controlId, customerId) {
        console.log("Looking for:", invoiceNo, controlId, customerId);
        
        // Get the documents
        const saleDoc = await Sale.findOne({ invoiceNo, controlId });
        if (!saleDoc) throw new Error('Sale not found');
        
        const customerDoc = await Customer.findOne({ controlId: customerId.toString() });
        if (!customerDoc) throw new Error('Customer not found');
        
        const transactionDoc = await Transaction.findOne({ controlId });
        if (!transactionDoc) throw new Error('Transaction not found');
        
        const companyDoc = await Company.findOne();
        
        // Create a plain object manually without using spread
        const printableData = {
            sale: saleDoc.toObject ? saleDoc.toObject() 
                : JSON.parse(JSON.stringify(saleDoc)),
            customer: customerDoc.toObject ? customerDoc.toObject() 
                : JSON.parse(JSON.stringify(customerDoc)),
            transaction: transactionDoc.toObject ? transactionDoc.toObject() 
                : JSON.parse(JSON.stringify(transactionDoc)),
            company: companyDoc ? (companyDoc.toObject ? companyDoc.toObject() 
                : JSON.parse(JSON.stringify(companyDoc))) 
                : null
        };
    
        //console.log(printableData)


        return printableData;
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
    


    if(!data || !data.customer || !data.items || data.items.length === 0){
        return res.status(400).send({message: "Incomplete data"})
    }

    try{
        const { invoiceNo, controlId, customerId } = await SalesClass.newSale(data)

        
        const pdfData = await SalesClass.getPrintableSale(invoiceNo, controlId, customerId)


        const pdfBuffer = await generatePDF('INVOICE', pdfData )
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


salesRouter.get('/', asyncHandler(async(req, res)=>{
    const  query = req.query

    const sales = await Sale.find({})
    res.send(sales)
}))


export default salesRouter



