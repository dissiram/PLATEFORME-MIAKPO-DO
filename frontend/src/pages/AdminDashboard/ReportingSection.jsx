import React, { useState } from 'react';
import { Download, Calendar, BarChart3, FileText, Users, TrendingUp } from 'lucide-react';

const ReportingSection = ({ stats = {}, users = [], offers = [] }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [reportType, setReportType] = useState('general');

  const generateReport = (type) => {
    const reportData = {
      general: {
        title: 'Rapport Général de la Plateforme',
        data: {
          'Utilisateurs totaux': stats.totalUsers ?? 0,
          'Utilisateurs actifs': stats.activeUsers ?? 0,
          'Offres totales': stats.totalOffers ?? 0,
          'Offres en attente': stats.pendingOffers ?? 0,
          'Croissance mensuelle': `${stats.monthlyGrowth ?? 0}%`,
          'Croissance des revenus': `${stats.revenueGrowth ?? 0}%`
        }
      },
      users: {
        title: 'Rapport des Utilisateurs',
        data: {
          'Total utilisateurs': users.length,
          'Utilisateurs actifs': users.filter(u => u.status === 'active').length,
          'Utilisateurs suspendus': users.filter(u => u.status === 'suspended').length,
          'Utilisateurs inactifs': users.filter(u => u.status === 'inactive').length,
          'Moyenne offres par utilisateur': users.length > 0 
            ? Math.round(users.reduce((sum, u) => sum + (u.totalOffers ?? 0), 0) / users.length) 
            : 0
        }
      },
      content: {
        title: 'Rapport des Contenus',
        data: {
          'Total des offres': offers.length,
          'Offres approuvées': offers.filter(o => o.status === 'approved').length,
          'Offres en attente': offers.filter(o => o.status === 'pending').length,
          'Offres rejetées': offers.filter(o => o.status === 'rejected').length,
          'Vues totales': offers.reduce((sum, o) => sum + (o.views ?? 0), 0)
        }
      }
    };

    const report = reportData[type];

    let csvContent = `${report.title}\nGénéré le: ${new Date().toLocaleDateString('fr-FR')}\nPériode: ${selectedPeriod === 'month' ? 'Ce mois' : selectedPeriod === 'quarter' ? 'Ce trimestre' : 'Cette année'}\n\n`;
    csvContent += 'Métrique,Valeur\n';
    Object.entries(report.data).forEach(([key, value]) => {
      csvContent += `"${key}","${value}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `rapport_${type}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Rapports et statistiques</h2>
        <p className="text-gray-600 mt-2">Analysez les performances de votre plateforme</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Taux de croissance</p>
              <p className="text-2xl font-bold text-green-600">+{stats.monthlyGrowth ?? 0}%</p>
              <p className="text-sm text-gray-500">vs mois dernier</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Taux d'approbation</p>
              <p className="text-2xl font-bold text-blue-600">
                {offers.length > 0 
                  ? Math.round((offers.filter(o => o.status === 'approved').length / offers.length) * 100) 
                  : 0}%
              </p>
              <p className="text-sm text-gray-500">des offres soumises</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Engagement moyen</p>
              <p className="text-2xl font-bold text-purple-600">
                {offers.length > 0 
                  ? Math.round(offers.reduce((sum, o) => sum + (o.views ?? 0), 0) / offers.length) 
                  : 0}
              </p>
              <p className="text-sm text-gray-500">vues par offre</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportingSection;
