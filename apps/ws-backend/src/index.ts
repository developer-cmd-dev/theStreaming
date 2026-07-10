import { CreateRoomSchema, type CreateRoom, type JoinRoom, type MessageData, type MessageType, type Chat } from '@repo/zod/schema'
import { WebSocketServer } from 'ws'
import ErrorResponse from './error/error'
import Room from './room'
import User from './user'
import jwt, { JsonWebTokenError } from 'jsonwebtoken'
import { redisClient } from '@repo/redis/redisClient'
const wss = new WebSocketServer({
    port: 8080
})

const rooms = new Map<string, Room>();

const JWT_SECRET = process.env.JWT_SECRET_KEY ;

type CurrnetUserState = {
    username:string|null;
    roomId:string|null;
    type:MessageType|null
}

let currentUserState:CurrnetUserState



wss.on('connection', async (socket) => {


    socket.on('message', (data) => {
        try {
        const messageData: MessageData = JSON.parse(data.toString()) as MessageData;


        if (messageData.type === 'create-room') {

            const { data, error } = CreateRoomSchema.safeParse(messageData.data as CreateRoom);

            if (error) {
                socket.send(JSON.stringify(new ErrorResponse(JSON.parse(error.message), "Invalid Input")))
            }


            if (data) {

                const payload= jwt.verify(data?.token, JWT_SECRET!)

                const room = new Room(data.streamId, data.username, [], socket)
                const streamer = new User(data.username, data.userId, data.token, socket, true);
                room.addUser(streamer)
                if (!rooms.has(data.streamId)) {
                    rooms.set(data.streamId, room)
                    console.log(`${streamer.username} has created room-${room.streamId}`);
                    socket.send("Room Created Successfully");
                    currentUserState={
                        username:streamer.username,
                        roomId:room.streamId,
                        type:messageData.type
                    }
                } else {
                    socket.send(JSON.stringify(new ErrorResponse({}, "Room Already Exist!")))
                }
            }

        } else if (messageData.type === 'join-room') {

            const { data, error } = CreateRoomSchema.safeParse(messageData.data as JoinRoom);

            if (error) {
                socket.send(JSON.stringify(new ErrorResponse(JSON.parse(error.message), "Invalid Input")))
            }

            if (data) {
                const user = new User(data.username, data.userId, data.token, socket, false);
                const room = rooms.get(data.streamId);
                console.log(room)

                if (!room) {
                    socket.send(JSON.stringify(new ErrorResponse({}, "Room not found")));
                    return;
                }

                room?.addUser(user);
                currentUserState={
                    username:user.username,
                    roomId:room.streamId,
                    type:messageData.type
                }
                console.log(`${user.username} has joined room - ${data.streamId}`)
                socket.send("Room joined successfully");

            }

        } else if (messageData.type === 'chat') {
            const data = messageData.data as Chat;
            const messagesArray:Chat[]=[]

            
            const room = rooms.get(data.streamId);
            room?.sendMessage(socket, data.message, data.userId, data.username)
        }

    } catch (error) {
        if(error instanceof JsonWebTokenError){
            console.log(error)
            socket.send(JSON.stringify(new ErrorResponse({},"Unauthorized")));
            return;
        }
     }
    
    })


    socket.on('close',()=>{
      if(currentUserState){
        if(currentUserState.type==='create-room'){
            rooms.delete(currentUserState.roomId??"");
        }else if(currentUserState.type==='join-room'){
            const room = rooms.get(currentUserState.roomId??"")
            if(room){
                room.deleteViewer(socket)
            }

        }
      }
    })

})



wss.on('error', (error) => {
    console.log(error)
    return;
})

wss.on('wsClientError', (error) => {
    console.log(error)
    return;
})