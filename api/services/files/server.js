import { google } from "googleapis";
import { readFileSync } from "fs";
import asyncHandler from "express-async-handler";
import path from "path";
import { Router } from 'express'
import { fileURLToPath } from "url";
import { dirname } from "path";

//dotenv.config()

const uploadRouter = Router()


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//const apiKeys = JSON.parse(readFileSync(path.resolve(__dirname, '../')))
const SCOPES = ['https://www.googleapis.com/auth/drive'];

const authorize = async()=>{
    const auth = new google.auth.JWT(
        //apiKeys.client_email,
        null,
        //apiKeys.private_key,
        SCOPES
    )

    try{
        await auth.authorize()
        return auth
    }catch(error){
        throw new Error(`Error authorizing Google Drive API: ${error.message}`)
    }
}

 
uploadRouter.get('/list', asyncHandler(async(req, res)=>{

    const auth = await authorize()
    const drive = google.drive({version: 'v3', auth})

    try{
        const response = await drive.files.list({
            pageSize: 100,
            fields: 'nextPageToken, fields(id, name)'
        })

        const files = response.data.files
        if(files.length){
            res.send({
                success: true,
                files: files.map(file => ({
                  name: file.name,
                  id: file.id
                })
            )})
        }else{
            console.log('no files available')
        }
    }catch(error){
        console.log(error)
    }
}))


uploadRouter.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  });

export default uploadRouter