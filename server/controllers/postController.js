import User from "../models/User.js";
import Post from "../models/Post.js";
import Follow from "../models/Follow.js";
import cloudinary from "../config/cloudinary.js";

// @desc    Crear un nuevo post
// @route   POST /api/posts
export const createPost = async (req, res) => {
  try {
    const { text } = req.body;
    let imageUrl = "";

    // Si viene un archivo, lo subimos a Cloudinary
    if (req.file) {
      // Convertimos el buffer a base64 para que Cloudinary lo acepte
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;
      
      const result = await cloudinary.uploader.upload(dataURI, {
        folder: "mini-social-posts", // Carpeta opcional en Cloudinary
      });
      imageUrl = result.secure_url;
    }

    if (!text && !imageUrl) {
      return res.status(400).json({ message: "El post debe tener texto o imagen" });
    }

    const post = await Post.create({
      author: req.user._id,
      text,
      imageUrl, // <-- Guardamos la URL de la imagen
    });

    // Poblamos el autor para devolverlo igual que en el feed
    const populatedPost = await Post.findById(post._id).populate("author", "username avatarUrl");
    res.status(201).json(populatedPost);
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

// @desc    Obtener el feed personalizado (posts de gente que sigo + míos)
// @route   GET /api/posts/feed
export const getFeed = async (req, res) => {
  try {
    // 1. Buscamos a todos los usuarios a los que YO sigo
    const follows = await Follow.find({ follower: req.user._id });
    
    // 2. Extraemos solo los IDs de esos usuarios en un array
    const followingIds = follows.map((follow) => follow.following);
    
    // 3. Le agregamos mi propio ID para ver también mis propios posts
    followingIds.push(req.user._id);

    // 4. Buscamos los posts donde el autor esté en esa lista de IDs
    const posts = await Post.find({ author: { $in: followingIds } })
      .sort({ createdAt: -1 }) // Más nuevos primero
      .populate("author", "username avatarUrl displayName");

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el feed", error: error.message });
  }
};