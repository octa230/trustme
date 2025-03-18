import Payment from "../../models/payment.js";
import Account from "../../models/account.js";
import JournalEntry from "../../models/journalEntry.js";
import Sale from "../../models/sale.js";
import Purchase from "../../models/purchase.js";
import mongoose from "mongoose";
import Customer from "../../models/customer.js";




export class AccountingService{


    //CREATE NEW JOURNAL ENTRY
    static async createJournalEntry(journalData){
        try{

            ///VALIDATE JOURNAL DATA
            let totalDebit = 0;
            let totalCredit = 0;

            journalData.entries.forEach(entry => {
                entry.totalCredit += entry.credit || 0
                entry.totalDebit += entry.debit || 0
            });

            if(Math.abs(totalDebit - totalCredit) > 0.01){
                throw new Error('Journal entries must balance. Total debits must equal total credits.');
            }
            
            const newJournalEntry = new JournalEntry({
                date: journalData.date,
                referenceType: journalData.referenceType,
                referenceId: journalData.referenceId,
                referenceNumber: journalData.referenceNumber,
                description: journalData.description,
                entries: journalData.entries,
                totalDebit,
                totalCredit,
                postingStatus:'posted'
            })

            return await newJournalEntry.save()

        }catch(error){
            console.log(error)
            throw Error
        }

    }


    ///GET CUSTOMER LEDGER
    static async getCustomerLedger(controlId, startDate, endDate){
      try{
            //const customer = await mongoose.model('Customer').findByOne(customerId)
            const customer = await Customer.findOne(controlId)
            if (!customer) {
                throw new Error('Customer not found');
            }
            console.log(customer)

            // Find the Accounts Receivable account
            const arAccount = await Account.findOne({type: 'asset', name: {$regex: '/recievble/i'}})

            if(!arAccount){
                throw new Error('Accounts Receivable account not found');
            }


            //PREPARE DATE FILTERS
            const dateFilter = {}
            if(startDate) dateFilter['$gte'] = startDate
            if(endDate) dateFilter['$lte'] = endDate

            ///CONSTRUCT QUERY
            const query ={
                'entries.account': arAccount._id,
                'postingStatus': 'posted'
            }

            if(Object.keys(dateFilter).length > 0){
                query.date = dateFilter
            }

            // Get journal entries with appropriate pipeline
            const JournalEntries = await JournalEntry.aggregate([
                {$match: query},
                {$unwind: '$entries'},
                {$match: {'entries.account': arAccount._id}},
                {$lookup: {
                    from:'sales',
                    localField: 'referenceId',
                    foreignField: '_id',
                    as: 'SaleDoc'
                }},
                {
                    $lookup:{
                        from:'payments',
                        localField:"referenceId",
                        foreignField:"_id",
                        as: "paymentDoc",

                    }
                },
                {
                    $lookup:{
                        from: 'returns',
                        localField:'referenceId',
                        foreignField:'_id',
                        as: 'returnDoc'
                    }
                },
                {
                    $sort:{date: 1}
                }

            ])

            const CustomerEntries = JournalEntries.filter(entry=>{
                if(entry.SaleDoc && entry.SaleDoc.length > 0){
                    return entry.SaleDoc[0].customer.toString() === customerId
                }
                if(entry.paymentDoc && entry.paymentDoc.length > 0){
                    return entry.paymentDoc[0].customer.toString() === customerId
                }
                if(entry.returnDoc && entry.returnDoc.length > 0){
                    return entry.returnDoc[0].customer.toString() === customerId
                }

                return false
            })

            let balance = 0;
            const entries = CustomerEntries.map(entry=> {
                balance += (entries.every.debit - entries.entry.credit)

                return{
                    date: entry.date,
                    description: entry.description,
                    referenceType: entry.referenceType,
                    referenceNumber: entry.referenceNumber,
                    debit: entry.entries.debit,
                    credit: entry.entries.credit,
                    balance
                }
            })

            ///CALCULATE TOTALS
            const totalDebit = entries.reduce((sum, entry)=> sum + entry.debit, 0);
            const totalCredit = entries.reduce((sum, entry)=> sum + entry.credit, 0)

            return {
                accountId: arAccount._id,
                accountName: arAccount.name,
                customerId: customer._id,
                customerName: customer.name,
                entries,
                totalDebit,
                totalCredit,
                balance
            };

        }catch(error){
            console.error(error)
        }
    } 


