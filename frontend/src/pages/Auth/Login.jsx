import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { motion } from "framer-motion";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../contexts/AuthContext"; // <-- import du hook

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); // <-- récupère login du contexte

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      const { token, user } = res.data;

      // Sauvegarde token et rôle dans localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("userRole", user.role);

      // Mise à jour immédiate du contexte
      login({ token, role: user.role }); // <-- clé pour que Navbar se mette à jour

      // Redirection selon rôle
      switch (user.role) {
        case "user":
          navigate("/dashboard/user");
          break;
        case "announcer":
          navigate("/dashboard/announcer");
          break;
        case "admin":
          navigate("/dashboard/admin");
          break;
        default:
          navigate("/");
      }

    } catch (err) {
      console.error("Erreur de connexion:", err);
      const msg =
        err.response?.data?.error ||
        "Une erreur est survenue. Veuillez réessayer.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="absolute inset-0 overflow-hidden">
      <Navbar />
      <div className="absolute -top-40 -right-32 w-96 h-96 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-20 blur-3xl" />
      <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-gradient-to-tr from-teal-400 to-green-500 rounded-full opacity-20 blur-3xl" />

      <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-8">
        <div className="w-full max-w-md px-4">
          <h1 className="text-3xl font-bold mb-8 text-center text-gray-900">
            Connexion
          </h1>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white shadow-md rounded-lg px-8 pt-8 pb-6 space-y-6"
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <label>Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label>Mot de passe</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {error && <div className="text-red-600 text-sm text-center">{error}</div>}

            <div className="flex justify-center pt-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Connexion..." : "Se connecter"}
              </Button>
            </div>
          </motion.form>
        </div>
      </main>
    </div>
  );
};

export default Login;
