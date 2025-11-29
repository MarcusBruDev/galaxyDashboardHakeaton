import express from 'express';
import morgan from 'morgan';
import planetRoutes from "./routers/planet.routes.js";


const app = express();

app.use(morgan('dev')); // middleware para el logging de peticiones
app.use(express.json()); // middleware para parsear JSON
app.use("/api/", planetRoutes); // Rutas de autenticación 


export default app;
