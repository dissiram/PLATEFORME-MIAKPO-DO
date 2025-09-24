import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCV } from "../../contexts/CVContext";
import CVPreview from "../../components/cv/CvPreview";

const PublicCV = () => {
  const { userId } = useParams();
  const { fetchPublicCV } = useCV();
  const [cv, setCV] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCV = async () => {
      setLoading(true);
      const data = await fetchPublicCV(userId);
      if (!data) {
        setError("CV non disponible ou non public.");
      } else {
        setCV(data);
      }
      setLoading(false);
    };
    loadCV();
  }, [userId]);

  if (loading) return <p>Chargement...</p>;

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-semibold mb-4">CV non disponible</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retour
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 flex flex-col gap-6">
      <h1 className="text-3xl font-bold text-center">CV de {cv.profileInfo.fullName}</h1>

      <div className="bg-white p-6 rounded-xl shadow">
        <CVPreview resume={cv} />
      </div>

      <p className="text-sm text-gray-500 text-right">
        Dernière mise à jour : {new Date(cv.updatedAt).toLocaleDateString("fr-FR")}
      </p>
    </div>
  );
};

export default PublicCV;
