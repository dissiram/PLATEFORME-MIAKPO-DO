import React from 'react';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Input } from '../components/ui/input';
import { Search } from 'lucide-react';
// import {motion} from 'framer-motion';

export default function SearchForm() {
  return (
    <section className=" pb-16 px-4 mb-10 mt-20">
            <h2 className="text-3xl text-center md:text-4xl font-bold text-gray-700 mb-4">
              Que cherchez-vous ?
            </h2>
      <div className="max-w-5xl mx-auto">
        
        <div className="bg-white rounded-2xl shadow-lg p-6 border">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Types d'offres</label>
              <Select>
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Sélectionner..." />
                </SelectTrigger>
                <SelectContent className='bg-white'>
                  <SelectItem value="cdi">CDI</SelectItem>
                  <SelectItem value="cdd">CDD</SelectItem>
                  <SelectItem value="stage">Stage</SelectItem>
                  <SelectItem value="freelance">Freelance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Secteurs d'activités</label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner..." />
                </SelectTrigger>
                <SelectContent className='bg-white'>
                  <SelectItem value="tech">Technologie</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="sante">Santé</SelectItem>
                  <SelectItem value="education">Éducation</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Fonctions</label>
              <Input 
                placeholder="Ex: Développeur, Manager..." 
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Lieux/quartier/ville</label>
              <div className="flex gap-2">
                <Input 
                  placeholder="Ex: Lome, Tokoin..." 
                  className="flex-1"
                />
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6">
                  <Search className="h-4 w-4 mr-2" />
                  Rechercher
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-20 space-y-4">
          <p className="text-gray-600">
            Pour plus d'exactitude dans les suggestions,{' '}
            <a href="./register" className="text-blue-600 hover:text-blue-700 underline">
              créer un compte
            </a>{' '}
            et bénéficiez de toutes les fonctionnalités.
          </p>
       
        </div>
      </div>
    </section>
  );
}