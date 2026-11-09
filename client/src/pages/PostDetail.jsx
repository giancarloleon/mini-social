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

  useEffect(() => { fetchData(); }, [id]);

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

  if (loading) return <div className="text-center mt-10 text-gray-500">Cargando...</div>;
  if (!post) return <div className="text-center mt-10 text-red-500">Post no encontrado</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Link to="/feed" className="text-blue-500 font-semibold hover:underline mb-4 block"> ← Volver al feed</Link>

      {/* Post original */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
        <h3 className="font-bold text-lg text-gray-900 mb-2">@{post.author?.username}</h3>
        <p className="text-xl text-gray-800 mb-4">{post.text}</p>
        <div className="text-gray-500 text-sm flex items-center gap-1">
          ❤️ {post.likesCount} likes
        </div>
      </div>

      {/* Formulario de comentario */}
      <form onSubmit={handleComment} className="flex gap-2 mb-6">
        <input type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Escribe un comentario..."
          className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        <button type="submit" className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-full hover:bg-blue-600 transition-colors">
          Enviar
        </button>
      </form>

      {/* Lista de comentarios */}
      <h4 className="font-bold text-gray-800 mb-3">Comentarios ({comments.length})</h4>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {comments.length === 0 ? (
          <p className="p-4 text-gray-500 text-center">No hay comentarios aún. ¡Sé el primero!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
              <strong className="text-gray-900 block mb-1">@{comment.author?.username}</strong>
              <p className="text-gray-700">{comment.text}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PostDetail;