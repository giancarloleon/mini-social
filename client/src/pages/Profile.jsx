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
      setIsFollowing(res.data.isFollowing); // <-- Leemos el estado inicial
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

  if (loading) return <div>Cargando perfil...</div>;
  if (error) return <div>{error}</div>;

  const { user, posts } = profileData;
  const isOwnProfile = currentUser?._id === user._id;

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <Link to="/feed" style={{ textDecoration: "none", color: "#007bff" }}>← Volver al feed</Link>

      <div style={{ border: "1px solid #ccc", borderRadius: "10px", padding: "20px", marginTop: "20px", textAlign: "center" }}>
        <div style={{ width: "80px", height: "80px", borderRadius: "50%", backgroundColor: "#007bff", color: "white", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "30px", fontWeight: "bold", margin: "0 auto" }}>
          {user.username.charAt(0).toUpperCase()}
        </div>
        <h2>@{user.username}</h2>
        <p style={{ color: "#666" }}>{user.bio || "Sin biografía"}</p>
        
        <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "10px" }}>
          <span><strong>{posts.length}</strong> Posts</span>
          <span><strong>{user.followersCount || 0}</strong> Seguidores</span>
          <span><strong>{user.followingCount || 0}</strong> Siguiendo</span>
        </div>

        {!isOwnProfile && (
          <button 
            onClick={handleFollow}
            style={{ 
              marginTop: "15px", padding: "10px 20px", borderRadius: "20px", cursor: "pointer",
              backgroundColor: isFollowing ? "#fff" : "#007bff",
              color: isFollowing ? "#007bff" : "white",
              border: "1px solid #007bff"
            }}
          >
            {isFollowing ? "Dejar de seguir" : "Seguir"}
          </button>
        )}
      </div>

      <h3 style={{ marginTop: "30px" }}>Posts</h3>
      {posts.length === 0 ? (
        <p>Este usuario aún no ha publicado nada.</p>
      ) : (
        posts.map((post) => (
          <PostCard key={post._id} post={post} onLike={() => {}} />
        ))
      )}
    </div>
  );
};

export default Profile;