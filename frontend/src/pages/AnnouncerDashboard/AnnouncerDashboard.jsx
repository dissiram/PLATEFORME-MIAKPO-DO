import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { BriefcaseIcon, ClipboardDocumentListIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const AnnouncerDashboard = () => {
  const [userName, setUserName] = useState("Utilisateur");
  const [offers, setOffers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState([]);

  // Récupération utilisateur et offres
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setUserName(res.data.username || "Utilisateur");
      } catch (err) {
        console.error("Erreur récupération utilisateur:", err);
      }
    };

    const fetchOffers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/offers");
        setOffers(res.data || []);
      } catch (err) {
        console.error("Erreur récupération offres:", err);
      }
    };

    fetchUser();
    fetchOffers();
  }, []);

  // Récupération des stats réelles
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/stats", {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") }
        });

        setStats([
          { id: 1, title: "Offres publiées", value: res.data.offersCount, icon: BriefcaseIcon, color: "bg-blue-100 text-blue-600" },
          { id: 2, title: "Candidatures reçues", value: res.data.applicationsCount, icon: ClipboardDocumentListIcon, color: "bg-green-100 text-green-600" },
        ]);
      } catch (err) {
        console.error("Erreur récupération stats:", err);
      }
    };

    fetchStats();
  }, []);

  // Filtrage des offres
  const filteredOffers = useMemo(() => {
    return offers.filter(offer => {
      const term = searchTerm.toLowerCase();
      return !term || (offer.title?.toLowerCase().includes(term) || offer.company?.toLowerCase().includes(term));
    });
  }, [offers, searchTerm]);

  return (
    <div className="flex-1 p-6 bg-gray-50 min-h-screen">
      {/* Header avec recherche */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
          Salut, {userName} !
        </h1>

        {/* Barre de recherche à côté */}
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Rechercher une offre..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Carte principale */}
      <div className="bg-white rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-center justify-between shadow-md">
        <div className="mb-6 sm:mb-0">
          <h2 className="text-xl font-semibold text-gray-900">Gérez vos tâches</h2>
          <p className="text-gray-600 mt-2">
            Consultez votre calendrier, gérez vos paiements, vos collaborateurs et vos projets.
          </p>
          <ul className="mt-3 text-gray-500 space-y-1 list-disc list-inside">
            <li>Consulter le calendrier</li>
            <li>Gérer les paiements</li>
            <li>Gérer les collaborateurs</li>
            <li>Gérer les projets</li>
          </ul>
        </div>

        <div className="w-40 h-40 bg-gray-100 rounded-xl flex items-center justify-center">
          <span className="text-gray-400">Illustration</span>
        </div>
      </div>

      <p className="text-gray-600 mb-4">Voici un aperçu de vos offres publiées</p>

      {/* Stats dynamiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.id}
              className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-shadow cursor-pointer"
              whileHover={{ y: -3, scale: 1.02 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-full shadow`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default AnnouncerDashboard;
