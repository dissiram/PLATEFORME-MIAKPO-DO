import React from "react";
import UserSidebar from "../components/UserSidebar";
import { Outlet } from "react-router-dom";

const UserLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar user avec scroll indépendant et scrollbar masquée */}
      <div className=" bg-white shadow-md overflow-y-auto hide-scrollbar">
        <UserSidebar role="user" />
      </div>

      {/* Contenu de la page avec scroll indépendant */}
      <div className="flex-1 p-6 bg-gray-50 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default UserLayout;
