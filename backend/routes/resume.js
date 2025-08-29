import express from "express";
import Resume from "../models/Resume.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

// Créer un CV (lié à l’utilisateur connecté)
router.post("/", verifyToken, async (req, res) => {
  try {
    const resume = new Resume({
      ...req.body,
      owner: req.user.id, // lien avec l'utilisateur connecté
    });
    await resume.save();
    res.status(201).json(resume);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Récupérer le CV du user connecté
router.get("/me", verifyToken, async (req, res) => {
  try {
    const resume = await Resume.findOne({ owner: req.user.id });
    if (!resume) return res.status(404).json({ error: "CV introuvable" });
    res.json(resume);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Récupérer tous les CV (optionnel : seulement pour admin)
router.get("/", async (req, res) => {
  try {
    const resumes = await Resume.find();
    res.json(resumes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Récupérer un CV par ID
router.get("/:id", async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) return res.status(404).json({ error: "CV introuvable" });
    res.json(resume);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mettre à jour un CV (seulement le propriétaire peut modifier)
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) return res.status(404).json({ error: "CV introuvable" });

    if (resume.owner.toString() !== req.user.id) {
      return res.status(403).json({ error: "Non autorisé" });
    }

    Object.assign(resume, req.body);
    await resume.save();

    res.json(resume);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Supprimer un CV (seulement le propriétaire peut supprimer)
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) return res.status(404).json({ error: "CV introuvable" });

    if (resume.owner.toString() !== req.user.id) {
      return res.status(403).json({ error: "Non autorisé" });
    }

    await resume.deleteOne();
    res.json({ message: "CV supprimé" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
