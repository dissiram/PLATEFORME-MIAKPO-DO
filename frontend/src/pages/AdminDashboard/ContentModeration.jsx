import React, { useState } from 'react';
import { Search, Filter, Eye, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';

const ContentModeration = ({ offers = [], setOffers = () => {} }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedOffer, setSelectedOffer] = useState(null);

  const filteredOffers = offers.filter(offer => {
    const matchesSearch =
      offer.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.author?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || offer.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || offer.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleModerateOffer = (offerId, newStatus) => {
    setOffers(offers.map(offer =>
      offer.id === offerId ? { ...offer, status: newStatus } : offer
    ));
    setSelectedOffer(null);
  };

  const handleDeleteOffer = (offerId) => {
    setOffers(offers.filter(offer => offer.id !== offerId));
    setSelectedOffer(null);
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return badges[status];
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const categories = ['Technologie', 'Design', 'Management', 'Marketing', 'Finance'];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Modération des contenus</h2>
        <p className="text-gray-600 mt-2">Gérer et modérer les offres publiées</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par titre ou auteur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="approved">Approuvées</option>
              <option value="rejected">Rejetées</option>
            </select>
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Toutes catégories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <p className="text-sm font-medium text-gray-600">Total offres</p>
          <p className="text-2xl font-bold text-gray-900">{offers.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <p className="text-sm font-medium text-gray-600">En attente</p>
          <p className="text-2xl font-bold text-yellow-600">
            {offers.filter(o => o.status === 'pending').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <p className="text-sm font-medium text-gray-600">Approuvées</p>
          <p className="text-2xl font-bold text-green-600">
            {offers.filter(o => o.status === 'approved').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <p className="text-sm font-medium text-gray-600">Rejetées</p>
          <p className="text-2xl font-bold text-red-600">
            {offers.filter(o => o.status === 'rejected').length}
          </p>
        </div>
      </div>

      {/* Table des offres */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Offre</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Catégorie</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Statut</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Date</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Vues</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOffers.map((offer) => (
                <tr key={offer.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-medium text-gray-900">{offer.title}</p>
                      <p className="text-sm text-gray-600">Par {offer.author}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {offer.category}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(offer.status)}`}>
                      {getStatusIcon(offer.status)}
                      <span className="ml-1 capitalize">
                        {offer.status === 'pending'
                          ? 'En attente'
                          : offer.status === 'approved'
                          ? 'Approuvée'
                          : 'Rejetée'}
                      </span>
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-900">
                    {offer.publishDate ? new Date(offer.publishDate).toLocaleDateString('fr-FR') : '—'}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-900">{offer.views ?? 0}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedOffer(offer)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Voir détails"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {offer.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleModerateOffer(offer.id, 'approved')}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Approuver"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleModerateOffer(offer.id, 'rejected')}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Rejeter"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredOffers.length === 0 && (
            <p className="text-center py-6 text-gray-500">Aucune offre trouvée</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentModeration;
