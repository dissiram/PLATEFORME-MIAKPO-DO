import express from "express";
import Portfolio from "../models/Portfolio.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

// Créer ou mettre à jour le portfolio de l’utilisateur
router.post("/", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const payload = { ...req.body, user: userId };

    const portfolio = await Portfolio.findOneAndUpdate(
      { user: userId },
      { $set: payload },
      { upsert: true, new: true }
    );

    res.status(200).json(portfolio);
  } catch (err) {
    console.error("Erreur création/mise à jour portfolio:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// Récupérer le portfolio de l’utilisateur connecté
router.get("/me", verifyToken, async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.user.id });
    if (!portfolio) return res.status(404).json({ error: "Portfolio introuvable" });
    res.json(portfolio);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// Récupérer tous les portfolios
router.get("/", async (_req, res) => {
  try {
    const portfolios = await Portfolio.find();
    res.json(portfolios);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// Récupérer le portfolio d’un utilisateur spécifique (privé)
router.get("/:userId", async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.params.userId });
    if (!portfolio) return res.status(404).json({ error: "Portfolio introuvable" });
    res.json(portfolio);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.get('/public/user/:userId', async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.params.userId, public: true });
    if (!portfolio) return res.status(404).json({ error: 'Portfolio non trouvé ou non public' });
    res.json(portfolio);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});


export default router;
