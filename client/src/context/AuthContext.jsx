import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

// Creamos el contexto
const AuthContext = createContext();

// Hook personalizado para usar el contexto más fácilmente
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  // Cuando el token cambie, actualizamos los headers de Axios
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      localStorage.setItem("token", token);
      // Aquí podríamos hacer un GET a /api/auth/me para traer los datos del usuario
      // Pero para simplificar, guardaremos el usuario en localStorage también
      const storedUser = localStorage.getItem("user");
      if (storedUser) setUser(JSON.parse(storedUser));
    } else {
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    setLoading(false);
  }, [token]);

  // Función para loguear
  const login = async (email, password) => {
    // URL de tu backend en Render o local
const API_URL = import.meta.env.VITE_API_URL;
    const res = await axios.post(`${API_URL}/auth/login`, { email, password });
    
    setToken(res.data.token);
    setUser({ _id: res.data._id, username: res.data.username, email: res.data.email });
    localStorage.setItem("user", JSON.stringify(res.data));
    return res.data;
  };

  // Función para registrar
  const register = async (username, email, password) => {
const API_URL = import.meta.env.VITE_API_URL;
    const res = await axios.post(`${API_URL}/auth/register`, { username, email, password });
    
    setToken(res.data.token);
    setUser({ _id: res.data._id, username: res.data.username, email: res.data.email });
    localStorage.setItem("user", JSON.stringify(res.data));
    return res.data;
  };

  // Función para desloguear
  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};