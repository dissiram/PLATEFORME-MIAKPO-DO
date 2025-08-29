import express from "express";
import Offer from "../models/Offer.js";
import { verifyToken, requireRoles } from "../middlewares/auth.js";
import { upload } from "../middlewares/upload.js";

const router = express.Router();

// Créer une offre avec image + fichiers
router.post("/", verifyToken, requireRoles("announcer", "admin"), upload.fields([
  { name: "image", maxCount: 1 },
  { name: "attachments", maxCount: 5 }
]), async (req, res) => {
  try {
    const data = req.body;
    const image = req.files?.image?.[0]?.path;
    const attachments = req.files?.attachments?.map(f => f.path) || [];

    const offer = await Offer.create({ ...data, image, attachments, recruiterId: req.user.id });
    res.status(201).json(offer);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// Récupérer toutes les offres
router.get("/", async (req, res) => {
  try {
    const offers = await Offer.find().sort({ createdAt: -1 });
    res.json(offers);
  } catch {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
