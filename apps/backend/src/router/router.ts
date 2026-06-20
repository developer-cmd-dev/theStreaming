import { Router } from "express";
import { healthCheck } from "../controller/healthcheck.controller";
import { login, refreshToken, signUp } from "../controller/auth.controller";


const router = Router();
router.get('/health',healthCheck);
router.post('/signup',signUp);
router.post('/login',login);
router.post('/refresh',refreshToken);





export default router;