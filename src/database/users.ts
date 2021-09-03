import FlakeId from '@brecert/flakeid'
import jwt from 'jsonwebtoken'
const flake = new FlakeId();

export interface User {
    id: string;
    name: string;
    socketIds: Array<string>
}
export class UserDatabase {
    userObj: {[key: string]: User};
    socketIds: {[key: string]: string};
    constructor() {
        this.userObj = {}
        this.socketIds = {};
    }
    add(user: Partial<User> ) {
        const id = flake.gen().toString();
        this.userObj[id] = {...user, socketIds: [], id} as any;
        return this.userObj[id];
    }
    get(id: string) {
        return this.userObj[id];
    }
    getUserByToken(token: string) {
        try {
            const userId = jwt.verify(token, "JWT_SECRET_CHANGE_ME_PLS") as string;
            return this.userObj[userId]
        } catch {
            return undefined;
        }
    }
    addSocketId(userId: string, socketId: string) {
        this.socketIds[socketId] = userId;
        this.userObj[userId]?.socketIds?.push(socketId)
    }
    removeSocketId(socketId: string) {
        const userId = this.socketIds[socketId];
        delete this.socketIds[socketId];
        const user = this.userObj[userId];
        if (!user) return;
        user.socketIds = user.socketIds.filter(ids => ids !== socketId);
    }
    getUserBySocketId(socketId: string) {
        const userId = this.socketIds[socketId];
        if (!userId) return undefined;
        return this.get(userId);
    }
}
const users = new UserDatabase();
export default users;