import express from "express";
import Page from "../models/Page.js";

const router = express.Router();

// Créer / publier une page
router.post("/", async (req, res) => {
  try {
    const page = await Page.create(req.body);
    res.status(201).json(page);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Récupérer une page par slug
router.get("/:slug", async (req, res) => {
  const page = await Page.findOne({ slug: req.params.slug });
  if (!page) return res.status(404).json({ error: "Page introuvable" });
  res.json(page);
});

// Mettre à jour une page (nom, desc, socials, blocks, etc.)
router.put("/:slug", async (req, res) => {
  try {
    const page = await Page.findOneAndUpdate(
      { slug: req.params.slug },
      req.body,
      { new: true, runValidators: true }
    );
    if (!page) return res.status(404).json({ error: "Page introuvable" });
    res.json(page);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Supprimer
router.delete("/:slug", async (req, res) => {
  await Page.findOneAndDelete({ slug: req.params.slug });
  res.json({ ok: true });
});

export default router;
