import {Router} from 'express'
import Sale from '../../models/sale.js'
import asyncHandler from 'express-async-handler'
import { generateId, generatePDF, sendPDF, toWords } from '../../utils.js';
import Transaction from '../../models/transaction.js';
import Company from '../../models/company.js';
import Customer from '../../models/customer.js';
import DeliveryNote from '../../models/deliveryNote.js';


const notesRouter = Router();


class DeliveryNoteClass{
    static async newNote(data){


        //console.log(data)

        const docsCount = await DeliveryNote.countDocuments()
        const deliveryNo = isNaN(docsCount) ? 1 : docsCount + 1

        const status = parseInt(data.pendingAmount) == 0 ?
        false : true;


        const note = new DeliveryNote({
            noteNo: deliveryNo,
            controlId: await generateId(),
            createdBy: data.employee.username,
            expiryDate: data.expiryDate,
            description: data.description,
            customer: data.customer._id,
            customerId: data.customer.controlId,
            customerName: data.customer.name,
            status: status, 
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

        const newNote = await note.save()

        const transaction = new Transaction({
            type: 'DELIVERY NOTE',
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
            itemsTotal: newNote.itemsTotal,
            totalAmount: newNote.totalWithVat,
            vatAmount: newNote.vatAmount,
            controlId: newNote.controlId
        })

        await transaction.save()

        return{
            noteNo: newNote.noteNo,
            controlId: newNote.controlId,
            customerId: newNote.customerId
        }

    }


    //retrieve saved sale by invoiceNo and controlId
    static async getPrintableNote(noteNo, controlId, customerId) {
        console.log("Looking for:", noteNo, controlId, customerId);
        
        // Get the documents
        const noteDoc = await DeliveryNote.findOne({ noteNo, controlId });
        if (!noteDoc) throw new Error('Sale not found');
        
        const customerDoc = await Customer.findOne({ controlId: customerId.toString() });
        if (!customerDoc) throw new Error('Customer not found');
        
        const transactionDoc = await Transaction.findOne({ controlId });
        if (!transactionDoc) throw new Error('Transaction not found');
        
        const companyDoc = await Company.findOne();
        
        // Create a plain object manually without using spread
        const printableData = {
            note: noteDoc.toObject ? noteDoc.toObject() 
                : JSON.parse(JSON.stringify(noteDoc)),
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




///SAVE Note
notesRouter.post('/save', asyncHandler(async(req, res)=>{
    const {data} = req.body
    if(!data || !data.customer || !data.items || data.items.length === 0){
        return res.status(400).send({message: "Incomplete Data"})
    }
    try{
        await DeliveryNoteClass.newSale(data)
        res.status(200).send({message: "Action completed Successfuly"})
    }catch(error){
        res.status(500).send({message: "failed to complete Action"})
        console.log(error)
    }
}))


///SAVE & PRINT SALE
notesRouter.post('/', asyncHandler(async(req, res)=>{
    
    const {data} = req.body
    


    if(!data || !data.customer || !data.items || data.items.length === 0){
        return res.status(400).send({message: "Incomplete data"})
    }

    try{
        const { noteNo, controlId, customerId } = await DeliveryNoteClass.newNote(data)

        
        const pdfData = await DeliveryNoteClass.getPrintableNote(noteNo, controlId, customerId)


        const pdfBuffer = await generatePDF('DELIVERY NOTE', pdfData )
        if(pdfBuffer){
            const filename = 'deliveryNote.pdf'
            sendPDF(pdfBuffer, filename)(req, res)
        }else{
            res.status(400).send('Invalid Pdf type or failed to generate PDF')
        }
    }catch(error){
        console.error('error in save & print action:', error)
        res.status(500).send('Internal server Error')
    }
}))


notesRouter.get('/', asyncHandler(async(req, res)=>{
    const  query = req.query

    const notes = await DeliveryNote.find({})
    res.send(notes).sort({createdAt: -1})
}))


export default notesRouter



