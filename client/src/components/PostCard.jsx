import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const PostCard = ({ post, onLike }) => {
  const [likes, setLikes] = useState(post.likesCount);
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async (e) => {
    e.preventDefault();
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
      color: "#333" 
    }}>
      
      {/* CABECERA: Fuera del Link del post. El username tiene su propio Link al perfil */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
        <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "#007bff", color: "white", display: "flex", justifyContent: "center", alignItems: "center", fontWeight: "bold" }}>
          {post.author?.username?.charAt(0).toUpperCase()}
        </div>
        <div>
          {/* Enlace al perfil del usuario */}
          <Link to={`/profile/${post.author?.username}`} style={{ textDecoration: "none", color: "inherit" }}>
            <strong>@{post.author?.username}</strong>
          </Link>
          <div style={{ fontSize: "12px", color: "#666" }}>{timeAgo}</div>
        </div>
      </div>

      {/* TEXTO DEL POST: Este Link te lleva al detalle del post */}
      <Link to={`/post/${post._id}`} style={{ textDecoration: "none", color: "inherit", display: "block" }}>
        <p style={{ fontSize: "16px", marginBottom: "15px" }}>{post.text}</p>
      </Link>

      {/* BOTONES DE ACCIÓN */}
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
        
        {/* Enlace al detalle del post para ver comentarios */}
        <Link to={`/post/${post._id}`} style={{ textDecoration: "none", color: "#666", fontSize: "14px" }}>
          💬 {post.commentsCount}
        </Link>
      </div>
    </div>
  );
};

export default PostCard;