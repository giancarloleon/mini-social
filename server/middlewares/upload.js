import multer from "multer";

// Guardamos el archivo en memoria (no en disco) para subirlo a Cloudinary
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 2 * 1024 * 1024 } // Límite de 2 MB
});

export default upload;