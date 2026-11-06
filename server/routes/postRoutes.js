import express from "express";
import { createPost, getPosts } from "../controllers/postController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// GET es público (cualquiera puede ver el feed)
router.get("/", getPosts);

// POST está protegido (solo usuarios logueados)
router.post("/", protect, createPost);

export default router;