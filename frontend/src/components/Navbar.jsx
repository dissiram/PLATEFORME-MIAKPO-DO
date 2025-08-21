import React, { useState } from 'react';
import { Button } from './ui/button';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.svg';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth(); // logout depuis AuthContext
  const navigate = useNavigate();

  // Déconnexion
  const handleLogout = () => {
    logout(); // fonction du AuthContext pour supprimer le token
    navigate("/login");
  };

  // Redirection vers le dashboard selon le rôle
  const handleDashboardRedirect = () => {
    if (!user) return;

    switch(user.role) {
      case "user":
        navigate("/dashboard/user");
        break;
      case "announcer":
        navigate("/dashboard/announcer");
        break;
      case "admin":
        navigate("/dashboard/admin");
        break;
      default:
        navigate("/");
    }
  };

  const MenuLinks = () => (
    <>
      <a href="/" className="text-gray-900 hover:text-blue-900">Espace Candidats</a>
      <a href="/" className="text-gray-900 hover:text-blue-900">Centre d'aide</a>
      {user ? (
        <>
          <Button onClick={handleDashboardRedirect} className="text-blue-800 hover:text-blue-900 bg-transparent">
            Mon Tableau de bord
          </Button>
          <Button onClick={handleLogout} className="bg-blue-600 text-white px-6 hover:bg-red-800">
            Déconnexion
          </Button>
        </>
      ) : (
        <>
          <Link to="/login" className="text-blue-800 hover:text-blue-900">S'identifier</Link>
          <Link to="/register" className="text-blue-800 hover:text-blue-900">S'enregistrer</Link>
          <Button onClick={() => navigate("/register")} className="bg-blue-600 text-white px-6 hover:bg-blue-800">
            Créer une offre
          </Button>
        </>
      )}
    </>
  );

  return (
    <header className="w-full bg-white/30 backdrop-blur-md shadow-sm fixed z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Link to="/">
              <img
                src={logo}
                alt="logo"
                className="w-24 sm:w-32 md:w-34 lg:w-37 xl:w-50 h-auto"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <MenuLinks />
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 bg-blue-600 focus:outline-none rounded-sm p-2"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden flex flex-col space-y-5 mt-4 text-center">
            <MenuLinks />
          </div>
        )}
      </div>
    </header>
  );
}
