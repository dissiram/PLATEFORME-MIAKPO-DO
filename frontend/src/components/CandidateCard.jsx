import React from "react";
import { CalendarIcon, BriefcaseIcon, AcademicCapIcon, TrophyIcon, CurrencyDollarIcon } from "@heroicons/react/24/outline";

const CandidateCard = ({ applicant, resume, portfolio, offer, appliedAt }) => {
  // Icône selon le type d'offre
  const getTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "emploi": return BriefcaseIcon;
      case "stage": return AcademicCapIcon;
      case "concours": return TrophyIcon;
      case "bourse": return CurrencyDollarIcon;
      default: return BriefcaseIcon;
    }
  };

  const TypeIcon = getTypeIcon(offer?.contractType || offer?.type);

  return (
    <div className="bg-gray-50 p-4 rounded-xl shadow">
      {/* Photo de profil */}
      <div className="flex items-center space-x-3 mb-3">
        <img
          src={
            portfolio?.profileImage
              ? `http://localhost:5000/${portfolio.profileImage}`
              : "/avatar.png"
          }
          alt={applicant.username}
          className="w-12 h-12 rounded-full border-2 border-indigo-500 object-cover"
        />
        <div>
          <p className="font-semibold text-gray-900">{applicant.username}</p>
          {offer?.title && (
            <p className="text-sm text-gray-500">
              Candidature pour : <span className="font-medium">{offer.title}</span>
            </p>
          )}
        </div>
      </div>

      {/* Type de contrat */}
      {offer?.contractType && (
        <div className="flex items-center gap-1 mb-2 text-sm text-gray-700">
          <TypeIcon className="h-4 w-4" />
          <span>{offer.contractType}</span>
        </div>
      )}

      {/* Date de candidature */}
      {appliedAt && (
        <div className="flex items-center gap-1 mb-2 text-sm text-gray-500">
          <CalendarIcon className="h-4 w-4" />
          <span>{new Date(appliedAt).toLocaleDateString()}</span>
        </div>
      )}

      {/* Infos CV / Portfolio */}
      <div className="flex gap-2 mt-2">
        {resume && (
          <a
            href={`http://localhost:5000/${resume}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 transition text-sm"
          >
            Voir CV
          </a>
        )}
        {portfolio && (
          <a
            href={`/portfolio/${applicant._id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition text-sm"
          >
            Voir Portfolio
          </a>
        )}
      </div>

      {/* Bio ou autres infos */}
      {portfolio?.bio && <p className="mt-2 text-gray-700 text-sm">{portfolio.bio}</p>}
    </div>
  );
};

export default CandidateCard;
