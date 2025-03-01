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
    const PdfBuffer = await page.pdf ({path: 'reciept.pdf', format:"A4"})
    await browser.close()
    return PdfBuffer

  }

  static async generateInvoice(data){
    const templateSource = fs.readFileSync('Reciept.hbs', 'utf-8')
    const template = Handlebars.compile(templateSource)
    const htmlContent = template(data)

    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.setContent(htmlContent)
    const PdfBuffer = await page.pdf ({path: 'reciept.pdf', format:"A4"})
    await browser.close()
    return PdfBuffer

  }

  static async generateQuote(data){
    const templateSource = fs.readFileSync('Reciept.hbs', 'utf-8')
    const template = Handlebars.compile(templateSource)
    const htmlContent = template(data)

    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.setContent(htmlContent)
    const PdfBuffer = await page.pdf ({path: 'reciept.pdf', format:"A4"})
    await browser.close()
    return PdfBuffer
  }

  static async generateEnquiry(data){
    const templateSource = fs.readFileSync('Reciept.hbs', 'utf-8')
    const template = Handlebars.compile(templateSource)
    const htmlContent = template(data)

    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.setContent(htmlContent)
    const PdfBuffer = await page.pdf ({path: 'reciept.pdf', format:"A4"})
    await browser.close()
    return PdfBuffer
  }

  static async generateDeliveryNote(data){
    const templateSource = fs.readFileSync('Reciept.hbs', 'utf-8')
    const template = Handlebars.compile(templateSource)
    const htmlContent = template(data)

    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.setContent(htmlContent)
    const PdfBuffer = await page.pdf ({path: 'reciept.pdf', format:"A4"})
    await browser.close()
    return PdfBuffer
  }

  static async generatePurchaseOrder(data){
    const templateSource = fs.readFileSync('Reciept.hbs', 'utf-8')
    const template = Handlebars.compile(templateSource)
    const htmlContent = template(data)

    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.setContent(htmlContent)
    const PdfBuffer = await page.pdf ({path: 'reciept.pdf', format:"A4"})
    await browser.close()
    return PdfBuffer
  }


  static async generatePurchase(data){
    try{
      const templateSource = fs.readFileSync('./templates/Purchase.hbs', 'utf-8')
      const template = Handlebars.compile(templateSource)
      const htmlContent = template(data)

      const browser = await puppeteer.launch()
      const page = await browser.newPage()
      await page.setContent(htmlContent)
      const PdfBuffer = await page.pdf ({path: 'purchase.pdf', format:"A4"})
      await browser.close()

      console.log('success')
      return PdfBuffer
    }catch(error){
      console.log('purchase error')
      throw new Error(error)
    }
  }

  static async generateTablePdf(data){
    const templateSource = fs.readFileSync('Reciept.hbs', 'utf-8')
    const template = Handlebars.compile(templateSource)
    const htmlContent = template(data)

    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.setContent(htmlContent)
    const PdfBuffer = await page.pdf ({path: 'reciept.pdf', format:"A4"})
    await browser.close()
    return PdfBuffer
  }
}

// Function to generate the PDF based on type
export const generatePDF = async (type, data) => {
  try {
    switch (type) {
      case 'RECIEPT':
        return await PdfGenerator.generateReciept(data);
      case 'PURCHASE ORDER':
        return await PdfGenerator.generatePurchaseOrder(data);
      case 'PURCHASE':
        return await PdfGenerator.generatePurchase(data);
      case 'DELIVERY NOTE':
        return await PdfGenerator.generateDeliveryNote(data);
      case 'QUOTE':
        return await PdfGenerator.generateQuote(data);
      case 'ENQUIRY':
        return await PdfGenerator.generateEnquiry(data);
      case 'INVOICE':
        return await PdfGenerator.generateInvoice(data);
      case 'PRINTTABLE':
        return await PdfGenerator.generateTablePdf(data);
      default:
        console.error(`Invalid PDF type: ${type}`);
        throw new Error('Invalid PDF type');
    }
  } catch (error) {
    console.error('Error in generatePDF function:', error);
    return null;
  }
}

/* export const generatePDF= async(type, data)=>{

  switch(type){
    case 'RECIEPT':
      await PdfGenerator.generateReciept(data)
      break;
    case 'PURCHASE ORDER':
      await PdfGenerator.generatePurchaseOrder(data)
      break;
    case 'PURCHASE':
      await PdfGenerator.generatePurchase(data)
      break;
    case 'DELIVERY NOTE':
      await PdfGenerator.generateDeliveryNote(data)
      break;
    case 'QUTOE':
      await PdfGenerator.generateQuote(data)
      break;
    case 'ENQUIRY':
      await PdfGenerator.generateEnquiry(data)
      break;
    case 'INVOICE':
      await PdfGenerator.generateInvoice(data)
      break;
    case 'PRINTTABLE':
      await PdfGenerator.generateTablePdf(data)
    default:
      return console.log('something went wrong')
  }
}
 */

// Send the generated PDF as a response
export const sendPDF = (pdfBuffer, filename = 'document.pdf') => {
  return (req, res) => {
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${filename}"`,
      'Content-Length': pdfBuffer.length,
    });

    // Send the PDF buffer in the response
    res.send(pdfBuffer);
  };
};



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