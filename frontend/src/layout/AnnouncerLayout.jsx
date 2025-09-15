import { Outlet } from "react-router-dom";
import UserSidebar from "../components/UserSidebar";

export default function AnnouncerLayout() {
  return (
    <div className="flex h-screen overflow-hidden">
     <div className="bg-white shadow-md overflow-y-auto hide-scrollbar">
     <UserSidebar role="announcer" />
     </div>
      <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
