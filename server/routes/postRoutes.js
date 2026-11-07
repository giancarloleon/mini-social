import express from "express";
import { createPost, getPosts, getPostById, getUserPosts } from "../controllers/postController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { toggleLike } from "../controllers/likeController.js";
import { createComment, getComments } from "../controllers/commentController.js";

const router = express.Router();

// 1. Rutas fijas (orden específico)
router.get("/", getPosts);
router.get("/user/:username", getUserPosts); // <-- ESTA VA ANTES

// 2. Rutas dinámicas (orden general)
router.get("/:id", getPostById); // <-- ESTA VA DESPUÉS

// Rutas protegidas
router.post("/", protect, createPost);

// --- Rutas de Interacción (Requieren Token) ---
router.post("/:id/like", protect, toggleLike);
router.post("/:id/comments", protect, createComment);

// --- Ruta pública para leer comentarios ---
router.get("/:id/comments", getComments);

export default router;