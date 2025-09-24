import React from "react";
import { useNavigate } from "react-router-dom";
import { useCV } from "../../contexts/CVContext";
import CVPreview from "../../components/cv/CvPreview";
import { PencilIcon } from "@heroicons/react/24/outline";

const MyCV = () => {
  const { cv, loading } = useCV();
  const navigate = useNavigate();

  if (loading) return <p>Chargement...</p>;

  if (!cv) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-semibold mb-4">Aucun CV trouvé</h2>
        <p className="text-gray-600 mb-4">Vous n’avez pas encore créé de CV.</p>
        <button
          onClick={() => navigate("/dashboard/user/cv")}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Créer mon CV
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Mon CV</h1>
        <button
          onClick={() => navigate("/dashboard/user/cv")}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <PencilIcon className="h-5 w-5 mr-2" />
          Modifier
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <CVPreview resume={cv} />
      </div>

      <p className="text-sm text-gray-500 text-right">
        Dernière mise à jour : {new Date(cv.updatedAt).toLocaleDateString("fr-FR")}
      </p>
    </div>
  );
};

export default MyCV;
