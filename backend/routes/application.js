// routes/applications.js
import express from "express";
import Application from "../models/Application.js";
import { verifyToken } from "../middlewares/auth.js";
import Offer from "../models/Offer.js";
import Resume from "../models/Resume.js";
import Portfolio from "../models/Portfolio.js";

const router = express.Router();

// POST : postuler à une offre
router.post("/:offerId/apply", verifyToken, async (req, res) => {
  try {
    const { offerId } = req.params;
    const userId = req.user.id;

    const existing = await Application.findOne({ offer: offerId, applicant: userId });
    if (existing) return res.status(400).json({ message: "Vous avez déjà postulé" });

    const application = new Application({ offer: offerId, applicant: userId });
    await application.save();

    res.status(201).json({ message: "Candidature envoyée" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// GET : candidatures pour les offres du recruteur connecté
// Remplacer la route GET /my-applications existante dans routes/applications.js

// GET : candidatures pour les offres du recruteur connecté (avec filtre optionnel par offre)
router.get("/my-applications", verifyToken, async (req, res) => {
  try {
    const { offerId } = req.query; // Paramètre optionnel pour filtrer par offre
    
    // Construire le filtre de base
    let applicationFilter = {};
    if (offerId) {
      applicationFilter.offer = offerId;
    }

    const applications = await Application.find(applicationFilter)
      .populate("offer", "title company location contractType recruiterId")
      .sort({ createdAt: -1 });

    // Filtrer uniquement les candidatures des offres créées par ce recruteur
    const myApps = applications.filter(
      (app) => app.offer?.recruiterId?.toString() === req.user.id
    );

    // Si on filtre par offre spécifique, enrichir avec les données CV/Portfolio
    if (offerId && myApps.length > 0) {
      const candidates = await Promise.all(
        myApps.map(async (app) => {
          // Récupérer le CV
          const resume = await Resume.findOne({ owner: app.applicant });
          
          // Récupérer le portfolio  
          const portfolio = await Portfolio.findOne({ user: app.applicant });

          return {
            applicationId: app._id,
            userId: app.applicant,
            status: app.status,
            appliedAt: app.createdAt,
            resume: resume || null,
            portfolio: portfolio || null,
          };
        })
      );

      const validCandidates = candidates.filter(candidate => 
        candidate.resume || candidate.portfolio
      );

      // Format pour le composant React
      const offer = myApps[0]?.offer;
      return res.json({
        offer: {
          _id: offer._id,
          title: offer.title,
          company: offer.company,
          location: offer.location,
          contractType: offer.contractType,
        },
        candidates: validCandidates
      });
    }

    // Sinon, retourner le format original
    res.json(myApps);
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// GET : historique des candidatures de l'utilisateur connecté
router.get("/my-history", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const applications = await Application.find({ applicant: userId })
      .populate("offer", "title company deadline")
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// PUT : mettre à jour le statut d'une candidature
router.put("/:applicationId/status", verifyToken, async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    if (!["En attente", "Acceptée", "Refusée"].includes(status)) {
      return res.status(400).json({ error: "Statut invalide" });
    }

    const application = await Application.findById(applicationId).populate("offer");

    if (!application) {
      return res.status(404).json({ error: "Candidature non trouvée" });
    }

    // Vérifier que le recruteur connecté est bien propriétaire de l'offre
    if (application.offer.recruiterId.toString() !== req.user.id) {
      return res.status(403).json({ error: "Non autorisé" });
    }

    application.status = status;
    await application.save();

    res.json({ message: "Statut mis à jour", application });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