    ///GET SUPPLIER LEDGER

    static async getSupplierLedger(supplierId, startDate, endDate){
        try{
            const supplier = await mongoose.model('Supplier').findOne({supplierId})

            console.log(supplier)
            if (!supplier) {
                throw new Error('Supplier not found');
            }


            //FIND ACCOUNTS PAYABLE ACCOUNT

            const apAccount = await Account.findOne({type: 'liability', name: {$regex: '/payabe/i'}})
            if (!apAccount) {
                throw new Error('Accounts Payable account not found');
            }

            // Prepare date filters
            const dateFilter = {};
            if (startDate) dateFilter['$gte'] = startDate;
            if (endDate) dateFilter['$lte'] = endDate;


            // Get all journal entries for this supplier
            const query ={
              'entries.account': apAccount._id,
              'postingStatus': 'posted'
            };

            if (Object.keys(dateFilter).length > 0) {
              query.date = dateFilter;
            }

            // Get journal entries with appropriate pipeline
            const journalEntries = await JournalEntry.aggregate([
              { $match: query },
              { $unwind: '$entries' },
              { $match: { 'entries.account': apAccount._id } },
              { $lookup: {
                  from: 'purchases',
                  localField: 'referenceId',
                  foreignField: '_id',
                  as: 'purchaseDoc'
                }
              },
              { $lookup: {
                  from: 'payments',
                  localField: 'referenceId',
                  foreignField: '_id',
                  as: 'paymentDoc'
                }
              },
              { $lookup: {
                  from: 'returns',
                  localField: 'referenceId',
                  foreignField: '_id',
                  as: 'returnDoc'
                }
              },
              { $sort: { date: 1 } }
            ]);



            // Filter for supplier specific entries
            const supplierEntries = journalEntries.filter(entry => {
              if (entry.purchaseDoc && entry.purchaseDoc.length > 0) {
                return entry.purchaseDoc[0].supplier.toString() === supplierId;
              }
              if (entry.paymentDoc && entry.paymentDoc.length > 0) {
                return entry.paymentDoc[0].supplier?.toString() === supplierId;
              }
              if (entry.returnDoc && entry.returnDoc.length > 0) {
                return entry.returnDoc[0].supplier?.toString() === supplierId;
              }
              return false;
            });

            // Format the ledger entries
            let balance = 0;
            const entries = supplierEntries.map(entry => {
              // For suppliers, credit increases liability, debit decreases it
              balance += (entry.entries.credit - entry.entries.debit);
            
              return {
                date: entry.date,
                description: entry.description,
                referenceType: entry.referenceType,
                referenceNumber: entry.referenceNumber,
                debit: entry.entries.debit,
                credit: entry.entries.credit,
                balance
              };
            });

            // Calculate totals
            const totalDebit = entries.reduce((sum, entry) => sum + entry.debit, 0);
            const totalCredit = entries.reduce((sum, entry) => sum + entry.credit, 0);

            return {
              accountId: apAccount._id,
              accountName: apAccount.name,
              supplierId: supplier._id,
              supplierName: supplier.name,
              entries,
              totalDebit,
              totalCredit,
              balance
            };

        }catch(error){
            console.log(error)
        }

    }



