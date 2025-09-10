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
} from "@heroicons/react/24/outline";

// Composant compteur animé
const Counter = ({ value }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.floor(latest));

  useEffect(() => {
    const animation = animate(count, value, { duration: 1.5 });
    return animation.stop;
  }, [value]);

  return <motion.span>{rounded}</motion.span>;
};

// Carte stat
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
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </motion.div>
  );
};

// Fonction utilitaire pour afficher le temps écoulé
const timeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000); // en secondes

  if (diff < 60) return `il y a ${diff} sec`;
  if (diff < 3600) return `il y a ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `il y a ${Math.floor(diff / 3600)} h`;
  return `il y a ${Math.floor(diff / 86400)} j`;
};

const AnnouncerDashboard = () => {
  const [userName, setUserName] = useState("Utilisateur");
  const [offers, setOffers] = useState([]);
  const [stats, setStats] = useState([]);
  const [lastApplicants, setLastApplicants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

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
        const res = await axios.get("http://localhost:5000/api/offers", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setOffers(res.data || []);
      } catch (err) {
        console.error("Erreur récupération offres:", err);
      }
    };

    fetchUser();
    fetchOffers();
  }, []);

  // Récupération stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/stats", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        setStats([
          {
            id: 1,
            title: "Offres publiées",
            value: res.data.offersCount || 0,
            icon: BriefcaseIcon,
            color: "bg-blue-500",
          },
          {
            id: 2,
            title: "Candidatures reçues",
            value: res.data.applicationsCount || 0,
            icon: ClipboardDocumentListIcon,
            color: "bg-green-500",
          },
          {
            id: 3,
            title: "Clics sur les annonces",
            value: res.data.clicksCount || 0,
            icon: CursorArrowRaysIcon,
            color: "bg-yellow-500",
          },
          {
            id: 4,
            title: "Réponses données",
            value: res.data.responsesCount || 0,
            icon: CursorArrowRaysIcon,
            color: "bg-purple-500",
          },
        ]);
      } catch (err) {
        console.error("Erreur récupération stats:", err);
      }
    };
    fetchStats();
  }, []);

  // Récupération des 3 derniers candidats
  useEffect(() => {
    const fetchLastApplicants = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/applicants/last", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setLastApplicants(res.data.slice(0, 3)); // Prend les 3 derniers
      } catch (err) {
        console.error("Erreur récupération candidats:", err);
      }
    };
    fetchLastApplicants();
  }, []);

  // Filtrage des offres (si besoin)
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

  return (
    <div className="flex-1 p-6 bg-gray-50 min-h-screen">
      {/* Header avec recherche + notif */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
          Salut, {userName} !
        </h1>

        <div className="flex items-center gap-4 w-full sm:w-auto">
          {/* Barre de recherche */}
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

          {/* Notifications et messagerie */}
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

      {/* Stats dynamiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <StatCard key={stat.id} stat={stat} />
        ))}
      </div>

      {/* Liste des 3 derniers candidats */}
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <h2 className="text-xl font-bold mb-4">Derniers candidats</h2>
        <ul className="divide-y divide-gray-200">
          {lastApplicants.length === 0 && (
            <li className="py-2 text-gray-500">Aucun candidat pour le moment.</li>
          )}
          {lastApplicants.map((applicant) => (
            <li key={applicant._id} className="py-2 flex justify-between items-center">
              <div>
                <span className="font-medium">{applicant.name}</span>
                <span className="text-gray-500 text-sm ml-2">({applicant.position})</span>
              </div>
              <span className="text-gray-400 text-xs">{timeAgo(applicant.createdAt)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AnnouncerDashboard;
