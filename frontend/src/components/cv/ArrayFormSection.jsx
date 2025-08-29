import React from "react";
import { TrashIcon, PlusIcon } from "@heroicons/react/24/solid";

const ArrayFormSection = ({ section, data, updateData, fields }) => {
  const handleChange = (index, field, value) => {
    const updated = [...data];
    updated[index][field] = value;
    updateData(section, updated);
  };

  const addItem = () =>
    updateData(section, [...data, Object.fromEntries(fields.map(f => [f, ""]))]);
  const removeItem = (index) => {
    const updated = data.filter((_, i) => i !== index);
    updateData(section, updated);
  };

  // Traduction des sections
  const sectionFR = {
    experience: "Expériences",
    education: "Éducation",
    projects: "Projets",
    skills: "Compétences",
    languages: "Langues"
  }[section] || section;

  // Traduction des labels et placeholders
  const translateField = (field) => {
    const mapping = {
      title: { label: "Titre", placeholder: "Entrez le titre" },
      company: { label: "Entreprise", placeholder: "Nom de l'entreprise" },
      location: { label: "Lieu", placeholder: "Ville, Pays" },
      startDate: { label: "Date de début", placeholder: "MM/YYYY" },
      endDate: { label: "Date de fin", placeholder: "MM/YYYY ou Présent" },
      description: { label: "Description", placeholder: "Détails de l'expérience" },
      progress: { label: "Progression (%)", placeholder: "0-100" },
      name: { label: "Nom", placeholder: "Nom du projet ou compétence" },
      level: { label: "Niveau", placeholder: "Débutant / Intermédiaire / Avancé" },
      year: { label: "Année", placeholder: "Ex: 2023" }
    };
    return mapping[field] || { label: field, placeholder: "" };
  };

  return (
    <div className="mb-6 rounded-lg shadow-sm p-4 bg-gray-50">
      <h4 className="font-semibold text-xl mb-3 text-gray-700">{sectionFR}</h4>
      {data.map((item, index) => (
        <div
          key={index}
          className="mb-4 p-3 rounded-lg bg-white flex flex-col gap-2 relative shadow-sm"
        >
          {fields.map((field) => {
            const { label, placeholder } = translateField(field);
            return (
              <div key={field}>
                <label className="block text-gray-600 font-medium mb-1">{label}</label>
                <input
                  type={field === "progress" ? "number" : "text"}
                  value={item[field]}
                  placeholder={placeholder}
                  onChange={(e) => handleChange(index, field, e.target.value)}
                  className="rounded-md w-full p-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            );
          })}
          <button
            onClick={() => removeItem(index)}
            className="absolute top-2 right-2 text-red-500 hover:text-red-700 flex items-center gap-1"
          >
            <TrashIcon className="h-5 w-5" />
            Supprimer
          </button>
        </div>
      ))}
      <button
        onClick={addItem}
        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium transition"
      >
        <PlusIcon className="h-5 w-5" />
        Ajouter un élément
      </button>
    </div>
  );
};

export default ArrayFormSection;
