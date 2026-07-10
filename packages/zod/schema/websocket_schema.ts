import {z} from 'zod'
import type { CreateRoom } from '../types/websocket_types'

export const CreateRoomSchema = z.object({

    token:z.string(),
    streamId:z.string(),
    username:z.string(),
    userId:z.string()
})  

export const JoinRoomSchema = z.object({
    token:z.string().nullable(),
    streamId:z.string(),
    username:z.string(),
    userId:z.string()
}) 