import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const CVContext = createContext();

export const CVProvider = ({ children }) => {
  const [cv, setCV] = useState(() => {
    // ⚡ Charger le CV depuis localStorage au démarrage
    const stored = localStorage.getItem("cv");
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(!cv); // si cv local, pas besoin de loader

  const API_URL = "http://localhost:5000/api/resumes";

  // ⚡ Récupérer le CV de l'utilisateur connecté
  const fetchMyCV = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) return setLoading(false);

    try {
      const res = await axios.get(`${API_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCV(res.data || null);
      localStorage.setItem("cv", JSON.stringify(res.data || null));
    } catch (err) {
      console.log("Aucun CV existant ou erreur API", err);
      setCV(null);
      localStorage.removeItem("cv");
    } finally {
      setLoading(false);
    }
  };

  // ⚡ Créer ou mettre à jour le CV
  const saveCV = async (data) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Utilisateur non connecté");
    const res = await axios.post(API_URL, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setCV(res.data);
    localStorage.setItem("cv", JSON.stringify(res.data));
    return res.data;
  };

  // ⚡ Supprimer le CV
  const deleteCV = async () => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Utilisateur non connecté");
    await axios.delete(`${API_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setCV(null);
    localStorage.removeItem("cv");
  };

  // ⚡ Récupérer un CV public par userId
  const fetchPublicCV = async (userId) => {
    try {
      const res = await axios.get(`${API_URL}/public/${userId}`);
      return res.data;
    } catch (err) {
      console.error("Erreur récupération CV public", err);
      return null;
    }
  };

  useEffect(() => {
    fetchMyCV();
  }, []);

  return (
    <CVContext.Provider
      value={{
        cv,
        loading,
        fetchMyCV,
        saveCV,
        deleteCV,
        fetchPublicCV,
      }}
    >
      {children}
    </CVContext.Provider>
  );
};

export const useCV = () => useContext(CVContext);
