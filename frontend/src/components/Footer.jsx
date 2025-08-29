import React from "react";
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import logo from '../assets/iconnew.svg';


export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
             <img src={logo} alt="logo" className="w-10" />
          </div>
        {/* Liens rapides */}
        <div className="text-center md:text-left">
          <h3 className="text-lg font-semibold text-white mb-4">Liens rapides</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:text-blue-500 transition">Accueil</a></li>
            <li><a href="/services" className="hover:text-blue-500 transition">Demandeurs</a></li>
           
          </ul>
        </div>
        <div className="text-center md:text-left">
          <h3 className="text-lg font-semibold text-white mb-4">Liens rapides</h3>
          <ul className="space-y-2 text-sm">
           
            <li><a href="/portfolio" className="hover:text-blue-500 transition">Entreprises</a></li>
            <li><a href="/contact" className="hover:text-blue-500 transition">Annonceurs</a></li>
          </ul>
        </div>

        {/* Réseaux sociaux */}
        <div className="text-center md:text-right">
          <h3 className="text-lg font-semibold text-white mb-4">Suivez-nous</h3>
          <div className="flex justify-center md:justify-end gap-4">
            <a href="#" className="hover:text-blue-500"><Facebook size={20} /></a>
            <a href="#" className="hover:text-blue-400"><Twitter size={20} /></a>
            <a href="#" className="hover:text-pink-500"><Instagram size={20} /></a>
            <a href="#" className="hover:text-blue-700"><Linkedin size={20} /></a>
          </div>
        </div>
      </div>

      {/* Bas de page */}
      <h1 className="text-4xl md:text-6xl lg:text-9xl font-bold text-center py-10">
      MIAKPO DO
     </h1>
        <div className=" border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} MIAKPO DO. Tous droits réservés.
      </div>
    </footer>
  );
}
