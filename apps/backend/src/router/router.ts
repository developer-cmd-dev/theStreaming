import { Router } from "express";
import { healthCheck } from "../controller/healthcheck.controller";
import { login, refreshToken, signUp } from "../controller/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();
router.get('/health',healthCheck);
router.post('/signup',signUp);
router.get('/login',login);
router.get('/refresh',refreshToken)

export default router;