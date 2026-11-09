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
  const [isFollowing, setIsFollowing] = useState(false);
  // --- ESTADOS PARA EDITAR PERFIL ---
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  // ----------------------------------

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${API_URL}/users/${username}/posts`);
      setProfileData(res.data);
      if (res.data.isFollowing !== undefined) setIsFollowing(res.data.isFollowing);
      setBio(res.data.user.bio || ""); // Inicializar la bio
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
      setProfileData({
        ...profileData,
        user: { ...profileData.user, followersCount: res.data.followersCount }
      });
      setIsFollowing(res.data.isFollowing);
    } catch (err) {
      console.error("Error al seguir", err);
    }
  };

  // --- FUNCIÓN PARA ACTUALIZAR PERFIL ---
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("bio", bio);
    if (avatarFile) formData.append("avatar", avatarFile);

    try {
      const res = await axios.put(`${API_URL}/users/profile`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      // Actualizamos el estado local
      setProfileData({
        ...profileData,
        user: { ...profileData.user, bio: res.data.bio, avatarUrl: res.data.avatarUrl }
      });
      setIsEditing(false);
      setAvatarFile(null);
      alert("Perfil actualizado con éxito");
    } catch (error) {
      console.error("Error al actualizar perfil", error);
    }
  };
  // --------------------------------------

  if (loading) return <div className="text-center mt-10 text-gray-500">Cargando perfil...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

  const { user, posts } = profileData;
  const isOwnProfile = currentUser?._id === user._id;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Link to="/feed" className="text-blue-500 font-semibold hover:underline mb-4 block">
        ← Volver al feed
      </Link>

      {/* Tarjeta de perfil */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center mb-8">
        
        {/* AVATAR: Si tiene foto, la muestra. Si no, muestra la letra */}
        {user.avatarUrl ? (
          <img src={user.avatarUrl} alt="Avatar" className="w-24 h-24 rounded-full object-cover mx-auto mb-4 shadow-md border-4 border-white" />
        ) : (
          <div className="w-24 h-24 rounded-full bg-blue-500 text-white flex items-center justify-center text-4xl font-bold mx-auto mb-4 shadow-md">
            {user.username.charAt(0).toUpperCase()}
          </div>
        )}

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

        {/* BOTONES: Seguir o Editar Perfil */}
        <div className="mt-6">
          {!isOwnProfile ? (
            <button onClick={handleFollow}
              className={`px-8 py-2 rounded-full font-semibold transition-colors border ${ isFollowing 
                  ? "bg-white text-blue-500 border-blue-500 hover:bg-blue-50" 
                  : "bg-blue-500 text-white border-transparent hover:bg-blue-600"
              }`}>
              {isFollowing ? "Dejar de seguir" : "Seguir"} </button>
          ) : (
            <button onClick={() => setIsEditing(!isEditing)} 
              className="px-8 py-2 rounded-full font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors border border-gray-300">
              {isEditing ? "Cancelar" : "Editar Perfil"} </button>
          )}
        </div>

        {/* FORMULARIO DE EDICIÓN (Solo visible si isEditing es true) */}
        {isEditing && (
          <form onSubmit={handleUpdateProfile} className="mt-6 p-4 border rounded-xl bg-gray-50 text-left">
            <label className="block text-sm font-medium text-gray-700 mb-1">Biografía</label>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Cuéntanos sobre ti..."
              className="w-full p-2 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 outline-none" rows="3"/>
            
            <label className="block text-sm font-medium text-gray-700 mb-1">Foto de Perfil</label>
            <input type="file" accept="image/*" onChange={(e) => setAvatarFile(e.target.files[0])} 
              className="mb-4 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            
            <button type="submit" className="w-full bg-blue-500 text-white font-bold py-2 rounded-lg hover:bg-blue-600 transition-colors">
              Guardar Cambios
            </button>
          </form>
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