import User from "../models/User.js";
import Follow from "../models/Follow.js";
import Post from "../models/Post.js";

// @desc    Obtener el perfil de un usuario por su username
// @route   GET /api/users/:username
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select("-password");
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el perfil", error: error.message });
  }
};

// @desc    Seguir o dejar de seguir a un usuario (Toggle)
// @route   POST /api/users/:id/follow
export const toggleFollow = async (req, res) => {
  try {
    const targetUserId = req.params.id; // A quién quiero seguir
    const currentUserId = req.user._id; // Quién soy yo

    // 1. Validar que no me intente seguir a mí mismo
    if (targetUserId === currentUserId.toString()) {
      return res.status(400).json({ message: "No puedes seguirte a ti mismo" });
    }

    // 2. Validar que el usuario a seguir existe
    const targetUser = await User.findById(targetUserId);
    if (!targetUser) return res.status(404).json({ message: "Usuario no encontrado" });

    // 3. Buscar si ya existe la relación de Follow
    const existingFollow = await Follow.findOne({ follower: currentUserId, following: targetUserId });

    if (existingFollow) {
      // --- DEJAR DE SEGUIR (Unfollow) ---
      await existingFollow.deleteOne();
      
      // Actualizamos los contadores (en el modelo User)
      await User.findByIdAndUpdate(currentUserId, { $inc: { followingCount: -1 } });
      await User.findByIdAndUpdate(targetUserId, { $inc: { followersCount: -1 } });

      return res.json({ message: "Dejaste de seguir al usuario" });
    } else {
      // --- SEGUIR (Follow) ---
      await Follow.create({ follower: currentUserId, following: targetUserId });
      
      // Actualizamos los contadores
      await User.findByIdAndUpdate(currentUserId, { $inc: { followingCount: 1 } });
      await User.findByIdAndUpdate(targetUserId, { $inc: { followersCount: 1 } });

      return res.json({ message: "Ahora sigues a este usuario" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al procesar el follow", error: error.message });
  }
};
export const getUserProfileWithPosts = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select("-password");
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    // Buscamos los posts del usuario
    const posts = await Post.find({ author: user._id })
      .sort({ createdAt: -1 })
      .populate("author", "username avatarUrl displayName");

    res.json({ user, posts });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el perfil", error: error.message });
  }
};