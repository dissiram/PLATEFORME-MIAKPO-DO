import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Search } from 'lucide-react';

export default function SearchForm({ onSearch }) {
  const [type, setType] = useState('');
  const [secteur, setSecteur] = useState('');
  const [fonction, setFonction] = useState('');
  const [lieu, setLieu] = useState('');

  // 🔹 Appel onSearch à chaque changement avec délai (debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch({ type, secteur, fonction, lieu });
    }, 300);
    return () => clearTimeout(timer);
  }, [type, secteur, fonction, lieu, onSearch]);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">

        {/* Type d'offre */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Types d'offres</label>
          <Select onValueChange={setType}>
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="Sélectionner..." />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="cdi">CDI</SelectItem>
              <SelectItem value="cdd">CDD</SelectItem>
              <SelectItem value="stage">Stage</SelectItem>
              <SelectItem value="freelance">Freelance</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Secteur */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Secteurs d'activités</label>
          <Select onValueChange={setSecteur}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sélectionner..." />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="tech">Technologie</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
              <SelectItem value="sante">Santé</SelectItem>
              <SelectItem value="education">Éducation</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Fonction */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Fonctions</label>
          <Input
            placeholder="Ex: Développeur, Manager..."
            className="w-full"
            value={fonction}
            onChange={(e) => setFonction(e.target.value)}
          />
        </div>

        {/* Lieu */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Lieux/quartier/ville</label>
          <Input
            placeholder="Ex: Lome, Tokoin..."
            className="w-full"
            value={lieu}
            onChange={(e) => setLieu(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
