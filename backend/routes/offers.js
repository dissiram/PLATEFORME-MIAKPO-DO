import express from "express";
import Offer from "../models/Offer.js";
import { verifyToken, requireRoles } from "../middlewares/auth.js";
import { upload } from "../middlewares/upload.js";

const router = express.Router();

// ----------------- Créer une offre -----------------
router.post(
  "/",
  verifyToken,
  requireRoles("announcer", "admin"),
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "attachments", maxCount: 5 },
  ]),
  async (req, res) => {
    try {
      const data = req.body;
      const image = req.files?.image?.[0]?.path;
      const attachments = req.files?.attachments?.map(f => f.path) || [];

      const offer = await Offer.create({
        ...data,
        image,
        attachments,
        recruiterId: req.user.id,
      });

      res.status(201).json(offer);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Erreur serveur" });
    }
  }
);

// ----------------- Supprimer une offre -----------------
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) return res.status(404).json({ error: "Offre non trouvée" });

    if (offer.recruiterId.toString() !== req.user.id) {
      return res.status(403).json({ error: "Non autorisé" });
    }

    await offer.remove();
    res.json({ message: "Offre supprimée" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// ----------------- Récupérer toutes les offres -----------------
router.get("/", async (req, res) => {
  try {
    const offers = await Offer.find().sort({ createdAt: -1 });
    res.json(offers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// ----------------- Récupérer toutes les offres d'un utilisateur -----------------
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const offers = await Offer.find({ recruiterId: userId }).sort({ createdAt: -1 });
    res.json(offers);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// ----------------- Récupérer les offres de l'utilisateur connecté -----------------
router.get("/me", verifyToken, async (req, res) => {
  try {
    const offers = await Offer.find({ recruiterId: req.user.id }).sort({ createdAt: -1 });
    res.json(offers);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// ----------------- Modifier une offre -----------------
router.put(
  "/:id",
  verifyToken,
  requireRoles("announcer", "admin"),
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "attachments", maxCount: 5 },
  ]),
  async (req, res) => {
    try {
      const offer = await Offer.findById(req.params.id);
      if (!offer) return res.status(404).json({ error: "Offre non trouvée" });

      if (offer.recruiterId.toString() !== req.user.id) {
        return res.status(403).json({ error: "Non autorisé" });
      }

      const data = req.body;
      const image = req.files?.image?.[0]?.path || offer.image;
      const attachments =
        req.files?.attachments?.map((f) => f.path) || offer.attachments;

      offer.set({ ...data, image, attachments });
      await offer.save();

      res.json(offer);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Erreur serveur" });
    }
  }
);

export default router;
