// contexts/OfferContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const OfferContext = createContext();

export const useOffers = () => useContext(OfferContext);

export const OfferProvider = ({ children }) => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Récupérer les offres depuis le backend
  const fetchOffers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/offers`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
          "Cache-Control": "no-cache", // ⚡ éviter le 304
        },
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Erreur récupération offres");
      }

      const text = await res.text();
      const data = text ? JSON.parse(text) : [];
      setOffers(data.items || data);
    } catch (err) {
      console.error("Erreur fetchOffers:", err);
      setOffers([]);
    } finally {
      setLoading(false);
    }
  };

  // Ajouter une offre (POST)
  const addOffer = async (newOffer) => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      for (const key in newOffer) {
        if (key === "image" && newOffer.image) {
          formData.append("image", newOffer.image);
        } else if (key === "attachments" && Array.isArray(newOffer.attachments)) {
          newOffer.attachments.forEach(file => formData.append("attachments", file));
        } else if (newOffer[key] !== undefined) {
          formData.append(key, newOffer[key]);
        }
      }

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/offers`, {
        method: "POST",
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
        body: formData,
      });

      if (!res.ok) {
        let errMsg = "Erreur création offre";
        try {
          const text = await res.text();
          const json = text ? JSON.parse(text) : null;
          errMsg = json?.error || errMsg;
        } catch {
          // ignore si pas JSON
        }
        throw new Error(errMsg);
      }

      // attendre la réponse JSON avant de rafraîchir
      await res.json();
      fetchOffers();
    } catch (err) {
      console.error("Erreur addOffer:", err);
      alert(err.message);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  return (
    <OfferContext.Provider value={{ offers, loading, fetchOffers, addOffer }}>
      {children}
    </OfferContext.Provider>
  );
};
