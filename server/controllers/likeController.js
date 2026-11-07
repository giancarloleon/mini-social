import Like from "../models/Like.js";
import Post from "../models/Post.js";

// @desc    Dar o quitar "Me gusta" a un post
// @route   POST /api/posts/:id/like
export const toggleLike = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id; // Viene del middleware protect

    // 1. Verificamos si el post existe
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post no encontrado" });

    // 2. Buscamos si ya existe un Like de este usuario en este post
    const existingLike = await Like.findOne({ user: userId, post: postId });

    if (existingLike) {
      // --- QUITAR LIKE ---
      await existingLike.deleteOne();
      // Restamos 1 al contador del Post
      post.likesCount = Math.max(0, post.likesCount - 1); 
      await post.save();
      
      return res.json({ message: "Like eliminado", likesCount: post.likesCount });
    } else {
      // --- DAR LIKE ---
      await Like.create({ user: userId, post: postId });
      // Sumamos 1 al contador del Post
      post.likesCount += 1;
      await post.save();

      return res.json({ message: "Like agregado", likesCount: post.likesCount });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al procesar el like", error: error.message });
  }
};