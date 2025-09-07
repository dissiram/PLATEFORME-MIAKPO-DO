import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useOffers } from "../../contexts/OfferContext";

import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

export default function CreateOffer() {
  const navigate = useNavigate();
  const { addOffer } = useOffers();

  const [step, setStep] = useState(1);
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

  const validateStep = () => {
    let newErrors = {};
    if (step === 1) {
      if (!formData.title.trim()) newErrors.title = "Le titre est requis";
      if (!formData.company.trim()) newErrors.company = "L’entreprise est requise";
      if (!formData.description.trim()) newErrors.description = "La description est requise";
    }
    if (step === 2) {
      if (formData.deadline && new Date(formData.deadline) < new Date()) {
        newErrors.deadline = "La date doit être future";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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

  const nextStep = () => {
    if (validateStep()) setStep((prev) => prev + 1);
  };

  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    await addOffer(formData);
    setSubmitted(true);

    setTimeout(() => navigate("/dashboard/announcer/offers"), 2000);
  };

  const stepVariants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  return (
    <div className="flex justify-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <Card className="w-full max-w-3xl border-0 rounded-2xl shadow-md bg-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {submitted ? "Offre publiée 🎉" : "Créer une offre"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {submitted ? (
            <motion.p
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-green-600 font-semibold text-center mt-6 text-lg"
            >
               Votre offre a été publiée avec succès ! Redirection...
            </motion.p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <AnimatePresence mode="wait">
                {/* --- Étape 1 --- */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    variants={stepVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <div className="bg-gray-50 p-4 rounded-xl shadow-inner">
                      <Label htmlFor="title">Titre</Label>
                      <Input
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Ex : Développeur React.js"
                        className={`mt-1 ${errors.title ? "border-red-500" : ""}`}
                      />
                      {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl shadow-inner">
                      <Label htmlFor="company">Entreprise</Label>
                      <Input
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="Ex : OpenAI"
                        className={`mt-1 ${errors.company ? "border-red-500" : ""}`}
                      />
                      {errors.company && <p className="text-red-500 text-sm">{errors.company}</p>}
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl shadow-inner">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={5}
                        className={`mt-1 ${errors.description ? "border-red-500" : ""}`}
                      />
                      {errors.description && (
                        <p className="text-red-500 text-sm">{errors.description}</p>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* --- Étape 2 --- */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    variants={stepVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-xl shadow-inner">
                        <Label htmlFor="category">Catégorie</Label>
                        <Input
                          id="category"
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          placeholder="Ex : Informatique"
                          className="mt-1"
                        />
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
                        <Input
                          id="location"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          placeholder="Ex : Paris"
                          className="mt-1"
                        />
                      </div>
                      <div className="bg-gray-50 p-4 rounded-xl shadow-inner">
                        <Label htmlFor="salary">Salaire</Label>
                        <Input
                          id="salary"
                          name="salary"
                          value={formData.salary}
                          onChange={handleChange}
                          placeholder="Ex : 45k€/an"
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl shadow-inner">
                      <Label htmlFor="skills">Compétences</Label>
                      <Input
                        id="skills"
                        name="skills"
                        value={formData.skills}
                        onChange={handleChange}
                        placeholder="Ex: React, Node.js, MongoDB"
                        className="mt-1"
                      />
                      {formData.skills && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {formData.skills.split(",").map((skill, i) => (
                            <span
                              key={i}
                              className="bg-blue-100 text-blue-800 px-2 py-1 rounded-lg text-sm"
                            >
                              {skill.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl shadow-inner">
                      <Label htmlFor="deadline">Date limite</Label>
                      <Input
                        type="date"
                        id="deadline"
                        name="deadline"
                        value={formData.deadline}
                        onChange={handleChange}
                        className={`mt-1 ${errors.deadline ? "border-red-500" : ""}`}
                      />
                      {errors.deadline && (
                        <p className="text-red-500 text-sm">{errors.deadline}</p>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* --- Étape 3 --- */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    variants={stepVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <div className="bg-gray-50 p-4 rounded-xl shadow-inner">
                      <Label htmlFor="image">Logo / Image</Label>
                      <Input
                        type="file"
                        id="image"
                        name="image"
                        accept="image/*"
                        onChange={handleChange}
                        className="mt-1"
                      />
                      {formData.image && (
                        <img
                          src={URL.createObjectURL(formData.image)}
                          alt="Preview"
                          className="mt-2 h-20 w-20 object-cover rounded-full border"
                        />
                      )}
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl shadow-inner">
                      <Label htmlFor="attachments">Fichiers joints</Label>
                      <Input
                        type="file"
                        id="attachments"
                        name="attachments"
                        accept=".pdf,.doc,.docx,.png,.jpg"
                        multiple
                        onChange={handleChange}
                        className="mt-1"
                      />
                      {formData.attachments.length > 0 && (
                        <ul className="mt-2 text-sm list-disc pl-4">
                          {formData.attachments.map((file, idx) => (
                            <li key={idx} className="flex justify-between items-center">
                              {file.name}
                              <button
                                type="button"
                                onClick={() => removeAttachment(idx)}
                                className="text-red-500 ml-2 text-sm"
                              >
                                Supprimer
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                      <h3 className="font-bold mb-2">Résumé</h3>
                      <p>
                        <span className="font-semibold">Titre :</span> {formData.title}
                      </p>
                      <p>
                        <span className="font-semibold">Entreprise :</span> {formData.company}
                      </p>
                      <p>
                        <span className="font-semibold">Localisation :</span> {formData.location}
                      </p>
                      <p>
                        <span className="font-semibold">Compétences :</span> {formData.skills}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* --- Navigation --- */}
              <div className="flex justify-between">
                {step > 1 && (
                  <Button type="button" onClick={prevStep} variant="outline">
                    Précédent
                  </Button>
                )}
                {step < 3 && (
                  <Button type="button" onClick={nextStep} className="ml-auto bg-blue-900 text-white">
                    Suivant
                  </Button>
                )}
                {step === 3 && (
                  <Button type="submit" className="ml-auto bg-green-700 text-white">
                    Publier l’offre
                  </Button>
                )}
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
