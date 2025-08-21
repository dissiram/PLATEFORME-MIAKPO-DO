// // createAdmin.js
// import mongoose from "mongoose";
// import bcrypt from "bcrypt";
// import dotenv from "dotenv";
// import User from "./models/User.js"; // adapte le chemin si nécessaire

// dotenv.config();

// const MONGO_URI = process.env.MONGO_URI;

// async function createAdmin() {
//   try {
//     await mongoose.connect(MONGO_URI);
//     console.log("MongoDB connecté");

//     const email = "admin@admin.com";
//     const password = "12345678";
//     const username = "Admin";

//     // Vérifie si l'admin existe déjà
//     const existingAdmin = await User.findOne({ email });
//     if (existingAdmin) {
//       console.log("Admin déjà existant !");
//       return process.exit(0);
//     }

//     // Hash du mot de passe
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Création du document admin
//     const admin = new User({
//       username,
//       email,
//       password: hashedPassword,
//       role: "admin",
//     });

//     await admin.save();
//     console.log("Admin créé avec succès !");
//     process.exit(0);
//   } catch (err) {
//     console.error("Erreur lors de la création de l'admin :", err);
//     process.exit(1);
//   }
// }

// createAdmin();
