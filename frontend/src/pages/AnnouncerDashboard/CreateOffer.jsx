import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

export default function CreateOffer() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    contractType: "",
    location: "",
    salary: "",
    deadline: "",
    image: null,
    attachments: [],
  });

  const [errors, setErrors] = useState({
    title: "",
    description: "",
    deadline: "",
    image: "",
    attachments: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      if (name === "image") {
        const file = files[0];
        if (file && file.size > 5 * 1024 * 1024) { // 5 Mo max
          setErrors((prev) => ({ ...prev, image: "Image trop grande (<5Mo)" }));
        } else {
          setErrors((prev) => ({ ...prev, image: "" }));
          setFormData({ ...formData, image: file });
        }
      } else if (name === "attachments") {
        const invalid = Array.from(files).some(f => f.size > 10 * 1024 * 1024); // 10 Mo max
        if (invalid) {
          setErrors((prev) => ({ ...prev, attachments: "Chaque fichier doit être <10Mo" }));
        } else {
          setErrors((prev) => ({ ...prev, attachments: "" }));
          setFormData({ ...formData, attachments: [...files] });
        }
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const removeAttachment = (index) => {
    const updated = [...formData.attachments];
    updated.splice(index, 1);
    setFormData({ ...formData, attachments: updated });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Le titre est requis";
    if (!formData.description.trim()) newErrors.description = "La description est requise";
    if (formData.deadline && new Date(formData.deadline) < new Date()) newErrors.deadline = "La date doit être future";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    console.log("Nouvelle offre:", formData);
    // TODO : Appel API pour sauvegarder l'offre
  };

  return (
    <div className="p-6 flex justify-center">
      <Card className="w-full max-w-3xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Créer une offre</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Titre */}
            <div>
              <Label htmlFor="title">Titre de l’offre</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Ex : Développeur React.js"
              />
              {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Description complète</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Décrivez les missions, compétences requises..."
                rows={5}
              />
              {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
            </div>

            {/* Catégorie */}
            <div>
              <Label htmlFor="category">Catégorie</Label>
              <Input
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Ex : Informatique, Marketing..."
              />
            </div>

            {/* Type de contrat */}
            <div>
              <Label htmlFor="contractType">Type de contrat</Label>
              <select
                id="contractType"
                name="contractType"
                value={formData.contractType}
                onChange={handleChange}
                className="w-full border rounded-md p-2"
              >
                <option value="">Sélectionner</option>
                <option value="CDI">CDI</option>
                <option value="CDD">CDD</option>
                <option value="Stage">Stage</option>
                <option value="Freelance">Freelance</option>
              </select>
            </div>

            {/* Localisation */}
            <div>
              <Label htmlFor="location">Localisation</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Ex : Lomé, Togo"
              />
            </div>

            {/* Salaire */}
            <div>
              <Label htmlFor="salary">Salaire / Budget</Label>
              <Input
                id="salary"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                placeholder="Ex : 500€ / mois"
              />
            </div>

            {/* Date limite */}
            <div>
              <Label htmlFor="deadline">Date limite de candidature</Label>
              <Input
                type="date"
                id="deadline"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
              />
              {errors.deadline && <p className="text-red-500 text-sm">{errors.deadline}</p>}
            </div>

            {/* Image / Logo */}
            <div>
              <Label htmlFor="image">Image / Logo</Label>
              <Input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleChange}
              />
              {errors.image && <p className="text-red-500 text-sm">{errors.image}</p>}
              {formData.image && (
                <img
                  src={URL.createObjectURL(formData.image)}
                  alt="Preview"
                  className="mt-2 h-20 object-contain rounded-md border"
                />
              )}
            </div>

            {/* Fichiers joints */}
            <div>
              <Label htmlFor="attachments">Fichiers joints</Label>
              <Input
                type="file"
                id="attachments"
                name="attachments"
                accept=".pdf,.doc,.docx,.png,.jpg"
                multiple
                onChange={handleChange}
              />
              {errors.attachments && <p className="text-red-500 text-sm">{errors.attachments}</p>}
              {formData.attachments.length > 0 && (
                <ul className="mt-2 text-sm text-gray-600 list-disc pl-4">
                  {formData.attachments.map((file, idx) => (
                    <li key={idx} className="flex justify-between items-center">
                      {file.name}
                      <button
                        type="button"
                        onClick={() => removeAttachment(idx)}
                        className="text-red-500 ml-2"
                      >
                        Supprimer
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Bouton */}
            <Button type="submit" className="w-full">
              Publier l’offre
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
