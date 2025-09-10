import React, { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  MagnifyingGlassIcon, 
  XMarkIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon 
} from "@heroicons/react/24/outline";
import { useOffers } from "../../contexts/OfferContext.jsx";
import OfferCard from "../../components/OfferCard.jsx"; 

export default function MyOffers() {
  const { offers, fetchUserOffers, deleteOffer } = useOffers();
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ type: [], location: [] });
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const offersPerPage = 6;

  useEffect(() => {
    fetchUserOffers();
  }, []);

  const filteredOffers = useMemo(() => {
    return offers.filter((offer) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        !searchTerm ||
        (offer.title || "").toLowerCase().includes(searchLower) ||
        (offer.company || "").toLowerCase().includes(searchLower) ||
        (offer.location || "").toLowerCase().includes(searchLower) ||
        (offer.type || "").toLowerCase().includes(searchLower) ||
        (offer.description || "").toLowerCase().includes(searchLower);

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

  // Calcul de la pagination
  const indexOfLastOffer = currentPage * offersPerPage;
  const indexOfFirstOffer = indexOfLastOffer - offersPerPage;
  const currentOffers = filteredOffers.slice(indexOfFirstOffer, indexOfLastOffer);
  const totalPages = Math.ceil(filteredOffers.length / offersPerPage);

  const clearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1); // Reset à la première page
  };

  const handleDelete = (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer cette offre ?")) {
      deleteOffer(id);
      // Si on supprime la dernière offre de la page, revenir à la page précédente
      if (currentOffers.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const handleEdit = (offer) => {
    navigate(`/edit-offer/${offer._id}`);
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
    <div className="p-6">
      {/* Barre de recherche */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par titre, entreprise ou ville..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset à la première page lors de la recherche
            }}
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

      {/* Informations sur les résultats */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-gray-700">
          {filteredOffers.length} offre{filteredOffers.length > 1 ? "s" : ""} trouvée
          {filteredOffers.length > offersPerPage && (
            <span className="text-gray-500 ml-2">
              (Page {currentPage} sur {totalPages})
            </span>
          )}
        </p>
      </div>

      {/* Liste des offres */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {currentOffers.map((offer) => (
          <OfferCard
            key={offer._id}
            offer={offer}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-8">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className={`p-2 rounded-lg border transition-colors ${
              currentPage === 1 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 border-gray-300'
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
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:text-blue-600'
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
                : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 border-gray-300'
            }`}
            aria-label="Page suivante"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Message si aucune offre */}
      {filteredOffers.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <MagnifyingGlassIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || filters.type.length > 0 || filters.location.length > 0 
                ? "Aucune offre ne correspond à vos critères" 
                : "Vous n'avez créé aucune offre"}
            </h3>
            <p className="text-gray-500">
              {searchTerm || filters.type.length > 0 || filters.location.length > 0 
                ? "Essayez de modifier vos critères de recherche" 
                : "Commencez par créer votre première offre"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}