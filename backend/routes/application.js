import express from "express";
import mongoose from "mongoose";
import Application from "../models/Application.js";
import Offer from "../models/Offer.js";
import { verifyToken } from "../middlewares/auth.js";
import Resume from "../models/Resume.js";
const router = express.Router();

// ----------------- POST : postuler à une offre -----------------
router.post("/:offerId/apply", verifyToken, async (req, res) => {
  try {
    const { offerId } = req.params;
    const userId = req.user.id;

    // Vérifier que l'offre existe
    if (!mongoose.Types.ObjectId.isValid(offerId)) {
      return res.status(400).json({ message: "ID d'offre invalide" });
    }
    const offer = await Offer.findById(offerId);
    if (!offer) return res.status(404).json({ message: "Offre non trouvée" });

    // Vérifier si l'utilisateur a déjà postulé
    const existing = await Application.findOne({ offer: offerId, applicant: userId });
    if (existing) return res.status(400).json({ message: "Vous avez déjà postulé à cette offre" });

    const application = new Application({
      offer: offerId,
      applicant: userId,
      status: "En attente",
    });

    await application.save();
    res.status(201).json({ message: "Candidature envoyée avec succès", application });

  } catch (error) {
    console.error("Erreur lors de la candidature:", error);
    res.status(500).json({ message: "Erreur serveur lors de la candidature" });
  }
});

// ----------------- GET : candidatures pour les offres du recruteur -----------------
// router.get("/my-applications", verifyToken, async (req, res) => {
//   try {
//     const recruiterId = req.user.id;

//     const applications = await Application.find()
//       .populate({
//         path: "offer",
//         match: { recruiterId },
//         select: "title company location contractType createdAt",
//       })
//       .populate({
//         path: "applicant",
//         select: "username email",
//       })
//       .sort({ createdAt: -1 });

//     const filteredApplications = applications.filter(app => app.offer);

//     res.json(filteredApplications);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Erreur serveur" });
//   }
// });

router.get("/my-applications", verifyToken, async (req, res) => {
  try {
    const recruiterId = req.user.id;

    const applications = await Application.find()
      .populate("offer", "title company location contractType recruiterId")
      .populate({
        path: "applicant",
        select: "username email image portfolio",
        populate: {
          path: "publicResume" // récupère directement le CV public
        }
      })
      .sort({ createdAt: -1 });

    const filteredApplications = applications.filter(
      (app) => app.offer?.recruiterId.toString() === recruiterId
    );

    res.json(filteredApplications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});



// ----------------- GET : historique des candidatures du candidat -----------------
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
        populate: { path: "recruiterId", select: "companyName" },
      })
      .sort({ createdAt: -1 });

    res.json(applications);

  } catch (err) {
    console.error("Erreur historique candidatures:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// ----------------- PUT : mettre à jour le statut d'une candidature -----------------
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

    // Vérifier que le recruteur est bien propriétaire de l'offre
    if (application.offer.recruiterId.toString() !== req.user.id) {
      return res.status(403).json({ error: "Non autorisé - Vous n'êtes pas le recruteur de cette offre" });
    }

    application.status = status;
    application.updatedAt = new Date();
    await application.save();

    res.json({ message: "Statut mis à jour avec succès", application });

  } catch (err) {
    console.error("Erreur mise à jour statut:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// ----------------- DELETE : supprimer une candidature -----------------
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

  } catch (err) {
    console.error("Erreur suppression candidature:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
