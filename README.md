# Mini-Social 

Una red social minimalista inspirada en Twitter/Instagram, construida con el stack MERN (MongoDB, Express, React, Node.js) y desplegada en la nube.

##  Demo en vivo
- **Frontend (Vercel):** [https://mini-social-alpha.vercel.app](https://mini-social-alpha.vercel.app)
- **Backend API (Render):** [https://mini-social-ea74.onrender.com/api/health](https://mini-social-ea74.onrender.com/api/health)

##  Características
- **Autenticación:** Registro e inicio de sesión con JWT.
- **Posts:** Creación de publicaciones con texto e imágenes (Cloudinary).
- **Interacciones:** Sistema de likes (toggle) y comentarios.
- **Red Social:** Feed personalizado basado en seguidos, sistema de follow/unfollow.
- **Perfiles:** Edición de biografía y foto de perfil, búsqueda de usuarios.
- **CRUD Completo:** Eliminación de posts propios.
- **Diseño:** Interfaz moderna y responsive con Tailwind CSS.

##  Tecnologías
- **Frontend:** React, Vite, React Router, Tailwind CSS, Axios.
- **Backend:** Node.js, Express, Mongoose, JWT, Multer, Cloudinary.
- **Base de datos:** MongoDB Atlas.
- **Despliegue:** Vercel (Frontend) y Render (Backend).

##  Cómo correr el proyecto localmente
1. Clona el repositorio: `git clone https://github.com/giancarloeon/mini-social.git`
2. Instala dependencias del backend: `cd server && npm install`
3. Instala dependencias del frontend: `cd client && npm install`
4. Configura las variables de entorno en `server/.env` (MongoDB, JWT, Cloudinary).
5. Corre el backend: `npm run dev` (en `server`).
6. Corre el frontend: `npm run dev` (en `client`).

##  Notas
- El backend está en el plan gratuito de Render, por lo que puede tardar unos segundos en "despertar" tras un periodo de inactividad.
- Las imágenes se almacenan en Cloudinary.

---
*Desarrollado por [Giancarlo Leon](https://github.com/giancarloeon)*