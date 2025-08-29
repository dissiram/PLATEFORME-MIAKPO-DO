import React, { useState, useEffect } from "react";
import axios from "axios";
import Progress from "../../components/cv/Progress";
import CVPreview from "../../components/cv/CvPreview";
import FormSection from "../../components/cv/FormSection";
import ArrayFormSection from "../../components/cv/ArrayFormSection";

const CVBuilder = () => {
  const [resume, setResume] = useState({
    profileInfo: { fullName: "", designation: "", summary: "" },
    contactInfo: { email: "", phone: "" },
    workExperience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    languages: [],
    interests: []
  });

  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: "", type: "" });

  // Charger le CV existant si présent
  useEffect(() => {
    const fetchCV = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get("http://localhost:5000/api/resumes/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setResume(res.data);
      } catch (err) {
        console.log("Aucun CV existant, création d'un nouveau");
      } finally {
        setLoading(false);
      }
    };

    fetchCV();
  }, []);

  const updateSection = (section, data) => {
    setResume(prev => ({ ...prev, [section]: data }));
  };

  const saveResume = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setToast({ message: "Vous devez être connecté.", type: "error" });
      return;
    }

    try {
      const method = resume._id ? "PUT" : "POST";
      const url = resume._id
        ? `http://localhost:5000/api/resumes/${resume._id}`
        : "http://localhost:5000/api/resumes";

      const res = await axios({
        method,
        url,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        data: resume
      });

      setResume(res.data);
      setToast({ message: "CV sauvegardé avec succès !", type: "success" });
    } catch (err) {
      console.error(err);
      setToast({ message: "Erreur : impossible de sauvegarder le CV.", type: "error" });
    }

    setTimeout(() => setToast({ message: "", type: "" }), 3000);
  };

  if (loading) return <p>Chargement du CV...</p>;

  return (
    <div className="flex flex-col lg:flex-row gap-8 p-6 bg-gray-50 min-h-screen">
      {/* Toast */}
      {toast.message && (
        <div
          className={`fixed top-6 right-6 px-4 py-2 rounded shadow-lg text-white transition-transform transform
            ${toast.type === "success" ? "bg-green-500" : "bg-red-500"} animate-slideIn`}
        >
          {toast.message}
        </div>
      )}

      {/* Colonne gauche : formulaire */}
      <div className="w-full lg:w-1/2 overflow-y-auto max-h-screen space-y-6">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          {resume._id ? "Modifier votre CV" : "Créer votre CV"}
        </h2>

        <div className="space-y-4">
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <FormSection section="profileInfo" data={resume.profileInfo} updateData={updateSection} />
          </div>
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <FormSection section="contactInfo" data={resume.contactInfo} updateData={updateSection} />
          </div>
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <ArrayFormSection section="workExperience" data={resume.workExperience} updateData={updateSection} fields={["company","role","startDate","endDate","description"]} />
          </div>
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <ArrayFormSection section="education" data={resume.education} updateData={updateSection} fields={["degree","institution","startDate","endDate"]} />
          </div>
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <ArrayFormSection section="skills" data={resume.skills} updateData={updateSection} fields={["name","progress"]} />
          </div>
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <ArrayFormSection section="projects" data={resume.projects} updateData={updateSection} fields={["title","description","github","liveDemo"]} />
          </div>
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <ArrayFormSection section="certifications" data={resume.certifications} updateData={updateSection} fields={["title","issuer","year"]} />
          </div>
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <ArrayFormSection section="languages" data={resume.languages} updateData={updateSection} fields={["name","progress"]} />
          </div>
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <ArrayFormSection
              section="interests"
              data={resume.interests.map(i => ({ interest: i }))}
              updateData={(sec, data) => updateSection("interests", data.map(d => d.interest))}
              fields={["interest"]}
            />
          </div>
        </div>

        {/* Bouton sauvegarde */}
        <div className="flex justify-center mt-6">
          <button
            onClick={saveResume}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold shadow hover:bg-blue-700 transition"
          >
            {resume._id ? "Mettre à jour le CV" : "Sauvegarder le CV"}
          </button>
        </div>
      </div>

      {/* Colonne droite : aperçu */}
      <div className="w-full lg:w-1/2">
        <div className="bg-white p-6 rounded-xl shadow h-full overflow-y-auto">
          <Progress resume={resume} />
          <CVPreview resume={resume} />
        </div>
      </div>
    </div>
  );
};

export default CVBuilder;
