import { useState } from "react";
import axios from "axios";

const PostCard = ({ post, onLike }) => {
  const [likes, setLikes] = useState(post.likesCount);
  const [isLiking, setIsLiking] = useState(false);

  // Función para dar/quitar like
    const handleLike = async () => {
    if (isLiking) return; 
    setIsLiking(true);
    try {
      // Cambiamos localhost por la variable de entorno
      const res = await axios.post(`${API_URL}/posts/${post._id}/like`);
      
      // Actualizamos el contador local con la respuesta del servidor
      setLikes(res.data.likesCount);
      if (onLike) onLike(post._id, res.data.likesCount); // Avisa al padre
    } catch (error) {
      console.error("Error al dar like:", error);
    } finally {
      setIsLiking(false);
    }
  };

  // Formatear la fecha (ej. "Hace 2 horas")
  const timeAgo = new Date(post.createdAt).toLocaleDateString("es-ES", {
    hour: "2-digit", minute: "2-digit"
  });

  return (
    <div style={{ 
      border: "1px solid #ccc", 
      borderRadius: "10px", 
      padding: "15px", 
      marginBottom: "15px",
      backgroundColor: "#fff",
      color: "#333" // Para que se lea si tu fondo es oscuro
    }}>
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

      {/* Botón de Like */}
      <div style={{ display: "flex", gap: "20px", borderTop: "1px solid #eee", paddingTop: "10px" }}>
        <button 
          onClick={handleLike}
          style={{ 
            background: "none", border: "none", cursor: "pointer", 
            color: likes > 0 ? "#e0245e" : "#666", 
            fontWeight: "bold", fontSize: "14px"
          }}
        >
          ❤️ {likes}
        </button>
        <span style={{ color: "#666", fontSize: "14px" }}>💬 {post.commentsCount}</span>
      </div>
    </div>
  );
};

export default PostCard;