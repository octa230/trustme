import jwt from 'jsonwebtoken'
import {v4 as uuidv4 } from 'uuid'
import puppeteer from 'puppeteer'
import fs from 'fs'
import Handlebars from 'handlebars'



export const generateId = async()=> uuidv4().slice(0, 5).toString()



class PdfGenerator{

  static async generateReciept(data){

    const templateSource = fs.readFileSync('Reciept.hbs', 'utf-8')
    const template = Handlebars.compile(templateSource)
    const htmlContent = template(data)

    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.setContent(htmlContent)
    await page.pdf ({path: 'reciept.pdf', format:"A4"})
    await browser.close()
    console.log('reciept generated successfully')

  }

  static async generateInvoice(data){
    const templateSource = fs.readFileSync('Reciept.hbs', 'utf-8')
    const template = Handlebars.compile(templateSource)
    const htmlContent = template(data)

    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.setContent(htmlContent)
    await page.pdf ({path: 'reciept.pdf', format:"A4"})
    await browser.close()
    console.log('reciept generated successfully')

  }

  static async generateQuote(data){
    const templateSource = fs.readFileSync('Reciept.hbs', 'utf-8')
    const template = Handlebars.compile(templateSource)
    const htmlContent = template(data)

    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.setContent(htmlContent)
    await page.pdf ({path: 'reciept.pdf', format:"A4"})
    await browser.close()
    console.log('reciept generated successfully')
  }

  static async generateEnquiry(data){
    const templateSource = fs.readFileSync('Reciept.hbs', 'utf-8')
    const template = Handlebars.compile(templateSource)
    const htmlContent = template(data)

    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.setContent(htmlContent)
    await page.pdf ({path: 'reciept.pdf', format:"A4"})
    await browser.close()
    console.log('reciept generated successfully')
  }

  static async generateDeliveryNote(data){
    const templateSource = fs.readFileSync('Reciept.hbs', 'utf-8')
    const template = Handlebars.compile(templateSource)
    const htmlContent = template(data)

    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.setContent(htmlContent)
    await page.pdf ({path: 'reciept.pdf', format:"A4"})
    await browser.close()
    console.log('reciept generated successfully')
  }

  static async generatePurchaseOrder(data){
    const templateSource = fs.readFileSync('Reciept.hbs', 'utf-8')
    const template = Handlebars.compile(templateSource)
    const htmlContent = template(data)

    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.setContent(htmlContent)
    await page.pdf ({path: 'reciept.pdf', format:"A4"})
    await browser.close()
    console.log('reciept generated successfully')
  }

  static async generateTablePdf(data){
    const templateSource = fs.readFileSync('Reciept.hbs', 'utf-8')
    const template = Handlebars.compile(templateSource)
    const htmlContent = template(data)

    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.setContent(htmlContent)
    await page.pdf ({path: 'reciept.pdf', format:"A4"})
    await browser.close()
    console.log('reciept generated successfully')
  }
}


export const generatePDF= async(type, data)=>{

  switch(type){
    case 'RECIEPT':
      await PdfGenerator.generateReciept(data)
    case 'PURCHASE ORDER':
      await PdfGenerator.generatePurchaseOrder(data)
    case 'DELIVERY NOTE':
      await PdfGenerator.generateDeliveryNote(data)
    case 'QUTOE':
      await PdfGenerator.generateQuote(data)
    case 'ENQUIRY':
      await PdfGenerator.generateEnquiry(data)
    case 'INVOICE':
      await PdfGenerator.generateInvoice(data)
    case 'PRINTTABLE':
      await PdfGenerator.generateTablePdf(data)
  }
}



export const generateToken =(user)=>{
    return jwt.sign({
      _id: user._id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      isAdmin: user.isAdmin,
      password: user.password
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    }

)}


export const isAuth = (req, res, next) => {
    const authorization = req.headers.authorization;
    if (authorization) {
      const token = authorization.slice(7, authorization.length); // Bearer XXXXXX
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          res.status(401).send({ message: 'Invalid Token' });
        } else {
          req.user = decoded;
          next();
        }
      });
    } else {
      res.status(401).send({ message: 'No Token' });
    }
  };
  
  export const isAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
      next();
    } else {
      res.status(401).send({ message: 'Invalid Admin Token' });
    }
  };

  export const isEmployee = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
      next();
    } else {
      res.status(401).send({ message: 'Invalid Admin Token' });
    }
  };


  /* export const mailTransporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth:{
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  }) */