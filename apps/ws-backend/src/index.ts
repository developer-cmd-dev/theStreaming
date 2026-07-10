import { CreateRoomSchema, type CreateRoom, type JoinRoom, type MessageData, type MessageType ,type Chat} from '@repo/zod/schema'
import { WebSocketServer } from 'ws'
import ErrorResponse from './error/error'
import Room from './room'
import User from './user'

const wss = new WebSocketServer({
    port: 8080
})

const rooms = new Map<string, Room>();

wss.on('connection', async (socket) => {

    socket.on('message', (data) => {

        const messageData: MessageData = JSON.parse(data.toString()) as MessageData;


        if (messageData.type === 'create-room') {

            const { data, error } = CreateRoomSchema.safeParse(messageData.data as CreateRoom);

            if (error) {
                socket.send(JSON.stringify(new ErrorResponse(JSON.parse(error.message), "Invalid Input")))
            }

            if (data) {
                const room = new Room(data.streamId, data.username, [], socket)
                const streamer = new User(data.username, data.userId, data.token, socket, true);
                room.addUser(streamer)
                if (!rooms.has(data.streamId)) {
                    rooms.set(data.streamId, room)
                    console.log(`${streamer.username} has created room-${room.streamId}`)
                    socket.send("Room Created Successfully")
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

                if (!room) {
                    socket.send(JSON.stringify(new ErrorResponse({}, "Room not found")));
                    return;
                }

                room?.addUser(user);
                console.log(`${user.username} has joined room - ${data.streamId}`)
                socket.send("Room joined successfully");

            }

        }else if(messageData.type==='chat'){
            const data = messageData.data as Chat;
            const room = rooms.get(data.streamId);
            room?.sendMessage(socket,data.message,data.userId,data.username)
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