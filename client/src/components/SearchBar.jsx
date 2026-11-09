import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Debounce: espera 500ms después de que el usuario deja de escribir
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await axios.get(`${API_URL}/users/search?q=${query}`);
        setResults(res.data);
      } catch (error) {
        console.error("Error buscando usuarios", error);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(timer); // Limpia el timer si el usuario sigue escribiendo
  }, [query]);

  return (
    <div style={{ position: "relative", marginBottom: "20px" }}>
      <input
        type="text"
        placeholder="Buscar usuarios..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ width: "100%", padding: "10px", borderRadius: "20px", border: "1px solid #ccc" }}
      />
      
      {/* Dropdown de resultados */}
      {query && (
        <div style={{ 
          position: "absolute", top: "100%", left: 0, right: 0, 
          backgroundColor: "white", border: "1px solid #ccc", borderRadius: "10px",
          marginTop: "5px", zIndex: 10, maxHeight: "300px", overflowY: "auto"
        }}>
          {isSearching && <div style={{ padding: "10px" }}>Buscando...</div>}
          
          {!isSearching && results.length === 0 && (
            <div style={{ padding: "10px", color: "#666" }}>No se encontraron usuarios.</div>
          )}

          {results.map((u) => (
            <Link 
              key={u._id} 
              to={`/profile/${u.username}`}
              onClick={() => setQuery("")} // Limpia al hacer clic
              style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px", textDecoration: "none", color: "inherit", borderBottom: "1px solid #eee" }}
            >
              <div style={{ width: "30px", height: "30px", borderRadius: "50%", backgroundColor: "#007bff", color: "white", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "12px" }}>
                {u.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <strong>@{u.username}</strong>
                {u.bio && <div style={{ fontSize: "12px", color: "#666" }}>{u.bio}</div>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;