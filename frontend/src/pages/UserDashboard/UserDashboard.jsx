import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BellIcon, 
  HeartIcon, 
  EyeIcon, 
  BriefcaseIcon, 
  AcademicCapIcon,
  TrophyIcon,
  CurrencyDollarIcon,
  UserIcon,
  MapPinIcon,
  CalendarIcon,
  StarIcon,
  CheckCircleIcon,
  ClockIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { 
  HeartIcon as HeartSolidIcon,
  BellIcon as BellSolidIcon 
} from '@heroicons/react/24/solid';

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('offers');
  const [favorites, setFavorites] = useState([1, 3]);
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Nouvelle offre correspondante", message: "Développeur Frontend - TechCorp", time: "Il y a 2h", read: false },
    { id: 2, title: "Candidature vue", message: "Votre candidature pour Stage Marketing a été consultée", time: "Il y a 5h", read: false },
    { id: 3, title: "Nouveau match", message: "3 nouvelles offres correspondent à votre profil", time: "Hier", read: true }
  ]);

  const mockOffers = [
    { id: 1, title: "Développeur Frontend React", company: "TechCorp", type: "emploi", location: "Paris", salary: "45-55k€", match: 95, urgent: true },
    { id: 2, title: "Stage Marketing Digital", company: "StartupXYZ", type: "stage", location: "Lyon", salary: "800€/mois", match: 88, urgent: false },
    { id: 3, title: "Concours Fonction Publique", company: "Ministère", type: "concours", location: "Toulouse", salary: "35k€", match: 82, urgent: true },
    { id: 4, title: "Bourse d'Excellence", company: "Université Paris", type: "bourse", location: "Paris", salary: "1200€/mois", match: 90, urgent: false },
    { id: 5, title: "Développeur Full Stack", company: "Innovation Lab", type: "emploi", location: "Remote", salary: "50-60k€", match: 92, urgent: false },
    { id: 6, title: "Stage Data Science", company: "AI Solutions", type: "stage", location: "Marseille", salary: "1000€/mois", match: 85, urgent: false }
  ];

  const applications = [
    { id: 1, title: "Développeur Frontend", company: "TechCorp", status: "En cours", date: "15/08/2025", type: "emploi" },
    { id: 2, title: "Stage Marketing", company: "StartupXYZ", status: "Vue", date: "12/08/2025", type: "stage" },
    { id: 3, title: "Développeur Backend", company: "WebAgency", status: "Refusée", date: "10/08/2025", type: "emploi" },
    { id: 4, title: "Bourse Recherche", company: "CNRS", status: "Acceptée", date: "08/08/2025", type: "bourse" }
  ];

  const portfolioSections = [
    { id: 'profile', title: 'Profil', icon: UserIcon, color: 'bg-gradient-to-br from-blue-500 to-blue-600' },
    { id: 'experience', title: 'Expérience', icon: BriefcaseIcon, color: 'bg-gradient-to-br from-green-500 to-green-600' },
    { id: 'projects', title: 'Projets', icon: AcademicCapIcon, color: 'bg-gradient-to-br from-purple-500 to-purple-600' },
    { id: 'skills', title: 'Compétences', icon: StarIcon, color: 'bg-gradient-to-br from-orange-500 to-orange-600' },
    { id: 'contact', title: 'Contact', icon: MapPinIcon, color: 'bg-gradient-to-br from-pink-500 to-pink-600' }
  ];

  const toggleFavorite = (offerId) => {
    setFavorites(prev => 
      prev.includes(offerId) 
        ? prev.filter(id => id !== offerId)
        : [...prev, offerId]
    );
  };

  const markNotificationAsRead = (notifId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notifId ? { ...notif, read: true } : notif
      )
    );
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
      case 'emploi': return 'bg-blue-100 text-blue-800';
      case 'stage': return 'bg-green-100 text-green-800';
      case 'concours': return 'bg-purple-100 text-purple-800';
      case 'bourse': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'En cours': return 'bg-blue-100 text-blue-800';
      case 'Vue': return 'bg-yellow-100 text-yellow-800';
      case 'Acceptée': return 'bg-green-100 text-green-800';
      case 'Refusée': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 text-center sm:text-left">
             Salut, Amanda!
            </h1>           
             <p className="text-gray-600 mt-1">Jetons un coup d'œil à votre activité aujourd'hui</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow">
                <BellSolidIcon className="h-6 w-6 text-gray-600" />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </button>
            </div>
            <button className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
              Upgrade
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div 
            className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
            whileHover={{ y: -2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Candidatures</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <BriefcaseIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
            whileHover={{ y: -2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Matchs</p>
                <p className="text-2xl font-bold text-gray-900">8</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <StarIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
            whileHover={{ y: -2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Vues Profil</p>
                <p className="text-2xl font-bold text-gray-900">156</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <EyeIcon className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
            whileHover={{ y: -2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Favoris</p>
                <p className="text-2xl font-bold text-gray-900">{favorites.length}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <HeartSolidIcon className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Navigation Tabs */}
        {/* <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6 w-fit">
          {[
            { id: 'offers', label: 'Offres', icon: BriefcaseIcon },
            { id: 'portfolio', label: 'Portfolio', icon: UserIcon },
            { id: 'matches', label: 'Matchs', icon: StarIcon },
            { id: 'applications', label: 'Candidatures', icon: ClockIcon },
            { id: 'notifications', label: 'Notifications', icon: BellIcon }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div> */}

        {/* Content based on active tab */}
        {activeTab === 'offers' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Offres Disponibles</h2>
              <div className="flex space-x-2">
                <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                  <option>Tous les types</option>
                  <option>Emploi</option>
                  <option>Stage</option>
                  <option>Concours</option>
                  <option>Bourse</option>
                </select>
                <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                  <option>Toutes les villes</option>
                  <option>Paris</option>
                  <option>Lyon</option>
                  <option>Marseille</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockOffers.map((offer) => {
                const TypeIcon = getTypeIcon(offer.type);
                return (
                  <motion.div
                    key={offer.id}
                    className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer relative"
                    whileHover={{ y: -4 }}
                  >
                    {offer.urgent && (
                      <div className="absolute top-4 right-4 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        Urgent
                      </div>
                    )}
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-2 rounded-lg ${offer.type === 'emploi' ? 'bg-blue-100' : offer.type === 'stage' ? 'bg-green-100' : offer.type === 'concours' ? 'bg-purple-100' : 'bg-yellow-100'}`}>
                        <TypeIcon className={`h-5 w-5 ${offer.type === 'emploi' ? 'text-blue-600' : offer.type === 'stage' ? 'text-green-600' : offer.type === 'concours' ? 'text-purple-600' : 'text-yellow-600'}`} />
                      </div>
                      <button 
                        onClick={() => toggleFavorite(offer.id)}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        {favorites.includes(offer.id) ? (
                          <HeartSolidIcon className="h-5 w-5 text-red-500" />
                        ) : (
                          <HeartIcon className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{offer.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{offer.company}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center space-x-1">
                        <MapPinIcon className="h-4 w-4" />
                        <span>{offer.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <CurrencyDollarIcon className="h-4 w-4" />
                        <span>{offer.salary}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(offer.type)}`}>
                        {offer.type.charAt(0).toUpperCase() + offer.type.slice(1)}
                      </span>
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium text-green-600">{offer.match}% match</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'portfolio' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Portfolio Interactif</h2>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Modifier
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {portfolioSections.map((section, index) => {
                const Icon = section.icon;
                return (
                  <motion.div
                    key={section.id}
                    className={`${section.color} p-6 rounded-2xl text-white cursor-pointer ${
                      index === 0 ? 'md:col-span-2' : ''
                    } ${index === 2 ? 'lg:col-span-2' : ''}`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <Icon className="h-6 w-6" />
                      <h3 className="text-lg font-semibold">{section.title}</h3>
                    </div>
                    {section.id === 'profile' && (
                      <div>
                        <p className="text-blue-100 mb-2">Amanda Johnson</p>
                        <p className="text-sm text-blue-200">Développeuse Frontend passionnée par l'UX/UI et les technologies modernes.</p>
                      </div>
                    )}
                    {section.id === 'experience' && (
                      <div className="space-y-2">
                        <div className="text-green-100">
                          <p className="font-medium">Frontend Developer</p>
                          <p className="text-sm text-green-200">TechCorp • 2023-Present</p>
                        </div>
                      </div>
                    )}
                    {section.id === 'projects' && (
                      <div className="space-y-2">
                        <div className="text-purple-100">
                          <p className="font-medium">E-commerce Platform</p>
                          <p className="text-sm text-purple-200">React, Node.js, MongoDB</p>
                        </div>
                        <div className="text-purple-100">
                          <p className="font-medium">Task Management App</p>
                          <p className="text-sm text-purple-200">Vue.js, Firebase</p>
                        </div>
                      </div>
                    )}
                    {section.id === 'skills' && (
                      <div className="flex flex-wrap gap-2">
                        {['React', 'JavaScript', 'TypeScript', 'Node.js', 'CSS'].map((skill) => (
                          <span key={skill} className="bg-orange-400 bg-opacity-30 px-2 py-1 rounded text-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                    {section.id === 'contact' && (
                      <div className="space-y-2 text-pink-100">
                        <p>amanda.johnson@email.com</p>
                        <p>+33 6 12 34 56 78</p>
                        <p>Paris, France</p>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'matches' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Offres Correspondantes</h2>
              <div className="text-sm text-gray-600">
                Basé sur votre profil et préférences
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockOffers.filter(offer => offer.match >= 85).map((offer) => {
                const TypeIcon = getTypeIcon(offer.type);
                return (
                  <motion.div
                    key={offer.id}
                    className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer border-l-4 border-green-500"
                    whileHover={{ x: 4 }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-2 rounded-lg ${offer.type === 'emploi' ? 'bg-blue-100' : offer.type === 'stage' ? 'bg-green-100' : offer.type === 'concours' ? 'bg-purple-100' : 'bg-yellow-100'}`}>
                        <TypeIcon className={`h-5 w-5 ${offer.type === 'emploi' ? 'text-blue-600' : offer.type === 'stage' ? 'text-green-600' : offer.type === 'concours' ? 'text-purple-600' : 'text-yellow-600'}`} />
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-lg font-bold text-green-600">{offer.match}%</span>
                      </div>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{offer.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{offer.company}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center space-x-1">
                        <MapPinIcon className="h-4 w-4" />
                        <span>{offer.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <CurrencyDollarIcon className="h-4 w-4" />
                        <span>{offer.salary}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(offer.type)}`}>
                        {offer.type.charAt(0).toUpperCase() + offer.type.slice(1)}
                      </span>
                      <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors">
                        Postuler
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'applications' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Suivi des Candidatures</h2>
              <div className="text-sm text-gray-600">
                {applications.length} candidatures au total
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Poste</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entreprise</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {applications.map((app) => (
                      <tr key={app.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{app.title}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                          {app.company}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(app.type)}`}>
                            {app.type.charAt(0).toUpperCase() + app.type.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                          {app.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                            {app.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
              <button 
                onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Tout marquer comme lu
              </button>
            </div>
            <div className="space-y-4">
              {notifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  className={`bg-white p-4 rounded-2xl shadow-sm cursor-pointer transition-all ${
                    !notification.read ? 'border-l-4 border-blue-500' : ''
                  }`}
                  onClick={() => markNotificationAsRead(notification.id)}
                  whileHover={{ x: 4 }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className={`font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-600'}`}>
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{notification.message}</p>
                      <p className="text-gray-400 text-xs">{notification.time}</p>
                    </div>
                    <BellIcon className="h-5 w-5 text-gray-400" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
