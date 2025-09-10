import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useOffers } from "../../contexts/OfferContext.jsx";

export default function EditOffer() {
  const { id } = useParams();
  const { offers, updateOffer } = useOffers();
  const navigate = useNavigate();

  const offer = offers.find(o => o._id === id);

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    type: "",
    salary: "",
    description: "",
  });

  useEffect(() => {
    if (offer) {
      setFormData({
        title: offer.title || "",
        company: offer.company || "",
        location: offer.location || "",
        type: offer.type || "",
        salary: offer.salary || "",
        description: offer.description || "",
      });
    }
  }, [offer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateOffer(id, formData);
    navigate("/my-offers"); // revenir à la liste après update
  };

  if (!offer) return <p>Offre introuvable.</p>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Modifier l'offre</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Titre de l'offre"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="company"
          value={formData.company}
          onChange={handleChange}
          placeholder="Entreprise"
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Localisation"
          className="w-full p-2 border rounded"
        />
        <select name="type" value={formData.type} onChange={handleChange} className="w-full p-2 border rounded">
          <option value="">Type d'offre</option>
          <option value="emploi">Emploi</option>
          <option value="stage">Stage</option>
          <option value="concours">Concours</option>
          <option value="bourse">Bourse</option>
        </select>
        <input
          type="text"
          name="salary"
          value={formData.salary}
          onChange={handleChange}
          placeholder="Salaire"
          className="w-full p-2 border rounded"
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full p-2 border rounded"
          rows={5}
        />
        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
          Mettre à jour
        </button>
      </form>
    </div>
  );
}
