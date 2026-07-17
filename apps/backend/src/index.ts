import express from 'express';
import router from './router/router';
import { ErrorMiddleware } from './middleware/error.middleware';
import cors from 'cors'
import cookieParser from 'cookie-parser'
import cluster from 'cluster';
import os from 'os'


const numCPUs = os.availableParallelism ? os.availableParallelism() : os.cpus().length;

if (cluster.isPrimary) {
    console.log(`Primary process ${process.pid} is running`);

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork()
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died. Spawning a new one...`);
        cluster.fork();
    });
} else {
    const app = express();
    const port = 3000;
    app.use(express.json());
    app.use(cors())

    app.use(cookieParser())

    app.use("/api/v1", router)
    app.use(ErrorMiddleware)
    app.listen(port, (error) => {
        if (error) {
            console.log(error);
            return;
        }

        console.log(`Server is running on ${port}`)
    })

}