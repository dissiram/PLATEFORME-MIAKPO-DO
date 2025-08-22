// layout/AnnouncerLayout.jsx
import { Outlet } from "react-router-dom";
import UserSidebar from "../components/UserSidebar";

export default function AnnouncerLayout() {
  return (
    <div className="flex">
      {/* Sidebar annonceur */}
      <UserSidebar role="announcer" />
      
      {/* Contenu */}
      <main className="flex-1 p-6 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}
