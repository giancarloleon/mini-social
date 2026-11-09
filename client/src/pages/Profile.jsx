import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import PostCard from "../components/PostCard";

const API_URL = import.meta.env.VITE_API_URL;

const Profile = () => {
  const { username } = useParams();
  const { user: currentUser } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFollowing, setIsFollowing] = useState(false); // Estado para el botón

  const fetchProfile = async () => {
  try {
    const res = await axios.get(`${API_URL}/users/${username}/posts`);
    setProfileData(res.data);
    
    // --- NUEVO: Leemos el isFollowing que nos manda el backend ---
    if (res.data.isFollowing !== undefined) {
      setIsFollowing(res.data.isFollowing);
    }
  } catch (err) {
    setError("Usuario no encontrado");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchProfile();
  }, [username]);

  const handleFollow = async () => {
    if (!profileData) return;
    try {
      const res = await axios.post(`${API_URL}/users/${profileData.user._id}/follow`);
      
      // Actualizamos el contador con lo que devuelve el backend
      setProfileData({
        ...profileData,
        user: { 
          ...profileData.user, 
          followersCount: res.data.followersCount 
        }
      });
      setIsFollowing(res.data.isFollowing); // <-- Actualizamos el estado del botón
    } catch (err) {
      console.error("Error al seguir", err);
    }
  };

  if (loading) return <div className="text-center mt-10 text-gray-500">Cargando perfil...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

  const { user, posts } = profileData;
  const isOwnProfile = currentUser?._id === user._id;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Link to="/feed" className="text-blue-500 font-semibold hover:underline mb-4 block">← Volver al feed</Link>

      {/* Tarjeta de perfil */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center mb-8">
        <div className="w-20 h-20 rounded-full bg-blue-500 text-white flex items-center justify-center text-4xl font-bold mx-auto mb-4 shadow-md">
          {user.username.charAt(0).toUpperCase()}
        </div>
        <h2 className="text-2xl font-bold text-gray-900">@{user.username}</h2>
        <p className="text-gray-500 mt-2">{user.bio || "Sin biografía"}</p>
        
        <div className="flex justify-center gap-6 mt-6">
          <div className="text-center">
            <span className="block font-bold text-lg text-gray-900">{posts.length}</span>
            <span className="text-sm text-gray-500">Posts</span>
          </div>
          <div className="text-center">
            <span className="block font-bold text-lg text-gray-900">{user.followersCount || 0}</span>
            <span className="text-sm text-gray-500">Seguidores</span>
          </div>
          <div className="text-center">
            <span className="block font-bold text-lg text-gray-900">{user.followingCount || 0}</span>
            <span className="text-sm text-gray-500">Siguiendo</span>
          </div>
        </div>

        {!isOwnProfile && (
          <button onClick={handleFollow}
            className={`mt-6 px-8 py-2 rounded-full font-semibold transition-colors border ${
              isFollowing 
                ? "bg-white text-blue-500 border-blue-500 hover:bg-blue-50" 
                : "bg-blue-500 text-white border-transparent hover:bg-blue-600"
            }`}
          >
            {isFollowing ? "Dejar de seguir" : "Seguir"}
          </button>
        )}
      </div>

      {/* Lista de posts */}
      <h3 className="text-xl font-bold text-gray-800 mb-4">Posts</h3>
      {posts.length === 0 ? (
        <p className="text-gray-500 text-center bg-white p-6 rounded-xl border border-gray-200">Este usuario aún no ha publicado nada.</p>
      ) : (
        posts.map((post) => (
          <PostCard key={post._id} post={post} onLike={() => {}} />
        ))
      )}
    </div>
  );
};

export default Profile;