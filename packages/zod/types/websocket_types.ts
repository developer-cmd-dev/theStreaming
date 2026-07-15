import z from "zod";
import type { CreateRoomSchema, JoinRoomSchema } from "../schema/websocket_schema";
export type MessageType = "create-room"|"join-room"|"message"

export interface MessageData {
    type:MessageType
    data:object
}




export type CreateRoom =z.infer<typeof CreateRoomSchema>

export type JoinRoom = z.infer<typeof JoinRoomSchema>

export interface Chat{
    username:string;
    userId:string;
    streamId:string;
    message:string;
}
