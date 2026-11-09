import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { getUserProfile, toggleFollow, getUserProfileWithPosts, searchUsers, updateUserProfile } from "../controllers/userController.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

// 1. Rutas fijas (Van primero)
router.get("/search", protect, searchUsers);
router.put("/profile", protect, upload.single("avatar"), updateUserProfile); // <-- AQUÍ

// 2. Rutas dinámicas (Van después)
router.get("/:username/posts", protect, getUserProfileWithPosts);
router.get("/:username", getUserProfile);
router.post("/:id/follow", protect, toggleFollow);

export default router;