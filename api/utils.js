import jwt from 'jsonwebtoken'
import {v4 as uuidv4 } from 'uuid'
import puppeteer from 'puppeteer'
import fs from 'fs'
import { Account } from './models/account.js'
import Handlebars from 'handlebars'
import { ToWords } from 'to-words'



export const generateId = async()=> uuidv4().slice(0, 8).toString()

/* export const accIdGenerator =async(type, dbLen)=>{
  const prefix = type.toUpperCase().substring(0, 4);
  return `${prefix}-${(dbLen =+ 1).toString().padStart(3, '0')}`
}
 */

export const accIdGenerator = async (type) => {
  const prefix = type.toUpperCase().substring(0, 4);
  let isUnique = false;
  let serialNumber;

  while (!isUnique) {
    const uniqueSuffix = Date.now().toString(36);
    serialNumber = `${prefix}-${uniqueSuffix}`;

    // Check if the serialNumber already exists in the database
    const existingAccount = await Account.findOne({ serialNumber });
    if (!existingAccount) {
      isUnique = true;
    }
  }

  return serialNumber;
};

export const generateStatus = async(pendingAmount) => {
  // Ensure the returned value matches one of the allowed enum values
  if (pendingAmount === 0) {
      return 'paid'; // If pending amount is 0, the status is 'paid'
  } else if (pendingAmount > 0 && pendingAmount < 0.01) {
      return 'partially_paid';
  } else if (pendingAmount > 0) {
      return 'pending'; // If there's a pending amount
  }
  return 'draft'; // Default status if no conditions match
};

const toWordsInstance = new ToWords({
  localeCode: 'en-AE', // Ensure correct locale
  converterOptions: {
    currency: true, // Enable currency mode
    currencyOptions: {
      name: 'Dirham',
      plural: 'Dirhams',
      symbol: 'AED',
      fractionalUnit: {
        name: 'fill',
        plural: 'fills',
        symbol: '',
      },
    },
  },
});


export const toWords =async(number)=> {
  return toWordsInstance.convert(number)
}


class PdfGenerator{

  static async generateReciept(data){

    const templateSource = fs.readFileSync('Reciept.hbs', 'utf-8')
    const template = Handlebars.compile(templateSource)
    const htmlContent = template(data)

    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.setContent(htmlContent)
    const PdfBuffer = await page.pdf ({
      path: 'reciept.pdf', format:"A4",
      printBackground: true
    })
    await browser.close()
    return PdfBuffer

  }


  //GENERATE INVOICE PDF
  static async generateInvoice(data){
    const templateSource = fs.readFileSync('./templates/Invoice.hbs', 'utf-8')
    const template = Handlebars.compile(templateSource)
    const htmlContent = template(data)

    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.setContent(htmlContent)
    const PdfBuffer = await page.pdf ({
      path: 'invoice.pdf', format:"A4",
      printBackground: true
    })
    await browser.close()
    return PdfBuffer

  }

  ///GENERATE QUOTATION PDF
  static async generateQuote(data){
    const templateSource = fs.readFileSync('./templates/Quotation.hbs', 'utf-8')
    const template = Handlebars.compile(templateSource)
    const htmlContent = template(data)

    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.setContent(htmlContent)
    const PdfBuffer = await page.pdf ({
      path: 'quotation.pdf', format:"A4",
      printBackground: true
    })
    await browser.close()
    return PdfBuffer
  }


  ///GENERATE ENQUIRY PDF
  static async generateEnquiry(data){
    const templateSource = fs.readFileSync('Reciept.hbs', 'utf-8')
    const template = Handlebars.compile(templateSource)
    const htmlContent = template(data)

    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.setContent(htmlContent)
    const PdfBuffer = await page.pdf ({
      path: 'reciept.pdf', format:"A4",
      printBackground: true
    })
    await browser.close()
    return PdfBuffer
  }



  ////GENERATE DELIVERY NOTE PDF
  static async generateDeliveryNote(data){
    const templateSource = fs.readFileSync('./templates/DeliveryNote.hbs', 'utf-8')
    const template = Handlebars.compile(templateSource)
    const htmlContent = template(data)

    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.setContent(htmlContent)
    const PdfBuffer = await page.pdf ({
      path: 'deliveryNote.pdf', format:"A4",
      printBackground: true
    })
    await browser.close()
    return PdfBuffer
  }


  ////GENERATE PURCHASE ORDER PDF
  static async generatePurchaseOrder(data){
    const templateSource = fs.readFileSync('Reciept.hbs', 'utf-8')
    const template = Handlebars.compile(templateSource)
    const htmlContent = template(data)

    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.setContent(htmlContent)
    const PdfBuffer = await page.pdf ({
      path: 'reciept.pdf', format:"A4",
      printBackground: true
    })
    await browser.close()
    return PdfBuffer
  }



  ///GENERATE PURCHASE PDF
  static async generatePurchase(data){
    try{
      const templateSource = fs.readFileSync('./templates/Purchase.hbs', 'utf-8')
      const template = Handlebars.compile(templateSource)
      const htmlContent = template(data)

      const browser = await puppeteer.launch()
      const page = await browser.newPage()
      await page.setContent(htmlContent)
      const PdfBuffer = await page.pdf ({
        path: 'purchase.pdf', format:"A4",
        printBackground: true
      })
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
    const PdfBuffer = await page.pdf ({
      path: 'reciept.pdf', format:"A4",
      printBackground: true
    })
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
      case 'PURCHASE': ///  WORKING
        return await PdfGenerator.generatePurchase(data);
      case 'DELIVERY NOTE':
        return await PdfGenerator.generateDeliveryNote(data);
      case 'QUOTATION':  /// WORKING
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