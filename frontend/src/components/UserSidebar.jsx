import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Bars3Icon, XMarkIcon, BriefcaseIcon,ReceiptPercentIcon,ClipboardDocumentListIcon, UserIcon, StarIcon, ClockIcon, BellIcon } from "@heroicons/react/24/outline";
import logo from "../assets/logo_icon2.svg";


const UserSidebar = ({ role }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  let links = [];

  if (role === "user") {
    links = [
      { name: "Offres", path: "/dashboard/user", icon: BriefcaseIcon },
      { name: "Portfolio", path: "/dashboard/user/portfolio", icon: UserIcon },
      { name: "Matchs", path: "/dashboard/user/matches", icon: ReceiptPercentIcon },
      { name: "Favoris", path: "/dashboard/user/favorites", icon: StarIcon },
      { name: "Mes Candidatures", path: "/dashboard/user/candidatures", icon: ClipboardDocumentListIcon },
      { name: "Notifications", path: "/dashboard/user/notifications", icon: BellIcon },
    ];
  } else if (role === "annoucer") {
    links = [
      { name: "Mes annonces", path: "/advertiser", icon: BriefcaseIcon },
      { name: "Créer une annonce", path: "/advertiser/create", icon: UserIcon },
    ];
  } else if (role === "admin") {
    links = [
      { name: "Gestion utilisateurs", path: "/admin", icon: UserIcon },
      { name: "Modération annonces", path: "/admin/moderation", icon: StarIcon },
      { name: "Statistiques", path: "/admin/stats", icon: ClockIcon },
    ];
  }

  return (
    <>
      {/* Bouton hamburger mobile */}
      <div className="lg:hidden fixed top-2 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-white bg-blue-900 p-2 rounded-2xl focus:outline-none"
        >
          {isOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed min-h-screen ml-px rounded-4xl bg-blue-900 m-5 p-6 shadow-lg transform transition-transform duration-300 z-40
        ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static`}
      >
        {/* Logo */}
        <div className="flex items-center justify-center mb-10">
          <Link to="/">
            <img src={logo} alt="logo" className="w-10 sm:w-12 md:w-14 h-auto" />
          </Link>
        </div>

        {/* Liens avec icônes + tooltip */}
        <div className="flex flex-col space-y-6 items-center">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname.startsWith(link.path);
            return (
              <div key={link.name} className="relative group">
                <Link
                  to={link.path}
                  className={`flex items-center justify-center p-3 rounded-xl transition-colors ${
                    isActive ? "bg-white text-gray-900 shadow-sm" : "text-white hover:bg-blue-800"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className="h-6 w-6"  />
                </Link>
                {/* Tooltip */}
                <div className="absolute left-14 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 pointer-events-none">
                  {link.name}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default UserSidebar;
