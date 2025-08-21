import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  StarIcon,
  HeartIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  TrophyIcon,
  ClockIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  ChevronDownIcon,
  CheckIcon,
  XMarkIcon,
  ArrowTopRightOnSquareIcon,
  EyeIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import {
  HeartIcon as HeartSolidIcon,
  StarIcon as StarSolidIcon
} from '@heroicons/react/24/solid';

export default function Matches() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    type: [],
    location: [],
    salaryRange: '',
    experience: '',
    remote: false
  });
  const [sortBy, setSortBy] = useState('match');
  const [viewMode, setViewMode] = useState('grid');
  const [favorites, setFavorites] = useState([1, 3, 7]);
  const [showFilters, setShowFilters] = useState(false);

  const matchedOffers = [
    {
      id: 1,
      title: "Développeur Frontend Senior React",
      company: "TechCorp Innovation",
      location: "Paris",
      remote: true,
      type: "emploi",
      salary: "55-70k€",
      experience: "5+ ans",
      match: 96,
      urgent: true,
      postedDate: "2024-08-18",
      description: "Rejoignez notre équipe pour développer des applications React de nouvelle génération avec TypeScript et Next.js.",
      requirements: ["React", "TypeScript", "Next.js", "GraphQL", "Jest"],
      benefits: ["Télétravail", "Formation continue", "Mutuelle premium", "RTT"],
      matchReasons: [
        { reason: "Compétences React avancées", weight: 35 },
        { reason: "Expérience TypeScript", weight: 25 },
        { reason: "Localisation Paris", weight: 20 },
        { reason: "Niveau sénior recherché", weight: 16 }
      ]
    },
    {
      id: 2,
      title: "Stage Développement Full Stack",
      company: "StartupXYZ",
      location: "Lyon",
      remote: false,
      type: "stage",
      salary: "1200€/mois",
      experience: "Débutant",
      match: 92,
      urgent: false,
      postedDate: "2024-08-19",
      description: "Stage de 6 mois dans une startup dynamique pour développer des solutions web innovantes.",
      requirements: ["JavaScript", "Node.js", "React", "MongoDB"],
      benefits: ["Encadrement senior", "Projet concret", "Possibilité d'embauche"],
      matchReasons: [
        { reason: "Stack technique parfaite", weight: 40 },
        { reason: "Opportunité d'apprentissage", weight: 30 },
        { reason: "Environnement startup", weight: 22 },
        { reason: "Durée idéale", weight: 8 }
      ]
    },
    {
      id: 3,
      title: "Concours Développeur Public",
      company: "Ministère de la Transformation Numérique",
      location: "Toulouse",
      remote: true,
      type: "concours",
      salary: "40-45k€",
      experience: "3+ ans",
      match: 89,
      urgent: true,
      postedDate: "2024-08-17",
      description: "Concours pour intégrer l'équipe de développement des services publics numériques.",
      requirements: ["JavaScript", "Vue.js", "Python", "PostgreSQL"],
      benefits: ["Sécurité emploi", "Évolution garantie", "Mission d'intérêt public"],
      matchReasons: [
        { reason: "Mission d'intérêt public", weight: 30 },
        { reason: "Technologies modernes", weight: 28 },
        { reason: "Stabilité recherchée", weight: 25 },
        { reason: "Télétravail possible", weight: 17 }
      ]
    },
    {
      id: 4,
      title: "Bourse d'Excellence Recherche IA",
      company: "INRIA Paris",
      location: "Paris",
      remote: false,
      type: "bourse",
      salary: "1800€/mois",
      experience: "Master/Doctorat",
      match: 94,
      urgent: false,
      postedDate: "2024-08-20",
      description: "Bourse de recherche pour développer des interfaces IA innovantes avec React et TensorFlow.",
      requirements: ["React", "Python", "TensorFlow", "Machine Learning"],
      benefits: ["Recherche de pointe", "Publications", "Réseau international"],
      matchReasons: [
        { reason: "Expertise React + IA", weight: 45 },
        { reason: "Profil recherche", weight: 25 },
        { reason: "Innovation technologique", weight: 20 },
        { reason: "Prestige INRIA", weight: 10 }
      ]
    },
    {
      id: 5,
      title: "Lead Developer Frontend",
      company: "FinTech Solutions",
      location: "Remote",
      remote: true,
      type: "emploi",
      salary: "70-85k€",
      experience: "7+ ans",
      match: 91,
      urgent: false,
      postedDate: "2024-08-19",
      description: "Dirigez une équipe de développeurs frontend pour créer des solutions fintech révolutionnaires.",
      requirements: ["React", "TypeScript", "Leadership", "Architecture"],
      benefits: ["100% remote", "Stock options", "Équipe internationale"],
      matchReasons: [
        { reason: "Leadership technique", weight: 35 },
        { reason: "Expertise architecture", weight: 30 },
        { reason: "100% télétravail", weight: 20 },
        { reason: "Secteur fintech", weight: 15 }
      ]
    },
    {
      id: 6,
      title: "Développeur React Native",
      company: "MobileFirst",
      location: "Marseille",
      remote: true,
      type: "emploi",
      salary: "45-55k€",
      experience: "3+ ans",
      match: 87,
      urgent: false,
      postedDate: "2024-08-18",
      description: "Développez des applications mobiles innovantes avec React Native et Expo.",
      requirements: ["React Native", "Expo", "TypeScript", "Firebase"],
      benefits: ["Flexibilité horaire", "Projets variés", "Formation mobile"],
      matchReasons: [
        { reason: "Transition vers mobile", weight: 40 },
        { reason: "Base React solide", weight: 35 },
        { reason: "Technologies modernes", weight: 15 },
        { reason: "Équipe dynamique", weight: 10 }
      ]
    },
    {
      id: 7,
      title: "Stage UX/UI Developer",
      company: "Design Studio Pro",
      location: "Nice",
      remote: true,
      type: "stage",
      salary: "900€/mois",
      experience: "Étudiant",
      match: 85,
      urgent: true,
      postedDate: "2024-08-20",
      description: "Stage alliant développement frontend et design UX/UI dans un studio créatif.",
      requirements: ["React", "CSS", "Figma", "Design System"],
      benefits: ["Apprentissage design", "Portfolio projets", "Mentorat créatif"],
      matchReasons: [
        { reason: "Compétences design", weight: 35 },
        { reason: "Développement créatif", weight: 30 },
        { reason: "Polyvalence recherchée", weight: 25 },
        { reason: "Environnement créatif", weight: 10 }
      ]
    },
    {
      id: 8,
      title: "Architecte Frontend",
      company: "Enterprise Solutions",
      location: "Paris",
      remote: true,
      type: "emploi",
      salary: "80-95k€",
      experience: "8+ ans",
      match: 93,
      urgent: false,
      postedDate: "2024-08-17",
      description: "Concevez l'architecture frontend de solutions enterprise avec micro-frontends.",
      requirements: ["Architecture", "Micro-frontends", "React", "Module Federation"],
      benefits: ["Projets d'envergure", "Équipe senior", "Conférences tech"],
      matchReasons: [
        { reason: "Expertise architecture", weight: 40 },
        { reason: "Projets complexes", weight: 30 },
        { reason: "Technologies avancées", weight: 20 },
        { reason: "Évolution senior", weight: 10 }
      ]
    }
  ];

  const filterOptions = {
    type: [
      { value: 'emploi', label: 'Emploi', icon: BriefcaseIcon },
      { value: 'stage', label: 'Stage', icon: AcademicCapIcon },
      { value: 'concours', label: 'Concours', icon: TrophyIcon },
      { value: 'bourse', label: 'Bourse', icon: CurrencyDollarIcon }
    ],
    location: [
      { value: 'paris', label: 'Paris' },
      { value: 'lyon', label: 'Lyon' },
      { value: 'marseille', label: 'Marseille' },
      { value: 'toulouse', label: 'Toulouse' },
      { value: 'remote', label: 'Remote' }
    ],
    salaryRange: [
      { value: '0-30', label: '0-30k€' },
      { value: '30-50', label: '30-50k€' },
      { value: '50-70', label: '50-70k€' },
      { value: '70+', label: '70k€+' }
    ],
    experience: [
      { value: 'junior', label: 'Junior (0-2 ans)' },
      { value: 'intermediate', label: 'Intermédiaire (3-5 ans)' },
      { value: 'senior', label: 'Senior (5+ ans)' },
      { value: 'lead', label: 'Lead/Expert (8+ ans)' }
    ]
  };

  const filteredOffers = matchedOffers.filter(offer => {
    if (searchQuery && !offer.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !offer.company.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    if (selectedFilters.type.length > 0 && !selectedFilters.type.includes(offer.type)) {
      return false;
    }
    
    if (selectedFilters.location.length > 0) {
      const matchesLocation = selectedFilters.location.some(loc => 
        offer.location.toLowerCase().includes(loc) || 
        (loc === 'remote' && offer.remote)
      );
      if (!matchesLocation) return false;
    }
    
    return true;
  }).sort((a, b) => {
    switch(sortBy) {
      case 'match': return b.match - a.match;
      case 'date': return new Date(b.postedDate) - new Date(a.postedDate);
      case 'salary': return b.salary.localeCompare(a.salary);
      default: return 0;
    }
  });

  const toggleFavorite = (offerId) => {
    setFavorites(prev => 
      prev.includes(offerId) 
        ? prev.filter(id => id !== offerId)
        : [...prev, offerId]
    );
  };

  const toggleFilter = (category, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(item => item !== value)
        : [...prev[category], value]
    }));
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'emploi': return BriefcaseIcon;
      case 'stage': return AcademicCapIcon;
      case 'concours': return TrophyIcon;
      case 'bourse': return CurrencyDollarIcon;
      default: return BriefcaseIcon;
    }
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'emploi': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'stage': return 'bg-green-100 text-green-800 border-green-200';
      case 'concours': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'bourse': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getMatchColor = (match) => {
    if (match >= 95) return 'text-green-600 bg-green-50';
    if (match >= 90) return 'text-blue-600 bg-blue-50';
    if (match >= 85) return 'text-orange-600 bg-orange-50';
    return 'text-gray-600 bg-gray-50';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Offres Correspondantes</h1>
              <p className="text-gray-600">
                {filteredOffers.length} offres parfaitement adaptées à votre profil
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <motion.div 
                className="bg-white p-4 rounded-2xl shadow-sm"
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">92%</div>
                  <div className="text-xs text-gray-600">Match moyen</div>
                </div>
              </motion.div>
              <motion.div 
                className="bg-white p-4 rounded-2xl shadow-sm"
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">{favorites.length}</div>
                  <div className="text-xs text-gray-600">Favoris</div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white p-6 rounded-2xl shadow-sm mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher par titre ou entreprise..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-xl border transition-colors ${
                  showFilters ? 'bg-blue-50 border-blue-200 text-blue-700' : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <FunnelIcon className="h-5 w-5" />
                <span>Filtres</span>
                {Object.values(selectedFilters).flat().length > 0 && (
                  <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                    {Object.values(selectedFilters).flat().length}
                  </span>
                )}
              </button>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="match">Meilleur match</option>
                <option value="date">Plus récent</option>
                <option value="salary">Salaire</option>
              </select>
            </div>

            {/* Expanded Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 pt-6 border-t border-gray-200"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Type Filter */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Type d'offre</h4>
                      <div className="space-y-2">
                        {filterOptions.type.map((option) => {
                          const Icon = option.icon;
                          return (
                            <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={selectedFilters.type.includes(option.value)}
                                onChange={() => toggleFilter('type', option.value)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <Icon className="h-4 w-4 text-gray-500" />
                              <span className="text-sm text-gray-700">{option.label}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    {/* Location Filter */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Localisation</h4>
                      <div className="space-y-2">
                        {filterOptions.location.map((option) => (
                          <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedFilters.location.includes(option.value)}
                              onChange={() => toggleFilter('location', option.value)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">{option.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Remote Toggle */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Options</h4>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedFilters.remote}
                          onChange={() => setSelectedFilters(prev => ({ ...prev, remote: !prev.remote }))}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Télétravail possible</span>
                      </label>
                    </div>

                    {/* Clear Filters */}
                    <div className="flex items-end">
                      <button
                        onClick={() => setSelectedFilters({ type: [], location: [], salaryRange: '', experience: '', remote: false })}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Effacer tous les filtres
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredOffers.map((offer, index) => {
            const TypeIcon = getTypeIcon(offer.type);
            return (
              <motion.div
                key={offer.id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer relative overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
              >
                {/* Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-xl ${getTypeColor(offer.type).replace('text-', 'bg-').replace('-800', '-100')}`}>
                        <TypeIcon className={`h-5 w-5 ${getTypeColor(offer.type).split(' ')[1]}`} />
                      </div>
                      <div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(offer.type)}`}>
                          {offer.type.charAt(0).toUpperCase() + offer.type.slice(1)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {offer.urgent && (
                        <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium">
                          Urgent
                        </span>
                      )}
                      <button
                        onClick={() => toggleFavorite(offer.id)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        {favorites.includes(offer.id) ? (
                          <HeartSolidIcon className="h-5 w-5 text-red-500" />
                        ) : (
                          <HeartIcon className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{offer.title}</h3>
                  <p className="text-blue-600 font-medium mb-3">{offer.company}</p>
                  <p className="text-gray-600 text-sm mb-4">{offer.description}</p>

                  {/* Match Percentage */}
                  <div className={`inline-flex items-center space-x-2 px-3 py-2 rounded-xl ${getMatchColor(offer.match)}`}>
                    <SparklesIcon className="h-4 w-4" />
                    <span className="font-semibold">{offer.match}% de correspondance</span>
                  </div>
                </div>

                {/* Match Breakdown */}
                <div className="px-6 pb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Pourquoi cette offre vous correspond :</h4>
                  <div className="space-y-1">
                    {offer.matchReasons.slice(0, 2).map((reason, i) => (
                      <div key={i} className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">{reason.reason}</span>
                        <div className="flex items-center space-x-1">
                          <div className="w-12 bg-gray-200 rounded-full h-1">
                            <div 
                              className="bg-green-500 h-1 rounded-full" 
                              style={{ width: `${reason.weight * 2}%` }}
                            />
                          </div>
                          <span className="text-gray-500 w-8">{reason.weight}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Details */}
                <div className="px-6 pb-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <MapPinIcon className="h-4 w-4" />
                      <span>{offer.location}</span>
                      {offer.remote && <span className="text-green-600">(Remote)</span>}
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <CurrencyDollarIcon className="h-4 w-4" />
                      <span>{offer.salary}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <ClockIcon className="h-4 w-4" />
                      <span>{offer.experience}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <CalendarIcon className="h-4 w-4" />
                      <span>{new Date(offer.postedDate).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>
                </div>

                {/* Requirements */}
                <div className="px-6 pb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Compétences requises :</h4>
                  <div className="flex flex-wrap gap-1">
                    {offer.requirements.slice(0, 4).map((req) => (
                      <span key={req} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                        {req}
                      </span>
                    ))}
                    {offer.requirements.length > 4 && (
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                        +{offer.requirements.length - 4}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 text-sm">
                        <EyeIcon className="h-4 w-4" />
                        <span>Voir détails</span>
                      </button>
                      <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 text-sm">
                        <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                        <span>Site entreprise</span>
                      </button>
                    </div>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                      Postuler
                    </button>
                  </div>
                </div>

                {/* Match indicator bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
                  <div 
                    className={`h-full ${offer.match >= 95 ? 'bg-green-500' : offer.match >= 90 ? 'bg-blue-500' : 'bg-orange-500'}`}
                    style={{ width: `${offer.match}%` }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredOffers.length === 0 && (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MagnifyingGlassIcon className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune offre trouvée</h3>
            <p className="text-gray-600 mb-4">Essayez de modifier vos critères de recherche</p>
            <button 
              onClick={() => {
                setSearchQuery('');
                setSelectedFilters({ type: [], location: [], salaryRange: '', experience: '', remote: false });
              }}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Effacer tous les filtres
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
