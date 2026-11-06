import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;

  // Verificamos si el token viene en los Headers (Authorization: Bearer <token>)
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // Extraemos el token (quitamos la palabra "Bearer ")
      token = req.headers.authorization.split(" ")[1];

      // Verificamos que el token sea válido y no esté expirado
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Buscamos al usuario en la DB (sin el password) y lo adjuntamos al request
      req.user = await User.findById(decoded.id).select("-password");

      // ¡Todo bien! Pasamos al siguiente controlador
      next();
    } catch (error) {
      res.status(401).json({ message: "No autorizado, token inválido" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "No autorizado, no hay token" });
  }
};