import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOffers } from "../../contexts/OfferContext";

import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

export default function CreateOffer() {
  const navigate = useNavigate();
  const { addOffer } = useOffers();

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    description: "",
    category: "",
    contractType: "",
    location: "",
    salary: "",
    deadline: "",
    skills: "",
    image: null,
    attachments: [],
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      if (name === "image") setFormData({ ...formData, image: files[0] });
      else if (name === "attachments") setFormData({ ...formData, attachments: [...files] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const removeAttachment = (index) => {
    const updated = [...formData.attachments];
    updated.splice(index, 1);
    setFormData({ ...formData, attachments: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Le titre est requis";
    if (!formData.description.trim()) newErrors.description = "La description est requise";
    if (!formData.company.trim()) newErrors.company = "L’entreprise est requise";
    if (formData.deadline && new Date(formData.deadline) < new Date())
      newErrors.deadline = "La date doit être future";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    await addOffer(formData);
    setSubmitted(true);

    setFormData({
      title: "",
      company: "",
      description: "",
      category: "",
      contractType: "",
      location: "",
      salary: "",
      deadline: "",
      skills: "",
      image: null,
      attachments: [],
    });

    setTimeout(() => navigate("/dashboard/announcer/offers"), 2000);
  };

  return (
    <div className="flex justify-center  p-6 bg-gray-50 min-h-screen">
      <Card className="w-full max-w-3xl border-0  rounded-2xl shadow-sm bg-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            {submitted ? "Offre publiée 🎉" : "Créer une offre"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {submitted ? (
            <p className="text-green-600 font-semibold text-center mt-4">
              ✅ Votre offre a été publiée avec succès ! Redirection...
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Chaque champ enveloppé d’une card-like section */}
              <div className="bg-gray-50 p-4 rounded-xl shadow-inner">
                <Label htmlFor="title">Titre</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Ex : Développeur React.js"
                  className="mt-1"
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>

              <div className="bg-gray-50 p-4 rounded-xl shadow-inner">
                <Label htmlFor="company">Entreprise</Label>
                <Input
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Ex : OpenAI"
                  className="mt-1"
                />
                {errors.company && <p className="text-red-500 text-sm mt-1">{errors.company}</p>}
              </div>

              <div className="bg-gray-50 p-4 rounded-xl shadow-inner">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                  className="mt-1"
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl shadow-inner">
                  <Label htmlFor="category">Catégorie</Label>
                  <Input id="category" name="category" value={formData.category} onChange={handleChange} className="mt-1"/>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl shadow-inner">
                  <Label htmlFor="contractType">Type de contrat</Label>
                  <select
                    id="contractType"
                    name="contractType"
                    value={formData.contractType}
                    onChange={handleChange}
                    className="mt-1 w-full border rounded-md p-2"
                  >
                    <option value="">Sélectionner</option>
                    <option value="CDI">CDI</option>
                    <option value="CDD">CDD</option>
                    <option value="Stage">Stage</option>
                    <option value="Freelance">Freelance</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl shadow-inner">
                  <Label htmlFor="location">Localisation</Label>
                  <Input id="location" name="location" value={formData.location} onChange={handleChange} className="mt-1"/>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl shadow-inner">
                  <Label htmlFor="salary">Salaire</Label>
                  <Input id="salary" name="salary" value={formData.salary} onChange={handleChange} className="mt-1"/>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl shadow-inner">
                <Label htmlFor="skills">Compétences</Label>
                <Input id="skills" name="skills" value={formData.skills} onChange={handleChange} className="mt-1"/>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl shadow-inner">
                <Label htmlFor="deadline">Date limite</Label>
                <Input type="date" id="deadline" name="deadline" value={formData.deadline} onChange={handleChange} className="mt-1"/>
                {errors.deadline && <p className="text-red-500 text-sm mt-1">{errors.deadline}</p>}
              </div>

              <div className="bg-gray-50 p-4 rounded-xl shadow-inner">
                <Label htmlFor="image">Logo / Image</Label>
                <Input type="file" id="image" name="image" accept="image/*" onChange={handleChange} className="mt-1"/>
                {formData.image && (
                  <img src={URL.createObjectURL(formData.image)} alt="Preview" className="mt-2 h-20 object-contain rounded-md border"/>
                )}
              </div>

              <div className="bg-gray-50 p-4 rounded-xl shadow-inner">
                <Label htmlFor="attachments">Fichiers joints</Label>
                <Input type="file" id="attachments" name="attachments" accept=".pdf,.doc,.docx,.png,.jpg" multiple onChange={handleChange} className="mt-1"/>
                {formData.attachments.length > 0 && (
                  <ul className="mt-2 text-sm list-disc pl-4">
                    {formData.attachments.map((file, idx) => (
                      <li key={idx} className="flex justify-between items-center">
                        {file.name}
                        <button type="button" onClick={() => removeAttachment(idx)} className="text-red-500 ml-2">
                          Supprimer
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <Button type="submit" className="w-full bg-blue-900 text-white hover:bg-blue-800 transition-colors">
                Publier l’offre
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
