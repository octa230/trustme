import asyncHandler from "express-async-handler";
import Company from "../../models/company.js";
import { Router } from "express";
import { generateId } from "../../utils.js";


const companyRouter = Router()



////CREATE COMPANY
companyRouter.post('/', asyncHandler(async(req, res)=>{
    const { name, logo, footerLogo, description, mobile, phone, address, email, trn, website, printFormat} = req.body

    const company = new Company({
        name,
        controlId: await generateId(),
        logo,
        footerLogo,
        description,
        mobile,
        phone,
        address,
        email,
        trn,
        website,
        printFormat
    })
    await company.save()
    res.status(200).send(company)
    
}))




///EDIT COMPANY

companyRouter.put('/:id', asyncHandler(async(req, res)=>{
    
    const { name, logo, footerLogo, description, mobile, phone, address, email, trn, website, printFormat} = req.body

    const company = await Company.findById(req.params.id)

    if(!company) return res.status(404).send({message: "company not found"})

        if(name) company.name = name
        if(logo) company.logo = logo
        if(footerLogo) company.footerLogo = footerLogo
        if(description) company.description = description
        if(mobile) company.mobile = mobile
        if(phone) company.phone = phone
        if(address) company.address = address
        if(email) company.email = email
        if(trn) company.trn = trn
        if(website) company.website = website
        if(printFormat) company.printFormat = printFormat
    
    await company.save()
    res.status(200).send(company)
    
}))


///DELETE COMPANY
companyRouter.delete('/:id', asyncHandler(async(req, res)=>{

    const company = await Company.findByIdAndDelete(req.params.id)

    if(!company) return res.status(404).send({message: "company not found"})
    
    res.status(200).send({message: "company deleted Successfully"})
    
}))



//GET ALLL COMPANIES
companyRouter.get('/', asyncHandler(async(req, res)=>{

    const companies = await Company.find()    
    res.status(200).send(companies)
    
}))

///GET COMPANY
companyRouter.get('/:id', asyncHandler(async(req, res)=>{

    const company = await Company.findByIdAndDelete(req.params.id)

    if(!company) return res.status(404).send({message: "company not found"})
    
    res.status(200).send(company)
    
}))



export default companyRouter