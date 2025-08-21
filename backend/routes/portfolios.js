// routes/portfolios.js
import express from "express";
import { verifyToken, requireRoles } from "../middlewares/auth.js";
import Portfolio from "../models/Portfolio.js";
import User from "../models/User.js";

const router = express.Router();

// POST /api/portfolios  (create or update own)
router.post("/", verifyToken, requireRoles("talent", "admin"), async (req, res) => {
  try {
    const { slug, title, description, photo, socials = [], blocks = [] } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "Utilisateur introuvable" });

    let portfolio = await Portfolio.findOne({ userId: user._id });

    // si changement de slug, vérifier l’unicité
    if (slug) {
      const exists = await Portfolio.findOne({ slug, _id: { $ne: portfolio?._id } });
      if (exists) return res.status(400).json({ error: "Slug déjà utilisé" });
    }

    if (!portfolio) {
      portfolio = await Portfolio.create({
        userId: user._id,
        slug,
        title,
        description,
        photo,
        socials,
        blocks,
        published: false,
      });
    } else {
      portfolio.slug = slug ?? portfolio.slug;
      portfolio.title = title ?? portfolio.title;
      portfolio.description = description ?? portfolio.description;
      portfolio.photo = photo ?? portfolio.photo;
      portfolio.socials = socials ?? portfolio.socials;
      portfolio.blocks = Array.isArray(blocks) ? blocks : portfolio.blocks;
      await portfolio.save();
    }

    res.json(portfolio);
  } catch {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// GET /api/portfolios/:slug (public)
router.get("/:slug", async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ slug: req.params.slug });
    if (!portfolio) return res.status(404).json({ error: "Portfolio introuvable" });
    // Optionnel: n’exposer que si publié
    if (!portfolio.published) {
      return res.status(403).json({ error: "Portfolio non publié" });
    }
    res.json(portfolio);
  } catch {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// PUT /api/portfolios/publish/:id
router.put("/publish/:id", verifyToken, requireRoles("talent", "admin"), async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) return res.status(404).json({ error: "Introuvable" });
    // Ownership: le talent ne peut publier que son portfolio
    if (req.user.role !== "admin" && String(portfolio.userId) !== req.user.id) {
      return res.status(403).json({ error: "Accès interdit" });
    }
    portfolio.published = !!req.body.published;
    portfolio.publishedAt = portfolio.published ? new Date() : null;
    await portfolio.save();
    res.json(portfolio);
  } catch {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
