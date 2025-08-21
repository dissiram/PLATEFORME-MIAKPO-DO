import React from "react";
import { Link } from "react-router-dom";
import errImg from "../../assets/error.svg";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-blue-50 rounded-xl shadow-md p-8 w-full max-w-md flex flex-col items-center relative">
        <img src={errImg} alt="Illustration erreur" className="w-32 h-32 mb-6" />

        <h1 className="text-2xl font-bold text-gray-800 mb-2">Page introuvable</h1>
        <p className="text-gray-600 mb-6 text-center">
          Désolé, la page que vous cherchez n’existe pas ou a été déplacée.
        </p>

        <Link
          to="/"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          Retour à l’accueil
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
