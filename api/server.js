import dotenv from "dotenv";
import express from "express";
import fs from 'fs/promises';
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import { Worker } from "worker_threads";
import { seedAccountGroups, seedAccountTypes, seedPredefinedAccounts } from "./seed.js";
import { stockSnapFunc } from "./helpers.js";



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

dotenv.config();

app.use(express.json());

const registerModules = {};

const loadServices = async () => {
    const modulesDir = path.join(__dirname, "services");

    try {
        const folders = await fs.readdir(modulesDir, { withFileTypes: true });

        const serviceFolders = folders
            .filter((dirent) => dirent.isDirectory())
            .map((dirent) => dirent.name);

        const workers = serviceFolders.map(async (folder) => {
            const servicePath = path.join(modulesDir, folder, 'server.js');

            try {
                await fs.access(servicePath);

                return new Promise((resolve, reject) => {
                    const worker = new Worker(new URL('./Worker-loader.js', import.meta.url), {
                        workerData: { service: servicePath }
                    });

                    worker.on('message', async () => {
                        try {
                            const { default: serviceModule } = await import(servicePath);
                            app.use(`/${folder}`, serviceModule);
                            registerModules[folder] = servicePath;
                            console.log(`✅ Registered module: ${folder}`);
                            resolve();
                        } catch (error) {
                            console.error(`❌ Error importing module ${folder}:`, error);
                            reject(error);
                        }
                    });

                    worker.on('error', (error) => {
                        console.error(`❌ Worker error for module ${folder}:`, error);
                        reject(error);
                    });

                    worker.on('exit', (code) => {
                        if (code !== 0) {
                            console.error(`❌ Worker stopped with exit code ${code} for module ${folder}`);
                            reject(new Error(`Worker stopped with exit code ${code}`));
                        }
                    });
                });
            } catch (error) {
                console.warn(`⚠️ Skipping module ${folder}: ${error.message}`);
                return Promise.resolve();
            }
        });

        await Promise.all(workers);
    } catch (error) {
        console.error("❌ Error loading modules:", error);
        throw error;
    }
};

app.post('/reload', async (req, res) => {
    try {
        Object.keys(registerModules).forEach((key) => {
            app.delete(`/${key}`);
            delete registerModules[key];
        });

        await loadServices();
        res.json({ message: "Services reloaded successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Failed to reload services" });
    }
});

const startServer = async () => {
    try {
        await loadServices();
        
        mongoose.connect(process.env.MONGO_URI)
            //await seedAccountTypes()
            //await seedAccountGroups()
            //await seedPredefinedAccounts()
            stockSnapFunc()
            .then(() => {
                console.log('✅ All seeding completed successfully.');
                console.log('✅ Connected to DB');
            })
            .catch((error) => {
                console.error('❌ DB connection error:', error.message);
            });

        app.listen(PORT, () => {
            console.log(`🚀 App running on port ${PORT}`);
        });
    } catch (error) {
        console.error("❌ Failed to start server:", error);
        process.exit(1);
    }
};

startServer();