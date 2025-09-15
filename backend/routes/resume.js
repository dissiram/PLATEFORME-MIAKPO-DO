import express from "express";
import Resume from "../models/Resume.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

// Créer ou mettre à jour un CV pour l'utilisateur connecté
router.post("/", verifyToken, async (req, res) => {
  try {
    const existing = await Resume.findOne({ owner: req.user.id });

    if (existing) {
      Object.assign(existing, req.body);
      await existing.save();
      return res.json(existing);
    }

    const resume = new Resume({
      ...req.body,
      owner: req.user.id,
    });
    await resume.save();
    res.status(201).json(resume);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Récupérer le CV PUBLIC ou accessible pour le recruteur/admin ou le candidat
// Récupérer le CV PUBLIC d'un utilisateur par son ID (accessible à tous)
router.get("/public/user/:userId", async (req, res) => {
  try {
    const resume = await Resume.findOne({ 
      owner: req.params.userId,
      isPublic: true 
    });

    if (!resume) {
      return res.status(404).json({ error: "CV non trouvé ou non public" });
    }

    res.json(resume);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});


// Récupérer le CV par ID (privé ou admin)
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) return res.status(404).json({ error: "CV introuvable" });

    if (!resume.isPublic &&
        resume.owner.toString() !== req.user.id &&
        req.user.role !== "admin") {
      return res.status(403).json({ error: "Non autorisé" });
    }

    res.json(resume);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
