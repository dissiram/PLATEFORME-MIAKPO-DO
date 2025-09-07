import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  BriefcaseIcon,
  AcademicCapIcon,
  TrophyIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  CalendarIcon,
  DocumentIcon,
  BuildingOfficeIcon,
} from "@heroicons/react/24/outline";

export default function UserDashboard() {
  const [user, setUser] = useState(null);
  const [offers, setOffers] = useState([]);
  const [expandedOffer, setExpandedOffer] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setUser(res.data);
      } catch (err) { console.error(err); }
    };

    const fetchOffers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/offers");
        setOffers(res.data);
      } catch (err) { console.error(err); }
    };

    fetchUser();
    fetchOffers();
  }, []);

  const toggleExpand = (id) => setExpandedOffer(expandedOffer === id ? null : id);
  const toggleMenu = () => setMenuOpen(!menuOpen);
  const handleMenuClick = (option) => {
    setMenuOpen(false);
    if (option === "cv") window.location.href = "/dashboard/user/mycv";
    else if (option === "portfolio") window.location.href = "/dashboard/user/myportfolio";
  };

  const getTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "emploi": return BriefcaseIcon;
      case "stage": return AcademicCapIcon;
      case "concours": return TrophyIcon;
      case "bourse": return CurrencyDollarIcon;
      default: return BriefcaseIcon;
    }
  };

  const getTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case "emploi": return "bg-blue-100 text-blue-800";
      case "stage": return "bg-green-100 text-green-800";
      case "concours": return "bg-purple-100 text-purple-800";
      case "bourse": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getDeadlineColor = (deadline) => {
    if (!deadline) return "text-gray-600";
    const diffDays = (new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24);
    if (diffDays <= 3) return "text-red-500";
    if (diffDays <= 10) return "text-orange-500";
    return "text-green-500";
  };

  const handleApply = async (offerId) => {
    try {
      await axios.post(`http://localhost:5000/api/applications/${offerId}/apply`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      alert("Candidature envoyée !");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Erreur lors de la candidature");
    }
  };

  return (
    <div className="flex flex-col bg-gray-50 min-h-screen p-6 space-y-10">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Salut, {user?.username || "Utilisateur"} !</h1>
          <p className="text-gray-600 mt-1">Découvrez vos offres disponibles</p>
        </div>
        <div className="relative">
          <img
            src="../public/avatar.png"
            alt="Avatar"
            className="h-12 w-12 rounded-full cursor-pointer border-2 border-indigo-500"
            onClick={toggleMenu}
          />
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-50">
              <button className="block w-full text-left px-4 py-2 hover:bg-indigo-100" onClick={() => handleMenuClick("cv")}>Voir CV</button>
              <button className="block w-full text-left px-4 py-2 hover:bg-indigo-100" onClick={() => handleMenuClick("portfolio")}>Voir Portfolio</button>
            </div>
          )}
        </div>
      </div>

      {/* Offres */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {offers.map((offer) => {
          const TypeIcon = getTypeIcon(offer.contractType || offer.type);
          return (
            <motion.div key={offer._id} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all relative">
              {offer.deadline && (
                <div className={`absolute top-4 right-4 text-xs font-medium flex items-center ${getDeadlineColor(offer.deadline)}`}>
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  Délai: {new Date(offer.deadline).toLocaleDateString()}
                </div>
              )}
              <div className="flex items-start justify-between mb-4">
                <div className={`p-2 rounded-lg ${getTypeColor(offer.type)}`}>
                  <TypeIcon className={`h-5 w-5 ${getTypeColor(offer.type).split(" ")[1]}`} />
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{offer.title || "Offre sans titre"}</h3>
              <p className="text-sm text-gray-500 mb-2">{offer.contractType || offer.type}</p>
              <p className="text-gray-600 text-sm mb-3 flex items-center">
                <BuildingOfficeIcon className="h-4 w-4 mr-1" />
                {offer.company || "Entreprise inconnue"}
              </p>
              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center space-x-1">
                  <MapPinIcon className="h-4 w-4" />
                  <span>{offer.location || "Non précisé"}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <CurrencyDollarIcon className="h-4 w-4" />
                  <span>{offer.salary || "N/A"}</span>
                </div>
              </div>
              <button
                onClick={() => toggleExpand(offer._id)}
                className="mt-3 text-sm text-indigo-600 hover:underline"
              >
                {expandedOffer === offer._id ? "Voir moins" : "Voir plus"}
              </button>
              {expandedOffer === offer._id && (
                <div className="mt-3 space-y-2">
                  <p className="text-gray-700">{offer.description || "Pas de description"}</p>
                  {offer.image && <img src={`http://localhost:5000/${offer.image}`} alt={offer.title} className="w-full h-40 object-cover rounded-lg mt-2" />}
                </div>
              )}
              <button
                onClick={() => handleApply(offer._id)}
                className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                Postuler
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
