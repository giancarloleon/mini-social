import User from "../models/User.js";
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

// @desc    Obtener un post por ID
// @route   GET /api/posts/:id
export const getPostById = async (req, res) => {
  try {
    // Buscamos por el ID que viene en la URL (req.params.id)
    const post = await Post.findById(req.params.id)
      .populate("author", "username avatarUrl displayName"); // Trae los datos del autor

    if (!post) {
      return res.status(404).json({ message: "Post no encontrado" });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el post", error: error.message });
  }
};

// @desc    Obtener todos los posts de un usuario específico
// @route   GET /api/posts/user/:username
export const getUserPosts = async (req, res) => {
  try {
    // Primero, buscamos el usuario por su username en la URL
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Luego, buscamos los posts cuyo 'author' coincida con el ID del usuario
    const posts = await Post.find({ author: user._id })
      .sort({ createdAt: -1 }) // Más recientes primero
      .populate("author", "username avatarUrl displayName");

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor", error: error.message });
  }
};