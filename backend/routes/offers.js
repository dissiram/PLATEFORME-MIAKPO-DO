// routes/offers.js
import express from "express";
import { verifyToken, requireRoles } from "../middlewares/auth.js";
import Offer from "../models/Offer.js";

const router = express.Router();

// POST /api/offers (recruteur)
router.post("/", verifyToken, requireRoles("recruteur", "admin"), async (req, res) => {
  try {
    const offer = await Offer.create({
      ...req.body,
      recruiterId: req.user.id,
    });
    res.status(201).json(offer);
  } catch {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// GET /api/offers?location=Lome&skill=React&page=1&limit=10
router.get("/", async (req, res) => {
  try {
    const { location, skill, q, page = 1, limit = 10 } = req.query;
    const filters = {};
    if (location) filters.location = location;
    if (skill) filters.skillsRequired = { $in: [skill] };
    if (q) filters.$text = { $search: q }; // => pense à créer un index text

    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      Offer.find(filters).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Offer.countDocuments(filters)
    ]);

    res.json({
      items,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit))
    });
  } catch {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// GET /api/offers/:id
router.get("/:id", async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) return res.status(404).json({ error: "Offre introuvable" });
    res.json(offer);
  } catch {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// PUT /api/offers/:id (owner only)
router.put("/:id", verifyToken, requireRoles("recruteur", "admin"), async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) return res.status(404).json({ error: "Introuvable" });

    if (req.user.role !== "admin" && String(offer.recruiterId) !== req.user.id) {
      return res.status(403).json({ error: "Accès interdit" });
    }

    Object.assign(offer, req.body);
    await offer.save();
    res.json(offer);
  } catch {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// DELETE /api/offers/:id (owner only)
router.delete("/:id", verifyToken, requireRoles("recruteur", "admin"), async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) return res.status(404).json({ error: "Introuvable" });

    if (req.user.role !== "admin" && String(offer.recruiterId) !== req.user.id) {
      return res.status(403).json({ error: "Accès interdit" });
    }

    await offer.deleteOne();
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
