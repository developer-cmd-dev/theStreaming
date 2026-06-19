import express from 'express';
import router from './router/router';
import { ErrorMiddleware } from './middleware/error.middleware';
import cors from 'cors'
const app = express();
const port = 8080;
app.use(express.json());
app.use(cors())



app.use("/api/v1", router)
app.use(ErrorMiddleware)
app.listen(port, (error) => {
    if (error) {
        console.log(error);
        return;
    }

    console.log(`Server is running on ${port}`)
})