import express from "express";
import Application from "../models/Application.js";
import { verifyToken } from "../middlewares/auth.js"; // ✅ corrigé
import Offer from "../models/Offer.js"; 
import Resume from "../models/Resume.js";

const router = express.Router();

// Middleware pour vérifier que c'est un recruteur
const recruiterMiddleware = (req, res, next) => {
  if (req.user.role !== "recruteur") {
    return res.status(403).json({ error: "Accès interdit" });
  }
  next();
};

// Récupérer les candidatures pour une offre et les CV associés
router.get("/offers/:jobId", verifyToken, recruiterMiddleware, async (req, res) => {
  try {
    // Vérifie que l'offre appartient bien au recruteur connecté
    const offer = await Offer.findById(req.params.jobId);
    if (!offer) {
      return res.status(404).json({ error: "Offre introuvable" });
    }
    if (offer.recruiterId.toString() !== req.user.id.toString()) { // ✅ utiliser id, pas _id
      return res.status(403).json({ error: "Vous n'êtes pas le propriétaire de cette offre" });
    }

    // Récupère les candidatures liées à cette offre
    const applications = await Application.find({ jobId: req.params.jobId })
      .populate("resume") // récupère le CV complet
      .populate("applicant", "username email"); // récupère nom + email du candidat

    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
