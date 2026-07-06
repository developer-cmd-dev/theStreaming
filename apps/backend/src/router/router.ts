import { Router } from "express";
import { healthCheck } from "../controller/healthcheck.controller";
import { login, logut, refreshToken, signUp } from "../controller/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { createStream,connectMediaServer,endStream } from "../controller/streaming.controller";

const router = Router();
router.get('/health',healthCheck);
router.post('/signup',signUp);
router.post('/login',login);
router.post('/refresh',refreshToken);
router.post('/logout',logut)

// Stream routes
router.post('/create-stream',authMiddleware,createStream);
router.post('/connect-media-server',authMiddleware,connectMediaServer);
router.post('/end-stream',authMiddleware,endStream)



export default router;