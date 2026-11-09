import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { getUserProfile, toggleFollow, getUserProfileWithPosts } from "../controllers/userController.js";

const router = express.Router();

// IMPORTANTE: El middleware 'protect' va justo después de la ruta
router.get("/:username/posts", protect, getUserProfileWithPosts); 
router.get("/:username", getUserProfile);
router.post("/:id/follow", protect, toggleFollow);

export default router;