import express, {json} from 'express'
import http from 'http'
import { User } from './database/users';
import roomRoutes from './routes/RoomRouter';


declare global {
    namespace Express {
      interface Request {
        token?: string
        user?: User
     }
  }
 }


export class App {
    express: express.Application;
    server: http.Server;
    constructor() {
        this.express = express();
        this.server = new http.Server(this.express);
        this.express.use(express.json())
        this.middlewares();
        this.routes();
    }
    routes() {
        this.express.use("/api/rooms", roomRoutes)
    }
    middlewares() {
        this.express.use((req, res, next) => {
            res.setHeader("Access-Control-Allow-Origin", "http://localhost:8080")
            res.setHeader('Access-Control-Allow-Headers', 'content-type,authorization');
            next()
        })
    }
}

const app = new App();
export default app;