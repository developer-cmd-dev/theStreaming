import { Router } from "express";
import { healthCheck } from "../controller/healthcheck.controller";
import { login, logout, refreshToken, signUp } from "../controller/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { createStream,connectMediaServer,endStream, startRecordingStream, deleteStream,updateStreamOnLive} from "../controller/streaming.controller";
import { liveStreams } from "../controller/dashboard.controller";
import { searchUser } from "../controller/search.controller";


const router = Router();
router.get('/health',healthCheck);
router.post('/signup',signUp);
router.post('/login',login);
router.post('/refresh',refreshToken);
router.get('/logout',logout)

// Dashboard routes
router.get('/',liveStreams)
router.get('/search-user',searchUser)

// Stream routes
router.post('/create-stream',authMiddleware,createStream);
router.post('/connect-media-server',authMiddleware,connectMediaServer);
router.post('/end-stream/:streamId',authMiddleware,endStream)
router.get('/record-streaming/:streamId',authMiddleware,startRecordingStream);
router.delete('/delete-stream',authMiddleware,deleteStream);
router.patch('/update-on-live',authMiddleware,updateStreamOnLive)



export default router;