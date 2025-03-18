import { Router } from "express";
import asyncHandler from 'express-async-handler'
import Transaction from "../../models/transaction.js";
import { generateId } from "../../utils.js";
import Item from "../../models/items.js";
//import { SaleReturn, PurchaseReturn } from "../../models/return.js";
import mongoose from "mongoose";



const returnRouter = Router()


class ReturnProcessor {
    constructor({
        sale,
        purchase,
        employee,
        type,
        vatRate,
        pendingAmount,
        vatAmount,
        totalAfterDiscount,
        totalWithoutVat,
        itemsWithVatTotal,
        discountAmount,
        advanceTotal,
        paidAmount,
        cardAmount,
        advanceAmount
    }) {
      this.controlId = purchase ? purchase.controlId : sale.controlId;
      this.vatRate = vatRate;
      this.items = purchase ? purchase.items : sale.items;
      this.employee = employee.username;
      this.customerId = sale?.customerId;
      this.customer = sale?.customer
      this.supplierId = purchase?.supplierId;
      this.supplier = purchase?.supplier
      this.type = type;
      this.originalTxn = null;
      this.returnTxn = null;
    }
    
    async start() {
      // No session/transaction needed
      return this;
    }
    
    async findSavedTxn() {
      this.originalTxn = await Transaction.findOne({ controlId: this.controlId });
      if (!this.originalTxn) throw new Error('Saved Transaction not found');
      return this;
    }
    
    async updateItems() {
      const updates = this.items.map((item) => {
        const qtyChange = this.type === 'SALE' ? item.qty : -item.qty;
        return Item.updateOne(
          { controlId: item.controlId },
          { $inc: { qty: qtyChange }}
        );
      });
      await Promise.all(updates);
      return this;
    }
    
    async recalculateTxnTotals() {
        const updatedItems = await Item.find({
            controlId: { $in: this.items.map((i) => i.controlId) },
        }).lean();
    
        console.log('Updated Items:', updatedItems);
    
        // Ensure qty and salePrice are valid numbers
        const itemsTotal = updatedItems.reduce((acc, item) => {
            const price = parseFloat(item.salePrice) || 0;
            const qty = parseFloat(item.qty) || 0;
            const subtotal = price * qty;
            console.log(`Item ${item.controlId}: Price=${price}, Qty=${qty}, Subtotal=${subtotal}`);
            return acc + subtotal;
        }, 0);
    
        // Validate vatRate
        const vatRate = parseFloat(this.vatRate) || 0;
        const vatAmount = itemsTotal * vatRate;
        const totalAmount = itemsTotal + vatAmount;
    
        console.log(`Items Total: ${itemsTotal}, VAT Rate: ${vatRate}, VAT Amount: ${vatAmount}, Total Amount: ${totalAmount}`);
    
        // Validate final result
        if (isNaN(totalAmount)) {
            throw new Error("Calculation error: totalAmount is NaN");
        }
    
        this.originalTxn.itemsTotal = itemsTotal;
        this.originalTxn.vatAmount = vatAmount;
        this.originalTxn.totalAmount = totalAmount;
    
        await this.originalTxn.save();
        return this;
    }
    
    /* async recalculateTxnTotals() {
      const updatedItems = await Item.find({
        controlId: { $in: this.items.map((i) => i.controlId) }
      }).lean();
      
      const itemsTotal = updatedItems.reduce((acc, item) => acc + item.salePrice * item.qty, 0);
      const vatAmount = itemsTotal * this.vatRate;
      const totalAmount = itemsTotal + vatAmount;
      
      this.originalTxn.itemsTotal = itemsTotal;
      this.originalTxn.vatAmount = vatAmount;
      this.originalTxn.totalAmount = totalAmount;
      
      await this.originalTxn.save();
      return this;
    } */
    
    async newReturnTxn() {
      const returnTxn = await Transaction.create({
        type: "RETURN",
        items: this.items,
        totalAmount: this.originalTxn.totalAmount,
        employeeId: this.employeeId,
        controlId: await generateId()
      });
      
      this.returnTxn = returnTxn;
      return this;
    }
    
    async newReturnDoc() {
      const returnDocData = {
        controlId: await generateId(),
        type: this.type,
        transactionId: this.returnTxn.controlId,
        totalAmount: this.originalTxn.totalAmount,
        vatAmount: this.originalTxn.vatAmount,
        preparedBy: this.employee.controlId
      };
      
      if (this.type === 'SALE') {
        returnDocData.customerId = this.customerId;
        await SaleReturn.create(returnDocData);
      } else if (this.type === 'PURCHASE') {
        returnDocData.supplierId = this.supplierId;
        await PurchaseReturn.create(returnDocData);
      } else {
        throw new Error('Invalid Return type Specified');
      }
      
      return this;
    }
    
    async commit() {
      // No transaction to commit
      return {
        transactionId: this.returnTxn.controlId,
        totalAmount: this.returnTxn.totalAmount
      };
    }
    
    async abort(error) {
      // Can't rollback without transactions, would need manual cleanup code here
      throw new Error(`Return process failed: ${error.message}`);
    }
  }

///WE ARE NOT PRINTING RETURNS SO WE HAVE SAVE AS THE DEFAULT ROUTE
returnRouter.post('/save', asyncHandler(async(req, res) => {
    const {data} = req.body;

    console.log('Received data:', data); // Debugging step 1

    const { purchase, sale, employee, type, vatRate } = data;

    if (!purchase && !sale) {
        console.log('Validation failed: missing purchase and sale');
        return res.status(400).json({ message: 'purchase or sale needed' });
    }

    const usableData = () => {
        if (purchase && purchase.type === 'PURCHASE') {
            console.log('Using purchase data:', purchase);
            return {
                controlId: purchase.controlId,
                items: purchase.items,
                supplierId: purchase.supplierId,
                vatRate: purchase.vatRate,
                type: purchase.type
            };
        } else if (sale && sale.type === 'SALE') {
            console.log('Using sale data:', sale);
            return {
                controlId: sale.controlId,
                items: sale.items,
                customerId: sale.customerId,
                vatRate: sale.vatRate,
                type: sale.type
            };
        } else {
            console.log('No purchase, no sale found');
            return null;
        }
    };
    

    const selectedData = usableData();

    if (!selectedData) {
        return res.status(400).json({ message: 'Invalid data: purchase or sale information is required.' });
    }

    const processor = new ReturnProcessor({
        purchase,
        sale,
        employee,
        items: selectedData?.items,
        type: selectedData.type || type,
        vatRate
    });

    try {
        console.log('Starting the return process'); // Debugging step 3

        await processor.start();
        console.log('Started session and transaction'); // Debugging step 4

        await processor.findSavedTxn();
        console.log('Saved transaction found'); // Debugging step 5

        await processor.updateItems();
        console.log('Items updated'); // Debugging step 6

        await processor.recalculateTxnTotals();
        console.log('Transaction totals recalculated'); // Debugging step 7

        await processor.newReturnTxn();
        console.log('New return transaction created'); // Debugging step 8

        await processor.newReturnDoc();
        console.log('Return document created'); // Debugging step 9

        const result = await processor.commit();
        console.log('Transaction committed'); // Debugging step 10

        res.status(200).json({ message: "Return processed successfully", data: result });
    } catch (error) {
        console.error('Error during return process:', error); // Debugging step 11
        await processor.abort(error);
        res.status(500).json({ message: error.message });
    }
}));



export default returnRouter