import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User.js";

const router = express.Router();

function signToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { username, email, password, role = "user" } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "Tous les champs sont obligatoires" });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: "Email déjà utilisé" });

    // NE PAS re-hasher ici, le pre("save") le fait automatiquement
    const user = new User({ username, email, password, role });
    await user.save();

    const token = signToken(user);
    res.status(201).json({ 
      token, 
      user: { ...user.toObject(), password: undefined } 
    });
  } catch (e) {
    console.error("Erreur serveur /register:", e);
    res.status(500).json({ error: "Erreur serveur" });
  }
});


// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    //   console.log("Body reçu login:", req.body); // 🔹

    const { email, password } = req.body;

    // Vérifier que les champs existent
    if (!email || !password) {
      return res.status(400).json({ error: "Email et mot de passe requis" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Utilisateur introuvable" });
    }

    // comparePassword est asynchrone, donc on met un await
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: "Mot de passe incorrect" });
    }

    const token = signToken(user);
    res.json({
      token,
      user: { ...user.toObject(), password: undefined } // on ne renvoie jamais le mot de passe
    });
  } catch (err) {
    console.error("Erreur serveur /login:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});


export default router;
