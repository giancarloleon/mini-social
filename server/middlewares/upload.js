import multer from "multer";

// Guardamos el archivo en memoria (no en disco) para subirlo a Cloudinary
const storage = multer.memoryStorage();
const upload = multer({ storage });

export default upload;