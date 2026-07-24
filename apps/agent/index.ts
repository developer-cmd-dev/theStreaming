import express from 'express';




const app = express();




app.listen(3003,(error)=>{
    if(error){
        console.log(error);
        return
    }
console.log(`Agent server is running on ${3003}`);
})