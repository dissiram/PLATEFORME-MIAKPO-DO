import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  BriefcaseIcon,
  AcademicCapIcon,
  TrophyIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  BellIcon,
  EnvelopeIcon,
  MagnifyingGlassIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";
import OfferCard from '../../components/OfferCard';

export default function UserDashboard() {
  const [user, setUser] = useState(null);
  const [offers, setOffers] = useState([]);
  const [filteredOffers, setFilteredOffers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [notificationsCount, setNotificationsCount] = useState(3);
  const [messagesCount, setMessagesCount] = useState(2);
  const offersPerPage = 6;

  // Debug des re-rendus
  useEffect(() => {
    console.log("Rendu - Page:", currentPage, "Offres:", filteredOffers.length);
  }, [currentPage, filteredOffers]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setUser(res.data);
      } catch (err) { 
        console.error("Erreur fetch user:", err); 
      }
    };
    fetchUser();
  }, []);

  // Charger les offres initiales
  useEffect(() => {
    const fetchInitialOffers = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get("http://localhost:5000/api/offers");
        setOffers(res.data);
        setFilteredOffers(res.data);
      } catch (err) {
        console.error("Erreur chargement offres:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialOffers();
  }, []);

  // Filtrage en temps réel avec la barre de recherche
  useEffect(() => {
    const filtered = offers.filter(offer => 
      offer.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOffers(filtered);
    setCurrentPage(1);
  }, [searchTerm, offers]);

  // Calcul de la pagination
  const indexOfLastOffer = currentPage * offersPerPage;
  const indexOfFirstOffer = indexOfLastOffer - offersPerPage;
  const currentOffers = filteredOffers.slice(indexOfFirstOffer, indexOfLastOffer);
  const totalPages = Math.ceil(filteredOffers.length / offersPerPage);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  
  const handleMenuClick = (option) => {
    setMenuOpen(false);
    if (option === "cv") window.location.href = "/dashboard/user/mycv";
    else if (option === "portfolio") window.location.href = "/dashboard/user/myportfolio";
    else if (option === "notifications") window.location.href = "/notifications";
    else if (option === "messages") window.location.href = "/messages";
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

  const handleSearch = useCallback(async (filters) => {
    setIsLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/offers", { 
        params: filters 
      });
      
      setOffers(res.data);
      setFilteredOffers(res.data);
      setCurrentPage(1);
      setSearchTerm(""); // Reset la recherche texte
      
    } catch (err) {
      console.error("Erreur recherche:", err);
      alert("Erreur lors de la recherche des offres");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearSearch = () => {
    setSearchTerm("");
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Générer les numéros de page à afficher
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return pageNumbers;
  };

  return (
    <div className="flex flex-col bg-gray-50 min-h-screen p-6 space-y-6">

      {/* Header avec barre de recherche et profil */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Titre */}
        <div className="lg:flex-1">
          <h1 className="text-3xl font-bold text-gray-900">Salut, {user?.username || "Utilisateur"} !</h1>
          <p className="text-gray-600 mt-1">Découvrez vos offres disponibles</p>
        </div>

        {/* Barre de recherche locale */}
        <div className="relative lg:flex-1 max-w-2xl">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par titre, entreprise, lieu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Icônes de notification et messagerie */}
        <div className="flex items-center gap-4">
          {/* Notification */}
          <button 
            onClick={() => handleMenuClick("notifications")}
            className="relative p-2 text-gray-600 hover:text-indigo-600 transition-colors"
          >
            <BellIcon className="h-6 w-6" />
            {notificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {notificationsCount}
              </span>
            )}
          </button>

          {/* Messagerie */}
          <button 
            onClick={() => handleMenuClick("messages")}
            className="relative p-2 text-gray-600 hover:text-indigo-600 transition-colors"
          >
            <EnvelopeIcon className="h-6 w-6" />
            {messagesCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {messagesCount}
              </span>
            )}
          </button>

          {/* Avatar */}
          <div className="relative">
            <img
              src="/avatar.png"
              alt="Avatar"
              className="h-12 w-12 rounded-full cursor-pointer border-2 border-indigo-500"
              onClick={toggleMenu}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/48x48/3B82F6/FFFFFF?text=U';
              }}
            />
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
                <button 
                  className="block w-full text-left px-4 py-3 hover:bg-indigo-50 transition-colors border-b border-gray-100"
                  onClick={() => handleMenuClick("cv")}
                >
                   Mon CV
                </button>
                <button 
                  className="block w-full text-left px-4 py-3 hover:bg-indigo-50 transition-colors border-b border-gray-100"
                  onClick={() => handleMenuClick("portfolio")}
                >
                  Mon Portfolio
                </button>
                <button 
                  className="block w-full text-left px-4 py-3 hover:bg-indigo-50 transition-colors"
                  onClick={() => {
                    localStorage.removeItem("token");
                    window.location.href = "/login";
                  }}
                >
                   Déconnexion
                </button>
              </div>
            )}
          </div>
        </div>
      </div>


      {/* Chargement */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="inline-flex items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mr-3"></div>
            <p className="text-gray-600 text-lg">Chargement des offres...</p>
          </div>
        </div>
      )}

      {/* Résultats et pagination info */}
      {!isLoading && filteredOffers.length > 0 && (
        <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
          <p className="text-gray-700 font-medium">
            {filteredOffers.length} offre{filteredOffers.length > 1 ? "s" : ""} trouvée{filteredOffers.length > 1 ? "s" : ""}
          </p>
          {filteredOffers.length > offersPerPage && (
            <p className="text-gray-500 text-sm">
              Page {currentPage} sur {totalPages}
            </p>
          )}
        </div>
      )}

      {/* Offres */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentOffers.map((offer) => (
            <OfferCard
              key={offer._id}
              offer={offer}
              onApply={handleApply}   
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-8">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className={`p-2 rounded-lg border transition-colors ${
              currentPage === 1 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-white text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 border-gray-300'
            }`}
            aria-label="Page précédente"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>

          {getPageNumbers().map((number) => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={`w-10 h-10 rounded-lg border flex items-center justify-center transition-colors ${
                currentPage === number
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-indigo-50 hover:text-indigo-600'
              }`}
              aria-label={`Page ${number}`}
            >
              {number}
            </button>
          ))}

          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-lg border transition-colors ${
              currentPage === totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 border-gray-300'
            }`}
            aria-label="Page suivante"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Message si aucune offre */}
      {!isLoading && filteredOffers.length === 0 && (
        <div className="text-center py-16">
          <div className="bg-white rounded-lg p-8 shadow-sm max-w-md mx-auto">
            <BuildingOfficeIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? "Aucune offre ne correspond à votre recherche" : "Aucune offre disponible"}
            </h3>
            <p className="text-gray-500">
              {searchTerm ? "Essayez d'autres mots-clés ou modifiez vos filtres" : "Revenez plus tard pour découvrir de nouvelles offres"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}