import express from "express";
import { getUserProfile, toggleFollow } from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Ver perfil es público
router.get("/:username", getUserProfile);

// Seguir requiere estar logueado
router.post("/:id/follow", protect, toggleFollow);

export default router;