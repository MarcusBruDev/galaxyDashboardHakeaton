import { Router } from "express";
import { getPlanet ,createPlanet} from '../controllers/planet.controller.js'

const router = Router();

router.get('/planet',getPlanet);
router.post('/planet',createPlanet);



export default router;
