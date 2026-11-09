import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

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

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="relative mb-6">
      <input
        type="text"
        placeholder="Buscar usuarios..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
      />
      
      {query && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-xl mt-2 shadow-lg z-10 max-h-60 overflow-y-auto">
          {isSearching && <div className="p-3 text-gray-500 text-sm">Buscando...</div>}
          
          {!isSearching && results.length === 0 && (
            <div className="p-3 text-gray-500 text-sm">No se encontraron usuarios.</div>
          )}

          {results.map((u) => (
            <Link 
              key={u._id} 
              to={`/profile/${u.username}`}
              onClick={() => setQuery("")}
              className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
            >
              <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">
                {u.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <strong className="text-gray-900 block">@{u.username}</strong>
                {u.bio && <div className="text-xs text-gray-500">{u.bio}</div>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;