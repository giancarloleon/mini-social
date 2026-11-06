import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js"; // <-- Importar

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Mini-Social API funcionando 🚀" });
});

// Rutas de autenticación
app.use("/api/auth", authRoutes); // <-- Agregar

export default app;