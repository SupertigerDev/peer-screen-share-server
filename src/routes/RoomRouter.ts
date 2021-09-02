import { NextFunction, Request, Response, Router } from "express";
import rooms from "../database/rooms";
import authenticate from "../middlewares/authenticate";

interface CreateRoomBody { roomName: string, username: string }

export class RoomRouter {
    router: Router;
    constructor() {
        this.router = Router();
    }
    public createRoom(req: Request, res: Response, next: NextFunction) {
        const data = req.body as CreateRoomBody;
        const room = rooms.add({name: data.roomName, creatorUserId: req.user?.id});
        res.json({roomId: room.id, token: req.token})
    }
    init() {
        this.router.post("/", authenticate({createUser: true}), this.createRoom);
    }
}
const roomRoutes = new RoomRouter();
roomRoutes.init();

export default roomRoutes.router;