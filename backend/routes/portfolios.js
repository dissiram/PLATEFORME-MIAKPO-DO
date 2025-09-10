// routes/portfolio.js
import express from "express";
import Portfolio from "../models/Portfolio.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

//  Créer ou mettre à jour le portfolio de l’utilisateur (upsert)
router.post("/", verifyToken, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(400).json({ error: "Utilisateur non identifié" });

    // Préparer le payload
    const payload = {
      ...req.body,
      user: userId,
    };

    // Upsert : créer ou mettre à jour le portfolio
    const portfolio = await Portfolio.findOneAndUpdate(
      { user: userId },           // recherche par user
      { $set: payload },          // mise à jour du contenu
      { upsert: true, new: true } // création si absent + renvoie le doc mis à jour
    );

    res.status(200).json(portfolio);
  } catch (err) {
    console.error("Erreur création/mise à jour portfolio:", err);
    //  Si problème d'unicité persiste, informer
    if (err.code === 11000) {
      return res.status(400).json({ error: "Portfolio déjà existant pour cet utilisateur" });
    }
    res.status(500).json({ error: "Erreur création/mise à jour portfolio" });
  }
});

//  Récupérer le portfolio de l’utilisateur connecté
router.get("/me", verifyToken, async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.user.id });
    if (!portfolio) return res.status(404).json({ error: "Portfolio introuvable" });
    res.json(portfolio);
  } catch (err) {
    console.error("Erreur récupération portfolio:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

//  Récupérer tous les portfolios
router.get("/", async (_req, res) => {
  try {
    const portfolios = await Portfolio.find();
    res.json(portfolios);
  } catch (err) {
    res.status(500).json({ error: "Erreur lecture portfolios" });
  }
});

//  Récupérer le portfolio d’un utilisateur spécifique par son ID
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const portfolio = await Portfolio.findOne({ user: userId });
    if (!portfolio) {
      return res.status(404).json({ error: "Portfolio introuvable pour cet utilisateur" });
    }
    res.json(portfolio);
  } catch (err) {
    console.error("Erreur récupération portfolio utilisateur:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// Récupérer le portfolio PUBLIC d’un utilisateur
router.get("/:userId/public", async (req, res) => {
  try {
    const { userId } = req.params;
    const portfolio = await Portfolio.findOne({ user: userId, public: true }).populate("user", "username email");

    if (!portfolio) {
      return res.status(404).json({ error: "Portfolio non trouvé ou privé" });
    }

    res.json(portfolio);
  } catch (err) {
    console.error("Erreur récupération portfolio public:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
