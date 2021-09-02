import { NextFunction, Request, Response, Router } from "express";
import rooms from "../database/rooms";

export class RoomRouter {
    router: Router;
    constructor() {
        this.router = Router();
    }
    public createRoom(req: Request, res: Response, next: NextFunction) {
        console.log("CreateRoom")
        console.log(req.body)
        // rooms.add()
    }
    init() {
        this.router.post("/", this.createRoom);
    }
}
const roomRoutes = new RoomRouter();
roomRoutes.init();

export default roomRoutes.router;