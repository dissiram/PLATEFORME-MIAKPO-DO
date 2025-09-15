import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import CVPreview from "../../components/cv/CvPreview";
import { ArrowLeftIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const PublicCV = () => {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userId } = useParams(); // Prend l'ID utilisateur de l'URL
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPublicCV = async () => {
      if (!userId) {
        setError("ID utilisateur manquant");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`/api/resumes/public/user/${userId}`);
        setResume(res.data);
      } catch (err) {
        console.error("Erreur récupération CV public:", err.response || err);
        if (err.response?.status === 404) {
          setError("Ce CV n'est pas disponible publiquement ou n'existe pas.");
        } else if (err.response) {
          setError(err.response.data.error || "Erreur lors du chargement du CV");
        } else {
          setError("Erreur réseau");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPublicCV();
  }, [userId]);

  if (loading) return <div className="flex justify-center items-center min-h-screen">Chargement...</div>;

  if (error) return (
    <div className="max-w-4xl mx-auto p-6 text-center">
      <EyeSlashIcon className="h-16 w-16 text-red-400 mx-auto mb-4" />
      <h2 className="text-xl font-semibold text-red-800 mb-2">CV non disponible</h2>
      <p className="text-red-600 mb-4">{error}</p>
      <button onClick={() => navigate(-1)} className="px-4 py-2 bg-red-600 text-white rounded-md">Retour</button>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">CV de {resume.ownerName || "Utilisateur"}</h1>
        <button onClick={() => navigate(-1)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg flex items-center gap-2">
          <ArrowLeftIcon className="h-5 w-5" /> Retour
        </button>
      </div>
      <CVPreview data={resume} />
    </div>
  );
};

export default PublicCV;
