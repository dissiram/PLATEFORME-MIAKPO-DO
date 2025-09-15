
// src/components/public/PublicPortfolio.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  UserCircleIcon, 
  ArrowLeftIcon, 
  EyeIcon, 
  EyeSlashIcon,
  GlobeAltIcon 
} from "@heroicons/react/24/outline";

const gridCols = { 
  small: "col-span-1", 
  medium: "col-span-2", 
  large: "col-span-3" 
};

const PublicPortfolio = () => {
  const [portfolio, setPortfolio] = useState(null);
  const [profile, setProfile] = useState({});
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPublicPortfolio = async () => {
      try {
        // Fetch public portfolio
        const res = await axios.get(`http://localhost:5000/api/portfolios/${userId}`);
        
        if (res.data) {
          setPortfolio(res.data);
          setProfile(res.data.profile || {});
          setBlocks(res.data.blocks || []);
        }
      } catch (err) {
        console.error("Erreur récupération portfolio public:", err.response || err);
        if (err.response?.status === 404) {
          setError("Ce portfolio n'existe pas ou n'est pas disponible.");
        } else if (err.response) {
          setError(err.response.data.error || "Erreur lors du chargement du portfolio");
        } else {
          setError("Erreur réseau");
        }
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchPublicPortfolio();
    } else {
      setError("ID utilisateur manquant");
      setLoading(false);
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <EyeSlashIcon className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-800 mb-2">Portfolio non disponible</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Retour
          </button>
        </div>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <p className="text-gray-600">Aucun portfolio trouvé.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-gray-800 transition"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Retour
            </button>
            
            <div className="flex items-center space-x-2">
              <GlobeAltIcon className="h-5 w-5 text-blue-500" />
              <span className="text-sm font-medium text-blue-600">Portfolio Public</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto p-6 flex flex-col gap-8">
        {/* Profile Section */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="flex flex-col items-center gap-4">
            {profile.image ? (
              <img 
                src={profile.image} 
                alt="Profile" 
                className="w-32 h-32 rounded-full object-cover shadow-lg ring-4 ring-white"
              />
            ) : (
              <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                <UserCircleIcon className="w-20 h-20 text-white" />
              </div>
            )}
            
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {profile.name || "Nom non renseigné"}
              </h1>
              {profile.bio && (
                <p className="text-gray-600 text-lg max-w-2xl">
                  {profile.bio}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Portfolio Blocks */}
        {blocks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {blocks.map((block, index) => (
              <div
                key={index}
                className={`${block.bgColor || 'bg-white'} p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 ${
                  gridCols[block.size] || "col-span-2"
                }`}
              >
                {block.type === "text" && (
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                      {block.content}
                    </p>
                  </div>
                )}
                
                {block.type === "title" && (
                  <h2 className="text-2xl font-bold text-gray-900 leading-tight">
                    {block.content}
                  </h2>
                )}
                
                {block.type === "image" && block.content && (
                  <div className="overflow-hidden rounded-lg">
                    <img 
                      src={block.content} 
                      alt="Portfolio content"
                      className="w-full h-48 object-cover hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                )}
                
                {block.type === "video" && block.content && (
                  <div className="overflow-hidden rounded-lg">
                    <video 
                      src={block.content} 
                      controls 
                      className="w-full h-48 rounded-lg"
                    />
                  </div>
                )}
                
                {block.type === "link" && block.content && (
                  <a 
                    href={block.content} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 underline font-medium transition-colors"
                  >
                    <GlobeAltIcon className="h-4 w-4 mr-2" />
                    {block.content}
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="text-gray-400 mb-4">
              <UserCircleIcon className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Portfolio en construction
            </h3>
            <p className="text-gray-600">
              Ce portfolio ne contient pas encore de contenu.
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="text-center py-8">
          <p className="text-sm text-gray-500">
            Portfolio mis à jour le {new Date(portfolio.updatedAt).toLocaleDateString('fr-FR')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PublicPortfolio;