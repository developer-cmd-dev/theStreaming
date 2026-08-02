import { RedisClient } from "bun";

 const redisClient = new RedisClient("redis://localhost:6379",{autoReconnect:false});


export default redisClient

