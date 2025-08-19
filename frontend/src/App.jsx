import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// Pages publiques
import Home from "./pages/public/home";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

// Pages utilisateurs
import UserDashboard from "./pages/UserDashboard/UserDashboard";
import Portfolio from "./pages/UserDashboard/Portfolio";
import Matches from "./pages/UserDashboard/Matches";
import Favorites from "./pages/UserDashboard/Favorites";

// Pages autres rôles
import AnnouncerDashboard from "./pages/AnnouncerDashboard/AnnouncerDashboard";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";

// Composants
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Route protégée
const PrivateRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;

  // Vérification du rôle si fourni
  if (role && user.role !== role) return <Navigate to="/" />;

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* Routes publiques */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Routes utilisateur */}
          <Route
            path="/dashboard/user"
            element={
              <PrivateRoute role="user">
                <UserDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/user/portfolio"
            element={
              <PrivateRoute role="user">
                <Portfolio />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/user/matches"
            element={
              <PrivateRoute role="user">
                <Matches />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/user/favorites"
            element={
              <PrivateRoute role="user">
                <Favorites />
              </PrivateRoute>
            }
          />

          {/* Routes annonceur */}
          <Route
            path="/dashboard/announcer"
            element={
              <PrivateRoute role="announcer">
                <AnnouncerDashboard />
              </PrivateRoute>
            }
          />

          {/* Routes admin */}
          <Route
            path="/dashboard/admin"
            element={
              <PrivateRoute role="admin">
                <AdminDashboard />
              </PrivateRoute>
            }
          />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
