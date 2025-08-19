import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../services/firebase";
import { useNavigate } from "react-router-dom";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { motion } from "framer-motion";

const Register = () => {
  const [step, setStep] = useState(1); // Étape 1 = choisir rôle, Étape 2 = infos
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleNextStep = () => {
    if (!role) {
      setError("Veuillez choisir un rôle");
      return;
    }
    setError("");
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!name || !email || !password) {
      setError("Tous les champs sont obligatoires");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Ici stocker le role et le nom dans Firestore 
      // console.log("Utilisateur créé :", userCredential.user);
      navigate("/login"); // redirige vers login après inscription
    } catch (err) {
      console.error(err);
      setError("Erreur lors de l'inscription");
    }
  };

  return (
     <div className="absolute inset-0 overflow-hidden">
      <div className="absolute -top-40 -right-32 w-96 h-96 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-20 blur-3xl" />
      <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-gradient-to-tr from-teal-400 to-green-500 rounded-full opacity-20 blur-3xl" />
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-8">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-8 text-center">Inscription</h1>

        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white shadow-md rounded-lg px-8 pt-8 pb-6 space-y-6"
          >
            <p className="text-center font-medium">Choisissez votre rôle</p>
            <div className="flex justify-around">
              <Button
                className={role === "user" ? "bg-blue-600 text-white" : ""}
                onClick={() => setRole("user")}
              >
                Utilisateur
              </Button>
              <Button
                className={role === "announcer" ? "bg-blue-600 text-white" : ""}
                onClick={() => setRole("announcer")}
              >
                Annonceur
              </Button>
            </div>
            {error && <div className="text-red-600 text-sm text-center">{error}</div>}
            <div className="flex justify-center">
              <Button onClick={handleNextStep}>Suivant</Button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white shadow-md rounded-lg px-8 pt-8 pb-6 space-y-6"
          >
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Nom</label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nom complet"
                className="w-full bg-white"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Adresse email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full bg-white"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Mot de passe</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mot de passe"
                className="w-full bg-white"
                required
              />
            </div>
            {error && <div className="text-red-600 text-sm text-center">{error}</div>}
            <div className="flex justify-center space-x-4">
              <Button type="button" onClick={() => setStep(1)}>Précédent</Button>
              <Button type="submit" className="bg-blue-600 text-white">S'inscrire</Button>
            </div>
          </motion.form>
        )}
      </div>
    </div>
  </div>
  );
};

export default Register;