    ///CREATE A NEW SALE ENTRY
    static async createSale(saleData){
        const session = await mongoose.startSession()
        session.startTransaction()

        try{
            //const sale = new Sale

            const JournalData ={
                date: saleData.date,
                referenceType: 'sale',
                referenceId: saleData._id,
                referenceNumber: saleData.invoiceNo,
                description: `Sale invoice ${saleData.invoiceNo} for ${saleData.customerName}`,
                entries: []
            } 


            const arAccount = await Account.findOne({
              type: 'asset', 
              name: {$regex: 'receivable', $options: 'i'}
            })

            //FIND SALES ACCOUNT
            const salesAccount = await Account.findOne({
              type: 'revenue',
              name: {$regex: 'sales', $options: 'i' }
            })

            ///FIND VAT ACCOUNT
            const vatAccount = await Account.findOne({
              type: 'liability', 
              name: {$regex: 'vat', $options: 'i'}
            })


          if (!arAccount) {
              console.log('Accounts Receivable not found');
          }else{
            console.log(arAccount)
          }
          if (!salesAccount) {
              console.log('Sales Account not found');
          }else{
            console.log(salesAccount)
          }
          if (!vatAccount) {
              console.log('VAT Account not found');
          }else{
            console.log(vatAccount)
          }
          
          

            // Debit Accounts Receivable
            JournalData.entries.push({
                account: arAccount._id,
                accountId: arAccount.controlId,
                description: `Invoice ${saleData.invoiceNo}`,
                debit: saleData.totalWithoutVat,
                credit: 0
            })

            
            // Credit Sales Account
            JournalData.entries.push({
                account: salesAccount._id,
                accountId: salesAccount.controlId,
                description: `Invoice ${saleData.invoiceNo}`,
                debit: 0,
                credit: saleData.totalWithoutVat
            })



            // Credit VAT if applicable
            if(saleData.vatAmount > 0 && vatAccount){
                JournalData.entries.push({
                    account: vatAccount._id,
                    accountId: vatAccount.controlId,
                    description: `VAT on invoice ${saleData.invoiceNo}`,
                    debit: 0,
                    credit: saleData.vatAmount

                })
            }


            await this.createJournalEntry(JournalData)
            await session.commitTransaction()
            return saleData

        }catch(error){
            console.log(error)
            await session.abortTransaction()
            throw error
        }finally{
            session.endSession()
        }
    }


    ///CREATE PURCHASE ENTRY
    static async createPurchase(purchaseData){
        const session = await mongoose.startSession()
        session.startTransaction()
        try{

            const JournalData = {
                date: purchaseData.date,
                referenceType: 'purchase',
                referenceId: purchaseData._id,
                referenceNumber: purchaseData.purchaseNo,
                description: `Purchase ${purchaseData.purchaseNo} from ${purchaseData.supplierName}`,
                entries:[]
            }


            const apAccount = await Account.findOne({type: 'liability', name: {$regex: '/payable/i'}});
            const inventoryAccount = await Account.findOne({type: 'asset', name: {$regex: '/inventory|/stock/i'}});
            const vatAccount = await Account.findOne({type: 'asset', name: {$regex: '/vat.*recievable|input/i'}});


            if(!apAccount || !inventoryAccount){
                throw new Error('Required Accounts Not Found')
            }


            // Debit Inventory
            JournalData.entries.push({
                account: inventoryAccount._id,
                description: `Purchase ${purchaseData.purchaseNo}`,
                debit: purchaseData.totalWithoutVat,
                credit: 0
            })



            // Debit VAT Receivable if applicable
            if(purchaseData.vatAmount > 0 && vatAccount){
                JournalData.entries.push({
                    account: vatAccount._id,
                    description: `VAT on purchase ${purchaseData.purchaseNo}`,
                    credit: purchaseData.vatAmount,
                    debit: 0
                })
            }


            //CREDIT ACCOUNTS PAYABLE
            JournalData.entries.push({
                account: apAccount._id,
                description: `Purchase ${purchaseData.purchaseNo}`,
                debit: 0,
                credit: purchaseData.totalAfterDiscount
            })


            //CREATE JOURNAL ENTRY
            await this.createJournalEntry(JournalData)
            await session.clusterTime()
            return purchaseData
        }catch(error){
            console.log(error)
        }finally{
            throw error
        }


    }


