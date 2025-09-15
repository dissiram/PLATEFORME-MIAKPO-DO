import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import axios from "axios";

const profileColors = [
  "bg-indigo-500", "bg-pink-500", "bg-green-500", "bg-yellow-500",
  "bg-purple-500", "bg-red-500", "bg-blue-500", "bg-teal-500"
];

const statusOptions = [
  { value: "En attente", label: "En attente", color: "bg-yellow-100 text-yellow-800" },
  { value: "Acceptée", label: "Acceptée", color: "bg-green-100 text-green-800" },
  { value: "Refusée", label: "Refusée", color: "bg-red-100 text-red-800" }
];

const ApplicationCard = ({ application, index, isExpanded, onToggle, onStatusUpdate }) => {
  const [resumeData, setResumeData] = useState(null);
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(false);

  const applicant = application.applicant || {};
  const applicantId = applicant._id || application.applicant; 
  const fullName = applicant.fullName || applicant.username || "Candidat";
  const email = applicant.email || "Non renseigné";
  const phone = applicant.contactInfo?.phone || "Non renseigné";
  const profileImageUrl = applicant.profileImage || null;
  const designation = applicant.designation || "Poste non spécifié";

  const colorClass = profileColors[index % profileColors.length];
  const currentStatus = statusOptions.find(opt => opt.value === (application.status || "En attente"));

  useEffect(() => {
    if (isExpanded && applicantId) {
      const fetchCandidateData = async () => {
        setLoading(true);
        try {
          const [resumeRes, portfolioRes] = await Promise.all([
            axios.get(`/api/resumes/public/user/${applicantId}`),
            axios.get(`/api/portfolios/public/user/${applicantId}`)
          ]);

          setResumeData(resumeRes.data || null);
          setPortfolioData(portfolioRes.data || null);
        } catch (err) {
          console.error("Erreur chargement données candidat:", err);
          setResumeData(null);
          setPortfolioData(null);
        } finally {
          setLoading(false);
        }
      };
      fetchCandidateData();
    }
  }, [isExpanded, applicantId]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={`bg-white rounded-xl shadow-md p-6 flex flex-col gap-4 border border-gray-100 ${isExpanded ? 'bg-gray-50' : ''}`}
    >
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg ${colorClass}`}>
          {profileImageUrl ? (
            <img src={profileImageUrl} alt={fullName} className="w-full h-full rounded-full object-cover" />
          ) : (
            <span>{fullName.charAt(0).toUpperCase()}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 text-lg truncate">{fullName}</p>
          <p className="text-gray-500 text-sm truncate">{designation}</p>
          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${currentStatus.color}`}>
            {currentStatus.label}
          </div>
        </div>
        <button onClick={onToggle} className="text-indigo-600 font-semibold flex items-center gap-1">
          {isExpanded ? 'Voir moins' : 'Voir plus'} <span className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>&#9660;</span>
        </button>
      </div>

      {/* Contenu dépliable */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-4 mt-3"
          >
            {loading && <div className="text-center py-4 text-gray-500">Chargement des données...</div>}

            {/* Infos contact */}
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-500 block mb-1">Email:</span>
                  <a href={`mailto:${email}`} className="text-indigo-600 hover:text-indigo-800 truncate block">{email}</a>
                </div>
                <div>
                  <span className="text-gray-500 block mb-1">Téléphone:</span>
                  <span className="text-gray-900">{phone}</span>
                </div>
              </div>
            </div>

            {/* Boutons actions */}
            <div className="flex flex-wrap gap-3 mt-2">
              {resumeData ? (
                <Link
                  to={`/public/resume/${applicantId}`}
                  className="flex-1 text-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow flex items-center justify-center gap-2"
                >
                  Voir CV
                </Link>
              ) : (
                <button disabled className="flex-1 text-center bg-gray-200 text-gray-500 px-4 py-2 rounded-lg cursor-not-allowed">
                  CV non disponible ou privé
                </button>
              )}

              {applicantId ? (
                <Link
                  to={`/public/portfolio/${applicantId}`}
                  className="flex-1 text-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition shadow flex items-center justify-center gap-2"
                >
                  Portfolio
                </Link>
              ) : (
                <button disabled className="flex-1 text-center bg-gray-200 text-gray-500 px-4 py-2 rounded-lg cursor-not-allowed">
                  ID utilisateur manquant
                </button>
              )}
            </div>

            {/* Sélecteur de statut */}
            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Modifier le statut:</label>
              <select
                value={application.status || "En attente"}
                onChange={(e) => onStatusUpdate(application._id, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            {/* Date de candidature */}
            {application.appliedAt && (
              <div className="text-xs text-gray-500 border-t border-gray-100 pt-2 text-right">
                Candidature du {new Date(application.appliedAt).toLocaleDateString('fr-FR', {
                  year: 'numeric', month: 'long', day: 'numeric'
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ApplicationCard;
