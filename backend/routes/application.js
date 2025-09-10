// routes/applications.js
import express from "express";
import Application from "../models/Application.js";
import { verifyToken } from "../middlewares/auth.js";
import Offer from "../models/Offer.js";

const router = express.Router();


// POST : postuler à une offre
router.post("/:offerId/apply", verifyToken, async (req, res) => {
  try {
    const { offerId } = req.params;
    const userId = req.user.id;

    // Vérifier si l'utilisateur a déjà postulé
    const existing = await Application.findOne({ offer: offerId, applicant: userId });
    if (existing) return res.status(400).json({ message: "Vous avez déjà postulé" });

    const application = new Application({ offer: offerId, applicant: userId });
    await application.save();

    res.status(201).json({ message: "Candidature envoyée avec succès" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});


// GET : candidatures pour les offres du recruteur connecté
router.get("/my-applications", verifyToken, async (req, res) => {
  try {
    const { offerId } = req.query; // optionnel
    let filter = {};

    if (offerId) {
      filter.offer = offerId;
    }

    const applications = await Application.find(filter)
      .populate("offer", "title company location contractType recruiterId")
      .populate("applicant", "username email") // optionnel : infos basiques du candidat
      .sort({ createdAt: -1 });

    // Filtrer uniquement les candidatures des offres du recruteur connecté
    const myApps = applications.filter(
      (app) => app.offer?.recruiterId?.toString() === req.user.id
    );

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

    // Vérifier que le recruteur est bien propriétaire de l'offre
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
