import Item from "../../models/items.js";
import { Router } from "express";
import asycHandler from "express-async-handler";
import mongoose from "mongoose";


export class StockService{

    ///UPDATE STOCK ON PURCHASE
    static async UpdateOnPurchase(purchaseData){
        const session = await mongoose.startSession()
        session.startTransaction()
        try{
            for(const item of purchaseData){
                const product = await Item.findOne({code: item.code}).session(session)
                if(!product){
                    throw new Error(`Product with Code ${item.code} not found`)
                }
                product.inStock += item.qty
                product.purchased += item.qty
                await product.save({session})
            }
            await session.commitTransaction();
            console.log('Stock updated after purchase.');
        }catch(error){
            await session.abortTransaction()
            console.error('Error updating stock after purchase:', error);
            console.log(error)
        }finally{
            session.endSession()
        }
    }


    ///DEDUCT STOCK ON SALE
    static async UpdateOnSale(saleData){
        const session = await mongoose.startSession()
        session.startTransaction()
        try{
            for(const item of saleData){
                const product = await Item.findOne({code: item.code}).session(session)
                if(!product){
                    throw new Error(`Product with code ${item.code} not found`)
                }

                if(product.inStock < item.qty){
                    throw new Error(`Insufficient stock for product ${product.name}`);
                }

                console.log(`Before update: Product ${product.name} inStock=${product.inStock}, qty=${item.qty}`);
                product.inStock -= item.qty
                product.sold += item.qty
                console.log(`After update: Product ${product.name} inStock=${product.inStock}`);
                await product.save({ session })
            }

            await session.commitTransaction()
            console.log('Stock updated after sale.')
        }catch(error){
            await session.abortTransaction()
            console.log(error)
            throw Error;
            
        }
    }

    static async generateStockLevelsReport() {
        try {
            const products = await Item.find({}, 'name inStock reorderPoint');
    
            const report = products.map(product => ({
                name: product.name,
                stockQuantity: product.stockQuantity,
                status: product.stockQuantity <= product.reorderPoint ? 'Low Stock' : 'In Stock',
            }));
    
            console.log('Stock Levels Report:', report);
            return report;
        } catch (error) {
            console.error('Error generating stock levels report:', error);
            throw error;
        }
    }

} 