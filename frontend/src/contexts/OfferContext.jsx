import React, { createContext, useContext, useState, useEffect } from "react";

const OfferContext = createContext();

/**
 * Hook pour utiliser facilement le contexte
 */
export const useOffers = () => useContext(OfferContext);

export const OfferProvider = ({ children }) => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  /**
   * Récupérer les offres depuis le backend
   */
  const fetchOffers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/offers`, {
        headers: { Authorization: token ? `Bearer ${token}` : undefined },
      });

      if (!res.ok) throw new Error("Erreur récupération offres");

      const data = await res.json();
      setOffers(data.items || data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Ajouter une offre (POST vers le backend)
   */
  const addOffer = async (newOffer) => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      for (const key in newOffer) {
        if (key === "image" && newOffer.image) formData.append("image", newOffer.image);
        else if (key === "attachments" && newOffer.attachments.length > 0) {
          newOffer.attachments.forEach(file => formData.append("attachments", file));
        } else {
          formData.append(key, newOffer[key]);
        }
      }

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/offers`, {
        method: "POST",
        headers: { Authorization: token ? `Bearer ${token}` : undefined },
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Erreur création offre");
      }

      // Rafraîchir les offres après création
      fetchOffers();
    } catch (err) {
      console.error(err);
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
