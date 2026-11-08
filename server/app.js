import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import userRoutes from "./routes/userRoutes.js";

// 1. PRIMERO inicializamos la app
const app = express();

// 2. Luego los middlewares globales
// Configuración de CORS para permitir Vercel y el entorno local
const allowedOrigins = [
  "http://localhost:5173", // Tu frontend local
  "https://mini-social.vercel.app" // Tu frontend en producción (CAMBIA ESTO)
];

app.use(cors({
  origin: function (origin, callback) {
    // Permitir peticiones sin origin (como Postman o Thunder Client)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("No permitido por CORS"));
    }
  },
  credentials: true
}));
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