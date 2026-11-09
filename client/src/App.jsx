import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Feed from "./pages/Feed";
import Profile from "./pages/Profile";
import PostDetail from "./pages/PostDetail"; // <-- Importar
import { useAuth } from "./context/AuthContext";

// Componente para proteger rutas privadas
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Ruta protegida: si no hay usuario, redirige al login */}
        <Route path="/feed" element={<ProtectedRoute><Feed /></ProtectedRoute>} />
        <Route path="/profile/:username" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        
        {/* NUEVA RUTA DE DETALLE */}
        <Route path="/post/:id" element={<ProtectedRoute><PostDetail /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;