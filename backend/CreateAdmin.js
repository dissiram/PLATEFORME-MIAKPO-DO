import mongoose from "mongoose";
import User from "./models/User.js"; // adapte le chemin selon ton arborescence

async function createAdmin() {
  try {
    // Connexion à MongoDB
    await mongoose.connect("mongodb://127.0.0.1:27017/miakpodo"); // remplace par ton URI Atlas si besoin

    // Vérifie si l’admin existe déjà
    const existingAdmin = await User.findOne({ email: "admin@example.com" });
    if (existingAdmin) {
      console.log("⚠️ Un admin existe déjà !");
      return;
    }

    // Création d’un admin
    const admin = new User({
      username: "admin",
      email: "admin@gmail.com",
      password: "123456", // sera hashé automatiquement par le pre("save")
      role: "admin",
    });
 // adapte le chemin selon ton arborescence


createAdmin();

    await admin.save();
    console.log("✅ Admin créé avec succès !");
  } catch (err) {
    console.error("❌ Erreur :", err.message);
  } finally {
    mongoose.disconnect();
  }
}

createAdmin();
