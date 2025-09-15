import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";

export default function Candidatures() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/applications/my-history",
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setApplications(res.data);
    } catch (err) {
      console.error("Erreur récupération candidatures :", err);
      toast.error("Erreur lors du chargement des candidatures");
    }
  };

  const handleDeleteApplication = async (applicationId) => {
    setLoading(true);
    try {
      await axios.delete(
        `http://localhost:5000/api/applications/${applicationId}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      
      toast.success("Candidature retirée avec succès");
      // Mettre à jour la liste sans recharger toute la page
      setApplications(applications.filter(app => app._id !== applicationId));
    } catch (err) {
      console.error("Erreur suppression candidature :", err);
      if (err.response?.status === 400) {
        toast.error(err.response.data.error || "Impossible de retirer cette candidature");
      } else {
        toast.error("Erreur lors de la suppression");
      }
    } finally {
      setLoading(false);
    }
  };

  const isActive = (deadline) => {
    if (!deadline) return true;
    const now = new Date();
    return new Date(deadline) >= now;
  };

  const canDelete = (application) => {
    // Peut supprimer seulement si le statut est "En attente" et que l'offre est active
    return application.status === "En attente" && isActive(application.offer.deadline);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <main className="flex-1 p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-xl shadow p-6"
        >
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Mes Candidatures</h1>
            <p className="text-gray-600 mt-2">
              {applications.length} candidature{applications.length !== 1 ? 's' : ''}
            </p>
          </div>

          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-400 text-xs font-semibold">
                <th className="py-2 px-4 font-semibold">Offres</th>
                <th className="py-2 px-4 font-semibold">Dates de soumission</th>
                <th className="py-2 px-4 font-semibold">Statut de l'offre</th>
                <th className="py-2 px-4 font-semibold">Statut candidature</th>
                <th className="py-2 px-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app, index) => (
                <motion.tr
                  key={app._id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="border-b last:border-b-0 hover:bg-gray-50"
                >
                  <td className="py-3 px-4">
                    <div className="font-semibold text-gray-800 text-sm">{app.offer?.title}</div>
                    <div className="text-xs text-gray-500">{app.offer?.company}</div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {new Date(app.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    {isActive(app.offer?.deadline) ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        ● Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-500">
                        ● Expirée
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      app.status === "Acceptée" ? "bg-green-100 text-green-700" :
                      app.status === "Refusée" ? "bg-red-100 text-red-700" :
                      app.status === "En cours de traitement" ? "bg-blue-100 text-blue-700" :
                      "bg-yellow-100 text-yellow-700"
                    }`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {canDelete(app) ? (
                      <button
                        onClick={() => handleDeleteApplication(app._id)}
                        disabled={loading}
                        className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                      >
                        {loading ? "Suppression..." : "Retirer"}
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400 cursor-not-allowed">
                        Non supprimable
                      </span>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>

          {applications.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              Aucune candidature pour le moment
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}