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

const MyOffers = () => {
  const [offers, setOffers] = useState([]);
  const [expandedOffer, setExpandedOffer] = useState(null);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/offers");
        setOffers(res.data);
      } catch (err) {
        console.error("Erreur récupération offres:", err);
      }
    };
    fetchOffers();
  }, []);

  const toggleExpand = (id) => {
    setExpandedOffer(expandedOffer === id ? null : id);
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
    const now = new Date();
    const date = new Date(deadline);
    const diffDays = (date - now) / (1000 * 60 * 60 * 24);
    if (diffDays <= 3) return "text-red-500";
    if (diffDays <= 10) return "text-orange-500";
    return "text-green-500";
  };

  if (!offers || offers.length === 0) {
    return <p className="text-center text-gray-500 p-6">Aucune offre trouvée pour l’instant.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {offers.map((offer) => {
        const TypeIcon = getTypeIcon(offer.contractType || offer.type);
        return (
          <motion.div
            key={offer._id}
            className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all relative"
            whileHover={{ y: -4 }}
          >
            {/* Deadline */}
            {offer.deadline && (
              <div className={`absolute top-4 right-4 text-xs font-medium flex items-center ${getDeadlineColor(offer.deadline)}`}>
                <CalendarIcon className="h-4 w-4 mr-1" />
                <span>{new Date(offer.deadline).toLocaleDateString()}</span>
              </div>
            )}

            {/* Icône type */}
            <div className="flex items-start justify-between mb-4">
              <div className={`p-2 rounded-lg ${getTypeColor(offer.type)}`}>
                <TypeIcon className={`h-5 w-5 ${getTypeColor(offer.type).split(" ")[1]}`} />
              </div>
            </div>

            {/* Titre et entreprise */}
            <h3 className="font-semibold text-gray-900 mb-2">{offer.title || "Offre sans titre"}</h3>
            <p className="text-gray-600 text-sm mb-3 flex items-center">
              <BuildingOfficeIcon className="h-4 w-4 mr-1" /> {offer.company || "Entreprise inconnue"}
            </p>

            {/* Lieu et salaire */}
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

            {/* Bouton Voir plus */}
            <button
              onClick={() => toggleExpand(offer._id)}
              className="mt-3 text-sm text-indigo-600 hover:underline"
            >
              {expandedOffer === offer._id ? "Voir moins" : "Voir plus"}
            </button>

            {/* Contenu étendu */}
            {expandedOffer === offer._id && (
              <div className="mt-3 space-y-2">
                <p className="text-gray-700">{offer.description || "Pas de description"}</p>
                {offer.image && (
                  <img
                    src={`http://localhost:5000/${offer.image}`}
                    alt={offer.title}
                    className="w-full h-40 object-cover rounded-lg mt-2"
                  />
                )}
                {offer.attachments && offer.attachments.length > 0 && (
                  <div className="mt-2">
                    {offer.attachments.map((file, idx) => (
                      <a
                        key={idx}
                        href={`http://localhost:5000/${file}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-indigo-600 hover:underline mb-1"
                      >
                        <DocumentIcon className="h-4 w-4 mr-1" /> {file.split("/").pop()}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Type de contrat en bas à droite */}
            <div className="absolute bottom-4 right-4 text-xs font-medium text-gray-700">
              <BriefcaseIcon className="h-4 w-4 inline mr-1" />
              {offer.contractType || offer.type || "Non spécifié"}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default MyOffers;
