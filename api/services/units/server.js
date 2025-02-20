import { Router } from "express";
import asyncHandler from 'express-async-handler'
import Unit from "../../models/unit.js";
import { generateId } from "../../utils.js";



const unitsRouter = Router()

unitsRouter.post('/', asyncHandler(async(req, res)=> {
    const {name} = req.body

    const existingUnit = await Unit.findOne({name})
    
    if(existingUnit) return res.status(403).send({message: "unit  name exixts"})
    const unit = new Unit({
        name,
        code: await generateId()
    })
    unit.save()
    res.status(200).send(unit)
}))

//GET ALL
unitsRouter.get('/', asyncHandler(async(req, res)=> {
    const units = await Unit.find()
    res.status(200).send(units)
}))


unitsRouter.put('/:id', asyncHandler(async(req, res)=>{
    
    const unit = await Unit.findById(req.params.id)

    if(!unit) return res.status(404).send({message: "unit not found"})

    if(unit) unit.name = req.body.name

    await unit.save()
    res.send(unit)
}))

unitsRouter.delete("/:id", asyncHandler(async(req, res)=>{
    const unit = await Unit.findByIdAndDelete(req.params.id)

    if(!unit) return res.status(404).send({message: "unit not found"})

    res.send({message: "unit deleted successfully"})
}))

export default unitsRouter