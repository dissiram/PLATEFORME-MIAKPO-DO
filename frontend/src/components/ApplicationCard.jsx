import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const profileColors = [
  "bg-gradient-to-br from-indigo-500 to-purple-600",
  "bg-gradient-to-br from-pink-500 to-rose-600",
  "bg-gradient-to-br from-green-500 to-emerald-600",
  "bg-gradient-to-br from-yellow-500 to-amber-600",
  "bg-gradient-to-br from-purple-500 to-violet-600",
  "bg-gradient-to-br from-red-500 to-orange-600",
  "bg-gradient-to-br from-blue-500 to-cyan-600",
  "bg-gradient-to-br from-teal-500 to-blue-600"
];

const statusOptions = [
  { value: "En attente", label: "En attente", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  { value: "Acceptée", label: "Acceptée", color: "bg-green-100 text-green-800 border-green-200" },
  { value: "Refusée", label: "Refusée", color: "bg-red-100 text-red-800 border-red-200" }
];

const ApplicationCard = ({ application, index, isExpanded, onToggle }) => {
  const applicant = application.applicant || {};
  const applicantId = applicant._id;
  const email = applicant.email || "Non renseigné";
  const userImage = applicant.image;
  const resumeData = applicant.publicResume;

  const [displayName, setDisplayName] = useState("Candidat");
  const [imageError, setImageError] = useState(false);

  const colorClass = profileColors[index % profileColors.length];
  const currentStatus = statusOptions.find(opt => opt.value === (application.status || "En attente"));

  useEffect(() => {
    let name = "Candidat";
    if (applicant.username) name = applicant.username;
    else if (resumeData?.profileInfo?.fullName) name = resumeData.profileInfo.fullName;
    else if (email !== "Non renseigné") name = email.split("@")[0];
    setDisplayName(name);
  }, [applicant.username, resumeData, email]);

  const getInitial = () => displayName.charAt(0).toUpperCase();
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString("fr-FR", {
    year: "numeric", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit"
  });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
      className={`bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden ${isExpanded ? "ring-2 ring-indigo-100" : "hover:border-gray-200"}`}
    >
      {/* Header */}
      <div className={`p-6 cursor-pointer ${isExpanded ? "bg-gray-50 pb-4" : "hover:bg-gray-50"}`} onClick={onToggle}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg ${colorClass}`}>
              {userImage && !imageError
                ? <img src={userImage} alt={displayName} className="w-full h-full rounded-2xl object-cover" onError={() => setImageError(true)} />
                : <span className="text-white font-semibold">{getInitial()}</span>}
            </div>
            <div>
              <p className="font-bold text-gray-900 text-lg">{displayName}</p>
              <p className="text-gray-600 text-sm">{application.offer?.title || "Poste non spécifié"}</p>
            </div>
          </div>

          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${currentStatus.color}`}>
            {currentStatus.label}
          </span>
        </div>
      </div>

      {/* Contenu dépliable */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="border-t border-gray-100 p-6 space-y-4"
          >
            {/* Email centré */}
            <div className="text-center text-sm text-gray-700">
              <span className="font-medium">Email : </span>
              <a href={`mailto:${email}`} className="text-blue-600 hover:underline">{email}</a>
            </div>

            {/* Boutons sur une ligne */}
            <div className="flex gap-3">
              <Link
                to={`/public/resume/${resumeData?.owner || applicantId}`}
                className={`flex-1 text-center px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  resumeData
                    ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
              >
                Voir CV
              </Link>
              <Link
                to={`/public/portfolio/${applicant.portfolio || applicantId}`}
                className="flex-1 text-center px-4 py-2 rounded-md text-sm font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 transition-all"
              >
                Voir Portfolio
              </Link>
            </div>

            {/* Timestamp */}
            {application.appliedAt && (
              <div className="text-center pt-4 border-t border-gray-100 text-gray-400 text-sm">
                Candidature reçue le {formatDate(application.appliedAt)}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ApplicationCard;
