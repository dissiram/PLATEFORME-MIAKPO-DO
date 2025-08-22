import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrashIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

const MyOffers = () => {
  const [offers, setOffers] = useState([
    // Exemple d'offres déjà créées (à supprimer ou remplacer par données backend)
    {
      id: 1,
      title: 'Développeur Frontend React',
      company: 'TechCorp',
      type: 'emploi',
      location: 'Paris',
      salary: '45-55k€',
      files: ['description.pdf']
    }
  ]);

  const [newFiles, setNewFiles] = useState([]);

  // Supprimer une offre
  const handleDeleteOffer = (id) => {
    setOffers(prev => prev.filter(offer => offer.id !== id));
  };

  // Ajouter des fichiers à une offre temporaire
  const handleFileChange = (e) => {
    const filesArray = Array.from(e.target.files).map(file => file.name);
    setNewFiles(filesArray);
  };

  // Créer une nouvelle offre (simplifiée ici)
  const handleAddOffer = () => {
    if (!newFiles.length) return alert("Ajoutez au moins un fichier !");
    const newOffer = {
      id: Date.now(),
      title: 'Nouvelle Offre',
      company: 'Votre Entreprise',
      type: 'emploi',
      location: 'Votre Ville',
      salary: 'À définir',
      files: newFiles
    };
    setOffers(prev => [...prev, newOffer]);
    setNewFiles([]);
  };

  return (
    <div className="flex-1 p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Mes Offres</h1>

      {/* Zone création offre */}
      <div className="bg-white p-6 rounded-2xl shadow-sm mb-6">
        <h2 className="font-semibold mb-4">Créer une nouvelle offre</h2>
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="mb-4"
        />
        {newFiles.length > 0 && (
          <ul className="mb-4">
            {newFiles.map((file, index) => (
              <li key={index} className="text-gray-700 text-sm">{file}</li>
            ))}
          </ul>
        )}
        <button
          onClick={handleAddOffer}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Ajouter l'offre
        </button>
      </div>

      {/* Liste des offres */}
      {offers.length === 0 ? (
        <p>Vous n’avez encore créé aucune offre.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map((offer) => (
            <motion.div
              key={offer.id}
              className="bg-white p-6 rounded-2xl shadow-sm relative"
              whileHover={{ y: -4 }}
            >
              <button
                onClick={() => handleDeleteOffer(offer.id)}
                className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <TrashIcon className="h-5 w-5 text-red-500" />
              </button>
              <div className="flex items-center space-x-2 mb-2">
                <DocumentTextIcon className="h-6 w-6 text-blue-600" />
                <h3 className="font-semibold text-gray-900">{offer.title}</h3>
              </div>
              <p className="text-gray-600 text-sm mb-2">{offer.company}</p>
              <p className="text-gray-500 text-sm mb-2">{offer.location}</p>
              <p className="text-gray-500 text-sm mb-4">{offer.salary}</p>

              {offer.files && offer.files.length > 0 && (
                <div className="mb-2">
                  <p className="text-gray-700 font-medium text-sm mb-1">Fichiers joints :</p>
                  <ul className="text-gray-600 text-sm list-disc list-inside">
                    {offer.files.map((file, idx) => (
                      <li key={idx}>{file}</li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOffers;
