import StockSnapshot from "../../models/stockSnapshot.js";
import { Router } from "express";
import asyncHandler from "express-async-handler";

const stockRouter = Router()

stockRouter.get('/daily', asyncHandler(async(req, res)=>{
    const {startDate, endDate} = req.query
    const snapshots = await StockSnapshot.find({
        date: {$gte: startDate, $lte: endDate}
    })
    console.log('Stock Snapshots:', snapshots);
    res.send(snapshots)
}))


stockRouter.get('/records', asyncHandler(async(req, res)=>{
    const {startDate, endDate, productId} = req.query
    const data = await StockSnapshot.find({
        date: {$gte: startDate, $lte: endDate},
        'products.productId': productId,
    }, {'products.$': 1, date: 1})

    const history = data.map((snapshot)=> ({
        date: snapshot.date,
        qty: snapshot.products[0].inStock 
    }))
    res.send(history)
}))


stockRouter.get('/movement', asyncHandler(async(req, res)=> {
    const {startDate, endDate} = req.query
    try {
        const snapshots = await StockSnapshot.find({
            date: { $gte: startDate, $lte: endDate },
        });

        const report = snapshots.map(snapshot => ({
            date: snapshot.date,
            products: snapshot.products.map(product => ({
                name: product.name,
                qty: product.inStock,
            })),
        }));

        console.log('Stock Movement Report:', report);
        res.send(report);
    } catch (error) {
        console.error('Error generating stock movement report:', error);
        throw error;
    }
}))
export default stockRouter