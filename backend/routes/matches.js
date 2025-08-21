// routes/matches.js
import express from "express";
import { verifyToken, requireRoles } from "../middlewares/auth.js";
import Match from "../models/Match.js";
import Offer from "../models/Offer.js";

const router = express.Router();

// POST /api/matches  (talent postule)
router.post("/", verifyToken, requireRoles("talent", "admin"), async (req, res) => {
  try {
    const { offerId } = req.body;
    if (!offerId) return res.status(400).json({ error: "offerId requis" });

    const exists = await Match.findOne({ offerId, talentId: req.user.id });
    if (exists) return res.status(400).json({ error: "Déjà postulé" });

    const match = await Match.create({
      offerId,
      talentId: req.user.id,
      status: "pending",
    });

    res.status(201).json(match);
  } catch {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// GET /api/matches/me (talent → ses candidatures)
router.get("/me", verifyToken, requireRoles("talent", "admin"), async (req, res) => {
  try {
    const items = await Match.find({ talentId: req.user.id }).populate("offerId");
    res.json(items);
  } catch {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// GET /api/matches/offer/:offerId (recruteur → candidatures d’une offre qu’il possède)
router.get("/offer/:offerId", verifyToken, requireRoles("recruteur", "admin"), async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.offerId);
    if (!offer) return res.status(404).json({ error: "Offre introuvable" });
    if (req.user.role !== "admin" && String(offer.recruiterId) !== req.user.id) {
      return res.status(403).json({ error: "Accès interdit" });
    }
    const items = await Match.find({ offerId: offer._id }).populate("talentId", "-password");
    res.json(items);
  } catch {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// PUT /api/matches/:id (recruteur met à jour statut)
router.put("/:id", verifyToken, requireRoles("recruteur", "admin"), async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);
    if (!match) return res.status(404).json({ error: "Introuvable" });

    const offer = await Offer.findById(match.offerId);
    if (!offer) return res.status(404).json({ error: "Offre introuvable" });

    if (req.user.role !== "admin" && String(offer.recruiterId) !== req.user.id) {
      return res.status(403).json({ error: "Accès interdit" });
    }

    match.status = req.body.status ?? match.status;
    await match.save();
    res.json(match);
  } catch {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
