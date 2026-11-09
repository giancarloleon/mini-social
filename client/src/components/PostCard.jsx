import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const PostCard = ({ post, onLike }) => {
  const [likes, setLikes] = useState(post.likesCount);
  const [isLiking, setIsLiking] = useState(false);

  // Función para dar/quitar like
  const handleLike = async (e) => {
    e.preventDefault(); // Evita que el clic del botón active el Link del padre
    if (isLiking) return; 
    setIsLiking(true);
    
    try {
      const res = await axios.post(`${API_URL}/posts/${post._id}/like`);
      setLikes(res.data.likesCount);
      if (onLike) onLike(post._id, res.data.likesCount); 
    } catch (error) {
      console.error("Error al dar like:", error);
    } finally {
      setIsLiking(false);
    }
  };

  // Formatear la fecha
  const timeAgo = new Date(post.createdAt).toLocaleDateString("es-ES", {
    hour: "2-digit", minute: "2-digit"
  });

  return (
    <div style={{ border: "1px solid #ccc", borderRadius: "10px", padding: "15px", marginBottom: "15px", backgroundColor: "#fff", color: "#333" }}>
      {/* Todo lo que está dentro del Link te lleva al detalle del post */}
      <Link to={`/post/${post._id}`} style={{ textDecoration: "none", color: "inherit", display: "block" }}>
        
        {/* Cabecera: Autor y fecha */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
          <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "#007bff", color: "white", display: "flex", justifyContent: "center", alignItems: "center", fontWeight: "bold" }}>
            {post.author?.username?.charAt(0).toUpperCase()}
          </div>
          <div>
            <strong>@{post.author?.username}</strong>
            <div style={{ fontSize: "12px", color: "#666" }}>{timeAgo}</div>
          </div>
        </div>

        {/* Texto del post */}
        <p style={{ fontSize: "16px", marginBottom: "15px" }}>{post.text}</p>
      </Link>

      {/* Botón de Like (FUERA del Link para que no redirija) */}
      <div style={{ display: "flex", gap: "20px", borderTop: "1px solid #eee", paddingTop: "10px" }}>
        <button 
          onClick={handleLike}
          disabled={isLiking}
          style={{ 
            background: "none", border: "none", cursor: "pointer", 
            color: likes > 0 ? "#e0245e" : "#666", 
            fontWeight: "bold", fontSize: "14px",
            padding: 0
          }}
        >
          ❤️ {likes}
        </button>
        
        {/* Contador de comentarios (también es un Link al detalle) */}
        <Link to={`/post/${post._id}`} style={{ textDecoration: "none", color: "#666", fontSize: "14px" }}>
          💬 {post.commentsCount}
        </Link>
      </div>
    </div>
  );
};

export default PostCard;