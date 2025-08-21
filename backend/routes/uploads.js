// routes/uploads.js
import express from "express";
import multer from "multer";
import { verifyToken } from "../middlewares/auth.js";
import Upload from "../models/Upload.js";
import path from "path";
import fs from "fs";

const router = express.Router();

// dossier local
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const dir = "uploads";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (_req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// POST /api/uploads
router.post("/", verifyToken, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Fichier manquant" });

    const file = await Upload.create({
      userId: req.user.id,
      filename: req.file.originalname,
      url: `/uploads/${req.file.filename}`,
      type: req.body.type || "image"
    });

    res.status(201).json(file);
  } catch {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// GET /api/uploads/me
router.get("/me", verifyToken, async (req, res) => {
  try {
    const items = await Upload.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(items);
  } catch {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
