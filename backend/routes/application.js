import express from "express";
import Application from "../models/Application.js";
import { verifyToken } from "../middlewares/auth.js";
import Offer from "../models/Offer.js";

const router = express.Router();


// Postuler à une offre
router.post("/:offerId/apply", verifyToken, async (req, res) => {
  try {
    const { offerId } = req.params;
    const userId = req.user.id;

    const offer = await Offer.findById(offerId);
    if (!offer) return res.status(404).json({ message: "Offre non trouvée" });

    const existingApplication = await Application.findOne({ offer: offerId, applicant: userId });
    if (existingApplication) {
      return res.status(400).json({ message: "Vous avez déjà postulé à cette offre" });
    }

    const application = new Application({ 
      offer: offerId, 
      applicant: userId,
      status: "En attente"
    });
    await application.save();

    res.status(201).json({ message: "Candidature envoyée avec succès", application });
  } catch (error) {
    console.error("Erreur lors de la candidature:", error);
    res.status(500).json({ message: "Erreur serveur lors de la candidature" });
  }
});

// Récupérer toutes les candidatures pour les offres du recruteur
router.get("/my-applications", verifyToken, async (req, res) => {
  try {
    const { offerId, status } = req.query;
    const recruiterOffers = await Offer.find({ recruiterId: req.user.id });
    const offerIds = recruiterOffers.map((offer) => offer._id);

    let filter = { offer: { $in: offerIds } };
    if (offerId) {
      if (!offerIds.includes(offerId)) {
        return res.status(403).json({ error: "Accès non autorisé à cette offre" });
      }
      filter.offer = offerId;
    }
    if (status) filter.status = status;

    const applications = await Application.find(filter)
      .populate("offer", "title company location contractType createdAt")
      .populate("applicant", "firstName lastName email phone resume")
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    console.error("Erreur lors de la récupération des candidatures:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// Historique des candidatures d’un candidat
router.get("/my-history", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { status } = req.query;

    let filter = { applicant: userId };
    if (status) filter.status = status;

    const applications = await Application.find(filter)
      .populate({
        path: "offer",
        select: "title company location contractType salary deadline recruiterId",
        populate: { path: "recruiterId", select: "companyName" }
      })
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'historique:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// 3 dernières candidatures reçues par le recruteur
router.get("/recent-applications", verifyToken, async (req, res) => {
  try {
    const recruiterOffers = await Offer.find({ recruiterId: req.user.id });
    const offerIds = recruiterOffers.map((offer) => offer._id);

    const recentApplications = await Application.find({ offer: { $in: offerIds } })
      .populate("offer", "title company")
      .populate("applicant", "firstName lastName email")
      .sort({ createdAt: -1 })
      .limit(3);

    res.json(recentApplications);
  } catch (error) {
    console.error("Erreur lors de la récupération des candidatures récentes:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});



// Détails d’une candidature
router.get("/:applicationId", verifyToken, async (req, res) => {
  try {
    const { applicationId } = req.params;

 
    const application = await Application.findById(applicationId)
      .populate("offer", "title company location contractType description requirements salary deadline recruiterId")
      .populate("applicant", "firstName lastName email phone resume coverLetter");

    if (!application) return res.status(404).json({ error: "Candidature non trouvée" });

    const isApplicant = application.applicant._id.toString() === req.user.id;
    const isRecruiter = application.offer.recruiterId.toString() === req.user.id;
    if (!isApplicant && !isRecruiter) {
      return res.status(403).json({ error: "Accès non autorisé à cette candidature" });
    }

    res.json(application);
  } catch (error) {
    console.error("Erreur lors de la récupération de la candidature:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.get("/recruiter/:recruiterId", verifyToken, async (req, res) => {
  try {
    // Vérifier rôle recruteur ou admin
    if (req.user.role !== "recruteur" && req.user.role !== "admin") {
      return res.status(403).json({ error: "Accès non autorisé" });
    }

    const applications = await Application.find({ offer: req.query.offerId }) // filtre si besoin
      .populate("applicant", "fullName username email profileImage contactInfo") // <- important
      .exec();

    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mettre à jour le statut d’une candidature
router.put("/:applicationId/status", verifyToken, async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    const validStatuses = ["En attente", "En cours de traitement", "Acceptée", "Refusée", "Annulée"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Statut invalide" });
    }

    const application = await Application.findById(applicationId).populate("offer");
    if (!application) return res.status(404).json({ error: "Candidature non trouvée" });

    if (application.offer.recruiterId.toString() !== req.user.id) {
      return res.status(403).json({ error: "Non autorisé - Vous n'êtes pas le recruteur de cette offre" });
    }

    application.status = status;
    application.updatedAt = new Date();
    await application.save();

    res.json({ message: "Statut mis à jour avec succès", application });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// Supprimer une candidature
router.delete("/:applicationId", verifyToken, async (req, res) => {
  try {
    const { applicationId } = req.params;
    const userId = req.user.id;

    const application = await Application.findById(applicationId);
    if (!application) return res.status(404).json({ error: "Candidature non trouvée" });

    if (application.applicant.toString() !== userId) {
      return res.status(403).json({ error: "Non autorisé - Vous ne pouvez pas supprimer cette candidature" });
    }

    if (application.status !== "En attente") {
      return res.status(400).json({ error: "Impossible de retirer une candidature déjà traitée" });
    }

    await Application.findByIdAndDelete(applicationId);
    res.json({ message: "Candidature retirée avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de la candidature:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});


export default router;
