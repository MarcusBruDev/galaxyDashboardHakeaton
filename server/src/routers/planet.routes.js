import { Router } from "express";
import { getPlanet ,createPlanet,updatePlanet} from '../controllers/planet.controller.js'

const router = Router();

router.get('/planet',getPlanet);
router.post('/planet',createPlanet);
router.put("/planets/:id", updatePlanet);





export default router;
