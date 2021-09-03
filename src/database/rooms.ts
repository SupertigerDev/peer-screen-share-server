import FlakeId from '@brecert/flakeid'
import socketIO, { Socket } from 'socket.io'
import users from './users';
const flake = new FlakeId();

interface Room {
    id: string;
    name: string;
    creatorUserId?: string;
    connectedSocketIds: Array<string>;
}
export class RoomDatabase {
    roomObj: {[key: string]: Room};
    socketIds: {[key: string]: string};

    constructor() {
        this.roomObj = {}
        this.socketIds = {};
    }
    add(room: Partial<Room>) {
        const id = flake.gen().toString();
        this.roomObj[id] = {...room, connectedSocketIds: [], id} as any;
        return this.roomObj[id];
    }
    get(roomId: string) {
        return this.roomObj[roomId]
    }
    addSocketId(roomId: string, socketId: string, io?: socketIO.Server) {
        this.roomObj[roomId].connectedSocketIds.push(socketId)
        this.socketIds[socketId] = roomId;
        // broadcast join event to the room
        const user = users.getUserBySocketId(socketId);
        const safeUser = {
            name: user?.name,
            id: user?.id
        }
        io?.in(roomId).emit("user_join", safeUser);
    }
    getConnectedUsers(roomId: string) {
        const room = this.get(roomId);
        if (!room) return [];
        const usersList = [];
        for (let i = 0; i < room.connectedSocketIds.length; i++) {
            const socketId = room.connectedSocketIds[i];
            const user = users.getUserBySocketId(socketId);
            if (!user) continue;
            usersList.push({name: user.name, id: user.id})
        }
        return usersList;
    }
    removeSocketId(socketId: string, io?: socketIO.Server) {
        const roomId = this.socketIds[socketId];
        delete this.socketIds[socketId];
        const room = this.roomObj[roomId];
        if (!room) return;
        room.connectedSocketIds = room.connectedSocketIds.filter(ids => ids !== socketId);
        // broadcast leave event to the room
        const user = users.getUserBySocketId(socketId);
        io?.in(roomId).emit("user_leave", user?.id);

    }
}
const rooms = new RoomDatabase();
export default rooms;