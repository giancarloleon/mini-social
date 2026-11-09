import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { toggleLike } from "../controllers/likeController.js";
import { createComment, getComments } from "../controllers/commentController.js";
import { createPost, getPosts, getPostById, getUserPosts, getFeed, deletePost } from "../controllers/postController.js"; // <-- Importar deletePost
import upload from "../middlewares/upload.js";

const router = express.Router();

// ... (Rutas fijas) ...
router.get("/", getPosts);
router.get("/feed", protect, getFeed);
router.get("/user/:username", getUserPosts);

// ... (Rutas dinámicas) ...
router.get("/:id", getPostById);
router.post("/", protect, upload.single("image"), createPost); 

// Interacciones
router.post("/:id/like", protect, toggleLike);
router.post("/:id/comments", protect, createComment);
router.get("/:id/comments", getComments);

// NUEVA RUTA PARA ELIMINAR
router.delete("/:id", protect, deletePost);

export default router;