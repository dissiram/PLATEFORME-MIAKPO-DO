import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import path from "path";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import offerRoutes from "./routes/offers.js";
import uploadRoutes from "./routes/uploads.js";
import portfolioRoutes from "./routes/portfolios.js";
import resumeRoutes from "./routes/resume.js";
import applicationRoutes from "./routes/application.js";
import statsRoutes from "./routes/stats.js";
import adminRoutes from './routes/admin.js';

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN, credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(morgan("dev"));

// Exposer les fichiers uploadés
app.use('/uploads', express.static(path.join(path.resolve(), 'uploads')));

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connecté"))
  .catch(err => console.error("MongoDB error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/offers", offerRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/portfolios", portfolioRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/stats", statsRoutes);
app.get("/health", (_req, res) => res.json({ ok: true }));
app.use('/api/admin', adminRoutes);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`API running on http://localhost:${port}`));
