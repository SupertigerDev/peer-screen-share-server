import express, {json} from 'express'
import http from 'http'
import roomRoutes from './routes/RoomRouter';
export class App {
    express: express.Application;
    server: http.Server;
    constructor() {
        this.express = express();
        this.express.use
        this.server = new http.Server(this.express);
        this.routes();
    }
    routes() {
        this.express.use("/api/rooms", roomRoutes)
    }
}

const app = new App();
export default app;