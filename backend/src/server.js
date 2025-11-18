import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';

import batchesRoutes from './routes/batchesRoutes.js';
import { connectDb } from './config/db.js';
import rateLimiter from './middleware/rateLimiter.js';


dotenv.config();

const app = express();
const PORT= process.env.PORT || 5001;
const __dirname = path.resolve();

// Middleware to parse JSON bodies

// 🎯 FIX: CONDITIONAL CORS IMPLEMENTATION
if (process.env.NODE_ENV !== "production") {
    // 1. In Development: Allow the specific Web App localhost origin.
    app.use(
        cors({
            origin: "http://localhost:5173",
        })
    );
} else {
    // 2. In Production (Deployed on Render): Allow ALL origins (*).
    // This is required because the mobile app's origin cannot be easily predicted, 
    // and this server is primarily an API/Controller.
    app.use(cors());
}

app.use(express.json());
app.use(rateLimiter);

app.use("/api/batch", batchesRoutes);

if (process.env.NODE_ENV === "production") {
    // This block handles serving the static web frontend files.
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
}

connectDb().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
