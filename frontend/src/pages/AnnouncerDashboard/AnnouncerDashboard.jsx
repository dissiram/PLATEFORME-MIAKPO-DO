import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import {
  BriefcaseIcon,
  ClipboardDocumentListIcon,
  CursorArrowRaysIcon,
  MagnifyingGlassIcon,
  BellIcon,
  ChatBubbleLeftIcon,
  UserIcon,
  PlusCircleIcon
} from "@heroicons/react/24/outline";

// --- Composant compteur animé ---
const Counter = ({ value }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.floor(latest));

  useEffect(() => {
    const animation = animate(count, value, { duration: 1.5 });
    return animation.stop;
  }, [value]);

  return <motion.span>{rounded}</motion.span>;
};

// --- Carte Statistique ---
const StatCard = ({ stat }) => {
  const Icon = stat.icon;
  return (
    <motion.div
      className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-shadow cursor-pointer"
      whileHover={{ y: -3, scale: 1.02 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm">{stat.title}</p>
          <p className="text-2xl font-bold text-gray-900">
            <Counter value={stat.value || 0} />
          </p>
        </div>
        <div className={`${stat.color} p-3 rounded-full shadow`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </motion.div>
  );
};

// --- Utilitaire temps écoulé ---
const timeAgo = (dateString) => {
  if (!dateString) return "Date inconnue";

  const date = new Date(dateString);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000); // en secondes

  if (diff < 60) return `il y a ${diff} sec`;
  if (diff < 3600) return `il y a ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `il y a ${Math.floor(diff / 3600)} h`;
  return `il y a ${Math.floor(diff / 86400)} j`;
};

// --- Dashboard recruteur ---
const AnnouncerDashboard = () => {
  const [userName, setUserName] = useState("Utilisateur");
  const [offers, setOffers] = useState([]);
  const [stats, setStats] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleCreateOffer = () => {
    window.location.href = "/dashboard/announcer/create"; 
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Token d'authentification manquant");
          setLoading(false);
          return;
        }

        // --- Utilisateur connecté ---
        const userRes = await axios.get("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserName(userRes.data.username || userRes.data.firstName || "Utilisateur");

        // --- Offres du recruteur ---
        const offersRes = await axios.get("http://localhost:5000/api/offers/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOffers(offersRes.data || []);

        // --- 3 dernières candidatures ---
        try {
          const applicationsRes = await axios.get(
            "http://localhost:5000/api/applications/recent",
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setRecentApplications(applicationsRes.data || []);
        } catch (err) {
          console.warn("Erreur récupération candidatures récentes:", err);
          // Fallback: calculer manuellement les candidatures récentes
          try {
            const allApplications = await axios.get(
              "http://localhost:5000/api/applications/my-applications",
              { headers: { Authorization: `Bearer ${token}` } }
            );
            setRecentApplications(allApplications.data.slice(0, 3) || []);
          } catch (fallbackErr) {
            console.warn("Fallback également en échec:", fallbackErr);
            setRecentApplications([]);
          }
        }

        // --- Statistiques (si dispo) ---
        try {
          const statsRes = await axios.get("http://localhost:5000/api/stats", {
            headers: { Authorization: `Bearer ${token}` },
          });

          setStats([
            {
              id: 1,
              title: "Offres publiées",
              value: offersRes.data.length || 0,
              icon: BriefcaseIcon,
              color: "bg-blue-500",
            },
            {
              id: 2,
              title: "Candidatures reçues",
              value: statsRes.data?.applicationsCount || 0,
              icon: ClipboardDocumentListIcon,
              color: "bg-green-500",
            },
            {
              id: 3,
              title: "Vues des offres",
              value: statsRes.data?.clicksCount || 0, 
              icon: CursorArrowRaysIcon,
              color: "bg-yellow-500",
            },
          ]);
        } catch (err) {
          console.warn("Endpoint stats non disponible, utilisation des valeurs par défaut:", err);
          // fallback si pas d'endpoint stats
          setStats([
            {
              id: 1,
              title: "Offres publiées",
              value: offersRes.data.length || 0,
              icon: BriefcaseIcon,
              color: "bg-blue-500",
            },
            {
              id: 2,
              title: "Candidatures totales",
              value: recentApplications.length,
              icon: ClipboardDocumentListIcon,
              color: "bg-green-500",
            },
            {
              id: 3,
              title: "Vues totales",
              value: 0,
              icon: CursorArrowRaysIcon,
              color: "bg-yellow-500",
            },
            {
              id: 4,
              title: "Candidats récents",
              value: recentApplications.length,
              icon: UserIcon,
              color: "bg-purple-500",
            },
          ]);
        }
      } catch (err) {
        console.error("Erreur récupération données:", err);
        setError("Erreur lors du chargement des données");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- Filtrage offres ---
  const filteredOffers = useMemo(() => {
    return offers.filter((offer) => {
      const term = searchTerm.toLowerCase();
      return (
        !term ||
        offer.title?.toLowerCase().includes(term) ||
        offer.company?.toLowerCase().includes(term)
      );
    });
  }, [offers, searchTerm]);

  if (loading) {
    return (
      <div className="flex-1 p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="bg-white p-6 rounded-2xl shadow-sm text-center">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 bg-gray-50 min-h-screen">
      {/* --- Header avec recherche et notifications --- */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
          Salut, {userName} !
        </h1>

        <div className="flex items-center gap-4 w-full sm:w-auto">
          {/* Recherche */}
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Rechercher ..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>

          {/* Notifications + Messages */}
          <div className="flex gap-3">
            <motion.div
              whileHover={{ rotate: -10, scale: 1.1 }}
              className="p-2 rounded-full bg-white shadow cursor-pointer relative"
            >
              <BellIcon className="h-6 w-6 text-gray-600" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                3
              </span>
            </motion.div>

            <motion.div
              whileHover={{ rotate: -10, scale: 1.1 }}
              className="p-2 rounded-full bg-white shadow cursor-pointer relative"
            >
              <ChatBubbleLeftIcon className="h-6 w-6 text-gray-600" />
              <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                5
              </span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* --- Statistiques --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <StatCard key={stat.id} stat={stat} />
        ))}
        
        {/* Bouton Créer une offre  */}
        <motion.div
          className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-shadow cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-blue-300 hover:border-blue-500"
          whileHover={{ y: -3, scale: 1.02 }}
          onClick={handleCreateOffer}
        >
          <div className="flex flex-col items-center justify-center h-full">
         
            <p className="text-gray-600 text-sm text-center">Créer une nouvelle offre</p>
          </div>
        </motion.div>
      </div>

      {/* --- Section candidatures récentes + offres récentes --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 3 dernières candidatures */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="text-xl font-bold mb-4">Dernières candidatures</h2>
          {recentApplications.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Aucune candidature récente
            </p>
          ) : (
            <div className="space-y-4">
              {recentApplications.map((application) => (
                <motion.div
                  key={application._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-indigo-100 p-2 rounded-full">
                      <UserIcon className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        {application.applicant?.firstName}{" "}
                        {application.applicant?.lastName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {application.offer?.title}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs ${
                        application.status === "En attente"
                          ? "bg-yellow-100 text-yellow-800"
                          : application.status === "Acceptée"
                          ? "bg-green-100 text-green-800"
                          : application.status === "Refusée"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {application.status}
                    </span>
                    <p className="text-xs text-gray-400 mt-1">
                      {timeAgo(application.createdAt)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Offres récentes */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="text-xl font-bold mb-4">Vos offres récentes</h2>
          {offers.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Aucune offre publiée
            </p>
          ) : (
            <div className="space-y-3">
              {filteredOffers.slice(0, 3).map((offer) => (
                <motion.div
                  key={offer._id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <p className="font-medium text-sm">{offer.title}</p>
                  <p className="text-xs text-gray-500">{offer.company}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {timeAgo(offer.createdAt)}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnnouncerDashboard;