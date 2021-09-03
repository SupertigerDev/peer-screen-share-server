import express, { json } from 'express'
import http from 'http'
import users, { User } from './database/users';
import roomRoutes from './routes/RoomRouter';
import socketIO from 'socket.io'
import onConnect from './events/onConnect';
import rooms from './database/rooms';

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
    io: socketIO.Server;
    constructor() {
        this.express = express();
        this.server = new http.Server(this.express);
        this.io = new socketIO.Server(this.server, { transports: ["websocket"] });
        this.express.use(express.json())
        this.middlewares();
        this.routes();
        this.events();
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
    events() {
        this.io.use((socket, next) => {
            const { token, roomId } = socket.handshake.auth;
            const user = users.getUserByToken(token);
            if (!user) return next(new Error("Invalid Token!"));
            const room = rooms.get(roomId);
            if (!room) return next(new Error("Room does not exist!"));
            users.addSocketId(user.id, socket.id);
            rooms.addSocketId(roomId, socket.id, this.io)
            socket.join(room.id)
            // sent details
            socket.emit("authorized", { 
                currentUser: {id: user.id, name: user.name},
                users: rooms.getConnectedUsers(roomId),
                room: { id: room.id, name: room.name }
            })
            next()
        })
        this.io.on("connection", socket => {

            // call
            socket.on("send_signal", ({userIdToSignal, signal}) => {
                const user = users.getUserBySocketId(socket.id);
                if (!user) return;
                const requestedUserRoom = rooms.getRoomBySocketId(socket.id)
                if (!requestedUserRoom) return;
                const userToSignalToSocketId = rooms.getUserSocketId(userIdToSignal, requestedUserRoom.id)
                if (!userToSignalToSocketId) return;
                this.io.to(userToSignalToSocketId).emit("signal_received", {signal, userId: user.id})
            })

            // accept call
            socket.on("return_signal", ({signal, userIdToSignal}) => {
                const user = users.getUserBySocketId(socket.id);
                if (!user) return;
                const requestedUserRoom = rooms.getRoomBySocketId(socket.id)
                if (!requestedUserRoom) return;
                const userToSignalToSocketId = rooms.getUserSocketId(userIdToSignal, requestedUserRoom.id)
                if (!userToSignalToSocketId) return;
                this.io.to(userToSignalToSocketId).emit("return_signal_received", {signal, userId: user.id})
            })

            socket.on("disconnect", reason => {
                rooms.removeSocketId(socket.id, this.io)
                users.removeSocketId(socket.id);
            })
        })
    }
}

const app = new App();
export default app;