    ///CREATE RETURN
    static async createReturn(returnData){
        const session = await mongoose.startSession()
        session.startTransaction()

        try{
            const JournalData = {
                date: returnData.date,
                referenceType:'return',
                referenceId: returnData._id,
                referenceNumber: returnData.returnNo,
                description: returnData.returnType === 'customer'
                    ? `Customer return ${returnData.returnNo} from ${returnData.customerName}`
                    :  `Supplier return ${returnData.returnNo} from ${returnData.supplierName}`,
                entries: [] 
            }


            if(returnData.returnType === 'customer'){
                const arAccount = await Account.findOne({type: 'asset', name: {$regex: '/recievable/i'}})
                const salesAccount = await Account.findOne({type: 'revenue', name: {$regex: '/sales/i'}})
                const vatAccount = await Account.findOne({type: 'liability', name: {$regex: '/vat/i'}})
                const inventoryAccount = await Account.findOne({type: 'asset', name: {$regex: '/recievable|stock/i'}})


                if (!arAccount || !salesAccount || !inventoryAccount) {
                    throw new Error('Required accounts not found');
                }


                // Credit Accounts Receivable
                JournalData.entries.push({
                    account: returnData._id,
                    description: `Return ${returnData.returnNo}`,
                    debit: 0, 
                    credit: returnData.totalWithoutVat,
                })


                //debit Sales
                JournalData.entries.push({
                    account: salesAccount._id,
                    description: `Return ${returnData.returnNo}`,
                    debit: returnData.totalWithoutVat,
                    credit: 0
                })

                ///Debit inventory (for Returned Goods)
                JournalData.entries.push({
                    account: inventoryAccount._id,
                    description: `Inventory for return ${returnData.returnNo}`,
                    debit: returnData.items.reduce((sum, item)=> sum + (item.costPrice * item.qty || 0), 0),
                    credit: 0,
                })

                ///Debit Vat If applicable
                if(returnData.vatAmount > 0 && vatAccount){
                    JournalData.entries.push({
                        account: vatAccount._id,
                        description: `Vat on return ${returnData.returnNo}`,
                        debit: returnData.vatAmount,
                        credit: 0
                    })
                }else{

                    // Supplier return: Debit AP, Credit Inventory, Credit VAT Receivable
                    const apAccount = await Account.findOne({ type: 'liability', name: { $regex: /payable/i } });
                    const inventoryAccount = await Account.findOne({ type: 'asset', name: { $regex: /inventory|stock/i } });
                    const vatAccount = await Account.findOne({ type: 'asset', name: { $regex: /vat.*receivable|input/i } })


                    if(!apAccount || !inventoryAccount) {
                        throw new Error('Required accounts not found');
                    }

                    // Debit Accounts Payable
                    JournalData.entries.push({
                        account: apAccount._id,
                        description: `Return ${returnData.returnNo}`,
                        debit: returnData,totalWithoutVat,
                        credit: 0
                    })


                    //Credit Inventory
                    JournalData.entries.push({
                        account: inventoryAccount._id,
                        description: `Return ${returnData.returnNo}`,
                        debit: 0,
                        credit: returnData.totalWithoutVat
                    })

                    // Credit VAT Receivable if applicable
                    if(returnData.vatAmount > 0 && vatAccount){
                        JournalData.entries.push({
                            account: vatAccount._id,
                            description: `VAT on return ${returnData.returnNo}`,
                            debit: 0,
                            credit: returnData.vatAmount
                        })
                    }
                }
                // Create journal entry
                await this.createJournalEntry(JournalData);
                await session.commitTransaction()
                return returnData
            }
        }catch(error){
            console.log(error)
            throw new Error
        }finally{
            session.endSession()
        }
    }


