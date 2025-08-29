import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CVPreview from "../../components/cv/CvPreview";

const MyCV = () => {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCV = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Vous n'êtes pas connecté.");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get("http://localhost:5000/api/resumes/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setResume(res.data);
      } catch (err) {
        console.error("Erreur récupération CV:", err.response || err);
        if (err.response) {
          setError(err.response.data.error || "Erreur serveur");
        } else {
          setError("Erreur réseau");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCV();
  }, []);

  if (loading) return <p>Chargement du CV...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!resume) return <p>Aucun CV trouvé.</p>;

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => navigate("/dashboard/user/cv")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Modifier le CV
        </button>
      </div>
      <CVPreview resume={resume} />
    </div>
  );
};

export default MyCV;
