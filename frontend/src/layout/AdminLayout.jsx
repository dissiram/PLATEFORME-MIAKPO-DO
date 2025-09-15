import React from "react";
import UserSidebar from "../components/UserSidebar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar admin à gauche avec scroll indépendant et scrollbar masquée */}
      <div className=" bg-white shadow-md overflow-y-auto hide-scrollbar">
        <UserSidebar role="admin" />
      </div>

      {/* Contenu de la page avec scroll indépendant */}
      <div className="flex-1 p-6 bg-gray-50 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
