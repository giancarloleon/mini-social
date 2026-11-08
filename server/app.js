import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import userRoutes from "./routes/userRoutes.js";

// 1. PRIMERO inicializamos la app
const app = express();

// 2. Luego los middlewares globales
app.use(cors());
app.use(express.json());

// 3. Ruta de prueba
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Mini-Social API funcionando 🚀" });
});

// 4. Finalmente, las rutas
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);

export default app;