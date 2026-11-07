import Comment from "../models/Comment.js";
import Post from "../models/Post.js";

// @desc    Crear un comentario en un post
// @route   POST /api/posts/:id/comments
export const createComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const { text } = req.body;

    if (!text) return res.status(400).json({ message: "El comentario no puede estar vacío" });

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post no encontrado" });

    // Creamos el comentario
    const comment = await Comment.create({
      post: postId,
      author: req.user._id,
      text,
    });

    // Actualizamos el contador del post
    post.commentsCount += 1;
    await post.save();

    // Poblamos el autor para devolverlo con el nombre en la respuesta
    const populatedComment = await Comment.findById(comment._id).populate("author", "username avatarUrl");

    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: "Error al crear comentario", error: error.message });
  }
};

// @desc    Obtener comentarios de un post
// @route   GET /api/posts/:id/comments
export const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.id })
      .sort({ createdAt: -1 })
      .populate("author", "username avatarUrl");
      
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener comentarios", error: error.message });
  }
};