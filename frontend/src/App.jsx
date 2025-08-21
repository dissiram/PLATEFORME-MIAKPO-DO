import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// Pages publiques
import Home from "./pages/public/home";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import NotFound from "./pages/public/notFound";

// Layout utilisateur
import UserLayout from "./layout/UserLayout";

// Pages utilisateurs
import UserDashboard from "./pages/UserDashboard/UserDashboard";
import Portfolio from "./pages/UserDashboard/Portfolio";
import Matches from "./pages/UserDashboard/Matches";
import Favorites from "./pages/UserDashboard/Favorites";
import Notifications from "./pages/UserDashboard/Notifications";
import Candidatures from "./pages/UserDashboard/Candidatures";

// Pages autres rôles
import AnnouncerDashboard from "./pages/AnnouncerDashboard/AnnouncerDashboard";
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

          {/* Routes utilisateur avec layout + sidebar */}
          <Route
            path="/dashboard/user"
            element={
              <PrivateRoute role="user">
                <UserLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<UserDashboard />} /> {/* /dashboard/user */}
            <Route path="portfolio" element={<Portfolio />} />
            <Route path="matches" element={<Matches />} />
            <Route path="favorites" element={<Favorites />} />
            <Route path="candidatures" element={<Candidatures />} />
            <Route path="notifications" element={<Notifications />} />
          </Route>

          {/* Routes annonceur */}
          <Route
            path="/dashboard/announcer"
            element={
              <PrivateRoute role="announcer">
                <AnnouncerDashboard />
              </PrivateRoute>
            }
          />

          {/* Route admin */}
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
