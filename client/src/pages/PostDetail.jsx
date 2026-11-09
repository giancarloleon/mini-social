import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

const PostDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  // Cargar el post y los comentarios
  const fetchData = async () => {
    try {
      const [postRes, commentsRes] = await Promise.all([
        axios.get(`${API_URL}/posts/${id}`),
        axios.get(`${API_URL}/posts/${id}/comments`)
      ]);
      setPost(postRes.data);
      setComments(commentsRes.data);
    } catch (error) {
      console.error("Error al cargar el post", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  // Crear un comentario
  const handleComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const res = await axios.post(`${API_URL}/posts/${id}/comments`, { text: newComment });
      setComments([res.data, ...comments]); // Añadir al principio
      setNewComment("");
    } catch (error) {
      console.error("Error al comentar", error);
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (!post) return <div>Post no encontrado</div>;

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <Link to="/feed" style={{ textDecoration: "none", color: "#007bff" }}>← Volver al feed</Link>

      {/* Post original */}
      <div style={{ border: "1px solid #ccc", borderRadius: "10px", padding: "20px", marginTop: "20px" }}>
        <h3>@{post.author?.username}</h3>
        <p style={{ fontSize: "18px" }}>{post.text}</p>
        <div style={{ color: "#666", fontSize: "14px" }}>❤️ {post.likesCount} likes</div>
      </div>

      {/* Formulario de comentario */}
      <form onSubmit={handleComment} style={{ display: "flex", gap: "10px", margin: "20px 0" }}>
        <input 
          type="text" 
          value={newComment} 
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Escribe un comentario..."
          style={{ flex: 1, padding: "10px", borderRadius: "20px", border: "1px solid #ccc" }}
        />
        <button type="submit" style={{ padding: "10px 20px", borderRadius: "20px", cursor: "pointer", backgroundColor: "#007bff", color: "white", border: "none" }}>
          Enviar
        </button>
      </form>

      {/* Lista de comentarios */}
      <h4>Comentarios ({comments.length})</h4>
      {comments.length === 0 ? (
        <p>No hay comentarios aún. ¡Sé el primero!</p>
      ) : (
        comments.map((comment) => (
          <div key={comment._id} style={{ borderBottom: "1px solid #eee", padding: "10px 0" }}>
            <strong>@{comment.author?.username}</strong>
            <p style={{ margin: "5px 0" }}>{comment.text}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default PostDetail;