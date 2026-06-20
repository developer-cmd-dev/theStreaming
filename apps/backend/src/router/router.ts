import { Router } from "express";
import { healthCheck } from "../controller/healthcheck.controller";
import { signUp } from "../controller/auth.controller";

const router = Router();
router.get('/health',healthCheck);
router.post('/signup',signUp)

export default router;