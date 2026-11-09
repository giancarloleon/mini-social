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
export const getUserProfileWithPosts = async (req, res) => {
  try {
    // 1. Buscamos al usuario dueño del perfil
    const user = await User.findOne({ username: req.params.username }).select("-password");
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    // 2. Buscamos sus posts
    const posts = await Post.find({ author: user._id })
      .sort({ createdAt: -1 })
      .populate("author", "username avatarUrl displayName");

    // 3. VERIFICAMOS SI EL USUARIO LOGUEADO YA SIGUE A ESTE PERFIL
    // req.user._id viene del middleware 'protect'
    let isFollowing = false;
    if (req.user) { // <-- Si no hay token, req.user es undefined y esto se salta
      const follow = await Follow.findOne({ 
        follower: req.user._id, 
        following: user._id 
      });
      if (follow) isFollowing = true;
    }

    // 4. Devolvemos todo, incluyendo el estado del follow
    res.json({ user, posts, isFollowing });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el perfil", error: error.message });
  }
};

// ... toggleFollow
export const toggleFollow = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const currentUserId = req.user._id;

    if (targetUserId === currentUserId.toString()) {
      return res.status(400).json({ message: "No puedes seguirte a ti mismo" });
    }

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) return res.status(404).json({ message: "Usuario no encontrado" });

    const existingFollow = await Follow.findOne({ follower: currentUserId, following: targetUserId });

    let isFollowing = false;
    let followersCount = targetUser.followersCount;

    if (existingFollow) {
      await existingFollow.deleteOne();
      await User.findByIdAndUpdate(currentUserId, { $inc: { followingCount: -1 } });
      const updatedTarget = await User.findByIdAndUpdate(targetUserId, { $inc: { followersCount: -1 } }, { new: true });
      followersCount = updatedTarget.followersCount;
    } else {
      await Follow.create({ follower: currentUserId, following: targetUserId });
      await User.findByIdAndUpdate(currentUserId, { $inc: { followingCount: 1 } });
      const updatedTarget = await User.findByIdAndUpdate(targetUserId, { $inc: { followersCount: 1 } }, { new: true });
      followersCount = updatedTarget.followersCount;
      isFollowing = true;
    }

    // --- NUEVO: Devolvemos el estado actualizado ---
    res.json({ message: isFollowing ? "Ahora sigues a este usuario" : "Dejaste de seguir al usuario", isFollowing, followersCount });
  } catch (error) {
    res.status(500).json({ message: "Error al procesar el follow", error: error.message });
  }
};