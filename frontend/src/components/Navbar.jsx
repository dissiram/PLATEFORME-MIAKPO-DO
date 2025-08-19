import React, { useState } from 'react';
import { Button } from './ui/button';
import {Link} from 'react-router-dom';
import logo from '../assets/logo.svg';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="w-full bg-white/30 backdrop-blur-md shadow-sm  fixed z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Link to={'/'}>
                        <img src={logo} alt="logo" className="w-40" />
         </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <a href="/Demandeurs" className="text-gray-900 hover:text-blue-900">Demandeurs</a>
            <a href="/Aide" className="text-gray-900 hover:text-blue-900">Centre d'aide</a>
            <a href="/login" className="text-blue-800 hover:text-blue-900">S'identifier</a>
            <a href="/register" className="text-blue-800 hover:text-blue-900">S'enregistrer</a>
            <Button className="bg-blue-600  text-white px-6 hover:bg-blue-800 hover:text-white"> <Link to="/CreerOffres" className="text-white">Créer une offre</Link> </Button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-300 bg-blue-600 focus:outline-none rounded-sm">
              {/* Icône burger */}
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2"
                   viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round"
                      d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu (affiché si ouvert) */}
        {isOpen && (
          <div className="md:hidden  space-y-5 mb-20 text-center">
            <a href="/Demandeurs" className="block text-gray-900 hover:text-blue-900">Demandeurs</a>
            <a href="/Aide" className="block text-gray-900 hover:text-blue-900">Centre d'aide</a>
            <a href="/login" className="block text-blue-800 hover:text-blue-900">S'identifier</a>
            <a href="/register" className="block text-blue-800 hover:text-blue-900">S'enregistrer</a>
            <Button className="bg-blue-800 hover:bg-blue-900 text-white px-6"> <Link to="/CreerOffres" className='text-white'>Créer une offre</Link> </Button>
          </div>
        )}
      </div>
    </header>
  );
}
