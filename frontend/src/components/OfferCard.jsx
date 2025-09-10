import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BriefcaseIcon,
  CalendarIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  EyeIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";

export default function OfferCard({ offer, onEdit, onDelete, onApply }) {
  const [expanded, setExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      // Vérifier si le contenu dépasse la hauteur maximale (300px)
      const isOverflowing = contentRef.current.scrollHeight > 300;
      setIsOverflowing(isOverflowing);
    }
  }, [offer]);

  const toggleExpand = () => setExpanded(!expanded);

  const truncateText = (text, length = 100) => {
    if (!text) return "";
    return text.length > length && !expanded ? text.slice(0, length) + "..." : text;
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-all relative">
      {/* Badge type */}
      <div className="flex justify-between items-start mb-2">
        <div className="flex gap-2">
          <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full flex items-center gap-1 text-xs font-medium">
            <BriefcaseIcon className="h-4 w-4" /> {offer.contractType || "Emploi"}
          </div>
          {offer.urgent && (
            <div className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">
              Urgent
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {onEdit && (
            <button onClick={() => onEdit(offer)} className="text-green-600 hover:text-green-800 text-sm">
              Modifier
            </button>
          )}
          {onDelete && (
            <button onClick={() => onDelete(offer._id)} className="text-red-600 hover:text-red-800 text-sm">
              Supprimer
            </button>
          )}
        </div>
      </div>

      {/* Contenu avec limitation de hauteur */}
      <motion.div
        ref={contentRef}
        className="overflow-hidden"
        initial={false}
        animate={{ height: expanded ? "auto" : isOverflowing ? "180px" : "auto" }}
        transition={{ duration: 0.3 }}
      >
        {/* Titre et entreprise */}
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{offer.title}</h3>
        <p className="text-blue-600 font-medium mb-2">{offer.company}</p>

        {/* Badges complémentaires */}
        <div className="flex flex-wrap gap-2 mb-3">
          {offer.location && (
            <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">{offer.location}</span>
          )}
          {offer.remote && (
            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">Remote</span>
          )}
          {offer.skills && offer.skills.split(",").map(skill => (
            <span key={skill} className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs">{skill}</span>
          ))}
        </div>

        {/* Infos clés */}
        <div className="flex flex-wrap gap-4 text-gray-500 text-sm mb-3">
          <div className="flex items-center gap-1">
            <MapPinIcon className="h-4 w-4" /> {offer.location || "Non précisé"}
          </div>
          <div className="flex items-center gap-1">
            <CurrencyDollarIcon className="h-4 w-4" /> {offer.salary || "N/A"}
          </div>
          {offer.deadline && (
            <div className="flex items-center gap-1">
              <CalendarIcon className="h-4 w-4" /> Sauvé le {new Date(offer.deadline).toLocaleDateString()}
            </div>
          )}
          {offer.viewedDate && (
            <div className="flex items-center gap-1">
              <EyeIcon className="h-4 w-4" /> Vu le {new Date(offer.viewedDate).toLocaleDateString()}
            </div>
          )}
        </div>

        {/* Description */}
        {offer.description && (
          <div className="mb-3 border-l-4 border-gray-200 pl-3 text-gray-700 text-sm">
            {truncateText(offer.description)}
          </div>
        )}
      </motion.div>

      {/* Bouton pour développer/réduire */}
      {isOverflowing && (
        <button
          onClick={toggleExpand}
          className="flex items-center justify-center w-full mt-3 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
        >
          {expanded ? (
            <>
              <ChevronUpIcon className="h-4 w-4 mr-1" />
              Voir moins
            </>
          ) : (
            <>
              <ChevronDownIcon className="h-4 w-4 mr-1" />
              Voir plus
            </>
          )}
        </button>
      )}

      {/* Bouton Postuler pour les users */}
      {onApply && (
        <button
          onClick={() => onApply(offer._id)}
          className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          Postuler
        </button>
      )}
    </div>
  );
}