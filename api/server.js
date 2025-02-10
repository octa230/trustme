import dotenv from "dotenv";
import e from "express";
import fs from 'fs/promises'
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import { Worker } from "worker_threads";


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


const app = e() 
const PORT = process.env.PORT || 8080

dotenv.config()

app.use(e.json())

const registerModules = {}

const loadServices = async()=> {
    const modulesDir = path.join(__dirname, "services").toString()
    try{
        const folders = await fs.readdir(modulesDir, {withFileTypes: true});

        const serviceFolders = folders
        .filter((dirent)=> dirent.isDirectory())
        .map((dirent)=> dirent.name)

        const workers = serviceFolders.map(async (folder)=>{
            return new Promise(async (resolve, reject)=>{
                const service = path.join(modulesDir, folder, 'server.js');

                await fs.access(service)
                .then(()=> {
                    const worker = new Worker(new URL('./Worker-loader.js', import.meta.url), {
                        workerData: { service }
                    })

                    worker.on('message', async()=> {
                        const {default: serviceModule} = await import(service)

                        app.use(`/${folder}`, serviceModule)
                        registerModules[folder] = service
                        console.log(`✅ Registered module: ${folder}`)
                        resolve()
                    });

                    worker.on('error', reject)
                })
                .catch((error)=> {
                    console.warn(`Skipping module ${folder}: ${error.message}`);
                    return Promise.resolve()
                })
            })
        })
        await Promise.all(workers)

    }catch(error){
        console.error("❌ Error loading modules:", error);
        throw error
    }
}


//await loadServices()

app.post('/reload', async(req, res)=> {
    try {
        // Unregister existing modules
        Object.keys(registerModules).forEach((key) => {
          app.delete(`/${key}`);
          delete registerModules[key];
        });
    
        await loadServices();
        res.json({ message: "Services reloaded successfully!" });
      } catch (error) {
        res.status(500).json({ error: "Failed to reload services" });
      }
})

const startServer = async () => {
    try {
      await loadServices();


      mongoose.connect(process.env.MONGO_URI)
      .then(()=>{
        console.log('connected to db')
      })
      .catch((error)=>{
        console.log(error.message);
        console.log('db not connected')
      })

      app.listen(PORT, () => {
        console.log(`App running on port ${PORT}`);
      });
    } catch (error) {
      console.error("Failed to start server:", error);
      process.exit(1);
    }
  };

startServer()