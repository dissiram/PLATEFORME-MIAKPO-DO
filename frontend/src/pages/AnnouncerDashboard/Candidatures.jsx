import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import ApplicationCard from "../../components/ApplicationCard"; 
import { toast } from "react-toastify";

const API_BASE_URL = "http://localhost:5000/api";

const RecruiterApplications = () => {
  const [applications, setApplications] = useState([]);
  const [offers, setOffers] = useState([]);
  const [selectedOfferId, setSelectedOfferId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedCards, setExpandedCards] = useState({});

  const handleError = (err, defaultMessage) => {
    console.error(defaultMessage, err);
    const message = err.response?.data?.error || err.response?.data?.message || defaultMessage;
    setError(message);
    toast.error(message);
    setTimeout(() => setError(null), 5000);
  };

  // Récupération des offres
  const fetchOffers = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token manquant");

      const res = await axios.get(`${API_BASE_URL}/offers/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOffers(res.data || []);
    } catch (err) {
      handleError(err, "Erreur lors du chargement des offres");
    }
  }, []);

  // Récupération de toutes les candidatures pour les offres du recruteur
  const fetchApplications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token manquant");

      const res = await axios.get(`${API_BASE_URL}/applications/my-applications`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setApplications(res.data || []);
      setExpandedCards({});
    } catch (err) {
      handleError(err, "Erreur lors du chargement des candidatures");
      setApplications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOffers();
    fetchApplications();
  }, [fetchOffers, fetchApplications]);

  // Mise à jour du statut
  const updateStatus = useCallback(async (applicationId, status) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token manquant");

      await axios.put(
        `${API_BASE_URL}/applications/${applicationId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );

      setApplications(prev => 
        prev.map(app => app._id === applicationId ? { ...app, status } : app)
      );
      toast.success("Statut mis à jour avec succès");
    } catch (err) {
      handleError(err, "Erreur lors de la mise à jour du statut");
      fetchApplications();
    }
  }, [fetchApplications]);

  // Expansion des cartes
  const toggleCard = useCallback(id => {
    setExpandedCards(prev => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const selectedOffer = offers.find(o => o._id === selectedOfferId);
  const displayedApplications = selectedOfferId
    ? applications.filter(app => app.offer._id === selectedOfferId)
    : applications;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Candidatures reçues</h1>

      {/* Sélecteur d'offres */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Sélectionner une offre</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={selectedOfferId}
            onChange={e => setSelectedOfferId(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">-- Toutes les offres --</option>
            {offers.map(offer => (
              <option key={offer._id} value={offer._id}>
                {offer.title} - {offer.company} ({offer.location})
              </option>
            ))}
          </select>

          <button
            onClick={fetchApplications}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow"
            disabled={loading}
          >
            {loading ? "Chargement..." : "Actualiser"}
          </button>
        </div>
      </div>

      {/* Info offre sélectionnée */}
      {selectedOffer && (
        <div className="bg-white rounded-xl shadow p-6 mb-8 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900">{selectedOffer.title}</h3>
          <div className="flex flex-wrap items-center gap-3 mt-2 text-gray-600">
            <span>{selectedOffer.company}</span>
            <span className="text-gray-400">•</span>
            <span>{selectedOffer.location}</span>
            <span className="text-gray-400">•</span>
            <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-sm">
              {selectedOffer.contractType}
            </span>
          </div>
          <div className="mt-4 text-right">
            <span className="text-2xl font-bold text-indigo-600">{displayedApplications.length}</span>
            <span className="text-gray-500 ml-2">
              candidature{displayedApplications.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      )}

      {/* Message d'erreur */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Contenu */}
      {loading ? (
        <div className="bg-white rounded-xl shadow p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des candidatures...</p>
        </div>
      ) : displayedApplications.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-12 text-center text-gray-500">
          <p>Aucun candidat n'a encore postulé.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {displayedApplications.map((app, index) => (
              <ApplicationCard
                key={app._id}
                application={app}
                index={index}
                isExpanded={expandedCards[app._id] || false}
                onToggle={() => toggleCard(app._id)}
                onStatusUpdate={updateStatus}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default RecruiterApplications;
