import React, { useState, useEffect, useMemo } from "react";
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
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export default function MyOffers() {
  const [offers, setOffers] = useState([]);
  const [expandedOffer, setExpandedOffer] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // 🎯 Filtres avancés
  const [filters, setFilters] = useState({
    type: [],
    location: [],
  });

  const filterOptions = {
    type: [
      { value: "emploi", label: "Emploi", icon: BriefcaseIcon },
      { value: "stage", label: "Stage", icon: AcademicCapIcon },
      { value: "concours", label: "Concours", icon: TrophyIcon },
      { value: "bourse", label: "Bourse", icon: CurrencyDollarIcon },
    ],
    location: [
      { value: "lomé", label: "Lomé" },
      { value: "sokodé", label: "Sokodé" },
      { value: "kara", label: "Kara" },
      { value: "kpalimé", label: "Kpalimé" },
      { value: "atakpamé", label: "Atakpamé" },
      { value: "dapaong", label: "Dapaong" },
      { value: "mango", label: "Mango" },
      { value: "tsévié", label: "Tsévié" },
      { value: "aného", label: "Aného" },
      { value: "remote", label: "Télétravail" },
    ],
  };

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

  const filteredOffers = useMemo(() => {
    return offers.filter((offer) => {
      const searchLower = searchTerm.toLowerCase();

      // Recherche
      const matchesSearch =
        !searchTerm ||
        (offer.title || "").toLowerCase().includes(searchLower) ||
        (offer.company || "").toLowerCase().includes(searchLower) ||
        (offer.location || "").toLowerCase().includes(searchLower) ||
        (offer.type || "").toLowerCase().includes(searchLower) ||
        (offer.description || "").toLowerCase().includes(searchLower);

      // Filtres
      const matchesType =
        filters.type.length === 0 || filters.type.includes((offer.type || "").toLowerCase());
      const matchesLocation =
        filters.location.length === 0 ||
        filters.location.some(
          (loc) =>
            loc === "remote"
              ? offer.remote
              : (offer.location || "").toLowerCase() === loc.toLowerCase()
        );

      return matchesSearch && matchesType && matchesLocation;
    });
  }, [offers, searchTerm, filters]);

  const toggleExpand = (id) => {
    setExpandedOffer(expandedOffer === id ? null : id);
  };

  const clearSearch = () => setSearchTerm("");

  const toggleFilter = (category, value) => {
    setFilters((prev) => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter((v) => v !== value)
        : [...prev[category], value],
    }));
  };

  const clearAllFilters = () => {
    setFilters({ type: [], location: [] });
    setSearchTerm("");
  };

  const getTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "emploi":
        return BriefcaseIcon;
      case "stage":
        return AcademicCapIcon;
      case "concours":
        return TrophyIcon;
      case "bourse":
        return CurrencyDollarIcon;
      default:
        return BriefcaseIcon;
    }
  };

  const getTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case "emploi":
        return "bg-blue-100 text-blue-800";
      case "stage":
        return "bg-green-100 text-green-800";
      case "concours":
        return "bg-purple-100 text-purple-800";
      case "bourse":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
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

  return (
    <div className="p-6">
      {/* Barre de recherche */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par titre, entreprise ou ville..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="flex items-center text-gray-500 hover:text-gray-700 text-sm"
          >
            <XMarkIcon className="h-5 w-5 mr-1" /> Effacer
          </button>
        )}
      </div>

      {/* Phrase nombre d'offres */}
      <p className="mb-4 text-gray-700">
        {filteredOffers.length} offre{filteredOffers.length > 1 ? "s" : ""} trouvée
      </p>

      {/* Bouton pour afficher/cacher les filtres */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="mb-4 px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 flex items-center gap-2"
      >
        <span>Filtres avancés</span>
      </button>

      {/* Filtres avancés */}
      {showFilters && (
        <div className="mb-6 p-4 border rounded-lg bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Type d'offre */}
            <div>
              <h4 className="font-medium text-gray-800 mb-2">Type d'offre</h4>
              <div className="space-y-2">
                {filterOptions.type.map((option) => {
                  const Icon = option.icon;
                  return (
                    <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.type.includes(option.value)}
                        onChange={() => toggleFilter("type", option.value)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <Icon className="h-4 w-4 text-gray-500" />
                      <span>{option.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Localisation */}
            <div>
              <h4 className="font-medium text-gray-800 mb-2">Localisation</h4>
              <div className="space-y-2">
                {filterOptions.location.map((option) => (
                  <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.location.includes(option.value)}
                      onChange={() => toggleFilter("location", option.value)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={clearAllFilters}
            className="mt-4 text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Effacer tous les filtres
          </button>
        </div>
      )}

      {/* Grille des offres */}
      {filteredOffers.length === 0 ? (
        <div className="text-center py-12">
          <MagnifyingGlassIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500 text-lg">
            Aucune offre trouvée
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOffers.map((offer) => {
            const TypeIcon = getTypeIcon(offer.contractType || offer.type);
            return (
              <motion.div
                key={offer._id}
                className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all relative"
                whileHover={{ y: -4 }}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {offer.deadline && (
                  <div
                    className={`absolute top-4 right-4 text-xs font-medium flex items-center ${getDeadlineColor(
                      offer.deadline
                    )}`}
                  >
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    <span>{new Date(offer.deadline).toLocaleDateString()}</span>
                  </div>
                )}

                <div className="flex items-start justify-between mb-4">
                  <div className={`p-2 rounded-lg ${getTypeColor(offer.type)}`}>
                    <TypeIcon className={`h-5 w-5 ${getTypeColor(offer.type).split(" ")[1]}`} />
                  </div>
                </div>

                <h3 className="font-semibold text-gray-900 mb-2">
                  {offer.title || "Offre sans titre"}
                </h3>
                <p className="text-gray-600 text-sm mb-3 flex items-center">
                  <BuildingOfficeIcon className="h-4 w-4 mr-1" /> {offer.company || "Entreprise inconnue"}
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

                <div className="absolute bottom-4 right-4 text-xs font-medium text-gray-700">
                  <BriefcaseIcon className="h-4 w-4 inline mr-1" /> {offer.contractType || offer.type || "Non spécifié"}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
