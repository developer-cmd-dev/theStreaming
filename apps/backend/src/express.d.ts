import type { User } from "@repo/zod/zod";

declare global {
    namespace Express {
      interface Request {
        userId:string
        username:string
      }
    }
  }