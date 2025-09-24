// routes/resume.js
import express from "express";
import Resume from "../models/Resume.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

// 🔹 Créer ou mettre à jour le CV
router.post("/", verifyToken, async (req, res) => {
  try {
    const data = req.body;
    let resume = await Resume.findOne({ owner: req.user.id });

    if (resume) {
      // Modifier le CV existant
      resume = await Resume.findByIdAndUpdate(resume._id, data, { new: true, runValidators: true });
    } else {
      // Créer un nouveau CV
      resume = new Resume({ ...data, owner: req.user.id });
      await resume.save();
    }

    res.json(resume);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de la sauvegarde du CV." });
  }
});

// 🔹 Supprimer le CV
router.delete("/me", verifyToken, async (req, res) => {
  try {
    await Resume.findOneAndDelete({ owner: req.user.id });
    res.json({ message: "CV supprimé avec succès" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de la suppression du CV." });
  }
});

// Récupérer le CV privé du propriétaire
router.get("/me", verifyToken, async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Utilisateur non identifié" });
    }

    const resume = await Resume.findOne({ owner: req.user.id });

    if (!resume) {
      return res.status(200).json(null); // ⚡ renvoie null si aucun CV
    }

    res.json(resume);
  } catch (err) {
    console.error("Erreur serveur /me :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});


// 🔹 Récupérer un CV public par ID
router.get("/public/:id", async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume || !resume.isPublic) return res.status(404).json({ message: "CV non trouvé ou privé" });
    res.json(resume);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

export default router;
