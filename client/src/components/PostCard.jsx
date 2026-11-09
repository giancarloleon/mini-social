import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext"; // <-- Importar

const API_URL = import.meta.env.VITE_API_URL;

const PostCard = ({ post, onLike, onDelete }) => { // <-- Recibimos onDelete
  const { user } = useAuth(); // <-- Usuario logueado
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

  // --- NUEVA FUNCIÓN PARA BORRAR ---
  const handleDelete = async (e) => {
    e.preventDefault();
    // Confirmación nativa del navegador
    if (!window.confirm("¿Estás seguro de que quieres eliminar este post?")) return;

    try {
      await axios.delete(`${API_URL}/posts/${post._id}`);
      if (onDelete) onDelete(post._id); // Avisa al padre (Feed) para que lo elimine de la lista
    } catch (error) {
      console.error("Error al eliminar post", error);
      alert("No se pudo eliminar el post");
    }
  };

  const timeAgo = new Date(post.createdAt).toLocaleDateString("es-ES", {
    hour: "2-digit", minute: "2-digit"
  });

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-4 border border-gray-200">
      
      {/* Cabecera */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          {post.author?.avatarUrl ? (
            <img src={post.author.avatarUrl} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-lg">
              {post.author?.username?.charAt(0).toUpperCase()}
            </div>
          )} 
          <div>
            <Link to={`/profile/${post.author?.username}`} className="hover:underline">
              <strong className="text-gray-900">@{post.author?.username}</strong>
            </Link>
            <div className="text-xs text-gray-500">{timeAgo}</div>
          </div>
        </div>

        {/* BOTÓN DE BASURA: Solo visible si soy el autor */}
        {user?._id === post.author?._id && (
          <button onClick={handleDelete} className="text-gray-400 hover:text-red-500 transition-colors p-1"
            title="Eliminar post">   🗑️   </button>
        )}
      </div>
        
      {/* Texto y Foto del post */}
      <Link to={`/post/${post._id}`} className="block mb-4">
        <p className="text-gray-800 text-base mb-2">{post.text}</p>
        {post.imageUrl && (
          <img src={post.imageUrl} alt="Post content" className="w-full rounded-lg mt-2 border border-gray-100"/>
        )}
      </Link>

      {/* Botones de acción */}
      <div className="flex gap-6 border-t border-gray-100 pt-3">
        <button onClick={handleLike} disabled={isLiking}
         className={`flex items-center gap-1 text-sm font-semibold transition-colors ${likes > 0 ? "text-pink-600" : "text-gray-500 hover:text-pink-600"}`}>
          ❤️ {likes}
        </button>
        
        <Link to={`/post/${post._id}`} className="flex items-center gap-1 text-sm font-semibold text-gray-500 hover:text-blue-500 transition-colors">
          💬 {post.commentsCount}
        </Link>
      </div>
    </div>
  );
};

export default PostCard;