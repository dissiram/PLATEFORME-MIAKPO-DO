import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Charger l'utilisateur depuis le localStorage au montage
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");

    if (token && role) {
      setUser({ token, role });
    }
    setLoading(false);
  }, []);

  // Déconnexion
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    setUser(null);
  };

  // Connexion / mise à jour de l'utilisateur
  const login = ({ token, role }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userRole", role);
    setUser({ token, role }); // <-- Mise à jour immédiate du contexte
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook pour utiliser le contexte
export const useAuth = () => useContext(AuthContext);
