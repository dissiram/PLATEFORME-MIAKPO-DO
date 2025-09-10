import express from "express";
import Offer from "../models/Offer.js";
import Application from "../models/Application.js";
import OfferClick from "../models/OfferClick.js";
import Response from "../models/Response.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

// GET /api/stats
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

    // Compter les clics sur les annonces
    const clicksCount = await OfferClick.countDocuments({
      offer: { $in: offerIds },
    });

    // Compter les réponses données aux candidatures
    const responsesCount = await Response.countDocuments({
      offer: { $in: offerIds },
    });

    res.json({
      offersCount,
      applicationsCount,
      responsesCount,
      clicksCount,
    });
  } catch (err) {
    console.error("Erreur récupération stats:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
