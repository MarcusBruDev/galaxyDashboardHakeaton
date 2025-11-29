import { Router } from "express";
import { getTasks } from '../controllers/planet.controller.js'

const router = Router();

router.get('/',getTasks);

export default router;
