import { Router } from "express";
import asyncHandler from 'express-async-handler'
import Transaction from "../../models/transaction.js";
import { generateId } from "../../utils.js";
import Item from "../../models/items.js";
import Return from "../../models/return.js";
import { toWords } from "../../utils.js";
import mongoose from "mongoose";



const returnRouter = Router()


class ReturnProcessor {
  /**
   * Processes a return (sale or purchase)
   * @param {Object} params - Return parameters
   * @returns {Object} - Result of the return process
   */
  static async processReturn(params) {
    try {
      // Validate input parameters
      this._validateParams(params);

      // Find the original transaction
      const originalTxn = await this._findOriginalTransaction(params);
      
      // Process the return
      const result = await mongoose.connection.transaction(async (session) => {
        // Update item quantities
        await this._updateItemQuantities(params, session);
        
        // Recalculate transaction totals
        await this._recalculateTransactionTotals(originalTxn, params.vatRate, session);
        
        // Create return transaction
        const returnTxn = await this._createReturnTransaction(params, originalTxn, session);
        
        // Create return document
        const returnDoc = await this._createReturnDocument(params, returnTxn, session);
        
        return {
          transactionId: returnTxn.controlId,
          returnId: returnDoc.controlId,
          totalAmount: returnTxn.totalAmount
        };
      });

      return result;
    } catch (error) {
      console.error('Return processing failed:', error);
      throw new Error(`Return processing failed: ${error.message}`);
    }
  }

  /**
   * Validates input parameters
   * @param {Object} params - Return parameters
   */
  static _validateParams(params) {
    if (!params) throw new Error('Missing return parameters');
    if (!params.type || !['SALE', 'PURCHASE'].includes(params.type)) {
      throw new Error('Invalid return type specified');
    }
    if (!params.items || !params.items.length) {
      throw new Error('No items specified for return');
    }
    if (params.type === 'SALE' && !params.sale) {
      throw new Error('Sale information required for sale return');
    }
    if (params.type === 'PURCHASE' && !params.purchase) {
      throw new Error('Purchase information required for purchase return');
    }
  }

  /**
   * Finds the original transaction
   * @param {Object} params - Return parameters
   * @returns {Object} - Original transaction
   */
  static async _findOriginalTransaction(params) {
    const controlId = params.purchase ? params.purchase.controlId : params.sale.controlId;
    const originalTxn = await Transaction.findOne({ controlId });
    
    if (!originalTxn) {
      throw new Error(`Original transaction not found for controlId: ${controlId}`);
    }
    
    return originalTxn;
  }

  /**
   * Updates item quantities
   * @param {Object} params - Return parameters
   * @param {Object} session - MongoDB session
   */
  static async _updateItemQuantities(params, session) {
    const updates = params.items.map((item) => {
      const qtyChange = params.type === 'SALE' ? -item.qty : item.qty;
      return Item.updateOne(
        { controlId: item.controlId },
        { $inc: { qty: qtyChange } },
        { session }
      );
    });
    
    await Promise.all(updates);
  }

  /**
   * Recalculates transaction totals
   * @param {Object} originalTxn - Original transaction
   * @param {Number} vatRate - VAT rate
   * @param {Object} session - MongoDB session
   */
  static async _recalculateTransactionTotals(originalTxn, vatRate, session) {
    const updatedItems = await Item.find({
      controlId: { $in: originalTxn.items.map(i => i.controlId) }
    }).session(session).lean();

    const itemsTotal = updatedItems.reduce((acc, item) => {
      const price = parseFloat(item.salePrice) || 0;
      const qty = parseFloat(item.qty) || 0;
      return acc + (price * qty);
    }, 0);

    const vatAmount = itemsTotal * (parseFloat(vatRate) || 0);
    const totalAmount = itemsTotal + vatAmount;

    originalTxn.itemsTotal = itemsTotal;
    originalTxn.vatAmount = vatAmount;
    originalTxn.totalAmount = totalAmount;

    await originalTxn.save({ session });
  }

  /**
   * Creates return transaction
   * @param {Object} params - Return parameters
   * @param {Object} originalTxn - Original transaction
   * @param {Object} session - MongoDB session
   * @returns {Object} - Created return transaction
   */
  static async _createReturnTransaction(params, originalTxn, session) {
    const returnTxn = await Transaction.create([{
      type: "RETURN",
      items: params.items,
      totalAmount: originalTxn.itemsWithVatTotal,
      employeeId: params.employee._id,
      controlId: await generateId(),
      originalTransactionId: originalTxn._id
    }], { session });

    return returnTxn[0];
  }

