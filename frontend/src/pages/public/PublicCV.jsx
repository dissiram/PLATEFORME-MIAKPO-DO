import React, { useEffect, useState } from "react";
import CVPreview from "../../components/cv/CvPreview";
import axios from "axios";

const PublicCV = () => {
  const [resume, setResume] = useState(null);

  useEffect(() => {
    // Récupération du CV depuis une API publique ou un fichier JSON
    axios
      .get("/api/cv/public") // Exemple d'API publique
      .then((res) => setResume(res.data))
      .catch((err) => console.error(err));
  }, []);

  if (!resume) return <p>Chargement du CV...</p>;

  return (
    <div className="container mx-auto p-4">
      <CVPreview resume={resume} />
    </div>
  );
};

export default PublicCV;
