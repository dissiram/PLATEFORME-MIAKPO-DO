import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HeartIcon,
  MapPinIcon,
  ClockIcon,
  CalendarIcon,
  EyeIcon,
  ArrowTopRightOnSquareIcon,
  SparklesIcon,
  FunnelIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

export default function MatchesForCandidate({ resumeId }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [matchedOffers, setMatchedOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    minScore: 70,
    location: '',
    remote: false
  });

  // Récupérer les offres correspondantes
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `http://localhost:5001/api/match/offers/${resumeId}`, 
          {
            params: filters,
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        if (response.data.success) {
          const mapped = response.data.data.matches.map(({ offer, score, matchReasons }) => ({
            id: offer._id,
            title: offer.title,
            company: offer.company, // Votre modèle a company comme string
            location: offer.location,
            salary: offer.salary,
            remote: offer.remote || false,
            match: score,
            postedDate: offer.createdAt,
            description: offer.description,
            requirements: offer.skills, // String dans votre modèle
            matchReasons: matchReasons || []
          }));
          
          setMatchedOffers(mapped);
        } else {
          setError(response.data.error);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors de la récupération des matches:', err);
        setError(err.response?.data?.error || 'Erreur de connexion');
        setLoading(false);
      }
    };

    if (resumeId) {
      fetchMatches();
    }
  }, [resumeId, filters]);

  const toggleFavorite = (offerId) => {
    setFavorites(prev =>
      prev.includes(offerId)
        ? prev.filter(id => id !== offerId)
        : [...prev, offerId]
    );
  };

  const getMatchColor = (match) => {
    if (match >= 90) return 'text-green-600 bg-green-50';
    if (match >= 80) return 'text-blue-600 bg-blue-50';
    if (match >= 70) return 'text-orange-600 bg-orange-50';
    return 'text-gray-600 bg-gray-50';
  };

  const filteredOffers = matchedOffers.filter(offer =>
    offer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    offer.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    offer.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleApply = async (offerId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5001/api/applications/apply`,
        { offerId, resumeId },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      alert('Candidature envoyée avec succès !');
    } catch (error) {
      console.error('Erreur lors de la candidature:', error);
      alert('Erreur lors de la candidature');
    }
  };

  const handleViewDetails = (offerId) => {
    window.open(`/offer/${offerId}`, '_blank');
  };

  const handleCompanyWebsite = (companyName) => {
    window.open(`https://www.google.com/search?q=${encodeURIComponent(companyName)}`, '_blank');
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-4">⚠️ {error}</div>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header avec filtres */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Offres Correspondantes</h1>
              <p className="text-gray-600">
                {loading ? 'Chargement...' : `${filteredOffers.length} offres correspondent à votre profil`}
              </p>
            </div>
            
            <div className="flex gap-3">
              <select
                value={filters.minScore}
                onChange={(e) => setFilters(prev => ({ ...prev, minScore: e.target.value }))}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value={60}>Score ≥ 60%</option>
                <option value={70}>Score ≥ 70%</option>
                <option value={80}>Score ≥ 80%</option>
                <option value={90}>Score ≥ 90%</option>
              </select>
              
              <button className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm hover:bg-gray-50">
                <AdjustmentsHorizontalIcon className="h-4 w-4" />
                Filtres
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher par titre, entreprise ou lieu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <FunnelIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
              <span className="text-gray-600">Recherche des offres correspondantes...</span>
            </div>
          </div>
        ) : filteredOffers.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg p-8 shadow-sm max-w-md mx-auto">
              <SparklesIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchQuery ? "Aucune offre ne correspond à votre recherche" : "Aucune offre trouvée"}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchQuery ? "Essayez d'autres mots-clés ou modifiez vos filtres" : "Votre profil est en cours d'analyse..."}
              </p>
              <button 
                onClick={() => setSearchQuery('')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Réinitialiser la recherche
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredOffers.map((offer, index) => (
              <motion.div
                key={offer.id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer relative overflow-hidden border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ y: -2 }}
              >
                {/* Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">{offer.title}</h3>
                      <p className="text-blue-600 font-medium text-sm">{offer.company}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(offer.id);
                      }}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0 ml-2"
                    >
                      {favorites.includes(offer.id) ? (
                        <HeartSolidIcon className="h-5 w-5 text-red-500" />
                      ) : (
                        <HeartIcon className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{offer.description}</p>

                  {/* Match Percentage */}
                  <div className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full ${getMatchColor(offer.match)} mb-4`}>
                    <SparklesIcon className="h-4 w-4" />
                    <span className="font-semibold text-sm">{offer.match}% de match</span>
                  </div>
                </div>

                {/* Match Reasons */}
                {offer.matchReasons.length > 0 && (
                  <div className="px-6 pb-4">
                    <h4 className="text-xs font-medium text-gray-700 mb-2 uppercase tracking-wide">
                      Points forts de correspondance :
                    </h4>
                    <div className="space-y-2">
                      {offer.matchReasons.slice(0, 2).map((reason, i) => (
                        <div key={i} className="flex items-center justify-between text-xs">
                          <span className="text-gray-600 flex-1 mr-2">{reason.reason}</span>
                          <div className="flex items-center space-x-1 flex-shrink-0">
                            <div className="w-10 bg-gray-200 rounded-full h-1.5">
                              <div 
                                className="bg-green-500 h-1.5 rounded-full" 
                                style={{ width: `${reason.weight}%` }}
                              />
                            </div>
                            <span className="text-gray-500 text-xs w-6">{reason.weight}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Details */}
                <div className="px-6 pb-4 grid grid-cols-2 gap-3 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <MapPinIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <span className="truncate">{offer.location}</span>
                    {offer.remote && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">Remote</span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <ClockIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <span>{offer.salary || 'Non spécifié'}</span>
                  </div>
                </div>

                {/* Compétences */}
                {offer.requirements && (
                  <div className="px-6 pb-4">
                    <div className="flex flex-wrap gap-1">
                      {offer.requirements.split(',').slice(0, 3).map((skill, index) => (
                        <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                          {skill.trim()}
                        </span>
                      ))}
                      {offer.requirements.split(',').length > 3 && (
                        <span className="text-gray-500 text-xs">
                          +{offer.requirements.split(',').length - 3} autres
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex space-x-3">
                    <button 
                      onClick={() => handleViewDetails(offer.id)}
                      className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 text-sm"
                    >
                      <EyeIcon className="h-4 w-4" />
                      <span>Détails</span>
                    </button>
                    <button 
                      onClick={() => handleCompanyWebsite(offer.company)}
                      className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 text-sm"
                    >
                      <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                      <span>Entreprise</span>
                    </button>
                  </div>
                  <button 
                    onClick={() => handleApply(offer.id)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Postuler
                  </button>
                </div>

                {/* Match indicator bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
                  <div
                    className={`h-full ${
                      offer.match >= 90 ? 'bg-green-500' : 
                      offer.match >= 80 ? 'bg-blue-500' : 
                      'bg-orange-500'
                    }`}
                    style={{ width: `${offer.match}%` }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}