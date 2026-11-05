import express from "express";
import cors from "cors";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta de prueba (Healthcheck)
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Mini-Social API funcionando 🚀" });
});

export default app;