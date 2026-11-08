import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import PostCard from "../components/PostCard";

const Feed = () => {
  const { user, logout } = useAuth();
  const [posts, setPosts] = useState([]);
  const [newPostText, setNewPostText] = useState("");
  const [loading, setLoading] = useState(true);

  // 1. Cargar el feed al entrar
  const fetchFeed = async () => {
    try {
      // Usamos la ruta protegida, Axios ya envía el token automáticamente gracias al AuthContext
      const res = await axios.get("http://localhost:4000/api/posts/feed");
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

  // 2. Crear un nuevo post
  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    try {
      const res = await axios.post("http://localhost:4000/api/posts", { text: newPostText });
      // Añadimos el nuevo post al principio de la lista
      setPosts([res.data, ...posts]); 
      setNewPostText(""); // Limpiamos el input
    } catch (error) {
      console.error("Error al crear post", error);
    }
  };

  // 3. Función para manejar el like desde el hijo
  const handleLikeUpdate = (postId, newCount) => {
    // Actualizamos el estado local para que el contador cambie visualmente
    setPosts(posts.map(p => p._id === postId ? { ...p, likesCount: newCount } : p));
  };

  if (loading) return <div>Cargando feed...</div>;

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      {/* Barra superior con botón de logout */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2>Hola, @{user?.username}</h2>
        <button onClick={logout} style={{ padding: "8px 12px", cursor: "pointer" }}>Cerrar Sesión</button>
      </div>

      {/* Formulario para crear post */}
      <form onSubmit={handleCreatePost} style={{ marginBottom: "30px", display: "flex", gap: "10px" }}>
        <input 
          type="text" 
          value={newPostText} 
          onChange={(e) => setNewPostText(e.target.value)}
          placeholder="¿Qué está pasando?"
          style={{ flex: 1, padding: "10px", borderRadius: "20px", border: "1px solid #ccc" }}
        />
        <button type="submit" style={{ padding: "10px 20px", borderRadius: "20px", cursor: "pointer", backgroundColor: "#007bff", color: "white", border: "none" }}>
          Publicar
        </button>
      </form>

      {/* Lista de posts */}
      <div>
        {posts.length === 0 ? (
          <p>No hay posts aún. ¡Sigue a alguien o publica algo!</p>
        ) : (
          posts.map((post) => (
            <PostCard key={post._id} post={post} onLike={handleLikeUpdate} />
          ))
        )}
      </div>
    </div>
  );
};

export default Feed;