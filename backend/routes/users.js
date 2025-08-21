// routes/users.js
import express from "express";
import { verifyToken } from "../middlewares/auth.js";
import User from "../models/User.js";
import Portfolio from "../models/Portfolio.js";
import Offer from "../models/Offer.js";
import Match from "../models/Match.js";
import Upload from "../models/Upload.js";

const router = express.Router();

// GET /api/users/me
router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ error: "User introuvable" });
    res.json(user);
  } catch {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// PUT /api/users/me
router.put("/me", verifyToken, async (req, res) => {
  try {
    const allowed = ["username", "profileImage", "phone", "address", "bio", "socials"];
    const patch = {};
    for (const key of allowed) if (key in req.body) patch[key] = req.body[key];

    const updated = await User.findByIdAndUpdate(req.user.id, patch, { new: true }).select("-password");
    res.json(updated);
  } catch {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// DELETE /api/users/me  (cascade)
router.delete("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User introuvable" });

    // Si talent → supprimer portfolio + matches (talent)
    if (user.role === "talent") {
      const p = await Portfolio.findOne({ userId: user._id });
      if (p) await Portfolio.deleteOne({ _id: p._id });
      await Match.deleteMany({ talentId: user._id });
    }

    // Si recruteur → supprimer offres + matches associés
    if (user.role === "recruteur") {
      const offers = await Offer.find({ recruiterId: user._id });
      const offerIds = offers.map(o => o._id);
      await Offer.deleteMany({ recruiterId: user._id });
      if (offerIds.length) {
        await Match.deleteMany({ offerId: { $in: offerIds } });
      }
    }

    // Supprimer uploads
    await Upload.deleteMany({ userId: user._id });

    // Supprimer user
    await User.findByIdAndDelete(user._id);

    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
