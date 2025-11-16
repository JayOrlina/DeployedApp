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
const __dirname = path.resolbve();

// Middleware to parse JSON bodies
if (process.env.NODE_ENV !== "production") {
  app.use(
    cors({
      origin: "http://localhost:5173", // Adjust the port if your frontend runs on a different port
    })
  );
}

app.use(express.json());
app.use(rateLimiter);

app.use("/api/batch", batchesRoutes);

if (process.env.NODE_ENV === "production") {
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
