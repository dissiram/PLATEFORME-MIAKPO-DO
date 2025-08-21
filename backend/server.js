// server.js
import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import path from "path";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import portfolioRoutes from "./routes/portfolios.js";
import offerRoutes from "./routes/offers.js";
import matchRoutes from "./routes/matches.js";
import uploadRoutes from "./routes/uploads.js";

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN, credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(morgan("dev"));

// Exposer les fichiers uploadés
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log(" MongoDB connecté"))
  .catch(err => console.error("MongoDB error:", err));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/portfolios", portfolioRoutes);
app.use("/api/offers", offerRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/uploads", uploadRoutes);

app.get("/health", (_req, res) => res.json({ ok: true }));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(` API on http://localhost:${port}`));
