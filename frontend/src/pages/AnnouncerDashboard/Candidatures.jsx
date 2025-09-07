import React, { useState, useEffect } from 'react';
import axios from 'axios';

const sanitizeUrl = (url) => {
  if (
    typeof url === "string" &&
    (url.startsWith("http://") ||
      url.startsWith("https://") ||
      url.startsWith("/"))
  ) {
    return url;
  }
  return "";
};

const RecruiterApplications = () => {
  const [applications, setApplications] = useState([]);
  const [offers, setOffers] = useState([]);
  const [selectedOfferId, setSelectedOfferId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOffers();
  }, []);

  useEffect(() => {
    if (selectedOfferId) {
      fetchApplications(selectedOfferId);
    } else {
      setApplications([]);
    }
  }, [selectedOfferId]);

  const fetchOffers = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/offers/",
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setOffers(res.data || []);
    } catch (err) {
      console.error("Erreur récupération offres:", err);
      setError("Erreur lors du chargement des offres");
    }
  };

  const fetchApplications = async (offerId) => {
    if (!offerId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const res = await axios.get(
        `http://localhost:5000/api/applications/my-applications?offerId=${offerId}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      
      // Si la réponse a le format avec offer et candidates
      if (res.data.candidates) {
        setApplications(res.data.candidates);
      } else {
        // Sinon, format original
        setApplications(res.data || []);
      }
    } catch (err) {
      console.error("Erreur récupération candidatures:", err);
      setError("Erreur lors du chargement des candidatures");
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (applicationId, status) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/applications/${applicationId}/status`,
        {
          method: 'PUT',
          headers: { 
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ status })
        }
      );
      
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
      
      // Mettre à jour localement
      setApplications((prev) =>
        prev.map((app) =>
          app.applicationId === applicationId || app._id === applicationId
            ? { ...app, status }
            : app
        )
      );
    } catch (err) {
      console.error("Erreur mise à jour statut:", err);
      setError("Erreur lors de la mise à jour du statut");
    }
  };

  const getSelectedOfferInfo = () => {
    return offers.find(offer => offer._id === selectedOfferId);
  };

  const selectedOffer = getSelectedOfferInfo();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Candidatures reçues
      </h1>

      {/* Sélecteur d'offres */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Sélectionner une offre</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={selectedOfferId}
            onChange={(e) => setSelectedOfferId(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">-- Choisir une offre --</option>
            {offers.map((offer) => (
              <option key={offer._id} value={offer._id}>
                {offer.title} - {offer.company} ({offer.location})
              </option>
            ))}
          </select>
          {selectedOfferId && (
            <button
              onClick={() => fetchApplications(selectedOfferId)}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Actualiser
            </button>
          )}
        </div>
      </div>

      {/* Informations de l'offre sélectionnée */}
      {selectedOffer && (
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-900">{selectedOffer.title}</h3>
          <div className="flex items-center space-x-4 mt-2 text-gray-600">
            <span>{selectedOffer.company}</span>
            <span>•</span>
            <span>{selectedOffer.location}</span>
            <span>•</span>
            <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-sm">
              {selectedOffer.contractType}
            </span>
          </div>
          <div className="mt-4 text-right">
            <span className="text-2xl font-bold text-indigo-600">{applications.length}</span>
            <span className="text-gray-500 ml-2">candidature{applications.length > 1 ? 's' : ''}</span>
          </div>
        </div>
      )}

      {/* Messages d'état */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Contenu principal */}
      {!selectedOfferId ? (
        <div className="bg-white rounded-xl shadow p-12 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Sélectionnez une offre</h3>
          <p className="text-gray-500">Choisissez une offre d'emploi pour voir les candidatures associées.</p>
        </div>
      ) : loading ? (
        <div className="bg-white rounded-xl shadow p-12 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des candidatures...</p>
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-12 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune candidature</h3>
          <p className="text-gray-500">Aucun candidat n'a encore postulé pour cette offre.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {applications.map((app) => {
            // Adaptation pour les deux formats de données possibles
            const applicationId = app.applicationId || app._id;
            const applicant = app.applicant || app;
            const resume = app.resume || applicant?.resume;
            const portfolio = app.portfolio || applicant?.portfolio;
            
            // Récupération des données selon le format
            const fullName = resume?.profileInfo?.fullName || 
                             applicant?.cvName || 
                             applicant?.username || 
                             "Candidat";
            
            const profileImage = portfolio?.profile?.image || 
                                applicant?.portfolio?.profileImage;
            
            const profileImageUrl = profileImage
              ? sanitizeUrl(profileImage.startsWith('http') ? profileImage : `http://localhost:5000/uploads/${profileImage}`)
              : "/avatar.png";

            const resumeUrl = applicant?.resume
              ? sanitizeUrl(`http://localhost:5000/uploads/${applicant.resume}`)
              : null;

            const offerTitle = app.offer?.title || selectedOffer?.title || "Offre";
            const email = resume?.contactInfo?.email || "Non renseigné";
            const phone = resume?.contactInfo?.phone || "Non renseigné";
            const designation = resume?.profileInfo?.designation || "Poste non spécifié";

            return (
              <div
                key={applicationId}
                className="bg-white rounded-xl shadow p-5 flex flex-col gap-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={profileImageUrl}
                    alt={fullName}
                    className="w-16 h-16 rounded-full border-2 border-indigo-500 object-cover"
                    onError={(e) => {
                      e.target.src = "/avatar.png";
                    }}
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-lg">
                      {fullName}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {designation}
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      Candidature pour : {offerTitle}
                    </p>
                  </div>
                  <span
                    className={`text-sm font-medium px-3 py-1 rounded-full ${
                      app.status === "Acceptée"
                        ? "bg-green-100 text-green-800"
                        : app.status === "Refusée"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {app.status === "Acceptée"
                      ? "✅ Acceptée"
                      : app.status === "Refusée"
                      ? "❌ Refusée"
                      : "⏳ En attente"}
                  </span>
                </div>

                {/* Informations de contact */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">Email:</span>
                      <p className="text-gray-900 truncate">{email}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Téléphone:</span>
                      <p className="text-gray-900">{phone}</p>
                    </div>
                  </div>
                </div>

                {/* Compétences */}
                {resume?.skills && resume.skills.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Compétences principales:</p>
                    <div className="flex flex-wrap gap-1">
                      {resume.skills.slice(0, 4).map((skill, index) => (
                        <span
                          key={index}
                          className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-xs"
                        >
                          {skill.name}
                        </span>
                      ))}
                      {resume.skills.length > 4 && (
                        <span className="text-xs text-gray-500 px-2 py-1">
                          +{resume.skills.length - 4} autres
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-3">
                  {resumeUrl && (
                    <a
                      href={resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
                    >
                      Voir CV
                    </a>
                  )}
                  {portfolio && (
                    <a
                      href={sanitizeUrl(`/portfolio/${applicant._id || app.userId}`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                    >
                      Voir Portfolio
                    </a>
                  )}
                </div>

                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => updateStatus(applicationId, "Acceptée")}
                    className="bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600 transition flex-1"
                  >
                    Valider
                  </button>
                  <button
                    onClick={() => updateStatus(applicationId, "Refusée")}
                    className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 transition flex-1"
                  >
                    Rejeter
                  </button>
                  <button
                    onClick={() => updateStatus(applicationId, "En attente")}
                    className="bg-yellow-500 text-white px-3 py-2 rounded hover:bg-yellow-600 transition flex-1"
                  >
                    En attente
                  </button>
                </div>

                {/* Date de candidature */}
                {app.appliedAt && (
                  <div className="text-xs text-gray-500 border-t border-gray-100 pt-2">
                    Candidature du {new Date(app.appliedAt).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecruiterApplications;