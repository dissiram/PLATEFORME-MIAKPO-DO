// routes/stats.js
import express from "express";
import Offer from "../models/Offer.js";
import Application from "../models/Application.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Compter les offres publiées par ce recruteur
    const offersCount = await Offer.countDocuments({ recruiterId: userId });

    // Compter les candidatures reçues pour les offres de ce recruteur
    const offerIds = (await Offer.find({ recruiterId: userId })).map(o => o._id);
    const applicationsCount = await Application.countDocuments({ offerId: { $in: offerIds } });

    res.json({
      offersCount,
      applicationsCount
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
