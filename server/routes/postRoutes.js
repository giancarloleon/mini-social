import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { toggleLike } from "../controllers/likeController.js";
import { createComment, getComments } from "../controllers/commentController.js";
import { createPost, getPosts, getPostById, getUserPosts, getFeed } from "../controllers/postController.js";

const router = express.Router();

// ==========================================
// 1. RUTAS FIJAS (Las más específicas primero)
// ==========================================

// Obtener todos los posts (Público)
router.get("/", getPosts);

// Obtener el feed personalizado (Protegido)
router.get("/feed", protect, getFeed);

// Obtener posts de un usuario específico (Público)
router.get("/user/:username", getUserPosts);


// ==========================================
// 2. RUTAS DINÁMICAS (Usan :id)
// ==========================================

// Obtener un post por ID (Público)
router.get("/:id", getPostById);

// Crear un post (Protegido)
router.post("/", protect, createPost);

// Interacciones con un post (Protegidas)
router.post("/:id/like", protect, toggleLike);
router.post("/:id/comments", protect, createComment);

// Leer comentarios de un post (Público)
router.get("/:id/comments", getComments);

export default router;