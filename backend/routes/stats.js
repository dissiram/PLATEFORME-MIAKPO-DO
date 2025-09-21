// routes/stats.js
import express from "express";
import Offer from "../models/Offer.js";
import Application from "../models/Application.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

// ----------------- Statistiques globales du recruteur -----------------
router.get("/", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Récupérer toutes les offres du recruteur
    const offers = await Offer.find({ recruiterId: userId });
    const offerIds = offers.map((o) => o._id);

    // Compter les offres publiées
    const offersCount = offers.length;

    // Compter les candidatures reçues
    const applicationsCount = await Application.countDocuments({
      offer: { $in: offerIds },
    });

  
    res.json({
      offersCount,
      applicationsCount,
      clicksCount,
    });
  } catch (err) {
    console.error("Erreur récupération stats globales:", err);
    res.status(500).json({ error: err.message });
  }
});

// ----------------- Statistiques par catégorie -----------------
router.get("/categories", async (_req, res) => {
  try {
    const stats = await Offer.aggregate([
      {
        $group: {
          _id: "$category", // Regroupe par champ "category"
          count: { $sum: 1 }, // Compte le nombre d'offres par catégorie
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          count: 1,
        },
      },
      { $sort: { count: -1 } }, // Trie par nombre décroissant
    ]);

    res.json(stats);
  } catch (err) {
    console.error("Erreur récupération stats catégories:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
