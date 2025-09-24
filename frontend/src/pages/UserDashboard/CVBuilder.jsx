import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCV } from "../../contexts/CVContext";
import FormSection from "../../components/cv/FormSection";
import ArrayFormSection from "../../components/cv/ArrayFormSection";
import CVPreview from "../../components/cv/CvPreview";
import Progress from "../../components/cv/Progress";

const CVBuilder = () => {
  const { cv, saveCV, loading } = useCV();
  const [resume, setResume] = useState(cv || {
    profileInfo: { fullName: "", designation: "", summary: "" },
    contactInfo: { email: "", phone: "" },
    workExperience: [], education: [], skills: [], projects: [],
    certifications: [], languages: [], interests: []
  });
  const [toast, setToast] = useState({ message: "", type: "" });
  const navigate = useNavigate();

  useEffect(() => {
    if (cv) setResume(cv);
  }, [cv]);

  const updateSection = (section, data) =>
    setResume(prev => ({ ...prev, [section]: data }));

  const handleSave = async () => {
    try {
      await saveCV(resume);
      setToast({ message: "CV sauvegardé !", type: "success" });
      setTimeout(() => navigate("/dashboard/user/myCV"), 1000);
    } catch {
      setToast({ message: "Erreur lors de la sauvegarde.", type: "error" });
    }
    setTimeout(() => setToast({ message: "", type: "" }), 3000);
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <div className="flex flex-col lg:flex-row gap-8 p-6 bg-gray-50 min-h-screen">
      {toast.message && (
        <div className={`fixed top-6 right-6 px-4 py-2 rounded shadow-lg text-white ${toast.type === "success" ? "bg-green-500" : "bg-red-500"}`}>
          {toast.message}
        </div>
      )}

      <div className="w-full lg:w-1/2 space-y-6 overflow-y-auto max-h-screen">
        <h2 className="text-3xl font-bold text-center">{resume._id ? "Modifier votre CV" : "Créer votre CV"}</h2>

        <FormSection section="profileInfo" data={resume.profileInfo} updateData={updateSection} />
        <FormSection section="contactInfo" data={resume.contactInfo} updateData={updateSection} />
        <ArrayFormSection section="workExperience" data={resume.workExperience} updateData={updateSection} fields={["company","role","startDate","endDate","description"]} />
        <ArrayFormSection section="education" data={resume.education} updateData={updateSection} fields={["degree","institution","startDate","endDate"]} />
        <ArrayFormSection section="skills" data={resume.skills} updateData={updateSection} fields={["name","progress"]} />
        <ArrayFormSection section="projects" data={resume.projects} updateData={updateSection} fields={["title","description","github","liveDemo"]} />
        <ArrayFormSection section="certifications" data={resume.certifications} updateData={updateSection} fields={["title","issuer","year"]} />
        <ArrayFormSection section="languages" data={resume.languages} updateData={updateSection} fields={["name","progress"]} />
        <ArrayFormSection section="interests" data={resume.interests.map(i => ({ interest: i }))} updateData={(sec, data) => updateSection("interests", data.map(d => d.interest))} fields={["interest"]} />

        <div className="flex justify-center mt-6">
          <button onClick={handleSave} className="bg-blue-600 text-white px-6 py-3 rounded-xl shadow hover:bg-blue-700">Sauvegarder</button>
        </div>
      </div>

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