    // PROCESS PAYMENT
    static async createPayment(paymentData) {
        const session = await mongoose.startSession();
        session.startTransaction();
        
        try {
        
          // Generate journal entries
          const journalData = {
            date: paymentData.date,
            referenceType: 'payment',
            referenceId: paymentData._id,
            referenceNumber: paymentData.paymentNo,
            description: paymentData.paymentType === 'customer' 
              ? `Payment received from customer ${paymentData.customerName}`
              : `Payment made to supplier ${paymentData.supplierName}`,
            entries: []
          };

          // Find necessary accounts based on payment type
          const cashAccount = await Account.findOne({ type: 'asset', name: { $regex: /cash|bank/i } });

          if (paymentData.paymentType === 'customer') {
            // Customer payment: Debit Cash/Bank, Credit AR
            const arAccount = await Account.findOne({ type: 'asset', name: { $regex: /receivable/i } });

            if (!cashAccount || !arAccount) {
              throw new Error('Required accounts not found');
            }

            // Debit Cash/Bank
            journalData.entries.push({
              account: cashAccount._id,
              description: `Payment ${paymentData.paymentNo}`,
              debit: paymentData.amount,
              credit: 0
            });

            // Credit Accounts Receivable
            journalData.entries.push({
              account: arAccount._id,
              description: `Payment ${paymentData.paymentNo}`,
              debit: 0,
              credit: paymentData.amount
            });
          } else {
            // Supplier payment: Credit Cash/Bank, Debit AP
            const apAccount = await Account.findOne({ type: 'liability', name: { $regex: /payable/i } });

            if (!cashAccount || !apAccount) {
              throw new Error('Required accounts not found');
            }

            // Credit Cash/Bank
            journalData.entries.push({
              account: cashAccount._id,
              description: `Payment ${paymentData.paymentNo}`,
              debit: 0,
              credit: paymentData.amount
            });

            // Debit Accounts Payable
            journalData.entries.push({
              account: apAccount._id,
              description: `Payment ${paymentData.paymentNo}`,
              debit: paymentData.amount,
              credit: 0
            });
          }

          // Create journal entry
          await this.createJournalEntry(journalData);

          // Update related documents if applicable
          if (paymentData.relatedDocuments && paymentData.relatedDocuments.length > 0) {
            for (const doc of paymentData.relatedDocuments) {
              if (doc.documentType === 'sale') {
                await Sale.findByIdAndUpdate(
                  doc.documentId,
                  { 
                    $inc: { 
                      paidAmount: doc.amount,
                      pendingAmount: -doc.amount
                    }
                  },
                  { session }
                );
              } else if (doc.documentType === 'purchase') {
                await Purchase.findByIdAndUpdate(
                  doc.documentId,
                  { 
                    $inc: { 
                      paidAmount: doc.amount,
                      pendingAmount: -doc.amount
                    }
                  },
                  { session }
                );
              }
            }
          }

          await session.commitTransaction();
          return paymentData;
        } catch (error) {
          await session.abortTransaction();
          throw error;
        } finally {
          session.endSession();
        }
    }

    // Generate financial statements
    static async generateTrialBalance(date){
    try {
      const accounts = await Account.find({ isActive: true });
      const trialBalance = [];
      
      for (const account of accounts) {
        // Get all journal entries for this account up to the date
        const entries = await JournalEntry.aggregate([
          { 
            $match: { 
              date: { $lte: date },
              postingStatus: 'posted'
            } 
          },
          { $unwind: '$entries' },
          { 
            $match: { 
              'entries.account': account._id 
            } 
          },
          { 
            $group: { 
              _id: '$entries.account',
              totalDebit: { $sum: '$entries.debit' },
              totalCredit: { $sum: '$entries.credit' }
            } 
          }
        ]);
        
        // Calculate balance based on account type
        let balance = 0;
        if (entries.length > 0) {
          const { totalDebit, totalCredit } = entries[0];
          
          if (['asset', 'expense'].includes(account.type)) {
            balance = totalDebit - totalCredit;
          } else if (['liability', 'equity', 'revenue'].includes(account.type)) {
            balance = totalCredit - totalDebit;
          }
        }
        
        if (Math.abs(balance) > 0.01) {
          trialBalance.push({
            accountId: account._id,
            accountCode: account.code,
            accountName: account.name,
            accountType: account.type,
            debit: balance > 0 ? balance : 0,
            credit: balance < 0 ? Math.abs(balance) : 0
          });
        }
      }
      
      // Calculate totals
      const totalDebit = trialBalance.reduce((sum, item) => sum + item.debit, 0);
      const totalCredit = trialBalance.reduce((sum, item) => sum + item.credit, 0);
      
      return {
        date,
        accounts: trialBalance,
        totalDebit,
        totalCredit,
        isBalanced: Math.abs(totalDebit - totalCredit) < 0.01
      };
    } catch (error) {
      throw error;
    }
  }
  
}


    

