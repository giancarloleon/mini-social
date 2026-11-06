import Post from "../models/Post.js";

// @desc    Crear un nuevo post
// @route   POST /api/posts
export const createPost = async (req, res) => {
  try {
    const { text, imageUrl } = req.body;

    if (!text && !imageUrl) {
      return res.status(400).json({ message: "El post debe tener texto o imagen" });
    }

    const post = await Post.create({
      author: req.user._id, // Viene del middleware 'protect'
      text,
      imageUrl,
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: "Error al crear el post", error: error.message });
  }
};

// @desc    Obtener todos los posts (Feed)
// @route   GET /api/posts
export const getPosts = async (req, res) => {
  try {
    // Traemos los posts más recientes y "poblamos" el autor (traemos su username y avatar)
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("author", "username avatarUrl displayName");
      
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los posts", error: error.message });
  }
};