// App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// Pages publiques
import Home from "./pages/public/Home";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import NotFound from "./pages/public/NotFound";

// Layouts
import UserLayout from "./layout/UserLayout";
import AnnouncerLayout from "./layout/AnnouncerLayout";

// Pages utilisateurs
import UserDashboard from "./pages/UserDashboard/UserDashboard";
import Portfolio from "./pages/UserDashboard/Portfolio";
import Matches from "./pages/UserDashboard/Matches";
import Favorites from "./pages/UserDashboard/Favorites";
import Notifications from "./pages/UserDashboard/Notifications";
import UserCandidatures from "./pages/UserDashboard/Candidatures";

// Pages annonceurs
import AnnouncerDashboard from "./pages/AnnouncerDashboard/AnnouncerDashboard";
import CreateOffer from "./pages/AnnouncerDashboard/CreateOffer";
import MyOffers from "./pages/AnnouncerDashboard/MyOffers";
import AnnouncerCandidatures from "./pages/AnnouncerDashboard/Candidatures";

// Page admin
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";

// Route protégée
const PrivateRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;

  if (role && user.role !== role) return <Navigate to="/" />;

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Routes publiques */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<NotFound />} />

          {/* Routes utilisateurs avec layout + sidebar */}
          <Route
            path="/dashboard/user"
            element={
              <PrivateRoute role="user">
                <UserLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<UserDashboard />} />
            <Route path="portfolio" element={<Portfolio />} />
            <Route path="matches" element={<Matches />} />
            <Route path="favorites" element={<Favorites />} />
            <Route path="candidatures" element={<UserCandidatures />} />
            <Route path="notifications" element={<Notifications />} />
          </Route>

          {/* Routes annonceurs avec layout + sidebar */}
          <Route
            path="/dashboard/announcer"
            element={
              <PrivateRoute role="announcer">
                <AnnouncerLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<AnnouncerDashboard />} />
            <Route path="create" element={<CreateOffer />} />
            <Route path="offers" element={<MyOffers />} />
            <Route path="candidatures" element={<AnnouncerCandidatures />} />
          </Route>

          {/* Route admin */}
          <Route
            path="/dashboard/admin"
            element={
              <PrivateRoute role="admin">
                <AdminDashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
