import { Router } from "express";
import { getPlanet, createPlanet, getAdvertices, getPlanetHistories } from '../controllers/planet.controller.js'

const router = Router();

// Rutas más específicas primero
router.get('/planet/histories', getPlanetHistories);
router.get('/status', getAdvertices);

// Rutas generales después
router.get('/planet', getPlanet);
router.post('/planet', createPlanet);
// router.put("/planets/:id", updatePlanet);


export default router;
