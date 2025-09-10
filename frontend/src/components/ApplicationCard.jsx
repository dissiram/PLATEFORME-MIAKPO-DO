import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const profileColors = [
  "bg-indigo-500", "bg-pink-500", "bg-green-500", "bg-yellow-500",
  "bg-purple-500", "bg-red-500", "bg-blue-500", "bg-teal-500"
];

const statusOptions = [
  { value: "En attente", label: "En attente", color: "bg-yellow-100 text-yellow-800" },
  { value: "Acceptée", label: "Acceptée", color: "bg-green-100 text-green-800" },
  { value: "Refusée", label: "Refusée", color: "bg-red-100 text-red-800" }
];

const ApplicationCard = React.memo(({ application, index, isExpanded, onToggle, onStatusUpdate }) => {
  const applicationId = application.applicationId || application._id;
  const applicant = application.applicant || application;
  const resumeData = application.resume || applicant?.resume;
  const portfolioData = application.portfolio || applicant?.portfolio;

  const fullName = resumeData?.profileInfo?.fullName || applicant?.username || "Candidat";
  const profileImage = applicant?.portfolio?.profileImage;
  const profileImageUrl = profileImage || null;

  const hasResume = applicant?.resume || resumeData?.fileUrl;
  const resumeUrl = applicant?.resume || resumeData?.fileUrl || null;

  const hasPortfolio = portfolioData || applicant?.portfolio;
  const portfolioUrl = applicant?._id || application.userId;

  const email = resumeData?.contactInfo?.email || applicant?.email || "Non renseigné";
  const phone = resumeData?.contactInfo?.phone || "Non renseigné";
  const designation = resumeData?.profileInfo?.designation || "Poste non spécifié";

  const colorClass = profileColors[index % profileColors.length];
  const currentStatus = statusOptions.find(opt => opt.value === (application.status || "En attente"));

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={`bg-white rounded-xl shadow-md hover:shadow-lg transition p-6 flex flex-col gap-4 border border-gray-100 ${isExpanded ? 'shadow-xl bg-gray-50' : ''}`}
    >
      {/* En-tête */}
      <div className="flex items-center gap-4">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg ${colorClass}`}>
          {profileImageUrl ? (
            <img
              src={profileImageUrl}
              alt={fullName}
              className="w-full h-full rounded-full object-cover"
              onError={(e) => { e.target.src = "/avatar.png"; }}
            />
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
        <button
          onClick={onToggle}
          className="text-indigo-600 font-semibold flex items-center gap-1 whitespace-nowrap"
          aria-label={isExpanded ? 'Réduire les détails' : 'Voir les détails'}
        >
          {isExpanded ? 'Voir moins' : 'Voir plus'}
          <span className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>&#9660;</span>
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
            {/* Infos contact */}
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-500 block mb-1">Email:</span>
                  <a href={`mailto:${email}`} className="text-indigo-600 hover:text-indigo-800 truncate block">{email}</a>
                </div>
                <div>
                  <span className="text-gray-500 block mb-1">Téléphone:</span>
                  <a href={`tel:${phone}`} className="text-gray-900">{phone}</a>
                </div>
              </div>
            </div>

            {/* Compétences */}
            {resumeData?.skills && resumeData.skills.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Compétences principales:</p>
                <div className="flex flex-wrap gap-1">
                  {resumeData.skills.slice(0, 5).map((skill, idx) => (
                    <span key={idx} className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-xs">{skill.name || skill}</span>
                  ))}
                  {resumeData.skills.length > 5 && (
                    <span className="text-xs text-gray-500 px-2 py-1">+{resumeData.skills.length - 5} autres</span>
                  )}
                </div>
              </div>
            )}

            {/* Boutons actions */}
            <div className="flex flex-wrap gap-3 mt-2">
              {hasResume && resumeUrl && (
                <a 
                  href={resumeUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex-1 text-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition shadow flex items-center justify-center gap-2"
                >
                  Voir CV
                </a>
              )}
              {hasPortfolio && portfolioUrl && (
                <Link
                  to={`/portfolio/${portfolioUrl}`}
                  className="flex-1 text-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition shadow flex items-center justify-center gap-2"
                >
                  Portfolio
                </Link>
              )}
            </div>

            {/* Sélecteur de statut */}
            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Modifier le statut:</label>
              <select
                value={application.status || "En attente"}
                onChange={(e) => onStatusUpdate(applicationId, e.target.value)}
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
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

ApplicationCard.displayName = 'ApplicationCard';

export default ApplicationCard;