  /**
   * Creates return document
   * @param {Object} params - Return parameters
   * @param {Object} returnTxn - Return transaction
   * @param {Object} session - MongoDB session
   * @returns {Object} - Created return document
   */
  static async _createReturnDocument(params, returnTxn, session) {
    const returnDocData = {
      controlId: await generateId(),
      type: params.type,
      transactionId: returnTxn.controlId,
      totalAmount: returnTxn.itemsWithVatTotal,
      vatAmount: returnTxn.vatAmount,
      preparedBy: params.employee.controlId
    };

    if (params.type === 'SALE') {
      returnDocData.customerId = params.customerId;
      return await SaleReturn.create([returnDocData], { session })[0];
    } else {
      returnDocData.supplierId = params.supplierId;
      return await PurchaseReturn.create([returnDocData], { session })[0];
    }
  }
}

returnRouter.get('/customers', asyncHandler(async(req, res)=> {
  const returns = await Return.find({returnType: "customer"})
  res.send(returns)
}))

returnRouter.get('/suppliers', asyncHandler(async(req, res)=> {
  const returns = await Return.find({returnType: "supplier"})
  res.send(returns)
}))

///WE ARE NOT PRINTING RETURNS SO WE HAVE SAVE AS THE DEFAULT ROUTE
returnRouter.post('/save', asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { data } = req.body;
    console.log('Processing return with data:', JSON.stringify(data, null, 2));

    // Validate input
    if (!data) throw new Error('No data provided');
    if (!data.items?.length) throw new Error('No items provided');
    if (!data.employee) throw new Error('Employee information required');

    const { purchase, sale, employee, items } = data;

    // Determine return type and validate
    let returnType, originalDoc, partyInfo;
    if (purchase) {
      returnType = 'supplier';
      originalDoc = {
        type: 'purchase',
        documentId: purchase._id,
        documentNo: purchase.controlId
      };
      partyInfo = {
        party: purchase.supplier,
        partyType: 'Supplier',
        partyId: purchase.supplierId,
        partyName: purchase.supplierName
      };


    } else if (sale) {
      returnType = 'customer';
      originalDoc = {
        type: 'sale',
        documentId: sale._id,
        documentNo: sale.controlId
      };
      partyInfo = {
        party: sale.customer,
        partyType: 'Customer',
        partyId: sale.customerId,
        partyName: sale.customerName
      };
    } else {
      throw new Error('Either purchase or sale data required');
    }

    

    // Calculate financials
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const vatAmount = items.reduce((sum, item) => sum + (item.vat || 0), 0);
    const totalAmount = subtotal + vatAmount;

    // Prepare return document
    const returnDoc = new Return({
      returnNo: await generateReturnNumber(returnType),
      controlId: await generateId(),
      returnType,
      originalDocument: originalDoc,
      ...partyInfo,
      items: items.map(item => ({
        product: item.productId, // Make sure to include product reference
        productCode: item.code,
        productName: item.name,
        quantity: item.qty,
        unitPrice: item.salePrice,
        vatRate: item.vatRate || data.vatRate || 0,
        total: item.total
      })),
      subtotal,
      vatAmount,
      totalAmount, // This was missing in your original code
      amountInWords: await toWords(totalAmount),
      status: 'confirmed',
      createdBy: employee._id,
      description: data.description || `${returnType} return`
    });

    // 1. Save return document (in session)
    const savedReturn = await returnDoc.save({ session });
    console.log('Return document saved:', savedReturn.returnNo);

    // 2. Update original transaction (if needed)
    if (data) {
      await Transaction.updateOne(
        { _id: originalDoc.documentId },
        { 
          $inc: { 
            'items.$[elem].returned': data.items[0].qty,
            totalAmount: -totalAmount // Deduct from original transaction
          },
          $set: { updatedAt: new Date() }
        },
        { 
          arrayFilters: [{ 'elem.productId': data.items[0].productId }],
          session 
        }
      );
      console.log('Original transaction updated');
    }

    // 3. Update inventory (in session)
    if (data.items) {
      const updates = items.map(item => {
        const qtyChange = returnType === 'customer' 
          ? item.qty  // Add back to inventory
          : -item.qty; // Remove from inventory
          

        return Item.updateOne(
          { _id: item.productId },
          { $inc: { inStock: qtyChange } },
          { session }
        );
      });

      await Promise.all(updates);
      console.log('Inventory updated for all items');
    }

    // Commit all operations as a single transaction
    await session.commitTransaction();
    console.log('Transaction committed successfully');

    res.status(201).json({
      success: true,
      data: {
        returnId: savedReturn._id,
        returnNo: savedReturn.returnNo,
        controlId: savedReturn.controlId,
        totalAmount: savedReturn.totalAmount
      }
    });

  } catch (error) {
    // Abort transaction on error
    await session.abortTransaction();
    console.error('Return processing failed:', error);
    
    res.status(500).json({
      success: false,
      message: 'Return processing failed',
      error: error.message
    });
  } finally {
    // End session
    session.endSession();
    console.log('Session ended');
  }
}));

// Helper function to generate return numbers
async function generateReturnNumber(returnType) {
  const prefix = returnType === 'customer' ? 'CR' : 'SR';
  const count = await Return.countDocuments({ returnType });
  return `${prefix}-${String(count + 1).padStart(5, '0')}`;
}

export default returnRouter