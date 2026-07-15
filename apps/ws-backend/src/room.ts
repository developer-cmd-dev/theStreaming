import type { WebSocket } from "ws";
import type User from "./user";
import ErrorResponse from "./error/error";
import { redis } from "bun";

 export default class Room {
    username:string;
    streamId:string;
    socket:WebSocket
    viewers:User[];
    chats:{message:string,username:string}[]=[]

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

    // this.saveMessages(message,username,this.streamId)

    this.viewers.forEach((viewer)=>{
        viewer.socket.send(JSON.stringify({
            type:'chat',
            data:{
                message,
                username
                
            }
        }))
    })
    

}


public deleteViewer (socket:WebSocket){
    this.viewers = this.viewers.filter((data)=>data.socket!=socket)
}


private async saveMessages (message:string,streamId:string,username:string){

    try {
        this.chats.push({message,username});
        redis.set(streamId+":message",JSON.stringify(this.chats));
    } catch (error) {
        console.log(error)
    }

}

}