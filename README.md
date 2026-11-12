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
##  Capturas de pantalla
  | Feed Principal | 
| :---: | 
<img width="3838" height="1786" alt="feed" src="https://github.com/user-attachments/assets/52d8067d-fc4c-4f2c-9961-f0ba6b3db6b1" />

  | Feed Responsive Principal | 
| :---: | 
<img width="720" height="1600" alt="feed responsive" src="https://github.com/user-attachments/assets/012075b1-41b3-4060-85e2-5ba26553dc39" />

  | Perfil Principal | 
| :---: | 
<img width="3838" height="1791" alt="perfil" src="https://github.com/user-attachments/assets/59881e01-0fe3-45ae-99ee-eccbd17fac4f" />

  | Perfil Responsive Principal | 
| :---: | 
<img width="720" height="1600" alt="perfil responsive" src="https://github.com/user-attachments/assets/7263e44d-ec3f-4e57-9055-62124ed9031d" />



---
*Desarrollado por [Giancarlo Leon](https://github.com/giancarloeon)*
