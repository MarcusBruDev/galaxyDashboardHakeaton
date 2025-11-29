import express from 'express';
import morgan from 'morgan';
import planetRoutes from "./routers/planet.routes.js";
import cors from 'cors';


const app = express();

// CORS configuration - Allow frontend to access the API
app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(morgan('dev')); // middleware para el logging de peticiones
app.use(express.json()); // middleware para parsear JSON
app.use("/api/", planetRoutes); // Rutas de autenticación 


export default app;
