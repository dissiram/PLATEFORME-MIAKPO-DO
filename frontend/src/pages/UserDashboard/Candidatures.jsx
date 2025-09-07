import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

export default function Candidatures() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/applications/my-history",
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        setApplications(res.data);
      } catch (err) {
        console.error("Erreur récupération candidatures :", err);
      }
    };

    fetchApplications();
  }, []);

  const isActive = (deadline) => {
    if (!deadline) return true;
    const now = new Date();
    return new Date(deadline) >= now;
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
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-400 text-xs font-semibold">
                <th className="py-2 px-4 font-semibold">Offres</th>
                <th className="py-2 px-4 font-semibold">Dates de soumission</th>
                <th className="py-2 px-4 font-semibold">Statut de l'offre</th>
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
                    <div className="font-semibold text-gray-800 text-sm">{app.offer.title}</div>
                    <div className="text-xs text-gray-500">{app.offer.company}</div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {new Date(app.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    {isActive(app.offer.deadline) ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        ● Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-500">
                        ● Expirée
                      </span>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </main>
    </div>
  );
}
