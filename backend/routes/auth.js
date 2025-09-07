import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const router = express.Router();

function signToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

router.post("/register", async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password) return res.status(400).json({ error: "Tous les champs sont obligatoires" });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: "Email déjà utilisé" });

    const user = new User({ username, email, password, role });
    await user.save();

    const token = signToken(user);
    res.status(201).json({ token, user: { ...user.toObject(), password: undefined } });
  } catch (e) {
  console.error("Erreur inscription :", e); // <--- log complet
  res.status(500).json({ error: e.message });
}

});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email et mot de passe requis" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Utilisateur introuvable" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ error: "Mot de passe incorrect" });

    const token = signToken(user);
    res.json({ token, user: { ...user.toObject(), password: undefined } });
  } catch {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
