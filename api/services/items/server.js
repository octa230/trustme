import asyncHandler from "express-async-handler";
import { Router } from "express";
import Item from "../../models/items.js";
import Category from "../../models/category.js";
import { generateId } from "../../utils.js";


const itemsRouter = Router()

itemsRouter.post('/', asyncHandler(async(req, res)=> {
    const {category, name, unit, brand, model, barcode, purchasePrice, salePrice, photo, description, note} = req.body

    const item = new Item({
        category,
        name,
        code: await generateId(),
        unit,
        brand,
        model,
        barcode,
        purchasePrice,
        salePrice,
        photo,
        description,
        note,
    })

    await item.save()
    res.status(200).send(item)
}))


itemsRouter.get('/', asyncHandler(async(req, res)=>{
    const items = await Item.find().sort({name: 1})
    if(items.length){
        res.status(200).send(items)
    }
}))




export default itemsRouter