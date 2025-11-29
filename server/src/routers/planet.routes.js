import { Router } from "express";
import { getPlanet, createPlanet, getAdvertices } from '../controllers/planet.controller.js'

const router = Router();

router.get('/planet', getPlanet);
router.post('/planet', createPlanet);
// router.put("/planets/:id", updatePlanet);


router.get('/status', getAdvertices)




export default router;
