import {WebSocketServer} from 'ws'


const wss = new WebSocketServer({
    port:8080
})

wss.on('connection',async(socket)=>{

   socket.on('message',(data)=>{
    console.log(data.toString())
   })


})

wss.on('error',(error)=>{
    console.log(error)
    return;
})

wss.on('wsClientError',(error)=>{
    console.log(error)
    return;
})