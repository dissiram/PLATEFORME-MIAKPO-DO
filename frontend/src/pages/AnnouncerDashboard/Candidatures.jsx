import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Candidatures = () => {
  const [applications] = useState([
    { id: 1, candidate: 'Amanda Johnson', offer: 'Développeur Frontend', type: 'emploi', date: '15/08/2025', status: 'En cours' },
    { id: 2, candidate: 'John Doe', offer: 'Stage Marketing', type: 'stage', date: '12/08/2025', status: 'Vue' },
    { id: 3, candidate: 'Sarah Lee', offer: 'Développeur Backend', type: 'emploi', date: '10/08/2025', status: 'Refusée' },
    { id: 4, candidate: 'Paul Martin', offer: 'Bourse Recherche', type: 'bourse', date: '08/08/2025', status: 'Acceptée' },
  ]);

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
    <div className="flex-1 p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Candidatures reçues</h1>

      {applications.length === 0 ? (
        <p>Aucune candidature reçue pour le moment.</p>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-max">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidat</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Offre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {applications.map((app) => (
                  <motion.tr
                    key={app.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    whileHover={{ scale: 1.01 }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{app.candidate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{app.offer}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{app.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{app.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                        {app.status}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Candidatures;
