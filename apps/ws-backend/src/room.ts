import type { WebSocket } from "ws";
import type User from "./user";
import ErrorResponse from "./error/error";

 export default class Room {
    username:string;
    streamId:string;
    socket:WebSocket
    viewers:User[];

constructor( streamId: string, username: string, viewers: User[],socket:WebSocket) {
    this.streamId = streamId;
    this.username = username;
    this.socket = socket; 
    this.viewers=viewers
}

public addUser(viewers:User){
    this.viewers.push(viewers)
}

public sendMessage(socket:WebSocket,message:string,userId:string,username:string){

    const userExist = this.viewers.filter(data=>data.userId===userId)

    if(userExist.length===0){
        socket.send(JSON.stringify(new ErrorResponse({},"Unable to send Message")));
        return;
    }

    this.viewers.forEach((viewer)=>{
        if(socket!==viewer.socket){
            viewer.socket.send(JSON.stringify({
                type:'chat',
                data:{
                    message,
                    username
                    
                }
            }))
        }
    })

}

}