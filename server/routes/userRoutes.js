import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { getUserProfile, toggleFollow, getUserProfileWithPosts } from "../controllers/userController.js";

const router = express.Router();

// Ver perfil es público
router.get("/:username/posts", getUserProfileWithPosts); // <-- NUEVA
router.get("/:username", getUserProfile);

// Seguir requiere estar logueado
router.post("/:id/follow", protect, toggleFollow);

export default router;