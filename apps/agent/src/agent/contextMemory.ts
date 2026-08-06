import type { Message } from "ollama"

class ContextMemory{

    private  contextMap = new Map<string,Message[]>()


    setMemory(key:string,content:Message):Message[]{
        let userContext = this.contextMap.get(key);
        if(!userContext){
          userContext= this.contextMap.set(key,[content]).get(key);
        }else if(userContext){
            userContext?.push(content);
            this.contextMap.set(key,userContext);
        }
        return userContext??[] ;
    }


    deleteMemory(key:string):boolean{
         return this.contextMap.delete(key);
    }






}



export const contextMemory =  new ContextMemory()