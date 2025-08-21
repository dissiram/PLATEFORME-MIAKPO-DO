import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HeartIcon,
  FolderIcon,
  TagIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EllipsisVerticalIcon,
  TrashIcon,
  PencilIcon,
  ShareIcon,
  EyeIcon,
  CalendarIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  TrophyIcon,
  ClockIcon,
  PlusIcon,
  XMarkIcon,
  CheckIcon,
  StarIcon,
  ArrowTopRightOnSquareIcon,
  DocumentTextIcon,
  ArchiveBoxIcon
} from '@heroicons/react/24/outline';
import {
  HeartIcon as HeartSolidIcon,
  StarIcon as StarSolidIcon,
  FolderIcon as FolderSolidIcon
} from '@heroicons/react/24/solid';

export default function Favorites() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [selectedTag, setSelectedTag] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedItems, setSelectedItems] = useState([]);
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const folders = [
    { id: 'all', name: 'Tous les favoris', count: 12, color: 'gray' },
    { id: 'priority', name: 'Priorité haute', count: 4, color: 'red' },
    { id: 'applied', name: 'Candidatures envoyées', count: 3, color: 'blue' },
    { id: 'research', name: 'À étudier', count: 5, color: 'yellow' }
  ];

  const tags = [
    { id: 'remote', name: 'Remote', color: 'green' },
    { id: 'senior', name: 'Senior', color: 'purple' },
    { id: 'startup', name: 'Startup', color: 'pink' },
    { id: 'paris', name: 'Paris', color: 'blue' },
    { id: 'urgent', name: 'Urgent', color: 'red' }
  ];

  const favoriteOffers = [
    {
      id: 1,
      title: "Développeur Frontend Senior React",
      company: "TechCorp Innovation",
      location: "Paris",
      salary: "55-70k€",
      type: "emploi",
      match: 96,
      savedDate: "2024-08-18",
      folder: 'priority',
      tags: ['remote', 'senior', 'paris'],
      notes: "Excellente opportunité, équipe technique solide. Entretien prévu la semaine prochaine.",
      applicationStatus: "applied",
      urgent: true,
      lastViewed: "2024-08-19"
    },
    {
      id: 2,
      title: "Stage Développement Full Stack",
      company: "StartupXYZ",
      location: "Lyon",
      salary: "1200€/mois",
      type: "stage",
      match: 92,
      savedDate: "2024-08-19",
      folder: 'research',
      tags: ['startup'],
      notes: "Stage intéressant pour acquérir de l'expérience full-stack.",
      applicationStatus: "not_applied",
      urgent: false,
      lastViewed: "2024-08-19"
    },
    {
      id: 3,
      title: "Lead Developer Frontend",
      company: "FinTech Solutions",
      location: "Remote",
      salary: "70-85k€",
      type: "emploi",
      match: 91,
      savedDate: "2024-08-17",
      folder: 'priority',
      tags: ['remote', 'senior'],
      notes: "Poste de leadership, 100% remote. Salaire très attractif.",
      applicationStatus: "applied",
      urgent: false,
      lastViewed: "2024-08-18"
    },
    {
      id: 4,
      title: "Bourse d'Excellence Recherche IA",
      company: "INRIA Paris",
      location: "Paris",
      salary: "1800€/mois",
      type: "bourse",
      match: 94,
      savedDate: "2024-08-20",
      folder: 'research',
      tags: ['paris'],
      notes: "Opportunité de recherche unique, prestige INRIA.",
      applicationStatus: "not_applied",
      urgent: false,
      lastViewed: "2024-08-20"
    },
    {
      id: 5,
      title: "Développeur React Native",
      company: "MobileFirst",
      location: "Marseille",
      salary: "45-55k€",
      type: "emploi",
      match: 87,
      savedDate: "2024-08-18",
      folder: 'research',
      tags: ['remote'],
      notes: "Transition vers le mobile, technologies modernes.",
      applicationStatus: "not_applied",
      urgent: false,
      lastViewed: "2024-08-19"
    },
    {
      id: 6,
      title: "Architecte Frontend",
      company: "Enterprise Solutions",
      location: "Paris",
      salary: "80-95k€",
      type: "emploi",
      match: 93,
      savedDate: "2024-08-17",
      folder: 'applied',
      tags: ['senior', 'paris'],
      notes: "Architecture micro-frontends, projets d'envergure.",
      applicationStatus: "applied",
      urgent: false,
      lastViewed: "2024-08-17"
    }
  ];

  const filteredOffers = favoriteOffers.filter(offer => {
    if (searchQuery && !offer.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !offer.company.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (selectedFolder !== 'all' && offer.folder !== selectedFolder) {
      return false;
    }
    if (selectedTag && !offer.tags.includes(selectedTag)) {
      return false;
    }
    return true;
  });

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
      case 'emploi': return 'bg-blue-100 text-blue-800';
      case 'stage': return 'bg-green-100 text-green-800';
      case 'concours': return 'bg-purple-100 text-purple-800';
      case 'bourse': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'applied': return 'bg-blue-100 text-blue-800';
      case 'not_applied': return 'bg-gray-100 text-gray-800';
      case 'interview': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'applied': return 'Candidature envoyée';
      case 'not_applied': return 'Non postulé';
      case 'interview': return 'Entretien';
      case 'rejected': return 'Refusé';
      default: return 'Non postulé';
    }
  };

  const getFolderColor = (color) => {
    switch(color) {
      case 'red': return 'text-red-600 bg-red-50';
      case 'blue': return 'text-blue-600 bg-blue-50';
      case 'yellow': return 'text-yellow-600 bg-yellow-50';
      case 'green': return 'text-green-600 bg-green-50';
      case 'purple': return 'text-purple-600 bg-purple-50';
      case 'pink': return 'text-pink-600 bg-pink-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const toggleSelection = (offerId) => {
    setSelectedItems(prev => 
      prev.includes(offerId) 
        ? prev.filter(id => id !== offerId)
        : [...prev, offerId]
    );
  };

  const createFolder = () => {
    if (newFolderName.trim()) {
      // Logic to create folder
      setNewFolderName('');
      setShowNewFolder(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes Favoris</h1>
            <p className="text-gray-600">
              {filteredOffers.length} offres sauvegardées
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <motion.div 
              className="bg-white p-4 rounded-2xl shadow-sm"
              whileHover={{ scale: 1.02 }}
            >
              <div className="text-center">
                <HeartSolidIcon className="h-6 w-6 text-red-500 mx-auto mb-1" />
                <div className="text-lg font-bold text-gray-900">{favoriteOffers.length}</div>
                <div className="text-xs text-gray-600">Total favoris</div>
              </div>
            </motion.div>
            <motion.div 
              className="bg-white p-4 rounded-2xl shadow-sm"
              whileHover={{ scale: 1.02 }}
            >
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">{favoriteOffers.filter(o => o.applicationStatus === 'applied').length}</div>
                <div className="text-xs text-gray-600">Candidatures</div>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Folders */}
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Dossiers</h3>
                <button 
                  onClick={() => setShowNewFolder(true)}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <PlusIcon className="h-4 w-4 text-gray-500" />
                </button>
              </div>
              <div className="space-y-2">
                {folders.map((folder) => (
                  <button
                    key={folder.id}
                    onClick={() => setSelectedFolder(folder.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${
                      selectedFolder === folder.id 
                        ? `${getFolderColor(folder.color)} border border-current border-opacity-20` 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {selectedFolder === folder.id ? (
                        <FolderSolidIcon className="h-5 w-5" />
                      ) : (
                        <FolderIcon className="h-5 w-5 text-gray-500" />
                      )}
                      <span className="text-sm font-medium">{folder.name}</span>
                    </div>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {folder.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* New Folder Form */}
              <AnimatePresence>
                {showNewFolder && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t border-gray-200"
                  >
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Nom du dossier"
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        onKeyPress={(e) => e.key === 'Enter' && createFolder()}
                      />
                      <button
                        onClick={createFolder}
                        className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <CheckIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setShowNewFolder(false)}
                        className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedTag('')}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedTag === '' 
                      ? 'bg-gray-900 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Tous
                </button>
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => setSelectedTag(tag.id)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      selectedTag === tag.id 
                        ? `${getFolderColor(tag.color)} border border-current border-opacity-20` 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search and Actions */}
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher dans les favoris..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex space-x-2">
                  {selectedItems.length > 0 && (
                    <button
                      onClick={() => setShowBulkActions(!showBulkActions)}
                      className="flex items-center space-x-2 px-4 py-3 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors"
                    >
                      <span>{selectedItems.length} sélectionné(s)</span>
                    </button>
                  )}
                  <button className="p-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                    <FunnelIcon className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Bulk Actions */}
              <AnimatePresence>
                {showBulkActions && selectedItems.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t border-gray-200"
                  >
                    <div className="flex space-x-2">
                      <button className="flex items-center space-x-2 px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors">
                        <TrashIcon className="h-4 w-4" />
                        <span>Supprimer</span>
                      </button>
                      <button className="flex items-center space-x-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
                        <FolderIcon className="h-4 w-4" />
                        <span>Déplacer</span>
                      </button>
                      <button className="flex items-center space-x-2 px-3 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                        <ArchiveBoxIcon className="h-4 w-4" />
                        <span>Archiver</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Favorites Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredOffers.map((offer, index) => {
                const TypeIcon = getTypeIcon(offer.type);
                const isSelected = selectedItems.includes(offer.id);
                
                return (
                  <motion.div
                    key={offer.id}
                    className={`bg-white rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer relative ${
                      isSelected ? 'ring-2 ring-blue-500' : ''
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    whileHover={{ y: -2 }}
                  >
                    {/* Selection Checkbox */}
                    <div className="absolute top-4 left-4 z-10">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelection(offer.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </div>

                    {/* Header */}
                    <div className="p-6 pb-4">
                      <div className="flex items-start justify-between mb-4 ml-8">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-xl ${getTypeColor(offer.type).replace('text-', 'bg-').replace('-800', '-100')}`}>
                            <TypeIcon className={`h-5 w-5 ${getTypeColor(offer.type).split(' ')[1]}`} />
                          </div>
                          <div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(offer.type)}`}>
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
                          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <EllipsisVerticalIcon className="h-5 w-5 text-gray-400" />
                          </button>
                        </div>
                      </div>

                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{offer.title}</h3>
                      <p className="text-blue-600 font-medium mb-3">{offer.company}</p>

                      {/* Match and Status */}
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="flex items-center space-x-1">
                          <StarSolidIcon className="h-4 w-4 text-yellow-400" />
                          <span className="text-sm font-medium text-gray-700">{offer.match}% match</span>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(offer.applicationStatus)}`}>
                          {getStatusLabel(offer.applicationStatus)}
                        </span>
                      </div>

                      {/* Details */}
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center space-x-2">
                          <MapPinIcon className="h-4 w-4" />
                          <span>{offer.location}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CurrencyDollarIcon className="h-4 w-4" />
                          <span>{offer.salary}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CalendarIcon className="h-4 w-4" />
                          <span>Sauvé le {new Date(offer.savedDate).toLocaleDateString('fr-FR')}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <EyeIcon className="h-4 w-4" />
                          <span>Vu le {new Date(offer.lastViewed).toLocaleDateString('fr-FR')}</span>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {offer.tags.map((tagId) => {
                          const tag = tags.find(t => t.id === tagId);
                          return tag ? (
                            <span key={tagId} className={`px-2 py-1 rounded text-xs ${getFolderColor(tag.color)}`}>
                              {tag.name}
                            </span>
                          ) : null;
                        })}
                      </div>

                      {/* Notes */}
                      {offer.notes && (
                        <div className="bg-gray-50 p-3 rounded-lg mb-4">
                          <div className="flex items-start space-x-2">
                            <DocumentTextIcon className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-gray-700">{offer.notes}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <div className="flex space-x-2">
                          <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 text-sm">
                            <EyeIcon className="h-4 w-4" />
                            <span>Voir</span>
                          </button>
                          <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 text-sm">
                            <PencilIcon className="h-4 w-4" />
                            <span>Notes</span>
                          </button>
                          <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 text-sm">
                            <ShareIcon className="h-4 w-4" />
                            <span>Partager</span>
                          </button>
                        </div>
                        <div className="flex space-x-2">
                          <button className="text-red-600 hover:text-red-700 p-1">
                            <HeartSolidIcon className="h-5 w-5" />
                          </button>
                          {offer.applicationStatus === 'not_applied' ? (
                            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                              Postuler
                            </button>
                          ) : (
                            <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                              Voir candidature
                            </button>
                          )}
                        </div>
                      </div>
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
                  <HeartIcon className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun favori trouvé</h3>
                <p className="text-gray-600 mb-4">
                  {searchQuery || selectedFolder !== 'all' || selectedTag 
                    ? 'Essayez de modifier vos critères de recherche' 
                    : 'Commencez à sauvegarder des offres qui vous intéressent'}
                </p>
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedFolder('all');
                    setSelectedTag('');
                  }}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  {searchQuery || selectedFolder !== 'all' || selectedTag ? 'Effacer les filtres' : 'Découvrir les offres'}
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
