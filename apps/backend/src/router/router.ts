import { Router } from "express";
import { healthCheck } from "../controller/healthcheck.controller";

const router = Router();
router.get('/health',healthCheck);


export default router;