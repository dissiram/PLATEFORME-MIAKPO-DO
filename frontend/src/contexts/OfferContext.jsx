import React, { createContext, useContext, useState } from "react";
import axios from "axios";

const OfferContext = createContext();

export const OfferProvider = ({ children }) => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Récupérer toutes les offres
  const fetchOffers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/offers`);
      setOffers(res.data);
    } catch (err) {
      console.error(err);
      setError("Impossible de récupérer les offres.");
    } finally {
      setLoading(false);
    }
  };

  // Récupérer les offres de l'utilisateur connecté
  const fetchUserOffers = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/offers/me`, {
        headers: { Authorization: token ? `Bearer ${token}` : undefined },
      });
      setOffers(res.data);
    } catch (err) {
      console.error(err);
      setError("Impossible de récupérer vos offres.");
    } finally {
      setLoading(false);
    }
  };

  // Créer une offre
  const createOffer = async (formData) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/offers`, formData, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
          "Content-Type": "multipart/form-data",
        },
      });
      setOffers((prev) => [res.data, ...prev]);
    } catch (err) {
      console.error(err);
      setError("Impossible de créer l'offre.");
    }
  };

  // Supprimer une offre
  const deleteOffer = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/offers/${id}`, {
        headers: { Authorization: token ? `Bearer ${token}` : undefined },
      });
      setOffers((prev) => prev.filter((offer) => offer._id !== id));
    } catch (err) {
      console.error(err);
      setError("Impossible de supprimer l'offre.");
    }
  };

  // Mettre à jour une offre
  const updateOffer = async (id, formData) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(`${import.meta.env.VITE_API_URL}/api/offers/${id}`, formData, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
          "Content-Type": "multipart/form-data",
        },
      });
      setOffers((prev) => prev.map((offer) => (offer._id === id ? res.data : offer)));
    } catch (err) {
      console.error(err);
      setError("Impossible de mettre à jour l'offre.");
    }
  };

  return (
    <OfferContext.Provider
      value={{
        offers,
        loading,
        error,
        fetchOffers,
        fetchUserOffers,
        createOffer,
        deleteOffer,
        updateOffer,
      }}
    >
      {children}
    </OfferContext.Provider>
  );
};

export const useOffers = () => useContext(OfferContext);
