import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { BriefcaseIcon, ClipboardDocumentListIcon, EyeIcon, BellIcon } from '@heroicons/react/24/outline';
import { BellIcon as BellSolidIcon } from '@heroicons/react/24/solid';

const AnnouncerDashboard = () => {
  const [userName, setUserName] = useState("Utilisateur");

  // Mock stats (tu peux aussi les récupérer depuis ton backend)
  const stats = [
    { id: 1, title: "Offres publiées", value: 24, icon: BriefcaseIcon, color: "bg-blue-100 text-blue-600" },
    { id: 2, title: "Candidatures reçues", value: 120, icon: ClipboardDocumentListIcon, color: "bg-green-100 text-green-600" },
    { id: 3, title: "Vues du profil", value: 456, icon: EyeIcon, color: "bg-purple-100 text-purple-600" },
    { id: 4, title: "Notifications", value: 5, icon: BellSolidIcon, color: "bg-red-100 text-red-600" },
  ];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUserName(res.data.username || "Utilisateur");
      } catch (err) {
        console.error("Erreur récupération utilisateur:", err);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="flex-1 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Salut, {userName}!</h1>
          <p className="text-gray-600 mt-1">Voici un aperçu de votre activité récente</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.id}
              className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              whileHover={{ y: -2 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-full`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Section des actions rapides */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div className="bg-blue-600 text-white p-6 rounded-2xl shadow-md cursor-pointer hover:bg-blue-700 transition-colors" whileHover={{ scale: 1.05 }}>
            Créer une nouvelle offre
          </motion.div>
          <motion.div className="bg-green-600 text-white p-6 rounded-2xl shadow-md cursor-pointer hover:bg-green-700 transition-colors" whileHover={{ scale: 1.05 }}>
            Voir candidatures reçues
          </motion.div>
          <motion.div className="bg-purple-600 text-white p-6 rounded-2xl shadow-md cursor-pointer hover:bg-purple-700 transition-colors" whileHover={{ scale: 1.05 }}>
            Consulter statistiques
          </motion.div>
          <motion.div className="bg-yellow-600 text-white p-6 rounded-2xl shadow-md cursor-pointer hover:bg-yellow-700 transition-colors" whileHover={{ scale: 1.05 }}>
            Gérer profil
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncerDashboard;
