import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

// télécharger le fichier de clé privée Firebase depuis la console
// (Project Settings > Service Accounts > Generate new private key)
import serviceAccount from "./firebase-service-account.json" assert { type: "json" };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
