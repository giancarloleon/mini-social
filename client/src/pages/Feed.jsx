import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import PostCard from "../components/PostCard";
import SearchBar from "../components/SearchBar";

const API_URL = import.meta.env.VITE_API_URL;

const Feed = () => {
  const { user, logout } = useAuth();
  const [posts, setPosts] = useState([]);
  const [newPostText, setNewPostText] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchFeed = async () => {
    try {
      const res = await axios.get(`${API_URL}/posts/feed`);
      setPosts(res.data);
    } catch (error) {
      console.error("Error al cargar el feed", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

   const [imageFile, setImageFile] = useState(null);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPostText.trim() && !imageFile) return; // Validar que haya texto o imagen

    // Usamos FormData para enviar texto + archivo
    const formData = new FormData();
    formData.append("text", newPostText);
    if (imageFile) {
      formData.append("image", imageFile); // "image" es el nombre que espera multer
    }
    try {
      const res = await axios.post(`${API_URL}/posts`, formData, {
        headers: { "Content-Type": "multipart/form-data" }, // Importante para archivos
      });
      setPosts([res.data, ...posts]); 
      setNewPostText(""); 
      setImageFile(null); // Limpiar
    } catch (error) {
      console.error("Error al crear post", error);
    }
  };

  const handleLikeUpdate = (postId, newCount) => {
    setPosts(posts.map(p => p._id === postId ? { ...p, likesCount: newCount } : p));
  };

  const handleDeletePost = (postId) => {
    // Filtramos la lista de posts para quitar el que acabamos de borrar
    setPosts(posts.filter((p) => p._id !== postId));
  };

  if (loading) return <div className="text-center mt-10 text-gray-500">Cargando feed...</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      
      {/* Navbar superior */}
      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">Hola, @{user?.username}</h2>
        <button 
          onClick={logout} 
          className="px-4 py-2 text-sm text-red-600 font-semibold border border-red-200 rounded-full hover:bg-red-50 transition-colors"
        >
          Cerrar Sesión
        </button>
      </div>

      <SearchBar />

      {/* Formulario de nuevo post */}
      <form onSubmit={handleCreatePost} className="flex flex-col gap-2 mb-8 bg-white p-3 rounded-xl shadow-sm border border-gray-200">
    <div className="flex gap-2">
      <input 
        type="text" 
        value={newPostText} 
        onChange={(e) => setNewPostText(e.target.value)}
        placeholder="¿Qué está pasando?"
        className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button type="submit" className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors">
        Publicar
      </button>
    </div>
    
    {/* Input para la imagen */}
    <input 
      type="file" 
      accept="image/*"
      onChange={(e) => setImageFile(e.target.files[0])}
      className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
    />
  </form>

      {/* Lista de posts */}
      <div>
        {posts.length === 0 ? (
          <p className="text-center text-gray-500">No hay posts aún. ¡Sigue a alguien o publica algo!</p>
        ) : (
          posts.map((post) => (
            <PostCard 
              key={post._id} 
              post={post} 
              onLike={handleLikeUpdate} 
              onDelete={handleDeletePost} // <-- PASAR LA FUNCIÓN
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Feed;