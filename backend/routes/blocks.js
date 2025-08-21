// routes/blocks.js
import express from "express";
import Block from "../models/Block.js";

const router = express.Router();

// Ajouter un bloc
router.post("/", async (req, res) => {
  try {
    const block = new Block(req.body);
    await block.save();
    res.status(201).json(block);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Récupérer tous les blocs
router.get("/", async (req, res) => {
  try {
    const blocks = await Block.find();
    res.json(blocks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mettre à jour un bloc
router.put("/:id", async (req, res) => {
  try {
    const block = await Block.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(block);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Supprimer un bloc
router.delete("/:id", async (req, res) => {
  try {
    await Block.findByIdAndDelete(req.params.id);
    res.json({ message: "Bloc supprimé" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
