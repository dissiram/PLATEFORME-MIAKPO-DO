import React from "react";
import UserSidebar from "../components/UserSidebar";
import { Outlet } from "react-router-dom";

const UserLayout = () => {
  return (
    <div className="flex">
      {/* Sidebar à gauche */}
      <UserSidebar role="user" />

      {/* Contenu de la page */}
      <div className="flex-1 p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default UserLayout;
