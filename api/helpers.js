import Item from "./models/items.js";
import cron from 'node-cron'
import mongoose from "mongoose";
import StockSnapshot from "./models/stockSnapshot.js";


const createDailyStockSnapshot = async()=> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Fetch all products
        const products = await Item.find({}, 'name inStock costPrice').session(session);

        // Prepare snapshot data
        const snapshotData = {
            date: new Date(),
            products: products.map(product => ({
                productId: product._id,
                name: product.name,
                qty: product.inStock,
                purchased: product.purchased,
                sold: product.sold,
                costPrice: product.costPrice,
            })),
        };

        // Save the snapshot
        const snapshot = new StockSnapshot(snapshotData);
        await snapshot.save({ session });

        // Commit the transaction
        await session.commitTransaction();
        console.log('Daily stock snapshot created successfully.');
    } catch (error) {
        // Rollback the transaction in case of error
        await session.abortTransaction();
        console.error('Error creating daily stock snapshot:', error);
        throw error;
    } finally {
        // End the session
        session.endSession();
    }
}

export const stockSnapFunc =async()=>{
    cron.schedule('0 0 * * *', async()=>{
        console.log('Creating daily stock snapshot...')
        await createDailyStockSnapshot()
    })
}