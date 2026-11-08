import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta por defecto: redirige al login */}
        <Route path="/" element={<Navigate to="/login" />} />
        
        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Ruta temporal para el feed (la crearemos en el siguiente paso) */}
        <Route path="/feed" element={<h1>Feed en construcción...</h1>} />
      </Routes>
    </Router>
  );
}

export default App;