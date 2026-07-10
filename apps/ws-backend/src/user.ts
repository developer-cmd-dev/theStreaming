import type { WebSocket } from "ws";

export default class User {

    username: string;
    userId: string;
    token:string;
    socket: WebSocket;
    whoStreaming:boolean=false

    constructor(username: string, userId: string,token:string, socket: WebSocket,whoStreaming:boolean) {
        this.username = username;
        this.userId = userId;
        this.token=token;
        this.socket = socket;
        this.whoStreaming=whoStreaming;
    }

}