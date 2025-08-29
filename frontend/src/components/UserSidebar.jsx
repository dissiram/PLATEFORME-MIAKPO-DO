import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Bars3Icon,
  XMarkIcon,
  BriefcaseIcon,
  FolderIcon,
  AdjustmentsHorizontalIcon,
  StarIcon,
  ClipboardDocumentListIcon,
  DocumentTextIcon,
  ChartBarIcon,
  NewspaperIcon,
  InboxArrowDownIcon,
  UsersIcon,
  ShieldCheckIcon,
  PresentationChartBarIcon
} from "@heroicons/react/24/outline";
import logo from "../assets/iconnew.svg";

const UserSidebar = ({ role }) => {
  const [isOpen, setIsOpen] = useState(false);

  let links = [];

  if (role === "user") {
    links = [
      { name: "Offres", path: "/dashboard/user", icon: BriefcaseIcon },
      { name: "Mon CV", path: "/dashboard/user/cv", icon: DocumentTextIcon },
      { name: "Portfolio", path: "/dashboard/user/portfolio", icon: FolderIcon },
      { name: "Matchs", path: "/dashboard/user/matches", icon: AdjustmentsHorizontalIcon },
      { name: "Favoris", path: "/dashboard/user/favorites", icon: StarIcon },
      { name: "Mes Candidatures", path: "/dashboard/user/candidatures", icon: ClipboardDocumentListIcon },
    ];
  } else if (role === "announcer") {
    links = [
      { name: "Tableau de bord", path: "/dashboard/announcer", icon: ChartBarIcon },
      { name: "Créer une offre", path: "/dashboard/announcer/create", icon: ClipboardDocumentListIcon },
      { name: "Mes annonces", path: "/dashboard/announcer/offers", icon: NewspaperIcon },
      { name: "Candidatures reçues", path: "/dashboard/announcer/candidatures", icon: InboxArrowDownIcon },
    ];
  } else if (role === "admin") {
    links = [
      { name: "Gestion utilisateurs", path: "/dashboard/admin", icon: UsersIcon },
      { name: "Modération annonces", path: "/dashboard/admin/moderation", icon: ShieldCheckIcon },
      { name: "Statistiques", path: "/dashboard/admin/stats", icon: PresentationChartBarIcon },
    ];
  }

  return (
    <>
      {/* Bouton hamburger mobile */}
      <div className="lg:hidden fixed top-2 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-white bg-blue-900 p-2 rounded-2xl focus:outline-none "
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
          <NavLink to="/">
            <img src={logo} alt="logo" className="w-8 sm:w-9 md:w-10 h-auto" />
          </NavLink>
        </div>

        {/* Liens avec icônes + tooltip */}
        <div className="flex flex-col space-y-6 items-center">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <div key={link.name} className="relative group">
                <NavLink
                  to={link.path}
                  end
                  className={({ isActive }) =>
                    `flex items-center justify-center p-3 rounded-[80%_80%_60%_60%/60%_60%_70%_100%] transition-colors ${
                      isActive ? "bg-white text-gray-900 shadow-sm" : "text-white hover:bg-blue-800"
                    }`
                  }
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className="h-6 w-6" />
                </NavLink>
                {/* Tooltip */}
                <div className="w-30 absolute left-14 top-1/2 -translate-y-1/2 bg-blue-600 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 pointer-events-none">
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
