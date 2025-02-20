import { Router } from "express";
import asyncHandler from "express-async-handler";
import Category from "../../models/category.js";
import { generateId } from "../../utils.js";



const categoryRouter = Router()

categoryRouter.post('/', asyncHandler(async(req, res)=>{
    const {name, file} = req.body
    const category = new Category({
        name,
        code: await generateId(),
        file
    })
    await category.save()
    res.status(200).send(category)
}))

categoryRouter.delete('/:id', asyncHandler(async(req, res)=>{
    const category = await Category.findByIdAndDelete()
    
    if(!category) return res.status(404).send({message: "category not found"})

    res.status(200).send({message: "category deleted successfuly"})
}))

categoryRouter.get('/', asyncHandler(async(req, res)=>{
    const categories = await Category.find()
    res.status(200).send(categories)
}))

categoryRouter.put('/:id', asyncHandler(async(req, res)=> {
    const category = await Category.findById(req.params.id)
    
    const {name, file } = req.body
    
    if(!category) return res.status(404).send({message: "category not found"})

        if(name) category.name = name
        if(file) category.file = file
    
    await category.save()
    res.status(200).send(category)
}))

export default categoryRouter