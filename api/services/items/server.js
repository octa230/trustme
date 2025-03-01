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
    const categories = await Item.find()
    if(categories){
        res.status(200).send(categories)
    }
}))




export default itemsRouter